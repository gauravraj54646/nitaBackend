import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { postJob, getAllJobs, getASingleJob, getMyJobs, deleteJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/post", isAuthenticated, isAuthorized("T/I&Pcell"), postJob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("T/I&Pcell"), getMyJobs);
router.delete("/delete/:id", isAuthenticated, isAuthorized("T/I&Pcell"), deleteJob);
router.get("/get/:id", getASingleJob)  // lets add is authenticated;


//Employer






export default router;
