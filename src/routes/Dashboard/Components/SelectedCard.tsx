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
    <div className={styles.selectedCard}>
      <img onMouseEnter={() => handlePlay()} onMouseLeave={() => handlePause()} src={track.cover} alt="" />
      <div>
        <a target="_blank" href={track.spotify_url}>
          {track.name}
        </a>
        <p>{track.artist}</p>
      </div>
      <audio ref={audioRef} src={track.preview} style={{ display: "hidden" }}></audio>
    </div>
  );
}

export default SelectedCard;
