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
import Swal from "sweetalert2";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [persons, setPersons] = useState([]);
  const availableTimeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      const user = "Current Rec Rep Name"; // Replace this with the actual way to get the logged-in user's name, such as from context or state.

      const bookingsCollection = collection(db, "meetings");
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsList = bookingsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((booking) => booking.person === user); // Filter meetings where the logged-in user is the person chosen.

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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "meetings", id));
        setBookings(bookings.filter((booking) => booking.id !== id));
        Swal.fire("Deleted!", "Your booking has been deleted.", "success");
      }
    });
  };

  const handleEdit = (booking) => {
    const [time, period] = booking.time.split(" ");
    setEditBooking({
      ...booking,
      time,
      period,
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
      <h1 style={styles.heading}>Manage Bookings</h1>
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
          <h2 style={styles.subHeading}>Edit Booking</h2>
          <div>
            <label style={styles.label}>
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
            <label style={styles.label}>
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
            <label style={styles.label}>
              Time:
              <select
                value={editBooking.time}
                onChange={(e) =>
                  setEditBooking({ ...editBooking, time: e.target.value })
                }
                style={styles.select}
              >
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
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
    margin: "50px auto",
    maxWidth: "800px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    color: "#333333",
    marginBottom: "20px",
    fontSize: "30px",
    textAlign: "center",
  },
  backButton: {
    marginBottom: "20px",
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#6b2227",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
    color: "#333",
    textAlign: "left",
    padding: "10px",
    fontWeight: "bold",
    borderBottom: "2px solid #dee2e6",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #dee2e6",
  },
  editButton: {
    marginRight: "10px",
    padding: "5px 10px",
    borderRadius: "8px",
    backgroundColor: "#dba2a2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
  deleteButton: {
    padding: "5px 10px",
    borderRadius: "8px",
    backgroundColor: "#dba2a2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
  editContainer: {
    marginTop: "20px",
  },
  subHeading: {
    color: "#333333",
    marginBottom: "20px",
    fontSize: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "16px",
    color: "#555",
  },
  input: {
    margin: "10px 0",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  select: {
    margin: "10px 0",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
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
