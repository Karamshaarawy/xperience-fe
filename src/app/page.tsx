"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import isAuth from "../../components/isAuth";

function Home() {
  const pathname = usePathname();
  useEffect(() => {}, []);
  return <></>;
}

export default isAuth(Home);
