import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import firebase from "firebase/compat/app";

export type LikeNotification = {
  timestamp: firebase.firestore.Timestamp;
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
  timestamp: firebase.firestore.Timestamp;
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
  const [likes, setLikes] = useState<LikeNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<RequestNotification[]>([]);
  const [tab, setTab] = useState<"requests" | "likes" | "accept">("requests");

  useEffect(() => {
    setIsLoading(true);
    if (!auth.currentUser) return;

    const notificationsRef = collection(firestore, "users", auth.currentUser.uid, "notifications");

    const unsubscribeNotifications = onSnapshot(notificationsRef, (snapshot) => {
      const notifications = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as LikeNotification | RequestNotification)
      );

      const likesArray = notifications.filter((notification) => notification.type === "like") as LikeNotification[];
      setLikes(likesArray);
      const requestsArray = notifications.filter(
        (notification) => notification.type === "request" || notification.type === "accept"
      ) as RequestNotification[];
      setRequests(requestsArray);
    });

    return () => unsubscribeNotifications();
  }, [tab]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const friendsRef = collection(firestore, "users", auth.currentUser.uid, "friends");

    const unsubscribeFriends = onSnapshot(friendsRef, (snapshot) => {
      const friends = snapshot.docs.map((doc) => doc.id);
      const updatedRequests = requests.map((request) => {
        if (friends.includes(request.user.uid)) {
          return { ...request, type: "accept" };
        } else {
          return request;
        }
      }) as RequestNotification[];
      if (tab === "likes") {
        const sortedLikes = likes.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setNotifications(sortedLikes);
      } else {
        const sortedRequests = updatedRequests.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setNotifications(sortedRequests);
      }

      setIsLoading(false);
    });

    return () => unsubscribeFriends();
  }, [requests]);

  return { notifications, isLoading, tab, setTab };
};
