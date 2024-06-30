import { useEffect, useState } from "react";

const useNotificationPermission = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    const handler = () => setPermission(Notification.permission);
    handler();
    Notification.requestPermission().then(handler);
    navigator.permissions
      .query({ name: "notifications" })
      .then((notificationPerm) => {
        notificationPerm.onchange = handler;
      });
  }, []);
  return permission;
};

export default useNotificationPermission;

// Notification.requestPermission().then((permission) => {
//   if (permission === "granted") {
//     return getToken(messaging, {
//       vapidKey:
//         "BEH0OMvStZlMB91AoHer9AGH02amwbydsDMh-Dvs98_bGTu5_Dh8AjwyQR5fUboWdWe7nAAQHaMmXLr4DivpK4c",
//     })
//       .then((currentToken: any) => {
//         if (currentToken) {
//           PostReq("devices", {
//             registration_id: `${currentToken}`,
//             type: "web",
//           }).then((res: any) => {
//             if (StatusSuccessCodes.includes(res.status)) {
//             } else {
//               res?.errors.forEach((err: any) => {
//                 messageApi.error(
//                   `${err.attr ? err.attr + ":" + err.detail : err.detail} `
//                 );
//               });
//             }
//           });
//         } else {
//           console.log("failed to generate the app registration token.");
//         }
//       })
//       .catch((err: any) => {
//         messageApi.error(err);
//       });
//   } else {
//     console.log("User Permission Denied");
//   }
// });
