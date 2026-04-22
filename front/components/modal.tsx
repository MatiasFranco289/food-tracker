import { Dispatch, SetStateAction } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({
  isOpen,
  title,
  message,
  setModalOpen,
}: ModalProps) {
  return (
    <div
      className={`fixed w-screen h-screen z-50 flex justify-center items-center 
        bg-black/20 backdrop-blur-xs duration-1000 ${isOpen ? "visible" : "hidden"}`}
    >
      <div className="bg-slate-900 py-6 px-16 flex flex-col items-center space-y-2 rounded-xl">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p>{message}</p>

        <div className="w-full flex justify-center mt-2">
          <button
            className="border border-white w-full rounded-xl p-2 cursor-pointer hover:bg-slate-950 duration-200"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
