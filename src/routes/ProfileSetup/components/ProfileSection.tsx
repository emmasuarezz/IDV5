import styles from "../../../styles/profileSetup.module.scss";

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section_info}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default ProfileSection;
