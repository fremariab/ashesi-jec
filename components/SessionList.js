import { useState, useEffect } from "react";
import { db } from "../lib/firebase-config";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import styles from "../styles/SessionList.module.css"; // Ensure this path is correct

const SessionList = ({ sessionType }) => {
  const [sessions, setSessions] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      // Handle the case where the user is not logged in
      console.log("User not logged in");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchSessions = async () => {
      const sessionsQuery = query(
        collection(db, "sessions"),
        where("sessionType", "==", sessionType),
        orderBy("startTime", "asc")
      );

      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSessions(sessionsData);

      const attendanceQuery = query(
        collection(db, "userAttendance"),
        where("userId", "==", userId)
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);
      const attendanceData = attendanceSnapshot.docs.reduce((acc, doc) => {
        const { sessionId, status } = doc.data();
        acc[sessionId] = status;
        return acc;
      }, {});

      setAttendanceStatus(attendanceData);
    };

    fetchSessions();
  }, [sessionType, userId]);

  const handleAttendanceClick = async (session) => {
    const now = new Date();
    const sessionStart = session.startTime.toDate();
    const sessionEnd = session.endTime.toDate();
    const pinDisplayTime = session.pinDisplayTime.toDate();

    if (now > sessionEnd) {
      Swal.fire("Error", "This session has already ended.", "error");
      return;
    }

    if (!currentLocation.latitude || !currentLocation.longitude) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          checkLocationAndTime(
            session,
            position.coords.latitude,
            position.coords.longitude
          );
        },
        () => Swal.fire("Error", "Could not retrieve your location.", "error")
      );
    } else {
      checkLocationAndTime(
        session,
        currentLocation.latitude,
        currentLocation.longitude
      );
    }
  };

  const checkLocationAndTime = (session, userLat, userLon) => {
    const distance = haversineDistance(
      userLat,
      userLon,
      session.location.latitude,
      session.location.longitude
    );

    if (distance > 250) {
      Swal.fire("Error", "You are not at the required location.", "error");
      return;
    }

    const now = new Date();
    const pinDisplayTime = session.pinDisplayTime.toDate();

    if (now < pinDisplayTime) {
      Swal.fire("Error", "It is not time to enter the pin yet.", "error");
      return;
    }

    Swal.fire({
      title: "Enter Pin",
      input: "text",
      inputAttributes: {
        maxlength: 4,
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
    }).then(async (result) => {
      if (result.value) {
        if (result.value === session.pin) {
          await updateAttendance(session.id, "Present");
        } else {
          Swal.fire("Error", "Incorrect pin.", "error");
        }
      }
    });
  };

  const updateAttendance = async (sessionId, status) => {
    try {
      const userAttendanceRef = collection(db, "userAttendance");
      const existingRecordQuery = query(
        userAttendanceRef,
        where("userId", "==", userId),
        where("sessionId", "==", sessionId)
      );

      const existingRecordSnapshot = await getDocs(existingRecordQuery);

      if (!existingRecordSnapshot.empty) {
        const docId = existingRecordSnapshot.docs[0].id;
        const docRef = doc(db, "userAttendance", docId);
        await updateDoc(docRef, {
          status: status,
          timestamp: new Date(),
        });
      } else {
        await addDoc(userAttendanceRef, {
          userId: userId,
          sessionId: sessionId,
          status: status,
          timestamp: new Date(),
        });
      }

      setAttendanceStatus((prev) => ({ ...prev, [sessionId]: status }));
      Swal.fire("Success", "Attendance marked as present.", "success");
      window.location.reload();
    } catch (error) {
      console.error("Error updating attendance:", error);
      Swal.fire("Error", "Error marking attendance.", "error");
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Sessions</h2>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Session Type</th>
            <th>Start Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr
              key={session.id}
              className={index % 2 === 0 ? styles.tableRowEven : undefined}
            >
              <td className={styles.tableCell}>{session.sessionType}</td>
              <td className={styles.tableCell}>
                {session.startTime.toDate().toLocaleString()}
              </td>
              <td className={styles.tableCell}>
                {attendanceStatus[session.id] || "Absent"}
              </td>
              <td className={styles.tableCell}>
                {new Date() < session.endTime.toDate() ? (
                  <button
                    className={`${styles.button} ${
                      attendanceStatus[session.id] === "Present"
                        ? styles.buttonDisabled
                        : ""
                    }`}
                    onClick={() => handleAttendanceClick(session)}
                    disabled={attendanceStatus[session.id] === "Present"}
                  >
                    {attendanceStatus[session.id] === "Present"
                      ? "Present"
                      : "Take Attendance"}
                  </button>
                ) : (
                  <button
                    className={`${styles.button} ${styles.buttonDisabled}`}
                    disabled
                  >
                    Session Ended
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionList;
