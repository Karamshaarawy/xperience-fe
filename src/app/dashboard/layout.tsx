"use client";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownProps,
  Layout,
  Menu,
  MenuProps,
  Space,
  message,
  notification,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import {
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { IoCarSportOutline } from "react-icons/io5";
import { MdCircleNotifications } from "react-icons/md";
import { RiHotelFill, RiLogoutBoxRLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { SiHiltonhotelsandresorts } from "react-icons/si";

import { BiSolidCarGarage } from "react-icons/bi";
import { BsInfoCircleFill } from "react-icons/bs";
import { CgOptions } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { LuUsers2 } from "react-icons/lu";
import { PiTrademark } from "react-icons/pi";
import { TbReservedLine } from "react-icons/tb";
import { PostReq } from "../api/api";
import { StatusSuccessCodes } from "../api/successStatus";
import { ToastContainer } from "react-toastify";
import { messaging } from "../utils/firebase";

const { Header, Sider, Content } = Layout;
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const { setLoginData, user }: any = useContext(LoginDataContext);
  const router = useRouter();
  const pathname = usePathname();
  const [prefix_pathname, setPrefix_pathname] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>({});
  const items: MenuProps["items"] = [];
  const [notifications, setNotifications] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [numberNotification, setNumberNotification] = useState(0);
  const [apiNotification, contextHolder] = notification.useNotification();
  const [messageApi, contextHolderMessage] = message.useMessage();
  const isEffectCalledRef = useRef(false);
  const [userName, setUserName] = useState<string>("");
  useEffect(() => {
    // requestPermission();

    if (typeof window !== "undefined") {
      const currentUser: any = localStorage.getItem("currentUser");
      setUserName(currentUser?.user?.name ? currentUser?.user?.name : "Admin");
    }

    isMobile && isMobile ? setCollapsed(!collapsed) : setCollapsed(collapsed);
    setPrefix_pathname(pathname?.slice(0, 3));

    let current_user = null;
    if (current_user != null) {
      setCurrentUser(current_user);
      if (!isEffectCalledRef.current) {
        isEffectCalledRef.current = true;
      }
    }
  }, [router, currentUser.id]);

  const fcmmessaging = messaging();

  function requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        return getToken(fcmmessaging, {
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
                      `${err.attr ? err.attr + ":" + err.detail : err.detail} `
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
      } else {
        console.log("User Permission Denied");
      }
    });
  }

  onMessage(fcmmessaging, (payload) => {
    openNotification(payload.notification);
  });

  const openNotification = (description: any) => {
    apiNotification.info({
      message: description.title,
      description: description.body,
      placement: "topRight",
      icon: <BsInfoCircleFill color="#292D4A" />,
    });
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setOpen(true);
  };

  const handleOpenChange: DropdownProps["onOpenChange"] = (nextOpen, info) => {
    if (info.source === "trigger" || nextOpen) {
      setOpen(nextOpen);
    }
  };

  function logOut() {
    localStorage.removeItem("currentUser");
    setCurrentUser({});
    router.push("/login");
  }

  const itemsProfile: MenuProps["items"] = [
    {
      label: (
        <span>
          <Space>
            Hi
            {userName}
          </Space>
        </span>
      ),
      key: "0",
    },
    {
      label: (
        <div className="flex h-48px  items-center" onClick={() => logOut()}>
          <Space>
            <AiOutlineLogout />
            Logout
          </Space>
        </div>
      ),
      key: "3",
    },
  ];

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {contextHolder}
      {contextHolderMessage}
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={240}
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            overflow: "hidden",
            height: "100vh",
            position: "fixed",
            top: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: "#292D4A",
          }}
        >
          <div className="flex justify-center  py-6 w-fit m-auto">
            <Image
              src="/images/Untitled1111111.png"
              alt="XperienceVIP"
              width={90}
              height={60}
              className=" bg-transparent"
            />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={[pathname]}
            style={{
              backgroundColor: "#292D4A",
            }}
            // selectedKeys={[
            //   pathname,
            //   pathname.includes("carServices")
            //     ? `/dashboard/carServices`
            //     : pathname.includes("hotelServices")
            //     ? `/dashboard/hotelServices`
            //     : pathname.includes("hotelServices")
            //     ? `/dashboard/hotelServices`
            //     : "",
            // ]}
            items={[
              {
                key: `/dashboard`,
                label: (
                  <Link href={`/dashboard`}>
                    <span className="text-white">
                      <Space>
                        <RxDashboard
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Dashboard
                      </Space>
                    </span>
                  </Link>
                ),
              },
              // {
              //   key: `/dashboard/reservations`,
              //   label: (
              //     <Link href={`/dashboard/reservations`}>
              //       <span className="text-white">
              //         <Space>
              //           <TbReservedLine
              //             size={collapsed ? 25 : 20}
              //             style={{ marginInlineEnd: "10px" }}
              //             color="white"
              //           />
              //           Reservations
              //         </Space>
              //       </span>
              //     </Link>
              //   ),
              // },
              {
                key: `/dashboard/carMakers`,
                label: (
                  <Link href={`/dashboard/carMakers`}>
                    <span className="text-white">
                      <Space>
                        <PiTrademark
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Car Makers
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/carModels`,
                label: (
                  <Link href={`/dashboard/carModels`}>
                    <span className="text-white">
                      <Space>
                        <BiSolidCarGarage
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Car Models
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/carServices`,
                label: (
                  <Link href={`/dashboard/carServices`}>
                    <span className="text-white">
                      <Space>
                        <IoCarSportOutline
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Car Services
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/carReservations`,
                label: (
                  <Link href={`/dashboard/carReservations`}>
                    <span className="text-white">
                      <Space>
                        <IoCarSportOutline
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Car Reservations
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/hotelServicesFeatures`,
                label: (
                  <Link href={`/dashboard/hotelServicesFeatures`}>
                    <span className="text-white">
                      <Space>
                        <RiHotelFill
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Hotel Service Features
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/hotelServices`,
                label: (
                  <Link href={`/dashboard/hotelServices`}>
                    <span className="text-white">
                      <Space>
                        <SiHiltonhotelsandresorts
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Hotel Services
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/hotelReservations`,
                label: (
                  <Link href={`/dashboard/hotelReservations`}>
                    <span className="text-white">
                      <Space>
                        <SiHiltonhotelsandresorts
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Hotel Reservations
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/subscriptionOptions`,
                label: (
                  <Link href={`/dashboard/subscriptionOptions`}>
                    <span className="text-white">
                      <Space>
                        <GrServices
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Subscription Options
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/serviceOptions`,
                label: (
                  <Link href={`/dashboard/serviceOptions`}>
                    <span className="text-white">
                      <Space>
                        <CgOptions
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Service Options
                      </Space>
                    </span>
                  </Link>
                ),
              },
              {
                key: `/dashboard/users`,
                label: (
                  <Link href={`/dashboard/users`}>
                    <span className="text-white">
                      <Space>
                        <LuUsers2
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Users
                      </Space>
                    </span>
                  </Link>
                ),
              },
            ]}
          />

          <Menu
            // title={t("settings")}
            className="absolute bottom-0"
            mode="inline"
            defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            style={{
              backgroundColor: "#292D4A",
            }}
            items={[
              {
                key: `#2`,
                label: (
                  <div onClick={() => logOut()}>
                    <span className="text-white">
                      <Space>
                        <RiLogoutBoxRLine
                          size={collapsed ? 25 : 20}
                          style={{ marginInlineEnd: "10px" }}
                          color="white"
                        />
                        Logout
                      </Space>
                    </span>
                  </div>
                ),
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="flex justify-between items-center align-middle h-[66px] bg-[#fff] p-2"
            style={{
              padding: isMobile ? "0 10px" : "0 50px",
              position: "sticky",
              top: 0,
              zIndex: 998,
              width: "100%",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#292D4A",
            }}
          >
            <Button
              type="text"
              icon={
                collapsed ? (
                  <AiOutlineMenuUnfold size={20} color="white" />
                ) : (
                  <AiOutlineMenuFold size={20} color="white" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
              className={collapsed ? "left-[80px]" : "left-[200px]"}
            />
            <div className="flex items-center">
              <Space size={24}>
                <Dropdown
                  menu={{
                    items: notifications,
                    onClick: (e) => handleMenuClick(e),
                  }}
                  trigger={["click"]}
                  overlayClassName="w-45 h-60 overflow-y-auto shadow-2xl rounded-lg"
                  open={open}
                  onOpenChange={handleOpenChange}
                  arrow={true}
                >
                  <a className="p-1" onClick={(e) => e.preventDefault()}>
                    <Space className="mt-3">
                      <Badge count={numberNotification} size="small">
                        <MdCircleNotifications
                          size={24}
                          className="cursor-pointer text-black"
                          color="white"
                        />
                      </Badge>
                    </Space>
                  </a>
                </Dropdown>

                <Dropdown menu={{ items: itemsProfile }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar
                        size={34}
                        icon={<FaRegUserCircle color="white" />}
                      />
                      {isMobile ? "" : currentUser ? currentUser.name : "Admin"}
                    </Space>
                  </a>
                </Dropdown>
              </Space>
            </div>
          </Header>
          <Content
            style={{
              minHeight: 280,
            }}
            className={collapsed ? "pl-[80px]" : "pl-[240px]"}
          >
            <Suspense>
              <ToastContainer />
              {children}
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
