import { useRouter } from "next/router";
import Header from "./Header";
import React from "react";

const Layout = ({ children }) => {
  const router = useRouter();

  // Exclude the header on the login, signup, home page, and any path starting with /admin
  const shouldShowHeader =
    router.pathname !== "/auth/login" &&
    router.pathname !== "/auth/signup" &&
    router.pathname !== "/" &&
    !router.pathname.startsWith("/admin");

  return (
    <div>
      {shouldShowHeader && <Header />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
