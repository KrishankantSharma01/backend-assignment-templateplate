import Application from '../models/Application.js';
import Program from '../models/Program.js';
import Student from '../models/Student.js';
import { validStatusTransitions  } from '../config/constants.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/httpError.js';

const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;
  const filters = {};

  if (studentId) {
    filters.student = studentId;
  }

  if (status) {
    filters.status = status;
  }

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: applications,
  });
});

const createApplication = asyncHandler(async (req, res) => {
  const { student, program, intake } = req.body;

  if (!student || !program || !intake) {
    throw new HttpError(400, "Student, program, and intake are required.");
  }

  const studentDoc = await Student.findById(student);
  if (!studentDoc) {
    throw new HttpError(404, "Student not found.");
  }

  const programDoc = await Program.findById(program);
  if (!programDoc) {
    throw new HttpError(404, "Program not found.");
  }

  if (!programDoc.intakes.includes(intake)) {
    throw new HttpError(400, "Invalid intake for the selected program.");
  }

  const existingApplication = await Application.findOne({ student, program, intake });
  if (existingApplication) {
    throw new HttpError(409, "Application already exists for this program and intake.");
  }

  const application = await Application.create({
    student,
    program,
    intake,
    university: programDoc.university,
    destinationCountry: programDoc.country,
    status: "draft",
    timeline: [{ status: "draft", note: "Application created." }],
  });

  res.status(201).json({
    success: true,
    data: application,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  if (!status) {
    throw new HttpError(400, "Status is required.");
  }

  const application = await Application.findById(id);
  if (!application) {
    throw new HttpError(404, "Application not found.");
  }

  const currentStatus = application.status;
  const allowedTransitions = validStatusTransitions[currentStatus] || [];

  if (!allowedTransitions.includes(status)) {
    throw new HttpError(400, `Invalid state transition from ${currentStatus} to ${status}.`);
  }

  application.status = status;
  application.timeline.push({
    status,
    note: note || `Status updated to ${status}.`,
  });

  await application.save();

  res.json({
    success: true,
    data: application,
  });
});

export { createApplication,
  listApplications,
  updateApplicationStatus,
 };
