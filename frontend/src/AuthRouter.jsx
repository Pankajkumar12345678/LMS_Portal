import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";

import { useAuthStore } from "./store/authStore";
import { useDispatch } from "react-redux";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	console.log("user",user)
	if (!isAuthenticated) {
		localStorage.removeItem("user");
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
	
	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};


	const appRouter = createBrowserRouter([
		{
		  path: "/",
		  element: <MainLayout />,
		  children: [
			{
			  path: "/",
			  element: (
				<>
				  <HeroSection />
				  {/* <Courses /> */}
				</>
			  ),
			},
			{
				path: "signup",
				element: (
				<RedirectAuthenticatedUser>
					<SignUpPage />
				</RedirectAuthenticatedUser>
				),
			  },
			{
			  path: "login",
			  element: (
				<RedirectAuthenticatedUser>
				  	<LoginPage />
				</RedirectAuthenticatedUser>
			  ),
			},
			{
				path: "verify-email",
				element: (
					<RedirectAuthenticatedUser>
						<EmailVerificationPage />
					</RedirectAuthenticatedUser>
				),
			  },
			{
				path: "forgot-password",
				element: (
					<RedirectAuthenticatedUser>
						<ForgotPasswordPage />
					</RedirectAuthenticatedUser>
				),
			  },
			
			  {
				path: "reset-password/:token",
				element: (
					<RedirectAuthenticatedUser>
						<ResetPasswordPage />
					</RedirectAuthenticatedUser>
				),
			  },
			  {
				path: "profile",
				element: (
					<ProtectedRoute>
						<DashboardPage/>
					</ProtectedRoute>
				),
			  },
			
		  ],
		},
	  ]);

function App() {
	const { isCheckingAuth, checkAuth} = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<main>
			<ThemeProvider>
				<RouterProvider router={appRouter} />
			</ThemeProvider>
	  </main>
	);
}

export default App;










//course progress code old

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
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess },] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess },] = useInCompleteCourseMutation();

  useEffect(() => {
    console.log(markCompleteData);

    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);
  const [showMotivation, setShowMotivation] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  console.log(data);

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  // initialze the first lecture is not exist
  const initialLecture = currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();

    //addtional for motivation
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 3000);
  };

  // Handle select a specific lecture to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    //handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  // addtional showing course progressbar
  const completedLectures = progress.filter((prog) => prog.viewed).length;
  const totalLectures = courseDetails.lectures.length;
  const progressPercentage = Math.round((completedLectures / totalLectures) * 100);

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      {/* Display course title and completion status  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>{" "}
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
        {/* Video section  */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>

            {/* previous video play code */}
            {/* <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
            /> */}

            {/* new video play code the video does not complete watch then does not call handleLectureProgress funtion */}
            <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              controlsList="nodownload"
              className="w-full h-auto md:rounded-lg"
              onEnded={() =>
                handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
            />

          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2 ">
            <h3 className="font-medium text-lg">
              {`Lecture ${courseDetails.lectures.findIndex(
                (lec) =>
                  lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1
                } : ${currentLecture?.lectureTitle || initialLecture.lectureTitle
                }`}
            </h3>
          </div>
        </div>
        {/* Lecture Sidebar  */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id
                  ? "bg-gray-200 dark:dark:bg-gray-800"
                  : ""
                  } `}
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
                      <CardTitle className="text-lg font-medium">
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