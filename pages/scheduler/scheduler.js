import React, { useState, useEffect } from "react";
import DateSelector from "./date-selector";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase-config";
import Modal from "react-modal";
import Link from "next/link";
import Image from "next/image";

const Scheduler = () => {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
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
    setSelectedDate(date);
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
      await addDoc(collection(db, "meetings"), meeting);
      setConfirmationMessage(
        `Meeting booked with ${selectedPerson} on ${selectedDate.toDateString()} at ${selectedTimeSlot}`
      );
      setModalIsOpen(true);
    } else {
      setConfirmationMessage("Please select a person, date, and time slot.");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPerson("");
    setSelectedDate(null);
    setSelectedTimeSlot("");
    setConfirmationMessage("");
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
        <h2>{confirmationMessage}</h2>
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
    margin: "50px",
    textAlign: "center",
    backgroundColor: "#6b2227",
    color: "#dba2a2",
    padding: "20px",
    borderRadius: "10px",
  },
  personList: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  personCard: {
    margin: "0 10px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "8px",
    transform: "scale(1)",
    transition: "all 0.3s ease-in-out",
  },
  personImage: {
    borderRadius: "50%",
    width: "100px",
    height: "100px",
  },
  dateSelectorContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  timeSlotContainer: {
    marginTop: "5px",
    display: "flex",
    justifyContent: "center",
    gap: "5px",
    flexWrap: "wrap",
  },
  timeSlot: {
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    marginBottom: "5px",
  },
  submitButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#dba2a2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    gap: "20px",
  },
  modalButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
  },
  manageBookingsButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    fontSize: "16px",
  },
};

const modalStyles = {
  content: {
    backgroundColor: "#6b2227",
    color: "#dba2a2",
    borderRadius: "10px",
    padding: "20px",
    border: "none",
  },
};

export default Scheduler;
