import { useState } from "react";
import { MappedTrack, MappedAlbum } from "../../hooks/UseSearch";
import { CreatePost, Search, SearchUser } from "./components";

function AddPost() {
  const [selected, setSelected] = useState<MappedTrack | MappedAlbum | undefined>(undefined);
  const [isTrackSelected, setIsTrackSelected] = useState(false);
  const [isUser, setIsUser] = useState(false);
  //if the track isn't selected, the route renders the search component
  //if it is selected, the route renders the create post component
  return (
    <main>
      {isUser ? (
        <SearchUser isUser={isUser} setIsUser={setIsUser} />
      ) : !isTrackSelected ? (
        <Search
          selected={selected}
          setSelected={setSelected}
          isTrackSelected={isTrackSelected}
          setIsTrackSelected={setIsTrackSelected}
          setIsUser={setIsUser}
        />
      ) : (
        <CreatePost
          selected={selected}
          isTrackSelected={isTrackSelected}
          setIsTrackSelected={setIsTrackSelected}
          setSelected={setSelected}
        />
      )}
    </main>
  );
}

export default AddPost;
