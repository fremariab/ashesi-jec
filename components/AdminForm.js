import { useState, useEffect, useCallback } from "react";
import { db } from "../lib/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import Swal from "sweetalert2";
import styles from "../styles/AdminForm.module.css";

const AdminForm = () => {
  const [sessionType, setSessionType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [pinDisplayTime, setPinDisplayTime] = useState("");
  const [pin, setPin] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [sessions, setSessions] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  const locations = [
    { name: "RB100", latitude: 5.761553, longitude: -0.2150965 },
    { name: "Databank 218", latitude: 5.7594716, longitude: -0.2200091 },
    { name: "Archer Courtyard", latitude: 5.7597119, longitude: -0.2200709 },
    { name: "Norton Motulsky", latitude: 5.7591665, longitude: -0.219695 },
    { name: "Tanko", latitude: 5.7633979, longitude: -0.2186333 },
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const fetchSessions = useCallback(
    async (next = false) => {
      let sessionsQuery;

      if (next) {
        if (lastVisible) {
          sessionsQuery = query(
            collection(db, "sessions"),
            orderBy("startTime", "desc"),
            startAfter(lastVisible),
            limit(10)
          );
        } else {
          return;
        }
      } else {
        sessionsQuery = query(
          collection(db, "sessions"),
          orderBy("startTime", "desc"),
          limit(10)
        );
      }

      const sessionsSnapshot = await getDocs(sessionsQuery);

      if (!sessionsSnapshot.empty) {
        const lastVisibleDoc =
          sessionsSnapshot.docs[sessionsSnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
      }

      const sessionsData = await Promise.all(
        sessionsSnapshot.docs.map(async (doc) => {
          const sessionData = doc.data();
          const attendanceQuery = query(
            collection(db, "userAttendance"),
            where("sessionId", "==", doc.id)
          );
          const attendanceSnapshot = await getDocs(attendanceQuery);
          const attendanceCount = attendanceSnapshot.size;
          return { id: doc.id, ...sessionData, attendanceCount };
        })
      );

      setSessions((prevSessions) => [
        ...(next ? prevSessions : []),
        ...sessionsData,
      ]);
    },
    [lastVisible]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (
      !sessionType ||
      !startTime ||
      !endTime ||
      !pinDisplayTime ||
      !pin ||
      !location ||
      !year
    ) {
      Swal.fire("Error", "All fields must be filled.", "error");
      return;
    }

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    const pinDisplay = new Date(pinDisplayTime);

    // Check if the dates are in the future
    if (start < now || end < now || pinDisplay < now) {
      Swal.fire("Error", "Dates and times must be in the future.", "error");
      return;
    }

    // Check if end time is after start time
    if (end <= start) {
      Swal.fire("Error", "End time must be after start time.", "error");
      return;
    }

    // Check if pin display time is within the start and end times
    if (pinDisplay < start || pinDisplay > end) {
      Swal.fire(
        "Error",
        "Pin display time must be between session start and end time.",
        "error"
      );
      return;
    }

    if (pin.length !== 4 || isNaN(pin)) {
      Swal.fire("Error", "Pin must be 4 digits.", "error");
      return;
    }

    const selectedLocation = locations.find((loc) => loc.name === location);

    try {
      await addDoc(collection(db, "sessions"), {
        sessionType,
        startTime: start,
        endTime: end,
        pinDisplayTime: pinDisplay,
        pin,
        location: selectedLocation,
        year,
      });
      Swal.fire("Success", "Session created successfully!", "success");

      setSessionType("");
      setStartTime("");
      setEndTime("");
      setPinDisplayTime("");
      setPin("");
      setLocation("");
      setYear("");

      fetchSessions();
    } catch (error) {
      console.error("Error creating session:", error);
      Swal.fire("Error", "Error creating session.", "error");
    }
  };

  return (
    <div className={styles.adminFormContainer}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Create a New Session</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Session Type:
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Session Type</option>
              <option value="Honor Code">Honor Code</option>
              <option value="Parliament Hearing">Parliament Hearing</option>
              <option value="Academic Integrity Session">
                Academic Integrity Session
              </option>
            </select>
          </label>
          <label className={styles.label}>
            Start Time:
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={styles.input}
              min={new Date().toISOString().slice(0, 16)} // Ensures no past dates are selected
            />
          </label>
          <label className={styles.label}>
            End Time:
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={styles.input}
              min={startTime} // Ensures end time is after start time
            />
          </label>
          <label className={styles.label}>
            Pin Display Time:
            <input
              type="datetime-local"
              value={pinDisplayTime}
              onChange={(e) => setPinDisplayTime(e.target.value)}
              className={styles.input}
              min={startTime} // Ensures pin display time is within session times
              max={endTime}
            />
          </label>
          <label className={styles.label}>
            Pin:
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength="4"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Location:
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Year:
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Year</option>
              {years.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className={styles.submitButton}>
            Create Session
          </button>
        </form>
      </div>
      <div className={styles.line}></div>
      <div className={styles.sessionsContainer}>
        <h2 className={styles.title}>Sessions</h2>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Session Type</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Attendance Count</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{session.sessionType}</td>
                <td className={styles.tableCell}>
                  {new Date(session.startTime.seconds * 1000).toLocaleString()}
                </td>
                <td className={styles.tableCell}>
                  {new Date(session.endTime.seconds * 1000).toLocaleString()}
                </td>
                <td className={styles.tableCell}>{session.attendanceCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => fetchSessions(true)}
          className={styles.loadMoreButton}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default AdminForm;
