// // pages/scheduler/index.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import withAuth from "../../hoc/withAuth";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/scheduler/scheduler");
  }, [router]);

  return <div>Redirecting...</div>;
};

export default withAuth(Index, ["superadmin"]);
