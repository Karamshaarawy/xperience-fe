"use client";
import { GetReq, PatchReq } from "@/app/api/api";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownProps,
  Layout,
  Menu,
  MenuProps,
  notification,
  Space,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import {
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { IoCarSportOutline, IoEarthSharp } from "react-icons/io5";
import { MdCircleNotifications, MdNotifications } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { SiHiltonhotelsandresorts } from "react-icons/si";

import { StatusSuccessCodes } from "../api/successStatus";
import { FaRegUserCircle } from "react-icons/fa";

// import { getCurrentUserData } from "@/app/utils/currentUser";
// import Pusher from "pusher-js";
const { Header, Sider, Content } = Layout;
// const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY ?? "", {
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
// });
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
  //   const { t } = useTranslation(lng, "layout");
  const items: MenuProps["items"] = [];
  const [notifications, setNotifications] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [numberNotification, setNumberNotification] = useState(0);
  const [apiNotification, contextHolder] = notification.useNotification();
  const isEffectCalledRef = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("currentUser");
      if (isAuth !== null) {
        // setLoginData(JSON.parse(isAuth));
      }
    }

    isMobile && isMobile ? setCollapsed(!collapsed) : setCollapsed(collapsed);
    setPrefix_pathname(pathname?.slice(0, 3));

    let current_user = null;
    if (current_user != null) {
      setCurrentUser(current_user);
      if (!isEffectCalledRef.current) {
        getListNotifications();
        isEffectCalledRef.current = true;
      }

      //   const channel = pusher.subscribe(`user_${current_user.id}`);
      //   channel.bind("notification", (data: any) => {
      //     getListNotifications();
      //     openNotification(data);
      //   });
      //   return () => {
      //     pusher.unsubscribe(`user_${current_user.id}`);
      //   };
      // } else {
      //   redirect("/auth/login");
    }
  }, [router, currentUser.id]);

  function getListNotifications() {
    let numberNotif = 0;
    GetReq("notifications/?limit=100&offset=0").then((res) => {
      if (StatusSuccessCodes.includes(res?.status)) {
        setNotifications(
          res?.data?.results?.map((item: any) => {
            setNumberNotification((numberNotif += item.seen ? 0 : 1));
            return {
              key: item.id,
              onClick: () => {
                !item.seen && markAsSeen(item.id);
              },
              label: (
                <div
                  className="flex justify-between"
                  style={{
                    backgroundColor: item.seen ? "white" : "#f3f6f4",
                    height: "70px",
                    padding: "7px",
                    borderRadius: "5px",
                  }}
                >
                  <Space>
                    <MdNotifications size={15} />
                    <span className="flex flex-col">
                      <b className="w-[150px] sm:w-[250px] lg:w-[400px] xl:w-[400px] ">
                        {" "}
                        {item.message}
                      </b>
                      <small>
                        {new Date(item.created_at).toLocaleString("CA", {
                          hour12: true,
                        })}
                      </small>
                    </span>
                  </Space>
                  {!item.seen && <Badge status="processing" />}
                </div>
              ),
            };
          })
        );
      }
    });
  }

  // const openNotification = (description: string) => {
  //   apiNotification.info({
  //     message: `Notification`,
  //     description: description,
  //     placement: "topRight",
  //     icon: <BsInfoCircleFill className="text-gold" />,
  //   });
  // };

  function markAsSeen(id: string) {
    PatchReq(`notifications/${id}/mark_as_seen/`, {}).then((res) => {
      if (StatusSuccessCodes.includes(res?.status)) {
        getListNotifications();
      }
    });
  }
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
            {/* {user.name} */}
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
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
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
          <div className="flex justify-center h-20 py-2 w-fit m-auto">
            <Image
              src="/images/untitled11111.PNG"
              alt="XperienceVIP"
              width={60}
              height={60}
            />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={[pathname]}
            style={{
              backgroundColor: "#292D4A",
            }}
            selectedKeys={[
              pathname,
              pathname.includes("carServices")
                ? `/dashboard/carServices`
                : pathname.includes("hotelServices")
                ? `/dashboard/hotelServices`
                : "",
            ]}
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
            className={collapsed ? "pl-[80px]" : "pl-[200px]"}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
