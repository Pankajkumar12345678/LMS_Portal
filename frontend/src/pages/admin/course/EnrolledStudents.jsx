import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const EnrolledStudents = () => {
    const { data: studentData, isError, isLoading } = useGetPurchasedCoursesQuery();
    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1 className="text-red-500">Failed to get Enrolled Student List</h1>;

    const { purchasedCourse } = studentData || [];

    return (
        <div>
            <Table className="mt-3">
                <TableCaption>A list of your recent enrolled student.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Student Pictures</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead> Course Title</TableHead>
                        <TableHead className="text-right">Student Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchasedCourse?.map((course) => (
                        <TableRow key={course._id}>
                            {/* Loop through the enrolled students */}
                            {course?.courseId?.enrolledStudents.map((student) => (
                                <React.Fragment key={student._id}>
                                    <TableCell className="font-medium">
                                        <Avatar>
                                            <AvatarImage className="w-10 h-10 rounded-full"
                                                src={student?.photoUrl|| "https://github.com/shadcn.png"}
                                                alt={student?.name || "Student"}
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{student?.name}</TableCell>
                                    <TableCell><Badge>{course?.courseId?.courseTitle}</Badge></TableCell>
                                    <TableCell className="text-right">{student?.email}</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default EnrolledStudents;
