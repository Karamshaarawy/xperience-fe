"use client";
import { message } from "antd";
// import { getCurrentUserData } from "@/app/utils/currentUser";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function isAuth(Component: any) {
  // const [messageApi, contextHolder] = message.useMessage();

  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const router = useRouter();
    useEffect(() => {
      if (typeof window !== "undefined") {
        const isAuth = JSON.parse(localStorage.getItem("currentUser"))?.user
          ?.is_staff;
        if (isAuth) {
        } else {
          // MessageAPI.error("You Are Not Allowed To Show This Page");
          redirect("/login");
        }
      }
    }, [router]);

    return (
      <>
        {/* {contextHolder} */}
        <Component />;
      </>
    );
  };
}
