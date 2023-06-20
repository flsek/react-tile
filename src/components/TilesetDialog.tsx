import React, { useEffect } from "react";

export default function TilesetDialog({
  tilesetImage,
  setLayer,
}: {
  tilesetImage: HTMLImageElement;
  setLayer: (layer: number) => void;
}) {
  const tilesetContainerRef = React.useRef<HTMLDivElement>(null);
  const tilesetSelectionRef = React.useRef<HTMLDivElement>(null);
  let selection: [number, number] = [0, 0];

  useEffect(() => {
    const tilesetContainer = tilesetContainerRef.current;
    const tilesetSelection = tilesetSelectionRef.current;

    // 타일 그리드에서 타일 선택
    const handleMouseDown = (event: MouseEvent) => {
      selection = getCoords(event);
      if (tilesetSelection) {
        tilesetSelection.style.left = selection[0] * 32 + "px";
        tilesetSelection.style.top = selection[1] * 32 + "px";
      }
    };

    tilesetContainer?.addEventListener("mousedown", handleMouseDown);

    return () => {
      tilesetContainer?.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // 마우스 클릭 위치의 좌표를 가져오는 유틸리티 함수
  const getCoords = (e: MouseEvent): [number, number] => {
    const { x, y } = (e.target as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - x;
    const mouseY = e.clientY - y;
    return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
  };

  return (
    <aside>
      <label>타일셋</label>
      <div className="tileset-container" ref={tilesetContainerRef}>
        <img
          id="tileset-source"
          crossOrigin="anonymous"
          alt="타일셋"
          src={tilesetImage.src}
        />
        <div
          className="tileset-container_selection"
          ref={tilesetSelectionRef}
        ></div>
      </div>
    </aside>
  );
}
