"use client";
// import { getCurrentUserData } from "@/app/utils/currentUser";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function isAuth(Component: any) {
  return (props: any) => {
    const router = useRouter();
    useEffect(() => {
      if (typeof window !== "undefined") {
        const isAuth = localStorage.getItem("currentUser");
        if (isAuth !== null) {
        } else {
          redirect("/dashboard");
        }
      }
    }, [router]);

    return <Component />;
  };
}
