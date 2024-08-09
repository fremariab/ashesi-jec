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
  RadioGroup,
  RadioLabel,
  RadioInput,
} from "../../components/SharedStyles";
import withAuth from "../../hoc/withAuth";

const MisconductReport = () => {
  const [formData, setFormData] = useState({
    reporter: "",
    gender: "",
    description: "",
    dateOccurred: "",
    locationOccurred: "",
    timeOccurred: "",
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
      await addDoc(collection(db, "misconductReports"), formData);
      swal("Success!", "Report submitted successfully!", "success");
      setFormData({
        reporter: "",
        gender: "",
        description: "",
        dateOccurred: "",
        locationOccurred: "",
        timeOccurred: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error.message);
      swal("Error", `Failed to submit report: ${error.message}`, "error");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Misconduct Report</Title>
        <Label htmlFor="reporter">Report Title *</Label>
        <Input
          type="text"
          id="reporter"
          name="reporter"
          required
          onChange={handleChange}
          value={formData.reporter}
        />

        <Label>Gender *</Label>
        <RadioGroup>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="gender"
              value="male"
              required
              onChange={handleChange}
              checked={formData.gender === "male"}
            />
            Male
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="gender"
              value="female"
              required
              onChange={handleChange}
              checked={formData.gender === "female"}
            />
            Female
          </RadioLabel>
        </RadioGroup>

        <Label htmlFor="description">Describe in detail *</Label>
        <TextArea
          id="description"
          name="description"
          rows="5"
          required
          onChange={handleChange}
          value={formData.description}
        />

        <Label htmlFor="dateOccurred">Date Event Occurred (Optional)</Label>
        <Input
          type="date"
          id="dateOccurred"
          name="dateOccurred"
          onChange={handleChange}
          value={formData.dateOccurred}
        />

        <Label htmlFor="locationOccurred">
          Location Event Occurred (Optional)
        </Label>
        <Input
          type="text"
          id="locationOccurred"
          name="locationOccurred"
          onChange={handleChange}
          value={formData.locationOccurred}
        />

        <Label htmlFor="timeOccurred">Time Event Occurred (Optional)</Label>
        <Input
          type="time"
          id="timeOccurred"
          name="timeOccurred"
          onChange={handleChange}
          value={formData.timeOccurred}
        />

        <SubmitButton type="submit">Submit Report</SubmitButton>
      </Form>
    </Container>
  );
};

export default withAuth(MisconductReport, ["normal", "jecr"]);
