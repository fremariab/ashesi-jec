import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DateSelector = ({ selectedDate, onDateChange }) => {
  return (
    <div style={styles.container}>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        style={styles.calendar}
        tileClassName="custom-tile"
      />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#6b2227",
    color: "#dba2a2",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "300px",
    margin: "0 auto",
  },
  calendar: {
    border: "1px solid #dba2a2",
    borderRadius: "10px",
  },
};

export default DateSelector;
