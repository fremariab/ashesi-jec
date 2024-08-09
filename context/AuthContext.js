import { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Create a provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Renamed from currentUser to user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an authentication check
    const authenticatedUser = {
      name: "User",
      email: "user.name@ashesi.edu.gh.com",
      role: "normal",
    }; // Replace with real authentication logic
    setUser(authenticatedUser);
    setLoading(false);
  }, []);

  const value = {
    user, // Changed from currentUser to user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
