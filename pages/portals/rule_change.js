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
} from "../../components/SharedStyles";
import withAuth from "../../hoc/withAuth";

const AppealsPortal = () => {
  const [formData, setFormData] = useState({
    appealTitle: "",
    appealDescription: "",
    reasonForAppeal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "appeals"), formData);
      swal("Success!", "Appeal submitted successfully!", "success");
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error.message);
      swal("Error", `Failed to submit appeal: ${error.message}`, "error");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Appeals Portal</Title>
        <Label htmlFor="appealTitle">Title of the Appeal *</Label>
        <Input
          type="text"
          id="appealTitle"
          name="appealTitle"
          required
          onChange={handleChange}
          value={formData.appealTitle}
        />

        <Label htmlFor="appealDescription">Describe your Appeal *</Label>
        <TextArea
          id="appealDescription"
          name="appealDescription"
          rows="5"
          required
          onChange={handleChange}
          value={formData.appealDescription}
        />

        <Label htmlFor="reasonForAppeal">Reason for Appeal *</Label>
        <TextArea
          id="reasonForAppeal"
          name="reasonForAppeal"
          rows="5"
          required
          onChange={handleChange}
          value={formData.reasonForAppeal}
        />

        <SubmitButton type="submit">Submit Appeal</SubmitButton>
      </Form>
    </Container>
  );
};

export default withAuth(AppealsPortal, ["normal", "jecr"]);
