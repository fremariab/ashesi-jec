import { useState, useEffect } from "react";
import { db } from "../../lib/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import SessionList from "../../components/SessionList";
import Analytics from "../../components/Analytics";
import styles from "../../styles/AttendancePage.module.css"; // Ensure this path is correct
import withAuth from "../../hoc/withAuth";

const AttendancePage = () => {
  const [selectedSessionType, setSelectedSessionType] = useState("");
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      console.log("User not logged in");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchAttendanceData = async () => {
      const attendanceQuery = query(
        collection(db, "userAttendance"),
        where("userId", "==", userId)
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);
      const attendanceData = attendanceSnapshot.docs.map((doc) => doc.data());

      const totalSessions = attendanceData.length;
      const totalPresent = attendanceData.filter(
        (session) => session.status === "Present"
      ).length;
      const totalAbsent = totalSessions - totalPresent;

      setTotalSessions(totalSessions);
      setTotalPresent(totalPresent);
      setTotalAbsent(totalAbsent);
    };

    fetchAttendanceData();
  }, [userId]);

  const handleButtonClick = (type) => {
    setSelectedSessionType(type);
  };

  return (
    <div className={styles.container}>
      <div className={styles.analyticsContainer}>
        <Analytics
          totalSessions={totalSessions}
          totalPresent={totalPresent}
          totalAbsent={totalAbsent}
        />
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Attendance System</h1>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${
              selectedSessionType === "Honor Code" ? styles.activeButton : ""
            }`}
            onClick={() => handleButtonClick("Honor Code")}
          >
            Honor Code
          </button>
          <button
            className={`${styles.button} ${
              selectedSessionType === "Parliament Hearing"
                ? styles.activeButton
                : ""
            }`}
            onClick={() => handleButtonClick("Parliament Hearing")}
          >
            Parliament Hearing
          </button>
          <button
            className={`${styles.button} ${
              selectedSessionType === "Academic Integrity Session"
                ? styles.activeButton
                : ""
            }`}
            onClick={() => handleButtonClick("Academic Integrity Session")}
          >
            Academic Integrity Session
          </button>
        </div>
        <br />
        {selectedSessionType && (
          <SessionList sessionType={selectedSessionType} />
        )}
      </div>
    </div>
  );
};

export default withAuth(AttendancePage, ["normal"]);
