import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { CreateResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create',protect,CreateResume);
resumeRouter.put('/update', upload.single('image'),protect,updateResume);
resumeRouter.delete('/delete/:resumeId',protect,deleteResume);
resumeRouter.get('/get/:resumeId',protect,getResumeById);
resumeRouter.get('/public/:resumeId',getPublicResumeById);

export default resumeRouter;
