import styles from "./StepPhoneEmail.module.css";
import React, { useState } from "react";
import Email from "./Email/Email";
import Phone from "./Phone/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

const StepPhoneEmail = ({ onNext }) => {
  const phoneEmailMap = {
    phone: Phone,
    email: Email,
  };
  const [tab, setTab] = useState("phone");

  const Tab = phoneEmailMap[tab];

  const buttonStyle = {
    color: "#fff",
    fontSize: "large",
  };

  return (
    <>
      <div className="cardWrapper">
        <div>
          <div className={styles.buttonWrapper}>
            <button
              style={buttonStyle}
              className={`${styles.tabButton} ${
                tab === "phone" ? styles.active : ""
              }`}
              onClick={() => setTab("phone")}
            >
              {<PhoneAndroidIcon />}
            </button>
            <button
              style={buttonStyle}
              className={`${styles.tabButton} ${
                tab === "email" ? styles.active : ""
              }`}
              onClick={() => setTab("email")}
            >
              {<MailOutlineIcon />}
            </button>
          </div>
          <Tab onNext={onNext} />
        </div>
      </div>
    </>
  );
};

export default StepPhoneEmail;
