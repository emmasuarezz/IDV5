import { useEffect, useState } from "react";
import { UserContextType } from "../contexts/UserContext";
import { auth } from "../firebase";
export const useSearchUser = () => {
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserContextType[]>([]);

  useEffect(() => {
    const searchUser = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_SERVER}/fb/searchUser/${search}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    searchUser();
  }, [search]);

  return { setSearch };
};
