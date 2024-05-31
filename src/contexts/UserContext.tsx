import { ReactNode, createContext, useContext, useState } from "react";
import useGetSelected from "../hooks/UseGetSelected";
import { MappedTrack } from "../hooks/UseSearch";

type Props = {
  children: ReactNode;
};
export type UserContextType = {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  banner: string;
  thumbnail: string;
  username: string;
  pronouns: string;
  dateOfBirth: string;
};
type UserContextProps = {
  user: UserContextType | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserContextType | undefined>>;
  selected: MappedTrack[] | undefined;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<UserContextType | undefined>(undefined);
  const { selected } = useGetSelected();

  return <UserContext.Provider value={{ user, setUser, selected }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
