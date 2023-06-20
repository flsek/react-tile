export default function HeaderDialog({ clearCanvas, exportImage }: {
    clearCanvas: () => void;
    exportImage: () => void;
}) {
  return (
    <header>
      <h1>맵 에디터</h1>
      <div>
        <button className="button-as-link" onClick={clearCanvas}>
          다시하기
        </button>
        <button className="primary-button" onClick={exportImage}>
          미리보기
        </button>
      </div>
    </header>
  );
}
