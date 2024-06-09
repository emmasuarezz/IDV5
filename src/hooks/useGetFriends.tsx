import { useEffect, useState } from "react";
import { auth } from "../firebase";

export type Friend = {
  uid: string;
  username: string;
  displayName: string;
  thumbnail: string;
};

export const useGetFriends = (uid: string) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_SERVER}/fb/getFriends/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await response.json()) as Friend[];
        setFriends(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriends();
  }, []);

  return { friends, isLoading };
};
