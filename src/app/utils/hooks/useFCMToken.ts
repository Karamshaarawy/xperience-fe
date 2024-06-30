import useNotification from "antd/es/notification/useNotification";
import { getToken, isSupported } from "firebase/messaging";
import { useEffect, useState } from "react";
import { messaging } from "../firebase";
import useNotificationPermission from "./useNotificationPermission";

const useFCMToken = () => {
  const permission = useNotificationPermission();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  useEffect(() => {
    const retrieveToken = async () => {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        if (permission === "granted") {
          const isFCMSupported = await isSupported();
          if (!isFCMSupported) return;
          const fcmToken = await getToken(messaging(), {
            vapidKey:
              "BEH0OMvStZlMB91AoHer9AGH02amwbydsDMh-Dvs98_bGTu5_Dh8AjwyQR5fUboWdWe7nAAQHaMmXLr4DivpK4c",
          });
          setFcmToken(fcmToken);
        }
      }
    };
    retrieveToken();
  }, [permission]);
  return fcmToken;
};

export default useFCMToken;
