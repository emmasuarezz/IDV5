import { MappedAlbum, MappedTrack } from "../../../hooks/UseSearch";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "../../../styles/Components/previewCard.module.scss";

const containerWidth = 184;

function PreviewCard({
  result,
  setSelected,
}: {
  result: MappedTrack | MappedAlbum;
  setSelected: (value: MappedTrack | MappedAlbum | undefined) => void;
}) {
  const [overflowAmount, setOverflowAmount] = useState<boolean>(false);

  const trackTitleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const trackTitleWidth = trackTitleRef.current?.offsetWidth || 0;
    const overflow = trackTitleWidth - containerWidth > 0;

    if (overflow) {
      setOverflowAmount(overflow);
      console.log(overflow, result.name);
    }
  }, [result.name]);

  return (
    <div
      key={result.uid}
      className={styles.previewCard}
      tabIndex={0}
      onClick={() => setSelected(result)}
    >
      <img src={result.cover} alt="album" />
      <div className={styles.previewInfo}>
        <h2
          ref={trackTitleRef}
          className={overflowAmount ? styles.marqueeAnimation : ""}
        >
          {result.name}
        </h2>
        <p>{result.album}</p>
      </div>
    </div>
  );
}
export default PreviewCard;
