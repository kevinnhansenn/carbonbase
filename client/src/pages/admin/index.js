import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { Button, Input, message } from "antd";
import { Dashboard } from "../dashboard";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";

export function Admin() {
  const codeRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [verified, setVerified] = useState(false);
  const history = useHistory();

  const verify = () => {
    setVerified(true);

    let connection;

    if (process.env.NODE_ENV === "development") {
      connection = io("localhost:5000");
    } else {
      connection = io();
    }

    setSocket(connection);

    connection.emit("ADMIN_JOIN", () => {
      message.success("Connection Established");
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (token) verify();
  }, []);

  const onEnter = () => {
    const code = codeRef.current.state.value;

    if (code === "admin") {
      localStorage.setItem("admin", "admin");
      verify();
    } else {
      message.error("Wrong Code!");
    }
  };

  return (
    <div className={"App-Page"}>
      {verified ? (
        <Dashboard setVerified={setVerified} socket={socket} />
      ) : (
        <div className={styles.container}>
          <div className={styles.title} onClick={() => history.push("/")}>
            Carbonbase
          </div>
          <div className={styles.subtitle}>ADMIN PORTAL</div>

          <div className={styles.email}>
            <div>Secret Code</div>
            <Input.Password
              size="large"
              ref={codeRef}
              onKeyDown={(e) => e.key === "Enter" && onEnter()}
            />
          </div>

          <div className="override-blue">
            <Button onClick={onEnter}>ENTER</Button>
          </div>
        </div>
      )}
    </div>
  );
}
