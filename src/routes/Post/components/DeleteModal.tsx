import styles from "../../../styles/Components/deleteModal.module.scss";
import utils from "../../../styles/utils.module.scss";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

export default function DeleteModal({ id, setDeleteModal }: { id: string; setDeleteModal: (value: boolean) => void }) {
  const navigate = useNavigate();
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
      if (response.ok) {
        navigate("/dashboard");
      }
    } catch {
      console.error("Error deleting post");
    }
  };
  return (
    <div className={utils.modalBg}>
      <section className={styles.modal}>
        <p onClick={() => setDeleteModal(false)}>nevermind, go back</p>
        <div className={`${utils.flexCol} ${utils.icenter}`}>
          <h2>Are you sure you want to delete this post?</h2>
          <p>This action is irreversible</p>
        </div>
        <button className={`${styles.deletePost} ${utils.cta} ${utils.danger}`} onClick={() => handleDelete(id)}>
          delete post
        </button>
      </section>
    </div>
  );
}
