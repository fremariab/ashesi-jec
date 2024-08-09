import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase-config";
import withAuth from "../../hoc/withAuth";
import styles from "../../styles/AdminDashboard.module.css"; // Import the CSS module

const AdminDashboard = () => {
  const [selectedPortal, setSelectedPortal] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [misconductReports, setMisconductReports] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsSnapshot = await getDocs(collection(db, "complaints"));
        const misconductReportsSnapshot = await getDocs(
          collection(db, "misconductReports")
        );
        const appealsSnapshot = await getDocs(collection(db, "appeals"));

        setComplaints(complaintsSnapshot.docs.map((doc) => doc.data()));
        setMisconductReports(
          misconductReportsSnapshot.docs.map((doc) => doc.data())
        );
        setAppeals(appealsSnapshot.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching data: ", error.message);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const renderTable = (data) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <>
        <table className={styles.table}>
          <thead>
            <tr>
              {Object.keys(currentItems[0] || {})
                .filter((key) => key !== "privacy") // Filter out "privacy"
                .map((key) => (
                  <th key={key}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item)}>
                {Object.entries(item)
                  .filter(([key]) => key !== "privacy") // Filter out "privacy"
                  .map(([key, value], i) => (
                    <td key={i}>{String(value)}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= data.length}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (selectedPortal) {
      case "complaints":
        return renderTable(complaints);
      case "misconductReports":
        return renderTable(misconductReports);
      case "appeals":
        return renderTable(appeals);
      default:
        return <p>Select a portal to view details</p>;
    }
  };

  return (
    <div className={styles.container}>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        View Portal Information
      </h1>
      <div className={styles.boxContainer}>
        <div
          className={styles.box}
          onClick={() => setSelectedPortal("complaints")}
        >
          Complaints
        </div>
        <div
          className={styles.box}
          onClick={() => setSelectedPortal("misconductReports")}
        >
          Misconduct Reports
        </div>
        <div
          className={styles.box}
          onClick={() => setSelectedPortal("appeals")}
        >
          Appeals
        </div>
      </div>
      {renderContent()}
      {showModal && selectedItem && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Details</h2>
            {Object.entries(selectedItem).map(([key, value], index) => (
              <p key={index}>
                <strong>{key}:</strong> {String(value)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(AdminDashboard, ["superadmin"]);
