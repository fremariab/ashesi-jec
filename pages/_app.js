import React from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AdminLayout from "../components/AdminLayout";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Determine if the current route is an admin route
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      {isAdminRoute ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}

export default MyApp;
