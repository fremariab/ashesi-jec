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
import { db } from "../../lib/firebase-config";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "../../styles/ManageScheduling.module.css";
import Image from "next/image";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [image, setImage] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [persons, setPersons] = useState([]);

  const timeSlotOptions = [];
  for (let hour = 10; hour <= 17; hour++) {
    timeSlotOptions.push(`${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`);
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const matchingUsers = users.filter((user) =>
      `${user.fname} ${user.lname}`.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(matchingUsers);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery(`${user.fname} ${user.lname}`);
    setFilteredUsers([]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPerson = async () => {
    if (
      !selectedUser?.fname ||
      !selectedUser?.lname ||
      !image ||
      selectedTimeSlots.length === 0
    ) {
      Swal.fire({
        title: "Missing Information",
        text: "Please complete all fields.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const newPerson = {
      name: `${selectedUser.fname} ${selectedUser.lname}`,
      image,
      timeSlots: selectedTimeSlots,
      email: selectedUser.email,
      role: selectedUser.role,
      year: selectedUser.year,
    };

    try {
      const docRef = await addDoc(collection(db, "persons"), newPerson);
      setPersons([...persons, { id: docRef.id, ...newPerson }]);
      Swal.fire({
        title: "Added",
        text: "Representative added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      resetForm();
    } catch (error) {
      console.error("Error adding person:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while saving the representative. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEditPerson = (person) => {
    setSelectedUser({
      fname: person.name.split(" ")[0],
      lname: person.name.split(" ")[1],
      email: person.email,
    });
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
    setSearchQuery("");
    setSelectedUser(null);
    setImage(null);
    setSelectedTimeSlots([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>{editingPerson ? "Edit Representative" : "Add Representative"}</h2>

        <input
          type="text"
          placeholder="Search User"
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.inputText}
        />
        {filteredUsers.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredUsers.map((user) => (
              <li
                key={user.uid}
                onClick={() => handleSelectUser(user)}
                className={styles.dropdownItem}
              >
                {user.fname} {user.lname} ({user.email})
              </li>
            ))}
          </ul>
        )}
        <input
          type="file"
          onChange={handleImageUpload}
          className={styles.inputFile}
        />
        {image && (
          <Image
            src={image}
            alt="Selected"
            width={50} // Set the width
            height={50} // Set the height
            style={{ marginRight: "10px", borderRadius: "50%" }}
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

      <div className={styles.separator}></div>

      <div className={styles.tableContainer}>
        <h2 style={{ color: "#7d0e29", textAlign: "center" }}>
          Representatives
        </h2>
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
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={50} // Set the width
                    height={50} // Set the height
                    style={{
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
