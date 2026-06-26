import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    rawText: {
        type: String,
        required: true
    },
    analysisResult: {
        type: Object,
        default: null
    },
    pageCount: {
        type: Number,
        default: 1
    }
})

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;