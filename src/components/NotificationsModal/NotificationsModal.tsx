import styles from "../../styles/Components/notificationsmodal.module.scss";
import utils from "../../styles/utils.module.scss";
import {
  LikeNotification as LikeNotificationType,
  RequestNotification as RequestNotificationType,
  useGetNotifications,
} from "../../hooks/useGetNotifications";
import { LikeNotification, RequestNotification } from "./components";
import { useEffect } from "react";
export default function NotificationsModal({
  setNotificationsModal,
}: {
  setNotificationsModal: (value: boolean) => void;
}) {
  const { tab, setTab, notifications, isLoading } = useGetNotifications();
  useEffect(() => {
    console.log(notifications);
  }, []);
  return (
    <div className={utils.modalBg}>
      <section className={styles.modal}>
        <div>
          <h1>Notifications</h1>
          <p onClick={() => setNotificationsModal(false)}>close</p>
        </div>
        <div className={styles.notificationsTabs}>
          <ul>
            <li onClick={() => setTab("requests")} className={tab == "requests" ? styles.activeTab : ""}>
              friend requests
            </li>
            <li onClick={() => setTab("likes")} className={tab == "likes" ? styles.activeTab : ""}>
              likes
            </li>
          </ul>
        </div>
        {isLoading ? (
          <section className={utils.loadingState}>
            <h1>Loading notifications</h1>
            <h2>It won't take long</h2>
          </section>
        ) : (
          <section className={styles.notificationsContainer}>
            {notifications.length === 0 ? (
              <div className={utils.loadingState}>
                <h2>No notifications yet</h2>
              </div>
            ) : (
              notifications.map((notification, index) => {
                if (notification.type === "like") {
                  return (
                    <LikeNotification
                      key={index}
                      notification={notification as LikeNotificationType}
                      showModal={setNotificationsModal}
                    />
                  );
                } else {
                  if (notification.type === "request") {
                    return (
                      <RequestNotification
                        key={index}
                        notification={notification as RequestNotificationType}
                        showModal={setNotificationsModal}
                      />
                    );
                  } else {
                    return (
                      <RequestNotification
                        key={index}
                        notification={notification as RequestNotificationType}
                        accept
                        showModal={setNotificationsModal}
                      />
                    );
                  }
                }
              })
            )}
          </section>
        )}
      </section>
    </div>
  );
}
