const express = require("express");
const {
    createCourse,
    createLecture,
    editCourse,
    editLecture,
    getCourseById,
    getCourseLecture,
    getCreatorCourses,
    getLectureById,
    getPublishedCourse,
    removeLecture,
    searchCourse,
    togglePublishCourse,
    deleteCourse,
  } = require("../controllers/course.controller");

const verifyToken = require("../middleware/verifyToken");
const upload = require("../utils/multer");

const router = express.Router();

// Course routes
router.post("/", verifyToken, createCourse);
router.get("/search", verifyToken, searchCourse);
router.get("/published-courses", getPublishedCourse);
router.get("/", verifyToken, getCreatorCourses);
router.put("/:courseId", verifyToken, upload.single("courseThumbnail"),editCourse);
router.get("/:courseId", verifyToken, getCourseById);

router.delete("/:courseId", verifyToken, deleteCourse); //addtional add delete course router

// Lecture routes
router.post("/:courseId/lecture", verifyToken, createLecture)
router.get("/:courseId/lecture", verifyToken, getCourseLecture);
router.post("/:courseId/lecture/:lectureId", verifyToken, editLecture);
router.delete("/lecture/:lectureId", verifyToken, removeLecture);
router.get("/lecture/:lectureId", verifyToken, getLectureById);

// Toggle publish/unpublish
router.patch("/:courseId", verifyToken, togglePublishCourse);


module.exports= router;