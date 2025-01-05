import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  // Fetch course progress data
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  // Mutations for updating course and lecture progress
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { isLoading: isCompletingCourse }] = useCompleteCourseMutation();
  const [inCompleteCourse, { isLoading: isInCompletingCourse }] = useInCompleteCourseMutation();

  // State to manage UI and optimistic updates
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState(null);

  // Set initial optimistic completion status when data is fetched
  useEffect(() => {
    if (data) {
      setOptimisticCompleted(data.data.completed);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  // Destructure data for easy access
  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  // Determine the initial lecture to display
  const initialLecture = currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  // Function to handle marking a course as complete
  const handleCompleteCourse = async () => {
    setOptimisticCompleted(true); // Optimistic update
    try {
      await completeCourse(courseId).unwrap();
      refetch();
      toast.success("Course marked as completed!");
    } catch (error) {
      setOptimisticCompleted(false); // Revert on error
      toast.error("Failed to mark the course as completed.");
    }
  };

  // Function to handle marking a course as incomplete
  const handleInCompleteCourse = async () => {
    setOptimisticCompleted(false); // Optimistic update
    try {
      await inCompleteCourse(courseId).unwrap();
      refetch();
      toast.success("Course marked as incomplete!");
    } catch (error) {
      setOptimisticCompleted(true); // Revert on error
      toast.error("Failed to mark the course as incomplete.");
    }
  };

  // Check if a lecture is completed
  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  // Handle lecture progress and show motivation message
  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();

    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 3000);
  };

  // Handle selecting a specific lecture
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  // Calculate progress percentage
  const completedLectures = progress.filter((prog) => prog.viewed).length;
  const totalLectures = courseDetails.lectures.length;
  const progressPercentage = Math.round((completedLectures / totalLectures) * 100);

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      {/* Display course title and completion status */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={optimisticCompleted ? handleInCompleteCourse : handleCompleteCourse}
          variant={optimisticCompleted ? "outline" : "default"}
          disabled={isCompletingCourse || isInCompletingCourse}
        >
          {optimisticCompleted ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      {/* Display Motivation Message */}
      {showMotivation && (
        <div className="bg-green-500 text-white p-4 rounded-lg text-center mb-4">
          Keep going! You're doing great!
        </div>
      )}

      {/* Course Progress Bar */}
      <div className="mb-6">
        <Progress value={progressPercentage} />
        <p className="text-sm text-gray-600 mt-1">{`${completedLectures} of ${totalLectures} lectures completed (${progressPercentage}%)`}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Section */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <video
            src={currentLecture?.videoUrl || initialLecture.videoUrl}
            controls
            controlsList="nodownload"
            className="w-full h-auto md:rounded-lg"
            onEnded={() =>
              handleLectureProgress(currentLecture?._id || initialLecture._id)
            }
            onContextMenu={(e) => e.preventDefault()}  
          />
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture ${courseDetails.lectures.findIndex(
                (lec) =>
                  lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1
                } : ${currentLecture?.lectureTitle || initialLecture.lectureTitle}`}
            </h3>
          </div>
        </div>

        {/* Lecture Sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1" style={{ maxHeight: "500px", overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id ? "bg-gray-200 dark:bg-gray-800" : ""
                  }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium " style={{ wordBreak: "break-word" }}>
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
