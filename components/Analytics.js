import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Analytics = ({ totalSessions, totalPresent, totalAbsent }) => {
  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [totalPresent, totalAbsent],
        backgroundColor: ["#6b2227", "#dba2a2"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "300px", height: "300px", marginBottom: "20px" }}>
      <h2>Analytics</h2>
      <Doughnut data={data} />
      <div>
        <p>
          <strong>Total Sessions:</strong> {totalSessions}
        </p>
        <p>
          <strong>Total Present:</strong> {totalPresent}
        </p>
        <p>
          <strong>Total Absent:</strong> {totalAbsent}
        </p>
      </div>
    </div>
  );
};

export default Analytics;
