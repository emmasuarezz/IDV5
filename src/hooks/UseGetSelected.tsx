import { useState, useEffect } from "react";
import { MappedTrack, mapTracks } from "./UseSearch";
import { auth } from "../firebase";

function useGetSelected() {
  const [selected, setSelected] = useState<MappedTrack[] | undefined>([]);
  useEffect(() => {
    const fetchSelectedTracks = async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(import.meta.env.VITE_SERVER + "/spotify/selected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSelected(mapTracks(data));
    };
    fetchSelectedTracks();
  }, []);
  return { selected };
}

export default useGetSelected;
