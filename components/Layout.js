import { useRouter } from "next/router";
import Header from "./Header";
import Link from "next/link";
import React from "react";

const Layout = ({ children }) => {
  const router = useRouter();

  // Exclude the header on the login and signup pages
  const shouldShowHeader =
    router.pathname !== "/auth/login" &&
    router.pathname !== "/auth/signup" &&
    router.pathname !== "/";

  return (
    <div>
      {shouldShowHeader && <Header />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
