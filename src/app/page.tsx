"use client";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("currentUser");
      if (isAuth !== null) {
        redirect("/dashboard");
      } else {
        redirect("/auth/login");
      }
    }
  }, [pathname]);
  return <></>;
}
