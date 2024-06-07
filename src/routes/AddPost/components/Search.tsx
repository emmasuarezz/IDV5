import styles from "../../../styles/addPost.module.scss";
import utils from "../../../styles/utils.module.scss";
import { PreviewCard, Searchbar } from ".";
import useSearch from "../../../hooks/UseSearch";
import { MappedAlbum, MappedTrack } from "../../../hooks/UseSearch";
import { TrackSelectedPreview } from ".";

export default function SearchComponent({
  selected,
  setSelected,
  isTrackSelected,
  setIsTrackSelected,
  setIsUser,
}: {
  selected: MappedTrack | MappedAlbum | undefined;
  setSelected: (selected: MappedTrack | MappedAlbum | undefined) => void;
  isTrackSelected: boolean;
  setIsTrackSelected: (isTrackSelected: boolean) => void;
  setIsUser: (isUser: boolean) => void;
}) {
  const { setSearch, searchResults, setIsTrack, isTrack, isLoading } = useSearch();

  return (
    <>
      <section className={styles.selectPost}>
        <h1 className={styles.title}>What are we sharing today?</h1>
        {/* Type of post selector */}
        <ul className={utils.icenter}>
          <li className={isTrack ? styles.active : styles.notActive} onClick={() => setIsTrack(true)}>
            Track
          </li>
          <p>or</p>
          <li className={!isTrack ? styles.active : styles.notActive} onClick={() => setIsTrack(false)}>
            Album
          </li>
          <p>//</p>
          <li className={styles.notActive} style={{ fontSize: "1.2rem" }} onClick={() => setIsUser(true)}>
            search for an user
          </li>
        </ul>
        <Searchbar setSearch={setSearch} isTrack={isTrack} />
      </section>

      {isLoading ? (
        <section className={utils.loadingState}>
          <h1>Searching for {isTrack ? "track" : "album"}...</h1>
          <h2>It won't take long</h2>
        </section>
      ) : searchResults.length == 0 ? null : (
        <section className={`${styles.preview}`}>
          <h1 className={styles.title}>Results</h1>
          <section className={styles.results}>
            {searchResults.map((result) => (
              <PreviewCard key={result.uid} result={result} setSelected={setSelected} />
            ))}
          </section>
        </section>
      )}

      {selected && (
        <TrackSelectedPreview
          selected={selected}
          isTrackSelected={isTrackSelected}
          setIsTrackSelected={setIsTrackSelected}
        />
      )}
    </>
  );
}
