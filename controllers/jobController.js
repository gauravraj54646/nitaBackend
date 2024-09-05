import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    jobType,
    // location,
    Year,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    // hiringMultipleCandidates,
    Opportunities,
    personalWebsiteTitle,
    personalWebsiteUrl,
    // jobNiche,
    jobFields,
    
  } = req.body;
  if (
    !title ||
    !jobType ||
    // !location ||
    ! Year||
    !companyName ||
    !introduction ||
    !responsibilities ||
    !qualifications ||
    !salary ||
    // !jobNiche
    !jobFields
  ) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }
  if (
    (personalWebsiteTitle && !personalWebsiteUrl) ||
    (!personalWebsiteTitle && personalWebsiteUrl)
  ) {
    return next(
      new ErrorHandler(
        "Provide both the website url and title, or leave both blank.",
        400
      )
    );
  }
  const postedBy = req.user._id;  //who post job
  const job = await Job.create({
    title,
    jobType,
    // location,
    Year,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    // hiringMultipleCandidates,
    Opportunities,
    personalWebsite: {
      title: personalWebsiteTitle,
      url: personalWebsiteUrl
    },
    jobFields,
    postedBy,
  });
  res.status(201).json({   //job created successfully
    success: true,
    message: "Job posted successfully!.",
    job,
  });
});

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const { city, niche, searchKeyword } = req.query;
  const query = {};
  if (city) {
    // query.location = city;
    query.Year = city;
  }
  if (niche) {
    // query.jobNiche = niche;
    query.jobFields = niche;
  }
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
    ];
  }
  const jobs = await Job.find(query);  // we find jobs by query
  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  // console.log(job)
  if (!job) {
    return next(new ErrorHandler("Oops! Job not found.", 404));  
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job deleted!.",
  });
});

export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }
  // 
  res.status(200).json({
    success: true,
    job,
  });
});

//http://localhost:5173/blogs/jbdgdtdvtubfybg?keyword=It;