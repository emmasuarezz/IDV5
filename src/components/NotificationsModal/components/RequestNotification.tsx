import { useState } from "react";
import { auth } from "../../../firebase";
import { RequestNotification as RequestNotificationType } from "../../../hooks/useGetNotifications";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/Components/notificationsmodal.module.scss";
import utils from "../../../styles/utils.module.scss";
export default function RequestNotification({
  notification,
  accept,
  showModal,
}: {
  notification: RequestNotificationType;
  accept?: boolean;
  showModal: (value: boolean) => void;
}) {
  const [accepting, setAccepting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  const AcceptedNotification = () => {
    return (
      <div className={styles.notification}>
        <img
          onClick={() => {
            showModal(false);
            navigate(`/userProfile/${notification.user.uid}`);
          }}
          src={notification.user.thumbnail}
          alt=""
        />
        <p>
          <span>{notification.user.displayName}</span> is now your friend!
        </p>
        <div className={`${styles.actions} ${utils.flexCol}`}>
          <button
            className={`${utils.cta} ${clearing ? utils.hidden : ""}`}
            onClick={() => {
              if (showModal) {
                showModal(false);
              }
              navigate(`/userProfile/${notification.user.uid}`);
            }}
          >
            go to profile
          </button>
          <button className={utils.cta} onClick={handleClear}>
            {clearing ? "clearing" : "clear"}
          </button>
        </div>
      </div>
    );
  };
  const RequestNotification = () => {
    return (
      <div className={styles.notification}>
        <img
          onClick={() => {
            showModal(false);
            navigate(`/userProfile/${notification.user.uid}`);
          }}
          src={notification.user.thumbnail}
          alt=""
        />
        <p>
          <span>{notification.user.displayName}</span> wants to be your friend
        </p>
        <div className={`${styles.actions} ${utils.flexCol}`}>
          <button className={utils.cta} onClick={handleAccept}>
            {accepting ? "accepting" : "accept"}
          </button>
          {!accepting && <button className={utils.cta}>decline</button>}
        </div>
      </div>
    );
  };
  const TheyAcceptedNotification = () => {
    return (
      <div className={styles.notification}>
        <img src={notification.user.thumbnail} alt="" />
        <p>
          <span>{notification.user.displayName}</span> accepted your request
        </p>
        <div className={`${styles.actions} ${utils.flexCol}`}>
          <button
            className={`${utils.cta} ${clearing ? utils.hidden : ""}`}
            onClick={() => {
              if (showModal) {
                showModal(false);
              }
              navigate(`/userProfile/${notification.user.uid}`);
            }}
          >
            go to profile
          </button>
          <button className={utils.cta} onClick={handleClear}>
            {clearing ? "clearing" : "clear"}
          </button>
        </div>
      </div>
    );
  };

  const handleAccept = async () => {
    try {
      setAccepting(true);
      const token = await auth.currentUser?.getIdToken();
      const currentUserUID = auth.currentUser?.uid;
      await fetch(`${import.meta.env.VITE_SERVER}/fb/acceptFriendRequest/${notification.user.uid}/${currentUserUID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleClear = async () => {
    setClearing(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const uid = auth.currentUser?.uid;
      await fetch(`${import.meta.env.VITE_SERVER}/fb/deleteNotification/${uid}/${notification.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
      setClearing(false);
    }
  };

  if (accept) return <AcceptedNotification />;
  return notification.type === "accept" ? <TheyAcceptedNotification /> : <RequestNotification />;
}
