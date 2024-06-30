import { MessagePayload, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { messaging } from "../firebase";
import { toast } from "react-toastify";
import useFCMToken from "./useFCMToken";

const useFCM = () => {
  const fcmToken = useFCMToken();
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    if ("serviceWorkers" in navigator) {
      const fcmmessaging = messaging();
      const unsubscribe = onMessage(fcmmessaging, (payload: any) => {
        toast.dark(payload.notification?.title);
        setMessages((messages: any) => [...messages, payload]);
      });
      return () => unsubscribe();
    }
  }, [fcmToken]);

  return { fcmToken, messages };
};
