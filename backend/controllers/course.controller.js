const Course = require("../models/course.model");
const Lecture = require("../models/lecture.model");
const { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } = require("../utils/cloudinary");

const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and category are required."
            });
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.userId
        });

        return res.status(201).json({
            course,
            message: "Course created."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        });
    }
};

const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice = "" } = req.query;
    
        console.log(categories);

        const searchCriteria = {
            isPublished: true,
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
            ]
        };

        if (categories.length > 0) {
            searchCriteria.category = { $in: categories };
        }

        const sortOptions = {};
        if (sortByPrice === "low") {
            sortOptions.coursePrice = 1;
        } else if (sortByPrice === "high") {
            sortOptions.coursePrice = -1;
        }

        const courses = await Course.find(searchCriteria)
            .populate({ path: "creator", select: "name photoUrl" })
            .sort(sortOptions);

        return res.status(200).json({
            success: true,
            courses: courses || []
        });

        
    } catch (error) {
        console.log(error);
    }
};

const getPublishedCourse = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .populate({ path: "creator", select: "name photoUrl" });
        if (!courses) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        return res.status(200).json({
            courses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses"
        });
    }
};

const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                courses: [],
                message: "Course not found"
            });
        }
        return res.status(200).json({
            courses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get creator's courses"
        });
    }
};

const editCourse = async (req, res) => {
    try {
        const courseId = req.params?.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;
        
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            });
        }

        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        // const updateData = {
        //     courseTitle,
        //     subTitle, 
        //     description, 
        //     category, 
        //     courseLevel, 
        //     coursePrice,
        //     courseThumbnail: courseThumbnail?.secure_url
        // };

        // update the editCourse backend code the user not provide attribute data then store old data
        
        const updateData = {
            courseTitle: course?.courseTitle||"",
            subTitle: course?.subTitle ||"",
            description: course?.description||"",
            category: course?.category||"",
            courseLevel: course?.courseLevel||"",
            coursePrice: course?.coursePrice||null,
            courseThumbnail: courseThumbnail?.secure_url || course?.courseThumbnail || ""
        };

        // Update fields only if new valid data is provided
        if (courseTitle) updateData.courseTitle = courseTitle;
        if (subTitle) updateData.subTitle = subTitle;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (courseLevel) updateData.courseLevel = courseLevel;
        if (coursePrice !== undefined && coursePrice !== null && !isNaN(coursePrice)) {
            updateData.coursePrice = coursePrice;
        }

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            course,
            message: "Course updated successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update course"
        });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            });
        }
        return res.status(200).json({
            course
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course by ID"
        });
    }
};

// additional add deleteCourse code in course.controller backend
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;  // Getting the courseId from the request params
        
        // Find and delete the course by courseId
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        
        if (!deletedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        
        // Optionally, you can delete associated lectures if needed
        // You can use something like:
        // await Lecture.deleteMany({ course: courseId });

        return res.status(200).json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to delete course"
        });
    }
};


const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture title is required"
            });
        }

        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message: "Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create lecture"
        });
    }
};

const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        // console.log(course.lectures)
        return res.status(200).json({
            lectures: course.lectures
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lectures"
        });
    }
};

const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;

        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lecture"
        });
    }
};

const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }

        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        );

        return res.status(200).json({
            message: "Lecture removed successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture"
        });
    }
};

const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture by ID"
        });
    }
};

const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            });
        }
        
        // console.log(publish)
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        
        // console.log("statusMessage",statusMessage)
        return res.status(200).json({
            message: `Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update status"
        });
    }
};

module.exports = {
    createCourse,
    searchCourse,
    getPublishedCourse,
    getCreatorCourses,
    editCourse,
    getCourseById,
    deleteCourse,
    createLecture,
    getCourseLecture,
    editLecture,
    removeLecture,
    getLectureById,
    togglePublishCourse
};
