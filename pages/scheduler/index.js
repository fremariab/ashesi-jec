// // pages/scheduler/index.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/scheduler/scheduler");
  }, [router]);

  return;
};

export default Index;
