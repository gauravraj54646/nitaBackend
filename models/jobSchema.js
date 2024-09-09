import mongoose from "mongoose";
//import userSchema from "./userSchema.js";
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["Full-time-employement", "Intern+full-time-employement","Internship","hackthons"],
  },
  Year: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
  },
  responsibilities: {
    type: String,
    required: true,
  },
  qualifications: {
    type: String,
    required: true,
  },
  offers: {
    type: String,
  },
  salary: {
    type: String,
    required: true,
  },
  // hiringMultipleCandidates: {
  //   type: String,
  //   default: "No",
  //   enum: ["Yes", "No"],
  // },
  Opportunities: {
    type: String,
    default: "Of-Campus",
    enum: ["On-Campus", "Of-Campus","Club"],
  },
  personalWebsite: {
    title: String,
    url: String, //required: true
  },
  // jobNiche: {
  //   type: String,
  //   required: true,
  // },
  jobFields: {
    type: String,
    required: true,
  },
  

  newsLettersSent: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
