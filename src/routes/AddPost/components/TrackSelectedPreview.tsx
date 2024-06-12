import styles from "../../../styles/addPost.module.scss";
import { MappedTrack, MappedAlbum } from "../../../hooks/UseSearch";
import { useRef } from "react";

export default function TrackSelectedPreview({
  selected,
  isTrackSelected,
  setIsTrackSelected,
}: {
  selected: MappedTrack | MappedAlbum;
  isTrackSelected: boolean;
  setIsTrackSelected: (isTrackSelected: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play();
    }
  };
  const handlePause = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  };

  return (
    <section className={styles.selectionPreview}>
      <section className={styles.content}>
        <img
          onMouseEnter={() => {
            handlePlay();
          }}
          onMouseLeave={() => {
            handlePause();
          }}
          src={selected ? selected.cover : ""}
          alt="album cover"
        />
        <div>
          <h1>{selected ? selected.name : ""}</h1>
          <h2>{selected ? selected.album : ""}</h2>
          <p>{selected ? selected.artist : ""}</p>
        </div>
      </section>

      <button onClick={() => setIsTrackSelected(!isTrackSelected)}>{isTrackSelected ? "go back" : "continue"}</button>
      <audio ref={audioRef} src={selected.preview} style={{ display: "hidden" }}></audio>
    </section>
  );
}
