import styles from "../../../styles/Components/deleteModal.module.scss";
import utils from "../../../styles/utils.module.scss";
import { auth } from "../../../firebase";

const handleDelete = async (id: string) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${import.meta.env.VITE_SERVER}/fb/deletePost/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
  } catch {
    console.error("Error deleting post");
  }
};

export default function DeleteModal({ id, setDeleteModal }: { id: string; setDeleteModal: (value: boolean) => void }) {
  console.log(id);
  return (
    <div className={styles.modal}>
      <p onClick={() => setDeleteModal(false)}>nevermind, go back</p>
      <div className={`${utils.flexCol} ${utils.icenter}`}>
        <h2>Are you sure you want to delete this post?</h2>
        <p>This action is irreversible</p>
      </div>
      <button className={`${styles.deletePost} ${utils.cta} ${utils.danger}`} onClick={() => handleDelete(id)}>
        delete post
      </button>
    </div>
  );
}
