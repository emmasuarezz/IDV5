import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  });

  return { user, setUser };
};
