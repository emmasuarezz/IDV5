import { useEffect, useState } from "react";
import { auth } from "../firebase";
export type SearchUserType = {
  id: string;
  displayName: string;
  avatar: string;
  username: string;
};

export const useSearchUser = () => {
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchUserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const searchUser = async () => {
      setIsLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_SERVER}/fb/searchUser/${search}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await res.json()) as SearchUserType[];
        setSearchResults(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    if (search) {
      searchUser();
    }
  }, [search]);

  return { setSearch, searchResults, isLoading };
};
