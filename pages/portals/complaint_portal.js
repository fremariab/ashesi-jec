import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase-config";
import swal from "sweetalert";
import {
  Container,
  Form,
  Title,
  Label,
  Input,
  TextArea,
  SubmitButton,
  ResetButton,
} from "../../components/SharedStyles";
import withAuth from "../../hoc/withAuth";

const ComplaintPortal = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    privacy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "complaints"), formData);
      swal("Success!", "Complaint submitted successfully!", "success");
      setFormData({
        name: "",
        email: "",
        title: "",
        description: "",
        privacy: false,
      });
    } catch (error) {
      console.error("Error adding document: ", error.message);
      swal("Error", `Failed to submit complaint: ${error.message}`, "error");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Complaint Portal</Title>
        <Label htmlFor="name">Full Name:</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          onChange={handleChange}
          value={formData.name}
        />

        <Label htmlFor="email">Email Address:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          onChange={handleChange}
          value={formData.email}
        />

        <Label htmlFor="title">Complaint Title:</Label>
        <Input
          type="text"
          id="title"
          name="title"
          required
          onChange={handleChange}
          value={formData.title}
        />

        <Label htmlFor="description">Complaint Description:</Label>
        <TextArea
          id="description"
          name="description"
          rows="5"
          required
          onChange={handleChange}
          value={formData.description}
        />

        <Label>
          <input
            type="checkbox"
            id="privacy"
            name="privacy"
            onChange={handleChange}
            checked={formData.privacy}
          />
          Submit Anonymously
        </Label>

        <div>
          <SubmitButton type="submit">Submit Complaint</SubmitButton>
          <ResetButton
            type="reset"
            onClick={() =>
              setFormData({
                name: "",
                email: "",
                title: "",
                description: "",
                privacy: false,
              })
            }
          >
            Reset
          </ResetButton>
        </div>
      </Form>
    </Container>
  );
};

export default withAuth(ComplaintPortal, ["normal"]);
