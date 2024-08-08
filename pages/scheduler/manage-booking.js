import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase-config";
import Link from "next/link";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsCollection = collection(db, "meetings");
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsList = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsList);
    };

    const fetchPersons = async () => {
      const personsCollection = collection(db, "persons");
      const personsSnapshot = await getDocs(personsCollection);
      const personsList = personsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPersons(personsList);
    };

    fetchBookings();
    fetchPersons();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "meetings", id));
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  const handleEdit = (booking) => {
    setEditBooking({
      ...booking,
      time: booking.time.endsWith("AM")
        ? booking.time.slice(0, -3)
        : booking.time.slice(0, -3),
      period: booking.time.endsWith("AM") ? "AM" : "PM",
    });
  };

  const handleSave = async () => {
    const bookingDoc = doc(db, "meetings", editBooking.id);
    await updateDoc(bookingDoc, {
      person: editBooking.person,
      date: new Date(editBooking.date).toDateString(),
      time: `${editBooking.time} ${editBooking.period}`,
    });
    setEditBooking(null);

    const bookingsCollection = collection(db, "meetings");
    const bookingsSnapshot = await getDocs(bookingsCollection);
    const bookingsList = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBookings(bookingsList);
  };

  return (
    <div style={styles.container}>
      <h1>Manage Bookings</h1>
      <Link href="/Scheduler" legacyBehavior passHref>
        <button style={styles.backButton}>Back to Scheduler</button>
      </Link>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Person</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Time</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td style={styles.tableCell}>{booking.person}</td>
              <td style={styles.tableCell}>{booking.date}</td>
              <td style={styles.tableCell}>{booking.time}</td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => handleEdit(booking)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(booking.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editBooking && (
        <div style={styles.editContainer}>
          <h2>Edit Booking</h2>
          <div>
            <label>
              Person:
              <select
                value={editBooking.person}
                onChange={(e) =>
                  setEditBooking({ ...editBooking, person: e.target.value })
                }
                style={styles.select}
              >
                {persons.map((person) => (
                  <option key={person.id} value={person.name}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Date:
              <input
                type="date"
                value={new Date(editBooking.date).toISOString().substr(0, 10)}
                onChange={(e) =>
                  setEditBooking({ ...editBooking, date: e.target.value })
                }
                style={styles.input}
              />
            </label>
          </div>
          <div>
            <label>
              Time:
              <input
                type="time"
                value={editBooking.time}
                onChange={(e) =>
                  setEditBooking({ ...editBooking, time: e.target.value })
                }
                style={styles.input}
              />
            </label>
            <select
              value={editBooking.period}
              onChange={(e) =>
                setEditBooking({ ...editBooking, period: e.target.value })
              }
              style={styles.select}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <button onClick={handleSave} style={styles.saveButton}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: "50px",
    textAlign: "center",
    backgroundColor: "#6b2227",
    color: "#dba2a2",
    padding: "20px",
    borderRadius: "10px",
  },
  backButton: {
    marginBottom: "20px",
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
  },
  table: {
    margin: "0 auto",
    borderCollapse: "collapse",
    width: "80%",
  },
  tableHeader: {
    border: "1px solid #dba2a2",
    padding: "8px",
    backgroundColor: "#6b2227",
    color: "#dba2a2",
  },
  tableCell: {
    border: "1px solid #dba2a2",
    padding: "8px",
  },
  editButton: {
    marginRight: "10px",
    padding: "5px 10px",
    borderRadius: "8px",
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
  deleteButton: {
    padding: "5px 10px",
    borderRadius: "8px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
  editContainer: {
    marginTop: "20px",
  },
  input: {
    margin: "10px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#333",
  },
  select: {
    margin: "10px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#333",
  },
  saveButton: {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
  },
};

export default ManageBookings;
