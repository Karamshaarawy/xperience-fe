"use client";

import { useEffect } from "react";
import isAuth from "../../../components/isAuth";
import useFCM from "../utils/hooks/useFCM";

function Dashboard() {
  const { messages, fcmToken } = useFCM();
  useEffect(() => {}, []);

  return (
    <div>
      <h1>FCM</h1>
      <p>FCM Token:{fcmToken}</p>
    </div>
  );
}

export default isAuth(Dashboard);
