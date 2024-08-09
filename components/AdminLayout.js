import { useRouter } from "next/router";
import AdminHeader from "./AdminHeader";
import React from "react";

const AdminLayout = ({ children }) => {
  const router = useRouter();

  // Include the admin header only on paths starting with /admin
  const shouldShowHeader = router.pathname.startsWith("/admin");

  return (
    <div>
      {shouldShowHeader && <AdminHeader />}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
