import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { auth, firestore } from "../firebase";

export type LikeNotification = {
  id: string;
  postId: string;
  type: "like";
  user: {
    uid: string;
    displayName: string;
    thumbnail: string;
  };
};
export type RequestNotification = {
  id: string;
  type: "request" | "accept";
  user: {
    uid: string;
    displayName: string;
    thumbnail: string;
  };
};

export const useGetNotifications = () => {
  const [notifications, setNotifications] = useState<(LikeNotification | RequestNotification)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"requests" | "likes" | "accept">("requests");

  useEffect(() => {
    setIsLoading(true);
    if (!auth.currentUser) return;
    const unsubscribe = onSnapshot(
      collection(firestore, "users", auth.currentUser?.uid, "notifications"),
      (snapshot) => {
        const notifications = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as LikeNotification | RequestNotification)
        );
        const likes = notifications.filter((notification) => notification.type === "like");
        const requests = notifications.filter(
          (notification) => notification.type === "request" || notification.type === "accept"
        );
        console.log(likes, requests);
        if (tab === "likes") {
          setNotifications(likes as (LikeNotification | RequestNotification)[]);
          console.log(likes, "likes");
        } else {
          setNotifications(requests as (LikeNotification | RequestNotification)[]);
          console.log(requests, "requests");
        }
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [tab]);

  return { notifications, isLoading, tab, setTab };
};
