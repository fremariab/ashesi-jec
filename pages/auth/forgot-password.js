import { useState } from "react";
import { auth } from "../../lib/firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import Swal from "sweetalert2";
import Image from "next/image";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        title: "Password Reset Email Sent",
        text: "Check your email to reset your password.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setMessage("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container">
      <div className="quote-section">
        <h2>
          <Image
            src="/assets/jeclogo.png"
            alt="JEC Logo"
            width={100}
            height={100}
          />
        </h2>
        <p>
          &quot;The greatness of a man is not in how much wealth he acquires,
          but in his integrity and his ability to affect those around him
          positively.&quot;
        </p>
        <footer>~ Bob Marley</footer>
      </div>

      <div className="form-section">
        <h1>Forgot Password</h1>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          {message && <p className="error-message">{message}</p>}
          <button type="submit">Send Reset Email</button>
        </form>
        <p>
          Remembered your password? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
