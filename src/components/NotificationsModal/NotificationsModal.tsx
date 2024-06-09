import styles from "../../styles/Components/notificationsmodal.module.scss";
import utils from "../../styles/utils.module.scss";
import {
  LikeNotification as LikeNotificationType,
  RequestNotification as RequestNotificationType,
  useGetNotifications,
} from "../../hooks/useGetNotifications";
import { LikeNotification, RequestNotification } from "./components";
export default function NotificationsModal({
  setNotificationsModal,
}: {
  setNotificationsModal: (value: boolean) => void;
}) {
  const { tab, setTab, notifications, isLoading } = useGetNotifications();
  return (
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
            <p>No notifications yet</p>
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
                  return <RequestNotification key={index} notification={notification as RequestNotificationType} />;
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
  );
}
