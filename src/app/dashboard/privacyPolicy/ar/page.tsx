"use client";
import { GetReq } from "@/app/api/api";
import { StatusSuccessCodes } from "@/app/api/successStatus";
import { message, Spin } from "antd";
import { Fragment, useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";

function PolicyPageEn() {
  const [policy, setPolicy] = useState<any[]>([]);
  const [loadPolicy, setLoadPolicy] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    getPolicy();
  }, []);

  function getPolicy() {
    let url = `policy`;
    setLoadPolicy(true);
    GetReq(url).then((res) => {
      setLoadPolicy(false);
      if (StatusSuccessCodes.includes(res.status)) {
        setPolicy(res.data.results);
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }

  return (
    <Fragment>
      {contextHolder}
      <div className=" flex w-full h-full items-center align-middle justify-center">
        {loadPolicy ? (
          <Spin size="large" className="w-full h-full content-center " />
        ) : (
          <div></div>
        )}
      </div>
    </Fragment>
  );
}

export default PolicyPageEn;
