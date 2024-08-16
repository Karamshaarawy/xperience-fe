import { GetByResType } from "@/app/api/api";
import { StatusSuccessCodes } from "@/app/api/successStatus";
import { message, Spin, Tooltip } from "antd";
import React, { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function ExportExcel() {
  const [isLoadingExcel, setIsLoadingExcel] = useState<boolean>(false);

  function exportReport() {
    setIsLoadingExcel(true);
    GetByResType("report/", "blob").then(async (res) => {
      setIsLoadingExcel(false);
      if (StatusSuccessCodes.includes(res?.status)) {
        let blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        res?.errors?.forEach((err: any) => {
          message.error(`${err.attr + ":" + err.datail} `);
        });
      }
    });
  }
  return (
    <div id="export" onClick={exportReport}>
      <Tooltip
        arrow={false}
        placement="bottom"
        color="#616161"
        title={
          <span className="text-xs">
            Export All Reservations In Excel Sheet
          </span>
        }
        overlayInnerStyle={{
          width: "max-content",
          borderRadius: "5px",
        }}
      >
        {isLoadingExcel ? (
          // eslint-disable-next-line react/jsx-no-undef
          <Spin />
        ) : (
          <IoDocumentTextOutline
            className="text-[#292D4A] cursor-pointer"
            size={30}
          />
        )}
      </Tooltip>
    </div>
  );
}
