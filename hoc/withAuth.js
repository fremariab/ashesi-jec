import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const WithAuth = (props) => {
    const { user } = useAuth(); // Ensure this matches the context
    const router = useRouter();

    React.useEffect(() => {
      if (!user || !allowedRoles.includes(user.role)) {
        router.replace("/login");
      }
    }, [user, router]);

    return user && allowedRoles.includes(user.role) ? (
      <WrappedComponent {...props} />
    ) : null;
  };

  // Setting a display name for easier debugging
  WithAuth.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;
