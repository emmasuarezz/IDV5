import { useEffect, useState } from "react";
import { auth } from "../firebase";

export type Friend = {
  uid: string;
  username: string;
  displayName: string;
};

export const useGetFriends = () => {
  const [friends, setFriends] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_SERVER}/fb/getFriends`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await response.json()) as string[];
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
