"use client";
import { GetReq } from "@/app/api/api";
import { StatusSuccessCodes } from "@/app/api/successStatus";
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
        setPolicy(`<p class="demoTitle">Terms and Conditions</p>
<p class="demoTitle">Welcome to Xperience, the premier provider of luxury travel experiences in Egypt. By booking or using any of our services, you agree to be bound by the following terms and conditions:</p>
<p class="demoTitle">Bookings and Payments:</p>
<ul>
<li class="demoTitle">All bookings must be made in advance and are subject to availability.</li>
<li class="demoTitle">We accept major credit cards, bank transfers, and mobile payment methods. All payments must be made in the stated currency.</li>
<li class="demoTitle">Booking changes or cancellations made within 30 days of arrival may be subject to fees.</li>
</ul>
<p class="demoTitle">Accommodations:</p>
<ul>
<li class="demoTitle">&nbsp;Our luxury accommodations are maintained to the highest standards of cleanliness and comfort.</li>
<li class="demoTitle">Guests are expected to treat the accommodations with care and respect during their stay.</li>
<li class="demoTitle">We reserve the right to charge for any damages or excessive cleaning required after a guest's stay.</li>
</ul>
<p class="demoTitle">Transportation:</p>
<ul>
<li class="demoTitle">Our fleet of chauffeured limousines provides safe, reliable, and comfortable transportation.</li>
<li class="demoTitle">Guests must wear seatbelts at all times and follow the instructions of the professional driver.</li>
<li class="demoTitle">Smoking, alcohol, and illegal substances are strictly prohibited in our vehicles.</li>
</ul>
<p class="demoTitle">Guest Conduct:</p>
<ul>
<li class="demoTitle">Xperience reserves the right to refuse service or remove any guest who engages in illegal, dangerous, or disruptive behavior.</li>
<li class="demoTitle">Guests are expected to be respectful of other travelers, our staff, and the local culture and environment.</li>
<li class="demoTitle">We are not responsible for the loss or damage of personal belongings during your stay.</li>
</ul>
<p class="demoTitle">Liability:</p>
<ul>
<li class="demoTitle">Xperience shall not be liable for any delays, cancellations, or changes to travel itineraries due to circumstances beyond our control, such as weather, political unrest, or transportation issues.</li>
<li class="demoTitle">We recommend that all guests purchase comprehensive travel insurance prior to their trip.</li>
</ul>
<p class="demoTitle">By proceeding with your booking, you acknowledge that you have read, understand, and agree to abide by these terms and conditions.</p>
<p class="demoTitle">Please don't hesitate to contact us if you have any further questions."</p>
<!-- Comments are visible in the HTML source only -->`);
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
      <div className=" flex w-full justify-center bg-white">
        {loadPolicy ? (
          <Spin size="large" className="w-full h-full content-center " />
        ) : (
          <>
            <div
              className="h-[100vh]"
              dangerouslySetInnerHTML={{
                __html: policy,
              }}
            ></div>
            <div></div>
          </>
        )}
      </div>
    </Fragment>
  );
}

export default PolicyPageEn;
