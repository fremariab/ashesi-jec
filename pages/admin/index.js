// // pages/scheduler/index.js
import withAuth from "../../hoc/withAuth";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { db } from "../../lib/firebase-config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import jeclogo from "../../assets/jeclogo2.png";

const Index = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      const meetingsQuery = query(
        collection(db, "meetings"),
        orderBy("date", "asc")
      );
      const meetingsSnapshot = await getDocs(meetingsQuery);
      const meetingsData = meetingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUpcomingMeetings(meetingsData);
    };

    const fetchSessions = async () => {
      const sessionsQuery = query(
        collection(db, "sessions"),
        orderBy("date", "asc")
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUpcomingSessions(sessionsData);
    };

    fetchMeetings();
    fetchSessions();
  }, []);

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FontAwesomeIcon icon={faCalendarAlt} style={styles.icon} />
            Upcoming Meetings
          </h2>
          {upcomingMeetings.length === 0 ? (
            <p style={styles.noData}>No upcoming meetings</p>
          ) : (
            <ul style={styles.list}>
              {upcomingMeetings.map((meeting, index) => (
                <li key={index} style={styles.listItem}>
                  <div style={styles.listItemContent}>
                    <span>{meeting.title}</span>
                    <span>{new Date(meeting.date).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FontAwesomeIcon icon={faUserCircle} style={styles.icon} />
            Upcoming Sessions
          </h2>
          {upcomingSessions.length === 0 ? (
            <p style={styles.noData}>No upcoming sessions</p>
          ) : (
            <ul style={styles.list}>
              {upcomingSessions.map((session, index) => (
                <li key={index} style={styles.listItem}>
                  <div style={styles.listItemContent}>
                    <span>{session.title}</span>
                    <span>{new Date(session.date).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#F7F7F7",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#7D0E29",
    padding: "10px 30px",
    color: "white",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: "1.5em",
    marginLeft: "15px",
  },
  nav: {
    display: "flex",
    alignItems: "center",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    marginLeft: "20px",
    fontSize: "16px",
    fontWeight: "500",
  },
  navIcon: {
    marginLeft: "20px",
    cursor: "pointer",
  },
  main: {
    padding: "30px",
  },
  section: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.5em",
    color: "#7D0E29",
    marginBottom: "20px",
  },
  icon: {
    marginRight: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "15px",
    borderBottom: "1px solid #E0E0E0",
  },
  listItemContent: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
  },
  noData: {
    color: "#999999",
    fontStyle: "italic",
  },
};

export default withAuth(Index, ["superadmin"]);
