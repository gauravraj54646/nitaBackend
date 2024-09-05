import mongoose from "mongoose";
import validator from "validator";
const applicationSchema = new mongoose.Schema({
  // jobSeekerInfo: {
  studentInfo:{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

     enrollment: {
      type: String,
      required: true,
    },
    branch:{
      type:Number,
        required: true,
    },
    
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    resume: {
      public_id: String,
      url: String,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student"],  // enum: ["Job Seeker"],
      required: true,
    },
  },
  // employerInfo: {
  TIPInfo : {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Employer"],
      required: true,
    },
  },
  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
  },
  deletedBy: {
    // jobSeeker: {
    Student:{
      type: Boolean,
      default: false,
    },
    // employer: {
    TIP:{
      type: Boolean,
      default: false,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);
