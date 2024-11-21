import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { jsPDF } from "jspdf";
import logo from './images/SCHOOL LOGO.PNG';

const STUDENTS_URL = "https://smart-school-server-9aqb.onrender.com/users/fees";

const StudentBalances = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [token, setToken] = useState("");

  useEffect(() => {
    // Load token from localStorage
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);

    // Fetch student data
    const fetchStudentData = async () => {
      try {
        const response = await fetch(STUDENTS_URL, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const result = await response.json();
        if (result.success) {
          const formattedStudents = result.data.map((student) => ({
            ...student,
            totalAmountPaid: student.feesPaidThisSemester.toLocaleString(),
            amountInArrears: student.arrears.toLocaleString(),
          }));
          setStudents(formattedStudents);
          setFilteredStudents(formattedStudents);
        } else {
          console.error("Error in response:", result.message);
        }
      } catch (error) {
        console.error("Error fetching student data", error);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [courseFilter, semesterFilter, yearFilter]);

  // Filter students based on user input
  const filterStudents = () => {
    let filtered = students;

    if (courseFilter) filtered = filtered.filter((student) => student.course.toLowerCase().includes(courseFilter.toLowerCase()));
    if (semesterFilter) filtered = filtered.filter((student) => student.semester.toString() === semesterFilter);
    if (yearFilter) filtered = filtered.filter((student) => student.year.toString() === yearFilter);

    // Filter for students with arrears
    filtered = filtered.filter((student) => parseInt(student.arrears, 10) > 0);

    setFilteredStudents(filtered);
  };

  // Handle pagination
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // Handle checking if student has arrears
  const checkArrears = (admissionNo) => {
    const student = students.find((student) => student.admissionNumber === admissionNo);
    if (student) {
      alert(
        `Student ${student.name} has ${student.amountInArrears} in arrears. Total Amount Paid: ${student.totalAmountPaid}`
      );
    } else {
      alert("Student not found.");
    }
  };

  // Generate PDF of filtered students
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add the logo to the header of the document
    doc.addImage(logo, "PNG", 10, 10, 50, 20); // Position: x=10, y=10, width=50, height=20
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Student Arrears Report", 70, 20);

    // Add table header
    const header = ["Name", "Course", "Semester", "Year", "Admission No", "Total Amount Paid", "Amount in Arrears"];

    const tableData = filteredStudents.map((student) => [
      student.name,
      student.course,
      student.semester,
      student.year,
      student.admissionNumber,
      student.totalAmountPaid,
      student.amountInArrears,
    ]);

    // Set column widths
    const columnWidths = [40, 40, 30, 20, 30, 40, 30];
    const rowHeight = 8;

    // Add a header row
    let yOffset = 40;
    doc.setFontSize(10);
    header.forEach((col, index) => {
      doc.text(col, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yOffset);
    });

    // Add student data in a table format
    yOffset += rowHeight;
    tableData.forEach((student, index) => {
      student.forEach((cell, colIndex) => {
        doc.text(cell.toString(), 10 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), yOffset);
      });

      yOffset += rowHeight;

      // Check if we need to add a new page
      if (yOffset > 250) {
        doc.addPage();
        doc.addImage(logo, "PNG", 10, 10, 50, 20); // Re-add the logo in the new page
        doc.text("Student Arrears Report", 70, 20); // Re-add the header text
        yOffset = 30; // Reset the offset for new page
      }
    });

    // Footer Message (on the last page)
    doc.text(
      "Students are advised to complete their fees as soon as possible to avoid disruption of services.",
      10,
      yOffset + 10
    );

    // Save the document
    doc.save("student-arrears-report.pdf");
  };

  const offset = currentPage * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(offset, offset + itemsPerPage);

  // Extract unique values for dropdowns
  const courses = [...new Set(students.map((student) => student.course))];
  const semesters = [...new Set(students.map((student) => student.semester.toString()))];
  const years = [...new Set(students.map((student) => student.year.toString()))];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Student Balances</h1>

      {/* Search Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <input
          type="text"
          placeholder="Enter Admission Number"
          value={admissionNumber}
          onChange={(e) => setAdmissionNumber(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full"
        />
        <button
          onClick={() => checkArrears(admissionNumber)}
          className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Check Arrears
        </button>

        {/* Filters */}
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full"
        >
          <option value="">Filter by Course</option>
          {courses.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full"
        >
          <option value="">Filter by Semester</option>
          {semesters.map((semester, index) => (
            <option key={index} value={semester}>
              {semester}
            </option>
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full"
        >
          <option value="">Filter by Year</option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Semester</th>
              <th className="px-4 py-2">Admission No.</th>
              <th className="px-4 py-2">Total Amount Paid</th>
              <th className="px-4 py-2">Amount in Arrears</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}
              >
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.course}</td>
                <td className="px-4 py-2">{student.semester}</td>
                <td className="px-4 py-2">{student.admissionNumber}</td>
                <td className="px-4 py-2">{student.totalAmountPaid}</td>
                <td className="px-4 py-2">{student.amountInArrears}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredStudents.length / itemsPerPage)}
        onPageChange={handlePageChange}
        containerClassName={"flex justify-center mt-6"}
        pageClassName={"px-3 py-2 border border-gray-300 mx-1 rounded"}
        activeClassName={"bg-blue-600 text-white"}
        previousClassName={"px-3 py-2 border border-gray-300 mx-1 rounded"}
        nextClassName={"px-3 py-2 border border-gray-300 mx-1 rounded"}
      />

      {/* PDF Section */}
      <div className="text-center mt-8">
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
        >
          Generate PDF Report
        </button>
      </div>
    </div>
  );
};

export default StudentBalances;
