import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // we verify token  , we have aal things in this payload

  req.user = await User.findById(decoded.id);  //we successfully get user

  next();
});

export const isAuthorized = (...roles) => {  //employer or sobseeker hai ye dekha hai maine 
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {  // we use indludes because it works on string only! and search is easy 
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource.`
        )
      );
    }
    next();
  };
};