"use client";
import { Button, Form, Image, Input, Skeleton, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      //   const isAuth = localStorage.getItem("currentUser");
      //   if (isAuth !== null) {
      //     router.push("/dashboard");
      //   }
    }
  }, [router]);

  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    let permissions: string[] = [];
    setLoading(true);
    axios
      .post(`https://gym-api.infranile.com/api/auth/login/`, values)
      .then(async function (response) {
        localStorage.setItem("currentUser", JSON.stringify(response?.data));

        response?.data?.groups[0]?.permissions?.forEach((element: any) => {
          permissions.push(element.codename);
        });
        await localStorage.setItem(
          "permissionList",
          JSON.stringify(permissions)
        );
        router.push("/dashboard");
      })
      .catch(function (error) {
        setLoading(false);
        messageApi.open({
          type: "error",
          content: error?.response?.data?.errors[0]?.detail,
        });
      });
  };
  return (
    <div>
      {contextHolder}
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 h-screen">
        <div className="bg-[#181C33] md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/4 py-8 px-4 sm:p-12 md:p-16 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none sm:bg-card">
          <div className="w-full max-w-80 sm:w-80 mx-auto sm:mx-0">
            <div className="w-auto">
              {/* <Image
                className="w-full"
                src="/images/logo-text.png"
                alt="Picture of the author"
                width={200}
                height={50}
              /> */}
            </div>
            <div className="mt-8 text-4xl font-extrabold tracking-tight leading-tight text-white">
              Xperience CRM.
              <br />
              Sign in
            </div>
            <Form
              className="mt-8"
              layout="vertical"
              form={form}
              name="control-hooks"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="mobile"
                label={<p className="text-white">Mobile</p>}
                rules={[
                  { required: true, message: "Please input your mobile!" },
                ]}
              >
                <Input style={{ backgroundColor: "white", color: "black" }} />
              </Form.Item>

              <Form.Item
                name="password"
                label={<p className="text-white">Password</p>}
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
                // style={{ backgroundColor: "white" }}
              >
                <Input.Password
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item>
                {!loading ? (
                  <Button
                    className="flex justify-center w-60 text-[#ABADB7]"
                    type="primary"
                    shape="round"
                    size="large"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#292D4A",
                      borderColor: "#ABADB7",
                    }}
                  >
                    Sign In
                  </Button>
                ) : (
                  <Skeleton.Button
                    active={true}
                    size="large"
                    shape="round"
                    block={true}
                  />
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="flex flex-row h-full w-full">
          <div className="relative hidden md:flex flex-auto items-center justify-center w-1/4 h-full  lg:px-28 overflow-hidden  bg-[url('/images/untitled1.PNG')] [background-size:100%_100%]"></div>
          <div className="relative hidden md:flex flex-auto items-center justify-center w-1/4 h-full  lg:px-28 overflow-hidden bg-[url('/images/untitled11.PNG')] [background-size:100%_100%]"></div>
          <div className="relative hidden md:flex flex-auto items-center justify-center w-1/4 h-full  lg:px-28 overflow-hidden bg-[url('/images/untitled111.PNG')] [background-size:100%_100%]"></div>
          <div className="relative hidden md:flex flex-auto items-center justify-center w-1/4 h-full  lg:px-28 overflow-hidden bg-[url('/images/untitled1111.PNG')] [background-size:100%_100%]"></div>
        </div>
      </div>
    </div>
  );
}
