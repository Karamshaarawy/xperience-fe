import useNotification from "antd/es/notification/useNotification";
import { getToken, isSupported } from "firebase/messaging";
import { useEffect, useState } from "react";
import { messaging } from "../firebase";
import useNotificationPermission from "./useNotificationPermission";
import { StatusSuccessCodes } from "@/app/api/successStatus";
import { PostReq } from "@/app/api/api";
import { message } from "antd";

const useFCMToken = () => {
  const permission = useNotificationPermission();
  const [fcmToken, setFcmToken] = useState<any>(null);
  const [messageApi, contextHolderMessage] = message.useMessage();

  useEffect(() => {
    const retrieveToken = async () => {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        if (permission === "granted") {
          const isFCMSupported = await isSupported();
          if (!isFCMSupported) return;
          const fcmToken = await getToken(messaging(), {
            vapidKey:
              "BEH0OMvStZlMB91AoHer9AGH02amwbydsDMh-Dvs98_bGTu5_Dh8AjwyQR5fUboWdWe7nAAQHaMmXLr4DivpK4c",
          })
            .then((currentToken: any) => {
              if (currentToken) {
                PostReq("devices", {
                  registration_id: `${currentToken}`,
                  type: "web",
                }).then((res: any) => {
                  if (StatusSuccessCodes.includes(res.status)) {
                  } else {
                    res?.errors.forEach((err: any) => {
                      messageApi.error(
                        `${
                          err.attr ? err.attr + ":" + err.detail : err.detail
                        } `
                      );
                    });
                  }
                });
              } else {
                console.log("failed to generate the app registration token.");
              }
            })
            .catch((err: any) => {
              messageApi.error(err);
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
