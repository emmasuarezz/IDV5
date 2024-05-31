import { MappedTrack } from "../../../hooks/UseSearch";
import styles from "../../../styles/Components/selectedCard.module.scss";

function SelectedCard({ track }: { track: MappedTrack }) {
  return (
    <div className={styles.selectedCard}>
      <img src={track.cover} alt="" />
      <div>
        <h1>{track.name}</h1>
        <p>{track.artist}</p>
      </div>
    </div>
  );
}

export default SelectedCard;
