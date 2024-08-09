// // pages/scheduler/index.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import withAuth from "../../hoc/withAuth";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/attendance/take-attendance");
  }, [router]);

  return;
};

export default withAuth(Index, ["normal", "jecr"]);
