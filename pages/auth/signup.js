import { useState } from "react";
import { auth, db } from "../../lib/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link"; // Importing Next.js Link component
import jeclogo from "../../assets/jeclogo.png"; // Ensure you have this image in the public folder

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Email validation regex for fname.lname@ashesi.edu.gh
    const emailRegex = /^[a-zA-Z]+\.([a-zA-Z]+)@ashesi\.edu\.gh$/;
    if (!emailRegex.test(email)) {
      setError("Wrong Email Format");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
      );
      return;
    }

    if (!year) {
      setError("Please select a year.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Extract fname and lname from email
      const [fname, lname] = email.split("@")[0].split(".");
      const capitalizedFname = capitalize(fname);
      const capitalizedLname = capitalize(lname);

      // Save user to Firestore with the role of "normal"
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        fname: capitalizedFname,
        lname: capitalizedLname,
        year: year,
        role: "normal", // Default role
        createdAt: new Date().toISOString(),
        lastLogin: null,
      });

      // Show success alert and redirect to login page
      Swal.fire({
        title: "Sign Up Successful",
        text: "You have successfully signed up!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/auth/login");
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.quoteContainer}>
        <p style={styles.quote}>
          “The greatness of a man is not in how much wealth he acquires, but in
          his integrity and his ability to affect those around him positively.”
        </p>
        <p style={styles.author}>~ Bob Marley</p>
      </div>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <Image src={jeclogo} alt="JEC Logo" width={60} height={60} />
        </div>
        <h1 style={styles.welcomeBack}>Create an account</h1>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSignUp} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            style={styles.input}
          />
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Select Year</option>
            <option value="Freshman">1st Year</option>
            <option value="Sophomore">2nd Year</option>
            <option value="Junior">3rd Year</option>
            <option value="Senior">4th Year</option>
          </select>
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
          <p style={styles.miniText}>
            Already have an account? <Link href="/auth/login">Log in</Link>
            <br />
            <br />
            Forgot your password?{" "}
            <Link href="/forgot-password">Reset it here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
  },
  quoteContainer: {
    flex: 1,
    backgroundColor: "#7D0E29", // Dark red color
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
  },
  quote: {
    fontSize: "2.5em",
    fontStyle: "italic",
    textAlign: "center",
    maxWidth: "600px",
  },
  author: {
    fontSize: "1.3em",
    marginTop: "20px",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#F7F7F7",
  },
  logoContainer: {
    marginBottom: "20px",
  },
  welcomeBack: {
    fontSize: "2em",
    color: "#7D0E29",
    marginBottom: "10px",
  },
  infoText: {
    color: "#666666",
    marginBottom: "30px",
    textAlign: "center",
  },
  miniText: {
    color: "#666666",
    marginBottom: "30px",
    textAlign: "center",
    fontSize: "12px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
    fontFamily: '"Jost", sans-serif',
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#7D0E29",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1em",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontFamily: '"Jost", sans-serif',
  },
  buttonHover: {
    backgroundColor: "#9C1C42",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default SignUp;
