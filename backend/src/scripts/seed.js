import connectDatabase from '../config/database.js';
import Application from '../models/Application.js';
import Program from '../models/Program.js';
import Student from '../models/Student.js';
import University from '../models/University.js';
import * as seedData from '../data/seedData.js';

async function seed() {
  await connectDatabase();

  await Promise.all([
    Application.deleteMany({}),
    Program.deleteMany({}),
    Student.deleteMany({}),
    University.deleteMany({}),
  ]);

  const universities = await University.insertMany(seedData.universities);

  const universityByName = universities.reduce((accumulator, university) => {
    accumulator[university.name] = university;
    return accumulator;
  }, {});

  const programs = await Program.insertMany(
    seedData.programs.map((program) => ({
      ...program,
      university: universityByName[program.universityName]._id,
    }))
  );

  const programByTitle = programs.reduce((accumulator, program) => {
    accumulator[program.title] = program;
    return accumulator;
  }, {});

  const students = await Student.create(seedData.students);

  const studentByEmail = students.reduce((accumulator, student) => {
    accumulator[student.email] = student;
    return accumulator;
  }, {});

  const applications = seedData.applications.map((application) => {
    const student = studentByEmail[application.studentEmail];
    const program = programByTitle[application.programTitle];
    const university = universityByName[program.universityName];

    return {
      student: student._id,
      program: program._id,
      university: university._id,
      destinationCountry: program.country,
      intake: application.intake,
      status: application.status,
      timeline: application.timeline,
    };
  });

  await Application.insertMany(applications);

  console.log("Seed completed successfully.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
