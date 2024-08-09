import React, { useState, useEffect } from "react";
import DateSelector from "./date-selector";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase-config";
import Modal from "react-modal";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";

const Scheduler = () => {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [persons, setPersons] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchPersons = async () => {
      const personsCollection = collection(db, "persons");
      const personsSnapshot = await getDocs(personsCollection);
      const personsList = personsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPersons(personsList);
    };

    fetchPersons();
  }, []);

  useEffect(() => {
    if (selectedPerson) {
      const person = persons.find((person) => person.name === selectedPerson);
      if (person) {
        setTimeSlots(person.timeSlots || []);
      }
    } else {
      setTimeSlots([]);
    }
  }, [selectedPerson, persons]);

  const handlePersonClick = (personName) => {
    if (selectedPerson === personName) {
      setSelectedPerson("");
      setSelectedTimeSlot("");
      setSelectedDate(null);
    } else {
      setSelectedPerson(personName);
      setSelectedTimeSlot("");
      setSelectedDate(null);
    }
  };

  const handleDateChange = (date) => {
    const today = new Date();
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);

    if (date < today) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "You cannot select a date in the past!",
      });
    } else if (date > oneMonthFromToday) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "You cannot select a date more than a month away!",
      });
    } else {
      setSelectedDate(date);
    }
  };

  const handleTimeSlotClick = (time) => {
    setSelectedTimeSlot(time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPerson && selectedDate && selectedTimeSlot) {
      const meeting = {
        person: selectedPerson,
        date: selectedDate.toDateString(),
        time: selectedTimeSlot,
      };
      try {
        await addDoc(collection(db, "meetings"), meeting);
        Swal.fire({
          icon: "success",
          title: "Meeting Booked",
          text: `Meeting booked with ${selectedPerson} on ${selectedDate.toDateString()} at ${selectedTimeSlot}`,
        });
        setModalIsOpen(true);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: "There was an issue booking the meeting. Please try again.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Selection",
        text: "Please select a person, date, and time slot.",
      });
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPerson("");
    setSelectedDate(null);
    setSelectedTimeSlot("");
  };

  return (
    <div style={styles.container}>
      <h1>Meeting Scheduler</h1>
      <div style={styles.personList}>
        {persons.map((person, index) => (
          <div
            key={index}
            onClick={() => handlePersonClick(person.name)}
            style={{
              ...styles.personCard,
              border:
                selectedPerson === person.name
                  ? "2px solid #dba2a2"
                  : "2px solid transparent",
              boxShadow:
                selectedPerson === person.name
                  ? "0px 4px 15px rgba(219, 162, 162, 0.6)"
                  : "none",
            }}
          >
            <Image
              src={person.image}
              alt={person.name}
              width={80} // specify the width
              height={80} // specify the height
              style={styles.personImage}
            />
            <p>{person.name}</p>
          </div>
        ))}
      </div>

      {selectedPerson && (
        <div style={styles.dateSelectorContainer}>
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>
      )}

      {selectedPerson && selectedDate && (
        <div style={styles.timeSlotContainer}>
          {timeSlots.length > 0 ? (
            timeSlots.map((time, index) => (
              <div
                key={index}
                onClick={() => handleTimeSlotClick(time)}
                style={{
                  ...styles.timeSlot,
                  border:
                    selectedTimeSlot === time
                      ? "2px solid #dba2a2"
                      : "2px solid transparent",
                  backgroundColor:
                    selectedTimeSlot === time ? "#dba2a2" : "#f5efef",
                }}
              >
                {time}
              </div>
            ))
          ) : (
            <p>No available time slots for this person.</p>
          )}
        </div>
      )}

      {selectedPerson && selectedDate && selectedTimeSlot && (
        <button onClick={handleSubmit} style={styles.submitButton}>
          Book Meeting
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Meeting Confirmation"
        style={modalStyles}
      >
        <h2>{selectedPerson}</h2>
        <div style={styles.modalActions}>
          <button onClick={closeModal} style={styles.modalButton}>
            Book Another Meeting
          </button>
          <Link href="/scheduler/manage-booking" legacyBehavior passHref>
            <button style={styles.manageBookingsButton}>Manage Bookings</button>
          </Link>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    margin: "50px auto",
    width: "80%",
    maxWidth: "800px",
    textAlign: "center",
    backgroundColor: "#ffffff",
    color: "#333",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  },
  personList: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "30px",
  },
  personCard: {
    cursor: "pointer",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    transition: "all 0.3s ease-in-out",
    textAlign: "center",
    width: "120px",
  },
  personImage: {
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    objectFit: "cover",
    marginBottom: "10px",
  },
  dateSelectorContainer: {
    marginTop: "30px",
  },
  timeSlotContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  timeSlot: {
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    backgroundColor: "#6b2227",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
  },
  submitButton: {
    padding: "12px 25px",
    borderRadius: "8px",
    backgroundColor: "#6b2227",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "30px",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  modalActions: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    gap: "20px",
  },
  modalButton: {
    padding: "12px 25px",
    borderRadius: "8px",
    backgroundColor: "#6b2227",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  manageBookingsButton: {
    padding: "12px 25px",
    borderRadius: "8px",
    backgroundColor: "#6b2227",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

const modalStyles = {
  content: {
    backgroundColor: "#ffffff",
    color: "#333",
    borderRadius: "10px",
    padding: "30px",
    border: "1px solid #e0e0e0",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    margin: "0 auto",
  },
};

export default Scheduler;
