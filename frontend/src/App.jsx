import { createBrowserRouter, Navigate, RouterProvider, } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";

import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import MainLayout from "./layout/MainLayout";
import HeroSection from "./pages/student/HeroSection";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import clsx from "clsx";
import Sidebar from "./pages/admin/Sidebar";
import AddCourse from "./pages/admin/course/AddCourse";
import CourseTable from "./pages/admin/course/CourseTable";
import Dashboard from "./pages/admin/Dashboard";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import Courses from "./pages/student/Courses";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import EnrolledStudents from "./pages/admin/course/EnrolledStudents";


// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
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
	else if (!isAuthenticated && children.type.name == "EmailVerificationPage") {
		return <Navigate to='/' replace />;
	}
	return children;
};

const AdminRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (user?.role !== "instructor") {
		return <Navigate to="/" replace />
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
}


function App() {
	const { isCheckingAuth, isAuthenticated, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth, isAuthenticated]);

	if (isCheckingAuth) return <LoadingSpinner />;
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
							<Courses />
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
					path: "my-learning",
					element: (
						<ProtectedRoute>
							<MyLearning />
						</ProtectedRoute>
					),
				},
				{
					path: "profile",
					element: (
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					),
				},
				{
					path: "course/search",
					element: (
						<ProtectedRoute>
							<SearchPage />
						</ProtectedRoute>
					),
				},
				{
					path: "course-detail/:courseId",
					element: (
						<ProtectedRoute>
							<CourseDetail />
						</ProtectedRoute>
					),
				},
				{
					path: "course-progress/:courseId",
					element: (
						<ProtectedRoute>
							<PurchaseCourseProtectedRoute>
							<CourseProgress />
							</PurchaseCourseProtectedRoute>
						</ProtectedRoute>
					),
				},

				// admin routes start from here
				{
					path: "admin",
					element: (
						<AdminRoute>
							<Sidebar />
						</AdminRoute>
					),
					children: [
						{
							path: "dashboard",
							element: <Dashboard />,
						},
						{
							path: "course",
							element: <CourseTable />,   //enrolledStudent
						},
						{
							path: "enrolledStudent",
							element: <EnrolledStudents/>,   
						},
						{
							path: "course/create",
							element: <AddCourse />,
						},
						{
							path: "course/:courseId",
							element: <EditCourse />,
						},
						{
							path: "course/:courseId/lecture",
							element: <CreateLecture />,
						},
						{
							path: "course/:courseId/lecture/:lectureId",
							element: <EditLecture />,
						},
					]
				},

			],
		},
	]);

	return (
		<main>
			<ThemeProvider>
				<RouterProvider router={appRouter} />
			</ThemeProvider>
		</main>
	);
}

export default App;