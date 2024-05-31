import { useRef } from "react";
import { MappedTrack } from "../../../hooks/UseSearch";
import styles from "../../../styles/Components/selectedCard.module.scss";

function SelectedCard({ track }: { track: MappedTrack }) {
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
    <a
      className={styles.selectedCard}
      href={track.spotify_url}
      target="_blank"
      onMouseEnter={() => handlePlay()}
      onMouseLeave={() => handlePause()}
    >
      <img src={track.cover} alt="" />
      <div>
        <h1>{track.name}</h1>
        <p>{track.artist}</p>
      </div>
      <audio ref={audioRef} src={track.preview} style={{ display: "hidden" }}></audio>
    </a>
  );
}

export default SelectedCard;
