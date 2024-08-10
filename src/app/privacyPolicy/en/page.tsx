"use client";
import { GetReq } from "@/app/api/api";
import { StatusSuccessCodes } from "@/app/api/successStatus";
import { alternativePolicyEn } from "@/app/utils/privacyPolicy";
import { message, Spin } from "antd";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";

function PolicyPageEn() {
  const [policy, setPolicy] = useState<any>([]);
  const [loadPolicy, setLoadPolicy] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    getPolicy();
  }, []);

  function getPolicy() {
    let url = `policy`;
    setLoadPolicy(true);
    axios
      .get(`https://api.xperiences.vip/api/policy/`, {
        headers: {
          "Accept-Language": "en-US,en;q=0.9", // Set your desired language(s)
        },
      })
      .then(async function (response) {
        setLoadPolicy(false);
        setPolicy(response?.data[0]?.content);
      })
      .catch(function (error: any) {
        setLoadPolicy(false);

        error?.errors?.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      });
    // GetReq(url).then((res) => {
    //   setLoadPolicy(false);
    //   if (StatusSuccessCodes.includes(res.status)) {
    //     setPolicy(res.data.results);
    //   } else {
    //     res?.errors.forEach((err: any) => {
    //       messageApi.error(
    //         `${err.attr ? err.attr + ":" + err.detail : err.detail} `
    //       );
    //     });
    //   }
    // });
  }
  return (
    <Fragment>
      {contextHolder}
      <div className=" flex w-full justify-center bg-white px-10 py-5">
        {loadPolicy ? (
          <Spin size="large" className="w-full h-full content-center " />
        ) : (
          <>
            {policy ? (
              <div
                className="min-h-[100vh] h-fit text-black"
                dangerouslySetInnerHTML={{
                  __html: policy,
                }}
              ></div>
            ) : (
              <div
                className="min-h-[100vh] h-fit text-black"
                dangerouslySetInnerHTML={{
                  __html: alternativePolicyEn,
                }}
              ></div>
            )}
          </>
        )}
      </div>
    </Fragment>
  );
}

export default PolicyPageEn;
