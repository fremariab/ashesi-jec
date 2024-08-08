// components/SharedStyles.js
import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5efef; /* Light grey background */
`;

export const Form = styled.form`
  background: #fff;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: left;
`;

export const Title = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
  color: #6b2227; /* Dark red/maroon color */
  font-size: 2rem;
  font-weight: bold;
`;

export const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #6b2227; /* Dark red/maroon color */
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #6b2227; /* Dark red/maroon color */
    outline: none;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #6b2227; /* Dark red/maroon color */
    outline: none;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const RadioLabel = styled.label`
  margin-right: 1rem;
  color: #6b2227; /* Dark red/maroon color */
`;

export const RadioInput = styled.input`
  margin-right: 0.5rem;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #6b2227; /* Dark red/maroon color */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  transition: background 0.3s;

  &:hover {
    background: #4d1513; /* Darker shade of maroon */
  }
`;

export const ResetButton = styled(SubmitButton)`
  background-color: #dba2a2;
  color: #333;
  &:hover {
    background-color: #b78484;
  }
`;
