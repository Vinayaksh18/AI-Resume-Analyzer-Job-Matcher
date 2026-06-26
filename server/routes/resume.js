import express from 'express';
import fs from 'fs';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {PDFParse} = require("pdf-parse");

import authMiddleware from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';
import Resume from '../models/Resume.js';
import { analyzeResume } from '../services/resumeAnalyzer.js';
import { error } from 'console';

const router = express.Router();

//POST /api/resume/upload
router.post("/upload", authMiddleware, uploadMiddleware.single("resume") ,async (req, res) => {
    if(!req.file){
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const parser = new PDFParse({ data: fileBuffer });
        const parsed = await parser.getText();
        await parser.destroy();

        if(!parsed.text || parsed.text.trim().length < 50){
            fs.unlinkSync(req.file.path);
            return res.status(422).json({ error: "Resume content is too short or empty - Could not extract text" });
        }

        const resume = await Resume.create({
            userId: req.user.id,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            rawText: parsed.text,
            pageCount: parsed.numpages
        })

        fs.unlinkSync(req.file.path);

        res.status(200).json({
            resumeId: resume._id,
            originalName: resume.originalName,
            pageCount: resume.pageCount,
            charCount: resume.rawText.length,
            message: "Resume uploaded and parsed successfully"
        })
    } catch (err){
        if(req.file?.path && fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "Error processing resume: " + err.message });
    }
})

//GET /api/resume - list user's resumes
router.get("/", authMiddleware, async(req,res) => {
    try{
        const resumes = await Resume.find({ userId: req.user.id })
            .select("originalName pageCount createdAt analysisResult")
            .sort({ createdAt: -1 });
        res.json(resumes);
    } catch(err){
        res.status(500).json({ error: "Error fetching resumes: " + err.message });
    }
})

//POST /api/resume/analyze/:id
router.post("/analyze/:id", authMiddleware, async (req,res) => {
    try{
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user.id,
        })

        if(!resume) return res.status(404).json({error: "Resume not found"});

        if(resume.analysisResult){
            return res.json({
                analysis: resume.analysisResult,
                cached: true
            })
        }

        const analysis = await analyzeResume(resume.rawText);

        resume.analysisResult = analysis;
        await resume.save();

        res.json({ analysis, cached: false });
    }   catch(err){
        error(err);
        res.status(500).json({ error: "Error analyzing resume: " + err.message });
    }
})

export default router;