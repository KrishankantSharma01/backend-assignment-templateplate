import Program from '../models/Program.js';
import Student from '../models/Student.js';
import HttpError from '../utils/httpError.js';

async function buildProgramRecommendations(studentId) {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  // Pre-process interested fields for regex matching in aggregation
  const fieldRegexArray = (student.interestedFields || []).map(field => ({
    $regexMatch: { input: "$field", regex: field, options: "i" }
  }));

  const recommendations = await Program.aggregate([
    {
      $addFields: {
        countryMatch: { $in: ["$country", student.targetCountries || []] },
        fieldMatch: fieldRegexArray.length > 0 ? { $anyElementTrue: [fieldRegexArray] } : false,
        budgetMatch: { $lte: ["$tuitionFeeUsd", student.maxBudgetUsd || Infinity] },
        intakeMatch: { $in: [student.preferredIntake || "", "$intakes"] },
        ieltsMatch: { $lte: ["$minimumIelts", student.englishTest?.score || 0] }
      }
    },
    {
      $addFields: {
        matchScore: {
          $sum: [
            { $cond: ["$countryMatch", 35, 0] },
            { $cond: ["$fieldMatch", 30, 0] },
            { $cond: ["$budgetMatch", 20, 0] },
            { $cond: ["$intakeMatch", 10, 0] },
            { $cond: ["$ieltsMatch", 5, 0] }
          ]
        },
        reasons: {
          $filter: {
            input: [
              { $cond: ["$countryMatch", { $concat: ["Preferred country match: ", "$country"] }, null] },
              { $cond: ["$fieldMatch", { $concat: ["Field alignment: ", "$field"] }, null] },
              { $cond: ["$budgetMatch", "Within budget range", null] },
              { $cond: ["$intakeMatch", { $concat: ["Preferred intake available: ", student.preferredIntake || ""] }, null] },
              { $cond: ["$ieltsMatch", "English test score meets requirement", null] }
            ],
            as: "reason",
            cond: { $ne: ["$$reason", null] }
          }
        }
      }
    },
    {
      $sort: { matchScore: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        countryMatch: 0,
        fieldMatch: 0,
        budgetMatch: 0,
        intakeMatch: 0,
        ieltsMatch: 0
      }
    }
  ]);

  return {
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        targetCountries: student.targetCountries,
        interestedFields: student.interestedFields,
      },
      recommendations,
    },
    meta: {
      implementationStatus: "completed-using-mongodb-aggregation",
    },
  };
}

export { buildProgramRecommendations,
 };
