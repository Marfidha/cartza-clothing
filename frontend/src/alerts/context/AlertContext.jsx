import { createContext, useContext, useState } from "react";
import Toastalert from "../Components/Toastalert";
import Snackbar from "../Components/Snackbar";
import ModalAlert from "../Components/ModalAlert";


const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [modal, setModal] = useState(null);

  

  // ---------- TOAST ----------
  const showToast = (message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // ---------- SNACKBAR ----------
  const showSnackbar = (message, actionLabel, action) => {
    setSnackbar({ message, actionLabel, action });
    setTimeout(() => setSnackbar(null), 5000);
  };

  // ---------- MODAL ----------
  const showModal = (options) => setModal(options);
  const closeModal = () => setModal(null);

  return (
    <AlertContext.Provider
      value={{
        showToast,
        showSnackbar,
        showModal,
        closeModal,
      }}
    >
      {children}

      {/* 🔥 TOAST STACK */}
      <div className="fixed top-6 right-6 z-9999 flex flex-col gap-3">
        {toasts.map((t) => (
          <Toastalert
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() =>
              setToasts((prev) =>
                prev.filter((x) => x.id !== t.id)
              )
            }
          />
        ))}
      </div>

      {/* Other alerts */}
      <Snackbar snackbar={snackbar} />
      <ModalAlert
  isOpen={!!modal}
  onClose={closeModal}
  onConfirm={modal?.onConfirm}
  title={modal?.title}
  message={modal?.message}
  type={modal?.type}
/>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);