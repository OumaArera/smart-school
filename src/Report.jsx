import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dummy Data
const dummyData = [
  {
    name: "John Doe",
    course: "Computer Science",
    year: "4",
    semester: "1",
    totalAmountPaid: "KES 50,000",
    arrears: "KES 5,000",
    paymentDates: ["2023-03-15", "2023-07-20"],
  },
  {
    name: "Jane Smith",
    course: "Business Administration",
    year: "1",
    semester: "2",
    totalAmountPaid: "KES 60,000",
    arrears: "KES 10,000",
    paymentDates: ["2023-02-10", "2023-06-18"],
  },
  {
    name: "Sam Johnson",
    course: "Electrical Engineering",
    year: "1",
    semester: "1",
    totalAmountPaid: "KES 70,000",
    arrears: "KES 2,000",
    paymentDates: ["2023-01-12", "2023-05-14"],
  },
  {
    name: "Emma Williams",
    course: "Nursing",
    year: "2",
    semester: "2",
    totalAmountPaid: "KES 40,000",
    arrears: "KES 3,000",
    paymentDates: ["2023-03-01", "2023-06-25"],
  },
  {
    name: "Emma Williams",
    course: "Nursing",
    year: "2",
    semester: "2",
    totalAmountPaid: "KES 20,000",
    arrears: "KES 3,000",
    paymentDates: ["2023-04-01", "2023-07-25"],
  },
  {
    name: "David Brown",
    course: "Law",
    year: "3",
    semester: "1",
    totalAmountPaid: "KES 45,000",
    arrears: "KES 7,000",
    paymentDates: ["2023-11-10", "2023-12-05"],
  },
];

// Reports Component
const Reports = () => {
  const [students, setStudents] = useState([]);
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [],
  });
  const [filteredData, setFilteredData] = useState(dummyData); // state for filtered data

  useEffect(() => {
    setStudents(dummyData);
    processGraphData(filteredData);
  }, [filteredData]); // trigger processing when filtered data changes

  const processGraphData = (students) => {
    const feePaymentData = {};
    const dateLabels = new Set();

    students.forEach((student) => {
      const key = `${student.year}-${student.semester}`;
      if (!feePaymentData[key]) {
        feePaymentData[key] = { payments: [], labels: [] };
      }

      student.paymentDates.forEach((date) => {
        if (!feePaymentData[key].labels.includes(date)) {
          feePaymentData[key].labels.push(date);
        }
        feePaymentData[key].payments.push({
          date,
          amount: parseInt(student.totalAmountPaid.replace(/[^\d.-]/g, "")),
        });
        dateLabels.add(date);
      });
    });

    // Generate the chart data
    const chartData = Object.keys(feePaymentData).map((key, index) => {
      const colors = [
        "rgba(75,192,192,1)", // Light teal
        "rgba(153,102,255,1)", // Purple
        "rgba(255,159,64,1)", // Orange
        "rgba(255,99,132,1)", // Red
        "rgba(54,162,235,1)", // Blue
      ];

      return {
        label: key,
        data: feePaymentData[key].labels.map((label) => {
          const payment = feePaymentData[key].payments.find(
            (payment) => payment.date === label
          );
          return payment ? payment.amount : 0;
        }),
        fill: false,
        borderColor: colors[index % colors.length],
        tension: 0.1,
      };
    });

    setGraphData({
      labels: [...dateLabels].sort(),
      datasets: chartData,
    });
  };

  const filterData = (year, semester) => {
    const filtered = dummyData.filter(
      (student) => student.year === year && student.semester === semester
    );
    setFilteredData(filtered);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Fee Payment Analysis</h1>

      {/* Filter buttons for Year-Semester */}
      <div className="mb-6 text-center">
        <button
          onClick={() => filterData("4", "1")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mx-2"
        >
          4-1
        </button>
        <button
          onClick={() => filterData("1", "2")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mx-2"
        >
          1-2
        </button>
        <button
          onClick={() => filterData("1", "1")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mx-2"
        >
          1-1
        </button>
        <button
          onClick={() => filterData("2", "2")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mx-2"
        >
          2-2
        </button>
        <button
          onClick={() => filterData("3", "1")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mx-2"
        >
          3-1
        </button>
      </div>

      {/* Ensure graphData.datasets is not empty */}
      {graphData.labels.length > 0 && graphData.datasets.length > 0 ? (
        <div className="mb-6">
          <Line
            data={graphData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Fee Payments by Year and Semester",
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Payment Dates",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Amount (KES)",
                  },
                  min: 0,
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading data...</div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Insights</h2>
        <ul className="list-disc pl-6">
          <li className="mb-2">
            The fee payment data shows that the majority of payments occur towards the beginning and middle of each semester.
          </li>
          <li className="mb-2">
            Some students consistently pay in the early months of the semester, while others tend to delay until the last possible dates.
          </li>
          <li className="mb-2">
            There seems to be a correlation between the amount of arrears and the number of late payments. Students with larger arrears tend to make payments later in the semester.
          </li>
          <li className="mb-2">
            For improved fee payment tracking, the school could consider implementing automated reminders for students to pay earlier in the semester.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;
