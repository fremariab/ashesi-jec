// pages/logout.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase-config"; // Adjust the path as needed

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push("/auth/login"); // Redirect to login page after logout
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div>
      <h1>Logging out...</h1>
      <p>You will be redirected shortly.</p>
    </div>
  );
};

export default Logout;
