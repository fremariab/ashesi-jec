import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const WithAuth = (props) => {
    const { user, loading } = useAuth(); // Get loading state
    const router = useRouter();

    React.useEffect(() => {
      if (!loading) {
        // Wait until loading is false
        if (!user || !allowedRoles.includes(user?.role)) {
          router.push("/auth/login");
        }
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <p>Loading...</p>; // Show a loading message while waiting for user info
    }

    return allowedRoles.includes(user.role) ? (
      <WrappedComponent {...props} />
    ) : null;
  };

  WithAuth.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;
