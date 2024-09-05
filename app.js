import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";


const app = express();
config({ path: "./config/config.env" });

app.use(   //for frontend and backend connectection
  cors({
    //origin: [process.env.FRONTEND_URL],
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());  //for access of token
app.use(express.json());  //for json format parse
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({     //for file uploads
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);




app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

newsLetterCron()   
connection();
app.use(errorMiddleware);
app.get('/',(req,res)=>{
  res.send("Hello fresher! , get your firstjob/internship here !..");
})

export default app;
