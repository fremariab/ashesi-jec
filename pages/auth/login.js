import { useState } from "react";
import { auth, db } from "../../lib/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image"; // Importing Next.js Image component
import Link from "next/link"; // Importing Next.js Link component
import jecLogo from "../../assets/jecLogo.png"; // Ensure you have this image in the public folder

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;

        if (userRole === "superadmin") {
          router.push("/admin");
        } else {
          router.push("/home");
        }
      } else {
        setError("User does not exist in the database.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.quoteContainer}>
        <p style={styles.quote}>
          &ldquo;Ethics is knowing the difference between what you have a right
          to do and what is right to do.&rdquo;
        </p>
        <p style={styles.author}>~ Potter Stewart</p>
      </div>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <Image src={jecLogo} alt="JEC Logo" width={60} height={60} />
        </div>
        <h2 style={styles.welcomeBack}>Welcome Back!</h2>
        <p style={styles.infoText}>
          Enter the information you entered while registering
        </p>
        <form onSubmit={handleLogin} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}

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
          <br />
          <p style={styles.miniText}>
            Don&#39;t have an account? <Link href="/auth/signup">Sign Up</Link>
          </p>

          <button type="submit" style={styles.button}>
            Login
          </button>
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

export default Login;
