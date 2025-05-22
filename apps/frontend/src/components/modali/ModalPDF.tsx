import React from "react";

type ModalPDFProps = {
  fileUrl: string;
  onClose: () => void;
  nomeFile?: string;
};

export default function ModalPDF({ fileUrl, onClose, nomeFile = "documento.pdf" }: ModalPDFProps) {
  const stampa = () => {
    const win = window.open(fileUrl, "_blank", "width=800,height=1000");
    win?.print();
  };

  const salva = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = nomeFile;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-xl font-bold mb-4">Anteprima PDF</h2>
        <iframe src={fileUrl} className="w-full h-[500px] border mb-4" />
        <div className="flex justify-end gap-3">
          <button onClick={stampa} className="bg-blue-600 text-white px-4 py-2 rounded">Stampa</button>
          <button onClick={salva} className="bg-green-600 text-white px-4 py-2 rounded">Salva</button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Annulla</button>
        </div>
      </div>
    </div>
  );
}
