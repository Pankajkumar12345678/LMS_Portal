const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
    getCourseProgress,
    updateLectureProgress,
    markAsCompleted,
    markAsInCompleted,
} = require("../controllers/courseProgress.controller");

const router = express.Router();

router.get("/:courseId", verifyToken, getCourseProgress);
router.post("/:courseId/lecture/:lectureId/view", verifyToken, updateLectureProgress);
router.post("/:courseId/complete", verifyToken, markAsCompleted);
router.post("/:courseId/incomplete", verifyToken, markAsInCompleted);

module.exports = router;