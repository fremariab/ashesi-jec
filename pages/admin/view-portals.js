import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase-config";
import withAuth from "../../hoc/withAuth";

const Container = styled.div`
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5efef;
  color: #f5efef;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const BoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Box = styled.div`
  flex: 1;
  margin: 0 1rem;
  padding: 1rem;
  background-color: #dba2a2;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5efef;
    color: #6b2227;
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const BoxTitle = styled.h2`
  margin: 0;
  color: #611c18;
`;

const Section = styled.div`
  background: #dba2a2;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #6b2227;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #611c18;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Item = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #611c18;
`;

const ItemTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.25rem;
`;

const ItemDescription = styled.p`
  margin-bottom: 0.5rem;
  color: #555;
`;

const AdminDashboard = () => {
  const [selectedPortal, setSelectedPortal] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [misconductReports, setMisconductReports] = useState([]);
  const [appeals, setAppeals] = useState([]);

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

  const renderContent = () => {
    switch (selectedPortal) {
      case "complaints":
        return (
          <Section>
            <SectionTitle>Complaints</SectionTitle>
            {complaints.map((complaint, index) => (
              <Item key={index}>
                <p>
                  <strong>Complaint:</strong> {complaint.title}
                </p>
                <p>
                  <strong>Description:</strong> {complaint.description}
                </p>
                <p>
                  <strong>Submitted by:</strong>{" "}
                  {complaint.privacy ? "Anonymous" : complaint.name}
                </p>
              </Item>
            ))}
          </Section>
        );
      case "misconductReports":
        return (
          <Section>
            <SectionTitle>Misconduct Reports</SectionTitle>
            {misconductReports.map((report, index) => (
              <Item key={index}>
                <p>
                  <strong>Title:</strong> {report.reportTitle}
                </p>
                <p>
                  <strong>Description:</strong> {report.description}
                </p>
                <p>
                  <strong>Gender:</strong> {report.gender}
                </p>
                {report.dateOccurred && (
                  <p>
                    <strong>Date:</strong> {report.dateOccurred}
                  </p>
                )}
                {report.locationOccurred && (
                  <p>
                    <strong>Location:</strong> {report.locationOccurred}
                  </p>
                )}
                {report.timeOccurred && (
                  <p>
                    <strong>Time:</strong> {report.timeOccurred}
                  </p>
                )}
              </Item>
            ))}
          </Section>
        );
      case "appeals":
        return (
          <Section>
            <SectionTitle>Appeals</SectionTitle>
            {appeals.map((appeal, index) => (
              <Item key={index}>
                <ItemTitle>{appeal.appealTitle}</ItemTitle>
                <ItemDescription>{appeal.appealDescription}</ItemDescription>
                <p>
                  <strong>Reason:</strong> {appeal.reasonForAppeal}
                </p>
              </Item>
            ))}
          </Section>
        );
      default:
        return <p>Select a portal to view details</p>;
    }
  };

  return (
    <Container>
      <BoxContainer>
        <Box onClick={() => setSelectedPortal("complaints")}>
          <BoxTitle>Complaints</BoxTitle>
        </Box>
        <Box onClick={() => setSelectedPortal("misconductReports")}>
          <BoxTitle>Misconduct Reports</BoxTitle>
        </Box>
        <Box onClick={() => setSelectedPortal("appeals")}>
          <BoxTitle>Appeals</BoxTitle>
        </Box>
      </BoxContainer>
      {renderContent()}
    </Container>
  );
};

export default withAuth(AdminDashboard, ["normal"]);
