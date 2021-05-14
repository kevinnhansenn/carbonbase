import { Fragment, useRef, useState } from "react";
import QrReader from "react-qr-reader";
import earth from "../../assets/earth.png";
import styles from "./index.module.css";
import CountUp from "react-countup";
import {
  CameraOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  LogoutOutlined,
  MinusOutlined,
  PlusOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import { Button, message, Popover, Spin } from "antd";
import Modal from "antd/es/modal/Modal";
import { request } from "../../api";

var data = [
  {
    year: "Mon",
    value: 3,
    type: "Lon",
  },
  {
    year: "Tue",
    value: 4,
    type: "Lon",
  },
  {
    year: "Wed",
    value: 3,
    type: "Lon",
  },
  {
    year: "Thu",
    value: 5,
    type: "Lon",
  },
  {
    year: "Fri",
    value: 4,
    type: "Lon",
  },
  {
    year: "Sat",
    value: 6,
    type: "Lon",
  },
  {
    year: "Sun",
    value: 7,
    type: "Lon",
  },
  {
    year: "Mon",
    value: 3,
    type: "Bor",
  },
  {
    year: "Tue",
    value: 4,
    type: "Bor",
  },
  {
    year: "Wed",
    value: 3,
    type: "Bor",
  },
  {
    year: "Thu",
    value: 5,
    type: "Bor",
  },
  {
    year: "Fri",
    value: 4,
    type: "Bor",
  },
  {
    year: "Sat",
    value: 6,
    type: "Bor",
  },
  {
    year: "Sun",
    value: 20,
    type: "Bor",
  },
];
var config = {
  data: data,
  padding: [65, 45, 40, 65],
  isStack: true,
  legend: false,
  xField: "year",
  yField: "value",
  seriesField: "type",
  color: ["#62DAAB", "#EF5350"],
  label: {
    style: {
      fill: "white",
      fontSize: 14,
    },
    position: "middle",
    layout: [
      { type: "interval-adjust-position" },
      { type: "interval-hide-overlap" },
    ],
  },
};

const previewStyle = {
  width: "90%",
};

export function Dashboard({ setVerified, socket }) {
  const [result, setResult] = useState(null);
  const [action, setAction] = useState(null);
  const [addTooltip, setAddTooltip] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deductTooltip, setDeductTooltip] = useState(false);
  const card = useRef(null);
  const [qrCodeScanner, setQrCodeScanner] = useState(false);

  const toggleState = () => {
    if (qrCodeScanner) {
      card.current.style.transform = "rotateY(0deg)";
      setTimeout(() => {
        setQrCodeScanner(false);
      }, 200);
    } else {
      card.current.style.transform = "rotateY(180deg)";
      setTimeout(() => {
        setQrCodeScanner(true);
      }, 200);
    }
  };

  const handleScan = async (data) => {
    if (data) {
      try {
        console.log(JSON.parse(data));
        setResult(JSON.parse(data));
      } catch (e) {
        message.error("Invalid QR Code");
      } finally {
        toggleState();
      }
    }
  };
  const handleError = () => {
    message.error("No Camera Permission");
  };

  const execute = (amount) => {
    socket.emit(
      "EXECUTE",
      {
        action,
        amount,
        id: result.id,
      },
      () => {
        setAddTooltip(false);
        setDeductTooltip(false);
        let updatedPoint = result.points;

        if (action === "+") {
          updatedPoint = updatedPoint + amount;
        }
        if (action === "-") {
          updatedPoint = updatedPoint - amount;
        }

        setResult({ ...result, points: updatedPoint });
        message.success("Success: Transaction Successful");
      }
    );
  };

  const selection = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        disabled={action === "-" && result && result.points < 10}
        size="small"
        onClick={() => execute(10)}
      >
        10
      </Button>
      <Button
        disabled={action === "-" && result && result.points < 20}
        size="small"
        onClick={() => execute(20)}
      >
        20
      </Button>
      <Button
        disabled={action === "-" && result && result.points < 50}
        size="small"
        onClick={() => execute(50)}
      >
        50
      </Button>
      <Button
        disabled={action === "-" && result && result.points < 100}
        size="small"
        onClick={() => execute(100)}
      >
        100
      </Button>
    </div>
  );

  const logout = () => {
    localStorage.clear();
    setVerified(false);
  };

  const actionClicked = (_action) => {
    if (_action === "+") setAddTooltip(true);
    if (_action === "-") setDeductTooltip(true);
    setAction(_action);
  };

  const openHistory = () => {
    setModalVisible(true);
    setHistoryLoading(true);
    request.get("/getHistory").then((res) => {
      console.log(res.data);
      setTransactionHistory(res.data);
      setHistoryLoading(false);
    });
  };

  const modalClose = () => {
    setModalVisible(false);
    setTransactionHistory([]);
  };

  return (
    <div className={"App-Page"}>
      <div className={styles.container}>
        <div className={styles.background} />
        <div className={styles.wrapper}>
          <div className={styles.titleColumn}>
            <div>
              <div className={styles.administrator}>Admin</div>
              <div className={styles.subtitle}>admin@carbonbase.co</div>
            </div>
            <div>
              <div className={styles.userText}>REGISTERED USERS</div>
              <div className={styles.userNum}>
                <CountUp end={200} />
              </div>
            </div>
          </div>

          {qrCodeScanner ? (
            <div className={styles.centerCard} ref={card}>
              <div className={styles.qrCode}>
                <QrReader
                  delay={100}
                  style={previewStyle}
                  onError={handleError}
                  onScan={handleScan}
                  facingMode={"environment"}
                />
              </div>
            </div>
          ) : (
            <div className={styles.centerCard} ref={card}>
              {result ? (
                <Fragment>
                  <CheckCircleOutlined
                    id={"check"}
                    className={styles.checkIcon}
                  />
                  <div className={styles.info}>{result.name}</div>
                  <div className={styles.info}>{result.email}</div>

                  <div className={styles.info}>
                    {" "}
                    <CountUp end={result.points ? result.points : 0} /> Points
                  </div>
                  <div className={styles.actions}>
                    <Popover
                      content={selection}
                      title="How many points?"
                      trigger="click"
                      visible={addTooltip}
                      onVisibleChange={(e) => setAddTooltip(e)}
                    >
                      <Button
                        type="primary"
                        ghost
                        shape="round"
                        icon={<PlusOutlined />}
                        onClick={() => actionClicked("+")}
                      >
                        Add
                      </Button>
                    </Popover>
                    <Popover
                      content={selection}
                      title="How many points?"
                      trigger="click"
                      visible={deductTooltip}
                      onVisibleChange={(e) => setDeductTooltip(e)}
                    >
                      <Button
                        shape="round"
                        onClick={() => actionClicked("-")}
                        danger
                        icon={<MinusOutlined />}
                      >
                        Deduct
                      </Button>
                    </Popover>
                    <Button
                      shape="round"
                      onClick={() => setResult(null)}
                      icon={<CloseOutlined />}
                    >
                      Cancel
                    </Button>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <img className={styles.earth} src={earth} alt="" />
                  <span className={styles.metric}>Engagement Metrics</span>
                  <Column {...config} />
                </Fragment>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.actionBar}>
        <TransactionOutlined onClick={openHistory} className={styles.icons} />
        <LogoutOutlined className={styles.icons} onClick={logout} />
        <div className={"qrCode blue"}>
          <Button
            type="primary"
            shape="circle"
            icon={<CameraOutlined />}
            size="large"
            onClick={toggleState}
          />
        </div>
      </div>
      <Modal
        title="My Transaction History"
        centered
        width="85vw"
        visible={modalVisible}
        footer={null}
        onCancel={modalClose}
      >
        {historyLoading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin />
          </div>
        ) : (
          <div>
            {transactionHistory.map((trx) => {
              return (
                <div key={trx.date} style={{ marginBottom: "15px" }}>
                  <div style={{ fontWeight: "bold" }}>{trx.date}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>{trx.name}</div>
                    <div
                      style={
                        trx.action === "+"
                          ? { color: "green", fontWeight: "bold" }
                          : { color: "red", fontWeight: "bold" }
                      }
                    >
                      {trx.action}
                      {trx.amount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
