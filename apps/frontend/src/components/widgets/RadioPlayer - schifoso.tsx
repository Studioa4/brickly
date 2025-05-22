// components/RadioPlayer.tsx
export default function RadioPlayer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 flex justify-center shadow z-50">
      <iframe
        src="https://myradioonline.it/widget"
        width="100%"
        height="100"
        frameBorder="0"
        allow="autoplay"
        className="w-full max-w-3xl"
        title="MyRadioOnline Widget"
      ></iframe>
    </footer>
  );
}
