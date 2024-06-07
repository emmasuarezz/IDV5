import styles from "../../../styles/addPost.module.scss";
import { MappedTrack, MappedAlbum } from "../../../hooks/UseSearch";

export default function trackSelectedPreview({
  selected,
  isTrackSelected,
  setIsTrackSelected,
}: {
  selected: MappedTrack | MappedAlbum;
  isTrackSelected: boolean;
  setIsTrackSelected: (isTrackSelected: boolean) => void;
}) {
  return (
    <section className={styles.selectionPreview}>
      <section className={styles.content}>
        <img src={selected ? selected.cover : ""} alt="album cover" />
        <div>
          <h1>{selected ? selected.name : ""}</h1>
          <h2>{selected ? selected.album : ""}</h2>
          <p>{selected ? selected.artist : ""}</p>
        </div>
      </section>

      <button onClick={() => setIsTrackSelected(!isTrackSelected)}>{isTrackSelected ? "go back" : "continue"}</button>
    </section>
  );
}
