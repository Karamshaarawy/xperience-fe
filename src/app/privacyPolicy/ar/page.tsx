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
          "Accept-Language": "ar;q=0.8", // Set your desired language(s)
        },
      })
      .then(async function (response) {
        setLoadPolicy(false);
        setPolicy(`
          "<p><i><strong>&nbsp;مرحبًا بك في Xperience، الموفر الرائد للتجارب السفرية الفاخرة في مصر.</strong></i></p><p><i><strong>&nbsp;من خلال الحجز أو استخدام أي من خدماتنا، فإنك توافق على الالتزام بالشروط والأحكام التالية:&nbsp;</strong></i></p><p><i><strong>&nbsp;الحجوزات والمدفوعات: -</strong></i></p><ul><li><i><strong>&nbsp;يجب أن تتم جميع الحجوزات مسبقًا وتخضع للتوفر.</strong></i></li><li><i><strong>&nbsp; نقبل بطاقات الائتمان الرئيسية وتحويلات البنكية والطرق الدفع المحمولة.&nbsp;</strong></i></li><li><i><strong>يجب أن تتم جميع المدفوعات بالعملة المحددة.</strong></i></li><li><i><strong>&nbsp; قد تخضع التغييرات أو الإلغاءات على الحجوزات التي تتم خلال 30 يومًا من الوصول لرسوم.</strong></i></li></ul><p><i><strong>الإقامة: -</strong></i></p><ul><li><i><strong>&nbsp;تتم صيانة إقامتنا الفاخرة وفقًا لأعلى معايير النظافة والراحة.</strong></i></li><li><i><strong>&nbsp; يُتوقع من الضيوف التعامل مع الإقامة بعناية واحترام أثناء إقامتهم.</strong></i></li><li><i><strong>&nbsp; نحتفظ بالحق في احتساب التكاليف لأي أضرار أو تنظيف مفرط مطلوب بعد إقامة الضيف.</strong></i></li></ul><p><i><strong>&nbsp;النقل: -</strong></i></p><ul><li><i><strong>&nbsp;توفر أسطولنا من سيارات الليموزين المُرافَقة نقلاً آمنًا وموثوقًا ومريحًا.</strong></i></li><li><i><strong>&nbsp;يجب على الضيوف ارتداء أحزمة الأمان في جميع الأوقات واتباع تعليمات السائق المحترف.</strong></i></li><li><i><strong>&nbsp;التدخين والكحول والمواد المخدرة محظورة صراحة في سياراتنا.</strong></i></li></ul><p><i><strong>&nbsp;سلوك الضيف: -</strong></i></p><ul><li><i><strong>&nbsp;تحتفظ Xperience بالحق في رفض الخدمة أو إزالة أي ضيف يشارك في سلوك غير قانوني أو خطير أو مزعج.</strong></i></li><li><i><strong>&nbsp; يُتوقع من الضيوف أن يكونوا محترمين تجاه المسافرين الآخرين وموظفينا والثقافة والبيئة المحلية.</strong></i></li><li><i><strong>&nbsp;نحن لسنا مسؤولين عن فقدان أو تلف الممتلكات الشخصية أثناء إقامتك.</strong></i></li></ul><p><i><strong>&nbsp;المسؤولية: -&nbsp;</strong></i></p><ul><li><i><strong>لن تكون Xperience مسؤولة عن أي تأخيرات أو إلغاءات أو تغييرات في برامج السفر بسبب ظروف خارجة عن سيطرتنا، مثل الطقس أو عدم الاستقرار السياسي أو مشاكل النقل.</strong></i></li><li><i><strong>&nbsp; نوصي جميع الضيوف بشراء تأمين سفر شامل قبل رحلتهم.</strong></i></li></ul><p>&nbsp;</p><p><i><strong>&nbsp;من خلال المضي قدمًا في حجزك، فإنك تقر بأنك قد قرأت وفهمت وتوافق على الالتزام بهذه الشروط والأحكام. لا تتردد في الاتصال بنا إذا كان لديك أي أسئلة إضافية.</strong></i></p>"`);
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
      <div className=" flex w-full justify-center bg-white" dir="rtl">
        {loadPolicy ? (
          <Spin size="large" className="w-full h-full content-center " />
        ) : (
          <>
            <div
              className="min-h-[100vh] h-fit text-black"
              dangerouslySetInnerHTML={{
                __html: policy,
              }}
            ></div>
            {/* <div>{policy[0]?.key}</div> */}
          </>
        )}
      </div>
    </Fragment>
  );
}

export default PolicyPageEn;
