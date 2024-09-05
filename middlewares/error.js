class ErrorHandler extends Error {     //since no status code so we make the inharit class
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;      // we include this status code
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error.";

  if (err.name === "CastError") {      //eg: if user write name in number form then
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);   //bad request
  }
  if (err.code === 11000) {   // not unique email
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered.`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again.`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again.`;
    err = new ErrorHandler(message, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};


export default ErrorHandler