import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import CountUp from "react-countup";
import QrCode from "qrcode.react";
import earth from "../../assets/earth.png";
import styles from "./index.module.css";
import io from "socket.io-client";

import {
  LogoutOutlined,
  MoneyCollectOutlined,
  QrcodeOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { Button, message, Spin } from "antd";
import Modal from "antd/es/modal/Modal";
import { request } from "../../api";

const convertTime = (date) => {
  if (process && process.env && process.env.NODE_ENV === "development") {
    return date;
  }
  return new Date(new Date(Date.parse(date)).getTime() + 8 * 60 * 60 * 1000);
};

export function Homepage() {
  const [socket, setSocket] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const card = useRef(null);
  const [account, setAccount] = useState({});
  const [qrCode, setQrCode] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const _account = localStorage.getItem("account");

    if (!_account) {
      return history.replace("");
    }

    const parsedAccount = JSON.parse(_account);
    setAccount(parsedAccount);

    let connection;

    if (process.env.NODE_ENV === "development") {
      connection = io("localhost:5000");
    } else {
      connection = io();
    }

    setSocket(connection);

    connection.emit("JOIN", parsedAccount.id, (user) => {
      message.success("Connected to Server");
      localStorage.setItem("account", JSON.stringify(user));
      setAccount(user);
    });

    connection.on("connect_error", () => {
      message.error("Fail to connect to server");
    });
  }, [history]);

  const toggleState = () => {
    if (qrCode) {
      card.current.style.transform = "rotateY(0deg)";
      setTimeout(() => {
        setQrCode(false);
      }, 200);
    } else {
      card.current.style.transform = "rotateY(180deg)";
      setTimeout(() => {
        setQrCode(true);
      }, 200);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.off("TRANSACTION");
      socket.on("TRANSACTION", ({ amount, action }) => {
        if (qrCode) toggleState();

        setTimeout(() => {
          if (action === "+") {
            setAccount({ ...account, points: account.points + amount });
            message.destroy();
            message.success(`Point: +${amount}`);
          }

          if (action === "-") {
            setAccount({ ...account, points: account.points - amount });
            message.destroy();
            message.error(`Point: -${amount}`);
          }
        }, 200);
      });
    }
  }, [socket, account, qrCode]);

  useEffect(() => {
    if (location && socket) {
      if (location.state.justRegister) {
        socket.emit("JUST_REGISTER");
      }
    }
  }, [location, socket]);

  const logout = () => {
    localStorage.clear();
    history.replace("");
  };

  const openHistory = () => {
    setModalVisible(true);
    setHistoryLoading(true);
    request.post("/getHistory", { id: account.id }).then((res) => {
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
          <div className={styles.title}>{account.name}</div>
          <div className={styles.subtitle}>{account.email}</div>
          {qrCode ? (
            <div className={styles.centerCard} ref={card}>
              <div className={styles.qrCode}>
                <QrCode value={account.id ? JSON.stringify(account) : ""} />
                <div className={styles.personalized}>
                  Your Personalized QR Code
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.centerCard} ref={card}>
              <img className={styles.earth} src={earth} alt="" />
              <CountUp
                end={account.points ? account.points : 0}
                className={styles.points}
              />
              <div className={styles.greenPoints}>Green Points</div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.actionBar}>
        <TransactionOutlined onClick={openHistory} className={styles.icons} />
        <LogoutOutlined className={styles.icons} onClick={logout} />
        <div className={"qrCode"}>
          <Button
            type="primary"
            shape="circle"
            icon={!qrCode ? <QrcodeOutlined /> : <MoneyCollectOutlined />}
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
                <div
                  key={trx.date}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div>{convertTime(trx.date)}</div>
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
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
