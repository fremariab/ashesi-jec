import React from "react";
import Link from "next/link";
import styled from "styled-components";
import withAuth from "../../hoc/withAuth";

const Container = styled.div`
  min-height: 79.1vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #7d0e29;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 3rem;
  text-align: center;
  color: #f5efef;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Card = styled.div`
  background: #dba2a2;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 300px;
  cursor: pointer;
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  h3 {
    margin: 0;
    font-size: 1.75rem;
    color: #7d0e29;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #7d0e29;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
`;

const Portals = () => {
  return (
    <Container>
      <Title>Welcome to the Students Portals</Title>
      <Grid>
        <Link href="../portals/complaint_portal" legacyBehavior passHref>
          <Card as="a">
            <h3>Complaint Portal &rarr;</h3>
            <p>Submit a complaint about general school issues.</p>
          </Card>
        </Link>

        <Link href="../portals/rule_change" legacyBehavior passHref>
          <Card as="a">
            <h3>Appeal Portal &rarr;</h3>
            <p>
              Request / appeal for changes to school rules or the constitution.
            </p>
          </Card>
        </Link>

        <Link href="../portals/misconduct_portal" legacyBehavior passHref>
          <Card as="a">
            <h3>Misconduct Report &rarr;</h3>
            <p>Report incidents of sexual misconduct.</p>
          </Card>
        </Link>
      </Grid>
    </Container>
  );
};

export default withAuth(Portals, ["normal", "jecr"]);
