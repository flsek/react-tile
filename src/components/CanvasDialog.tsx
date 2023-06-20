import { useEffect, useRef, useState } from "react";

type Layer = { [key: string]: [number, number] };

export default function CanvasDialog({
  tilesetImage,
  setLayer,
}: {
  tilesetImage: HTMLImageElement;
    setLayer: (layer: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let [isMouseDown, setIsMouseDown] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([{}, {}, {}]);
  const [currentLayer, setCurrentLayer] = useState<number>(0);
  const [selection, setSelection] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;

    function addTile(mouseEvent: MouseEvent) {
      const clicked = getCoords(mouseEvent);
      const key = `${clicked[0]}-${clicked[1]}`;

      if (mouseEvent.shiftKey) {
        delete layers[currentLayer][key];
      } else {
        layers[currentLayer][key] = [selection[0], selection[1]];
      }
      draw();
    }

    // 클릭/드래그로 타일을 그리거나 제것하는 마우스 이벤트 바인딩
    canvas?.addEventListener("mousedown", () => {
      isMouseDown = true;
    });
    canvas?.addEventListener("mouseup", () => {
      isMouseDown = false;
    });
    canvas?.addEventListener("mouseleave", () => {
      isMouseDown = false;
    });
    canvas?.addEventListener("mousedown", addTile);
    canvas?.addEventListener("mousemove", (event) => {
      if (isMouseDown) {
        addTile(event);
      }
    });
  }, [currentLayer, isMouseDown, selection]);

  // 마우스 클릭 위치의 좌표를 가져오는 유틸리티 함수
  const getCoords = (e: MouseEvent): [number, number] => {
    const { x, y } = (e.target as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - x;
    const mouseY = e.clientY - y;
    return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
  };

  // 그리기 로직
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      const size_of_crop = 32;

      layers.forEach((layer) => {
        Object.keys(layer).forEach((key) => {
          // key에서 x, y 위치 설정 ("3-4" -> x=3, y=4)
          const positionX = Number(key.split("-")[0]);
          const positionY = Number(key.split("-")[1]);
          const [tilesheetX, tilesheetY] = layer[key];

          ctx?.drawImage(
            tilesetImage,
            tilesheetX * 32,
            tilesheetY * 32,
            size_of_crop,
            size_of_crop,
            positionX * 32,
            positionY * 32,
            size_of_crop,
            size_of_crop
          );
        });
      });
    }
  };

  return (
    <>
      <canvas ref={canvasRef} width={480} height={480} />
      <p className="instructions">
            <strong>Click</strong> 그리기.
            <strong>Shift+Click</strong> 지우기.
          </p>
          <div>
            <label>Editing Layer: </label>
            <ul className="layers">
              <li>
                <button
                  className="layer-button"
                  tile-layer="2"
                  onClick={() => setLayer(2)}
                >
                  상위 레이어
                </button>
              </li>
              <li>
                <button
                  className="layer-button"
                  tile-layer="1"
                  onClick={() => setLayer(1)}
                >
                  중간 레이어
                </button>
              </li>
              <li>
                <button
                  className="layer-button"
                  tile-layer="0"
                  onClick={() => setLayer(0)}
                >
                  레이어
                </button>
              </li>
            </ul>
          </div>
    </>
  );
}
