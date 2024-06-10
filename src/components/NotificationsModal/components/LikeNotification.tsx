import { LikeNotification as LikeNotificationType } from "../../../hooks/useGetNotifications";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/Components/notificationsmodal.module.scss";
import utils from "../../../styles/utils.module.scss";
import { useState } from "react";
import { auth } from "../../../firebase";
export default function LikeNotification({
  notification,
  showModal,
}: {
  notification: LikeNotificationType;
  showModal: (value: boolean) => void;
}) {
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

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
    }
  };

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
        <span>{notification.user.displayName}</span> liked your post
      </p>
      <div className={styles.actions}>
        <button
          className={`${utils.cta} ${clearing ? utils.hidden : ""}`}
          onClick={() => {
            showModal(false);
            navigate(`/post/${notification.postId}`);
          }}
        >
          go to post
        </button>
        <button className={utils.cta} onClick={handleClear}>
          {clearing ? "clearing" : "clear"}
        </button>
      </div>
    </div>
  );
}
