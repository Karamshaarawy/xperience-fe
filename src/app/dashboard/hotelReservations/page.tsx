"use client";
import { Fragment, useEffect, useState } from "react";
import isAuth from "../../../../components/isAuth";
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  message,
} from "antd";
import { isMobile } from "react-device-detect";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GetReq, PatchReq, PostReq } from "@/app/api/api";
import { StatusSuccessCodes } from "@/app/api/successStatus";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { FiMinusCircle } from "react-icons/fi";

function ReservationsPage() {
  const columns: TableColumnsType<any> = [
    {
      title: "Client's Name",
      dataIndex: ["user", "name"],
      key: "ClientName",
    },
    {
      title: "Mobile",
      dataIndex: ["user", "mobile"],
      key: "mobile",
    },
    {
      title: "Hotel",
      key: "hotel",
      render: (record: any) =>
        record?.hotel_reservations[0]?.hotel_service?.name,
    },
    {
      title: "CheckIn Date",
      key: "CheckIn",
      render: (record: any) => record?.hotel_reservations[0]?.check_in_date,
    },
    {
      title: "CheckOut Date",
      key: "CheckOut",
      render: (record: any) => record?.hotel_reservations[0]?.check_out_date,
    },

    {
      title: "Created By",
      dataIndex: ["created_by", "name"],
      key: "createdBy",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Edit",
      key: "edit",
      render: (record: any) => (
        <Button
          style={{
            backgroundColor: "#363B5E",
            borderColor: "#F1DF78",
          }}
          className=" text-white"
          id={record.id}
          onClick={() => openAddEditModel(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  const [searchForm] = Form.useForm();
  const [AddEditReservationForm] = Form.useForm();
  const [addHotelReservationForm] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const [reservationsList, setReservationsList] = useState<any[]>([]);
  const [reservationsCount, setReservationsCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [postEditRequestLoading, setPostEditRequestLoading] =
    useState<any>(false);
  const [addHotelReservationModalOpen, setAddHotelReservationModalOpen] =
    useState<any>(false);
  const [isEdit, setIsEdit] = useState<any>(false);
  const [recordId, setRecordId] = useState<number | undefined>(undefined);
  const [hotelServiceOptionsDropDown, setHotelServiceOptionsDropDown] =
    useState<any>([]);
  const [usersDropDown, setUsersDropDown] = useState<any>([]);
  const [hotelServicesDropDown, setHotelServicesDropDown] = useState<any>([]);
  useEffect(() => {
    getReservationsList();
    hotelServicesSearch();
    getHotelServiceOptions();
    usersSearch();
  }, []);
  const [loadReservationsList, setLoadReservationsList] = useState<any>(false);

  function getReservationsList(page: number = 1, pageSize: number = 10) {
    setCurrentPage(page);
    let url = `reservations/?limit=${pageSize}&offset=${(page - 1) * pageSize}`;
    params.forEach((value: any, key: any) => (url += `&${key}=${value}`));
    setLoadReservationsList(true);
    GetReq(url).then((res) => {
      setLoadReservationsList(false);
      if (StatusSuccessCodes.includes(res.status)) {
        setReservationsList(res.data.results);
        setReservationsCount(res.data.count);
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }

  function closeAddHotelReservation() {
    setAddHotelReservationModalOpen(false);
  }

  function applySearch(values: any) {
    if (values.search) {
      params.set("search", values.search);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
    getReservationsList();
  }

  const onSearchReset = () => {
    searchForm.resetFields();
    params.has("search") && params.delete("search");
    replace(`${pathname}`);
    getReservationsList();
  };

  function openAddEditModel(record?: any) {
    setAddHotelReservationModalOpen(true);
    record.id ? setIsEdit(true) : setIsEdit(false);
    setRecordId(record?.id);
    record.id
      ? addHotelReservationForm.setFieldsValue({
          user: record?.user,
          hotel_service_id: record?.hotel_reservations[0]?.hotel_service?.id,
          status: record.status,
          extras: record?.hotel_reservations[0]?.extras,
          check_in_date: dayjs(record?.hotel_reservations[0]?.check_in_date),
          check_out_date: dayjs(record?.hotel_reservations[0]?.check_ou_date),
          final_price: record?.hotel_reservations[0]?.final_price,
          options: record?.hotel_reservations[0]?.options,
        })
      : null;
  }

  function handleCancel() {
    AddEditReservationForm.resetFields();
    setAddHotelReservationModalOpen(false);
  }

  function addHotelReservation(values: any) {
    calculateFinalPrice();
    console.log(values);

    delete values.additional_fees;
    values.check_in_date = values.check_in_date.format("YYYY-MM-DD");
    values.check_out_date = values.check_out_date.format("YYYY-MM-DD");
    values.options = values?.options?.map((rec: any) => {
      return {
        service_option: rec?.service_option?.value,
        quantity: rec?.quantity,
      };
    });
    values.hotel_service_id = values.hotel_service_id.value;
    let data: any = { user: values.user, status: values.status };
    delete values.user;
    delete values.status;
    data.hotel_reservations = [values];
    console.log(data);

    setPostEditRequestLoading(true);
    isEdit
      ? PatchReq(`reservations/${recordId}/`, data).then((res) => {
          setPostEditRequestLoading(false);
          if (StatusSuccessCodes.includes(res.status)) {
            messageApi.success("Reservation Updated Successfully");
            handleCancel();
            getReservationsList();
          } else {
            res?.errors.forEach((err: any) => {
              messageApi.error(
                `${err.attr ? err.attr + ":" + err.detail : err.detail} `
              );
            });
          }
        })
      : PostReq(`reservations/`, data).then((res) => {
          setPostEditRequestLoading(false);
          if (StatusSuccessCodes.includes(res.status)) {
            messageApi.success("Reservation Added Successfully");
            handleCancel();
            getReservationsList();
          } else {
            res?.errors.forEach((err: any) => {
              messageApi.error(
                `${err.attr ? err.attr + ":" + err.detail : err.detail} `
              );
            });
          }
        });
  }

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current < dayjs().startOf("day");
  };

  function hotelServicesSearch(search?: any) {
    let url = `hotel-services/?limit=${9999}`;
    search ? (url += `&search=${search}`) : null;
    GetReq(url).then((res) => {
      if (StatusSuccessCodes.includes(res.status)) {
        let list: any = [];
        res.data.results.map((rec: any) => {
          list.push({
            label: rec.name,
            value: rec.id,
            key: rec.id,
            title: +rec.day_price,
          });
        });
        setHotelServicesDropDown(list);
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }
  function onHotelServiceSearch(value: any) {
    hotelServicesSearch(value);
  }

  function usersSearch(search?: any) {
    let url = `user/profile/?limit=${9999}`;
    search ? (url += `&search=${search}`) : null;
    GetReq(url).then((res) => {
      if (StatusSuccessCodes.includes(res.status)) {
        let list: any = [];
        res.data.results.map((rec: any) => {
          list.push({
            label: rec.name,
            value: rec.id,
            key: rec.id,
          });
        });
        setUsersDropDown(list);
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }

  function onUserSearch(value: any) {
    usersSearch(value);
  }

  function getHotelServiceOptions() {
    let url = `service-options/?limit=99999&service_type=HOTEL`;
    GetReq(url).then((res: any) => {
      if (StatusSuccessCodes.includes(res.status)) {
        let list: any = [];
        res.data.results.map((rec: any) => {
          list.push({
            label: rec.type + " " + rec.name,
            value: rec.id,
            key: rec.id,
            title: +rec.price,
          });
        });
        setHotelServiceOptionsDropDown(list);
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }

  function calculateFinalPrice() {
    let serviceOptionsPrice = addHotelReservationForm
      ?.getFieldValue("options")
      ?.map((rec: any) => {
        return [rec?.service_option?.title * rec?.quantity];
      })
      ?.reduce((a: any, b: any) => +a + +b);
    let numberOfDays =
      (Date.parse(addHotelReservationForm.getFieldValue("check_out_date")) -
        Date.parse(addHotelReservationForm.getFieldValue("check_in_date"))) /
      (1000 * 60 * 60 * 24);
    let dayPrice =
      addHotelReservationForm?.getFieldValue("hotel_service_id")?.title;
    let hotelPrice = numberOfDays * dayPrice;

    let AdditionalFees =
      +addHotelReservationForm.getFieldValue("additional_fees");
    let finalPrice = 0;
    serviceOptionsPrice !== undefined && !isNaN(serviceOptionsPrice)
      ? (finalPrice += +serviceOptionsPrice)
      : null;
    hotelPrice ? (finalPrice += +hotelPrice) : null;
    AdditionalFees ? (finalPrice += +AdditionalFees) : null;
    addHotelReservationForm.setFieldValue("final_price", finalPrice);
    addHotelReservationForm.validateFields();
  }
  return (
    <Fragment>
      {contextHolder}
      <div className="w-full h-fit bg-[#363B5E] py-8 px-5 flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row justify-between items-center content-center">
        <div className="flex flex-row flex-wrap gap-5 w-fit ">
          <h2 className="text-xl text-[white] font-semibold">Reservations</h2>
        </div>
        <Button
          style={{
            backgroundColor: "#363B5E",
            borderColor: "#F1DF78",
          }}
          className=" text-white"
          onClick={openAddEditModel}
        >
          Add New
        </Button>

        <Modal
          open={addHotelReservationModalOpen}
          title={"Add New Hotel Reservation"}
          onCancel={closeAddHotelReservation}
          width={700}
          maskClosable={false}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          afterClose={() => addHotelReservationForm.resetFields()}
        >
          <Form
            form={addHotelReservationForm}
            layout="vertical"
            name="hotelReservationForm"
            onFinish={addHotelReservation}
          >
            <Form.Item name="user" label="Client" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select User"
                onSearch={onUserSearch}
                filterOption={false}
                optionFilterProp="children"
                options={usersDropDown}
                allowClear={true}
                onClear={() => usersSearch()}
              />
            </Form.Item>
            <Form.Item
              name="hotel_service_id"
              label="Hotel Service"
              rules={[{ required: true }]}
            >
              <Select
                labelInValue
                showSearch
                placeholder="Select hotel Service"
                onSearch={onHotelServiceSearch}
                filterOption={false}
                optionFilterProp="children"
                options={hotelServicesDropDown}
                allowClear={true}
                onClear={() => hotelServicesSearch()}
                onChange={(e) =>
                  addHotelReservationForm.setFieldValue("final_price", null)
                }
              />
            </Form.Item>
            <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row gap-2 ">
              <Form.Item
                name="check_in_date"
                label="Check-In Date"
                rules={[{ required: true }]}
                className="w-full"
              >
                <DatePicker
                  className="w-full"
                  disabledDate={disabledDate}
                  format="YYYY-MM-DD"
                  onChange={(e) => {
                    addHotelReservationForm.setFieldValue("final_price", null);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="check_out_date"
                label="Check-Out Date"
                rules={[{ required: true }]}
                className="w-full"
              >
                <DatePicker
                  className="w-full"
                  disabledDate={disabledDate}
                  format="YYYY-MM-DD"
                  onChange={(e) => {
                    addHotelReservationForm.setFieldValue("final_price", null);
                  }}
                />
              </Form.Item>
            </div>

            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((key, name, ...restField) => (
                    <Form.Item key={Math.random()}>
                      <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row gap-2 items-center">
                        <Form.Item
                          rules={[{ required: true }]}
                          key={Math.random()}
                          label="service Option"
                          {...restField}
                          className="w-full"
                          name={[name, "service_option"]}
                        >
                          <Select
                            labelInValue
                            options={hotelServiceOptionsDropDown}
                            onChange={(e) => {
                              addHotelReservationForm.setFieldValue(
                                "final_price",
                                null
                              );
                            }}
                            placeholder={"Select Option"}
                            className="w-full"
                          />
                        </Form.Item>
                        <Form.Item
                          rules={[{ required: true }]}
                          className="w-full"
                          label="Quantity"
                          {...restField}
                          name={[name, "quantity"]}
                        >
                          <InputNumber
                            placeholder={"enter Quantity"}
                            className="w-full"
                            onChange={(e) => {
                              addHotelReservationForm.setFieldValue(
                                "final_price",
                                null
                              );
                            }}
                          />
                        </Form.Item>
                        <FiMinusCircle
                          size={30}
                          className="dynamic-delete-button cursor-pointer"
                          onClick={() => remove(name)}
                        />
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Option
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item
              name="extras"
              label="Extras"
              // rules={[{ required: true }]}
              className="w-full"
            >
              <TextArea className="w-full" />
            </Form.Item>
            <Form.Item
              className="w-full"
              name="additional_fees"
              label="Additional Fees"
            >
              <InputNumber
                className="w-full"
                onChange={(e) => {
                  addHotelReservationForm.setFieldValue("final_price", null);
                }}
              />
            </Form.Item>
            <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row gap-2 items-center">
              <Form.Item label="  ">
                <Button onClick={calculateFinalPrice}>
                  Calculate Final Price
                </Button>
              </Form.Item>
              <Form.Item
                className="w-full"
                name="final_price"
                label="Final Price"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
            </div>
            <Form.Item
              className="w-full"
              name="status"
              label="Status:"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option
                  key="waitingForPayment"
                  value="WAITING_FOR_PAYMENT"
                >
                  WAITING FOR PAYMENT
                </Select.Option>
              </Select>
            </Form.Item>

            <SubmitButton
              form={addHotelReservationForm}
              loading={postEditRequestLoading}
            />
          </Form>
        </Modal>
      </div>
      <div className="w-full bg-white py-15">
        <div className="w-full h-full flex flex-col gap-5 p-5">
          <div
            id="filterSearch"
            className="w-full h-fit flex flex-row flex-wrap gap-2"
          >
            <Form
              form={searchForm}
              onFinish={applySearch}
              layout="inline"
              className={
                "gap-3 mb-5 items-baseline flex " +
                (isMobile ? " flex-col" : "flex-row")
              }
            >
              <Form.Item name="search">
                <Input
                  allowClear
                  placeholder="Search . . ."
                  onChange={(e: any) => {
                    e.target.value === "" ? onSearchReset() : null;
                  }}
                />
              </Form.Item>
              <Button
                htmlType="submit"
                style={{
                  backgroundColor: "#363B5E",
                  borderColor: "#F1DF78",
                }}
                className=" text-white"
              >
                Apply
              </Button>
              <Button onClick={onSearchReset}>Reset</Button>
            </Form>
          </div>
        </div>
      </div>
      <div id="content" className="w-full bg-white">
        <div className="w-full px-5 overflow-auto h-[63vh]" id="InfiniteScroll">
          <Table
            dataSource={reservationsList}
            columns={columns}
            rowKey={"id"}
            scroll={{ x: 0 }}
            loading={loadReservationsList}
            pagination={{
              current: currentPage,
              total: reservationsCount,
              pageSize: 10,
              showTotal(total, range) {
                return `${range[0]}-${range[1]} of ${total} items`;
              },
              onChange: (page, pageSize) => {
                getReservationsList(page, pageSize);
              },
            }}
          />
        </div>
      </div>
    </Fragment>
  );
}

// export default isAuth(ReservationsPage);
export default ReservationsPage;

const SubmitButton = ({
  form,
  loading,
}: {
  form: FormInstance;
  loading: boolean;
}) => {
  const [submittable, setSubmittable] = useState(false);

  const values = Form.useWatch([], form);
  const router = useRouter();

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [values]);

  return (
    <Button
      htmlType="submit"
      disabled={!submittable}
      style={{
        backgroundColor: "#363B5E",
        borderColor: "#F1DF78",
      }}
      className="m-2 w-[100%] h-[45px] font-semibold text-white"
      loading={loading}
    >
      Confirm
    </Button>
  );
};
