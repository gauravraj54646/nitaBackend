import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Cron Automation");
    const jobs = await Job.find({ newsLettersSent: false });
    for (const job of jobs) {
      try {
        const filteredUsers = await User.find({
          $or: [
            { "skills.firstSkills": job.jobFields },
            { "skills.secondSkills": job.jobFields },
            { "skills.thirdSkills": job.jobFields },  //jobNiche  niches
          ],
        });
        for (const user of filteredUsers) {
          const subject = `Hot Job Alert: ${job.title} in ${job.jobFields } Available Now`;
          const message = `Hi ${user.name},
          // Enrollment no. ${user.enrollment}, Branch ${user.branch}
           \n\nGreat news! A new job that fits your Filed has just been posted by Training/Internship & Placement Cell of NIT Agartala. The position is for a ${job.title} with ${job.companyName}, and requested to apply it ASAP.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Year:** ${job.Year}\n- **Salary:** ${job.salary}\n\nDon’t wait too long! fill this openings like these are filled quickly. \n\nWe’re here to support you in T/I&P cell search. Best of luck!\n\nBest Regards,\n Training and placement Team of NIT,AGARTALA.`;
          sendEmail({
            email: user.email,
            subject,
            message,
          });
        }
        job.newsLettersSent = true;
        await job.save();
      } catch (error) {
        console.log("ERROR IN NODE CRON CATCH BLOCK");
        return next(console.error(error || "Some error in Cron."));
      }
    }
  });
};
