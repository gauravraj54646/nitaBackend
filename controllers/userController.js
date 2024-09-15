import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      enrollment,
      branch,
      phone,
      address,
      password,
      role,
      firstSkills, //firstNiche
      secondSkills,
      thirdSkills,
      coverLetter,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !role ||
      !enrollment ||
      !branch
    ) {
      return next(new ErrorHandler("All fileds are required.", 400));
    }
    if (role === "Student" && (!firstSkills || !secondSkills || !thirdSkills)) {
      return next(
        new ErrorHandler("Please provide your prefered Skills.", 400)
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }
    const userData = {
      name,
      email,
      enrollment,
      branch,
      phone,
      address,
      password,
      role,
      skills: {
        firstSkills,
        secondSkills,
        thirdSkills,
      },
      coverLetter,
    };
    if (req.files && req.files.resume) {
      const { resume } = req.files;
      if (resume) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "Job_Seekers_Resume" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(
              new ErrorHandler("Failed to upload resume to cloud.", 500)
            );
          }
          userData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };
        } catch (error) {
          return next(new ErrorHandler("Failed to upload resume", 500));
        }
      }
    }
    const user = await User.create(userData);
    sendToken(user, 201, res, "User Registered.");
  } catch (error) {
    next(error);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!password) {
    return next(new ErrorHandler(" password  are required.", 400));
  }
  if (!email) {
    return next(new ErrorHandler("Email, are required.", 400));
  }
  if (!role) {
    return next(new ErrorHandler("role are required.", 400));
  }

  // if (!role || !email || !password) {
  //   return next(
  //     new ErrorHandler("Email, password and role are required.", 400)
  //   );
  // }
  console.log(req.body);
  const user = await User.findOne({ email }).select("+password"); //for getting pasword
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("Invalid user role.", 400));
  }
  sendToken(user, 200, res, "User logged in successfully!.");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()), //ok gaurav we token expires now
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    enrollment: req.body.enrollment,
    branch: req.body.branch,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    skills: {
      firstSkills: req.body.firstSkills,
      secondSkills: req.body.secondSkills,
      thirdSkills: req.body.thirdSkills,
    },
  };

  const { firstSkills, secondSkills, thirdSkills } = newUserData.skills;

  if (
    req.user.role === "Student" &&
    (!firstSkills || !secondSkills || !thirdSkills)
  ) {
    return next(
      new ErrorHandler("Please provide your all preferred job niches.", 400)
    );
  }
  if (req.files) {
    // we now check if resume then update resume
    const resume = req.files.resume; //we add here ?
    if (resume) {
      const currentResumeId = req.user.resume.public_id;
      if (currentResumeId) {
        await cloudinary.uploader.destroy(currentResumeId); //we delete resume
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_Seekers_Resume",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
    message: "Profile updated.",
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New password & confirm password do not match.", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully!.");
});

