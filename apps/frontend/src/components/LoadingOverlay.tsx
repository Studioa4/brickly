const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 flex items-center justify-center">
      <img src="/icon.png" alt="loading" className="h-10 w-10" />
    </div>
    <p className="mt-4 text-blue-700 font-semibold">Attendere...</p>
  </div>
);
export default LoadingOverlay;
