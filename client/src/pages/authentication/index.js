import { useRef, useState } from "react";
import styles from "./index.module.css";
import { Button, Input, message } from "antd";
import { useHistory } from "react-router-dom";
import { request } from "../../api";

export function Authentication() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

  const [login, setLogin] = useState(true);

  const history = useHistory();

  const loginSuccess = (data, justRegister = false) => {
    const { id, name, email, points } = data;

    localStorage.setItem(
      "account",
      JSON.stringify({
        id,
        name,
        email,
        points,
      })
    );

    history.push({
      pathname: "/home",
      state: { justRegister },
    });
  };

  const handleClick = () => {
    const email = emailRef.current.state.value;
    const password = passwordRef.current.state.value;
    if (login) {
      if (email && password) {
        request
          .post("/login", { email, password })
          .then((res) => {
            loginSuccess(res.data);
          })
          .catch(() => {
            message.error("Invalid Credentials");
          });
      }
    } else {
      const name = usernameRef.current.state.value;
      if (email && password && name) {
        request
          .post("/register", { name, email, password })
          .then((res) => {
            loginSuccess(res.data, true);
          })
          .catch(() => {
            message.error("Name Already Taken");
          });
      }
    }
  };

  return (
    <div className={"App-Page"}>
      <div className={styles.container}>
        <div className={styles.title} onClick={() => history.push("/admin")}>
          Carbonbase
        </div>
        <div className={styles.subtitle}>
          {login ? "ACCOUNT LOGIN" : "REGISTER ACCOUNT"}
        </div>
        {!login && (
          <div className={styles.email}>
            <div>Username</div>
            <Input size="large" ref={usernameRef} />
          </div>
        )}
        <div className={styles.email}>
          <div>Email Address</div>
          <Input size="large" ref={emailRef} />
        </div>
        <div className={styles.password}>
          <div>Password</div>
          <Input.Password
            size="large"
            ref={passwordRef}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
          />
        </div>
        <div className="override">
          <Button onClick={handleClick}>{login ? "LOG IN" : "REGISTER"}</Button>
        </div>
        <div className={styles.createAccount}>
          <span onClick={() => setLogin(!login)}>
            {" "}
            {login ? "Create an account" : "Log In"}
          </span>
        </div>
      </div>
    </div>
  );
}
