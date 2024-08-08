import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import withAuth from "../../hoc/withAuth";
import { db, storage } from "../../lib/firebase-config";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import styles from "../../styles/ManageScheduling.module.css";
const Admin = () => {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  // Generate time slots between 10 AM and 5 PM
  const timeSlotOptions = [];
  for (let hour = 10; hour <= 17; hour++) {
    timeSlotOptions.push(`${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`);
  }

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

    if (file) {
      if (file.size > maxSize) {
        Swal.fire({
          title: "File Too Large",
          text: "The image file is too large. Please resize it (below 2 MB) before uploading.",
          icon: "warning",
          confirmButtonText: "OK",
          footer:
            '<a href="https://imageresizer.com/" target="_blank" rel="noopener noreferrer">Resize your image here</a>',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddPerson = async () => {
    // Validate the fields
    if (!name.trim()) {
      Swal.fire({
        title: "Missing Information",
        text: "Please enter a name.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!image) {
      Swal.fire({
        title: "Missing Information",
        text: "Please upload an image.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (selectedTimeSlots.length === 0) {
      Swal.fire({
        title: "Missing Information",
        text: "Please select at least one time slot.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const newPerson = {
      name,
      image,
      timeSlots: selectedTimeSlots,
    };

    try {
      if (editingPerson) {
        await updateDoc(doc(db, "persons", editingPerson.id), newPerson);
        setPersons(
          persons.map((person) =>
            person.id === editingPerson.id
              ? { ...person, ...newPerson }
              : person
          )
        );
        Swal.fire({
          title: "Updated",
          text: "Representative information updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setEditingPerson(null);
      } else {
        const docRef = await addDoc(collection(db, "persons"), newPerson);
        setPersons([...persons, { id: docRef.id, ...newPerson }]);
        Swal.fire({
          title: "Added",
          text: "Representative added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      resetForm();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while saving the representative. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEditPerson = (person) => {
    setName(person.name);
    setImage(person.image);
    setSelectedTimeSlots(person.timeSlots || []);
    setEditingPerson(person);
  };

  const handleDeletePerson = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "persons", id));
        setPersons(persons.filter((person) => person.id !== id));
        Swal.fire({
          title: "Deleted",
          text: "Representative deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the representative. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleSelectTimeSlot = (slot) => {
    if (selectedTimeSlots.includes(slot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter((time) => time !== slot));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slot]);
    }
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setSelectedTimeSlots([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Page</h1>

      {/* Add/Edit Person Section */}
      <div style={{ marginBottom: "20px" }}>
        <h2>{editingPerson ? "Edit Representative" : "Add Representative"}</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputText}
          required
        />
        <input
          type="file"
          onChange={handleImageUpload}
          className={styles.inputFile}
          required
        />
        {image && (
          <img
            src={image}
            alt="Selected"
            style={{ width: "50px", height: "50px", marginRight: "10px" }}
          />
        )}

        <h3>Select Time Slots</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {timeSlotOptions.map((slot, index) => (
            <div
              key={index}
              onClick={() => handleSelectTimeSlot(slot)}
              className={`${styles.timeSlot} ${
                selectedTimeSlots.includes(slot) ? styles.timeSlotSelected : ""
              }`}
            >
              {slot}
            </div>
          ))}
        </div>

        <button onClick={handleAddPerson} className={styles.button}>
          {editingPerson ? "Update Representative" : "Add Representative"}
        </button>
      </div>

      {/* Persons List */}
      <div className={styles.tableContainer}>
        <h2>Representatives</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Profile Photo</th>
              <th>Representative Name</th>
              <th>Time Slots</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={person.image}
                    alt={person.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>{person.name}</td>
                <td>
                  {person.timeSlots
                    ? person.timeSlots.join(", ")
                    : "No slots selected"}
                </td>
                <td>
                  <FaEdit
                    onClick={() => handleEditPerson(person)}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                  <FaTrash
                    onClick={() => handleDeletePerson(person.id)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(Admin, ["superadmin"]);
