import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const tilesetImage = useMemo(() => new Image(), []);
  let canvas = document.querySelector("canvas") as HTMLCanvasElement;
  let tilesetContainer = document.querySelector(
    ".tileset-container"
  ) as HTMLDivElement;
  let tilesetSelection = document.querySelector(
    ".tileset-container_selection"
  ) as HTMLDivElement;

  let selection: [number, number] = [0, 0]; //Which tile we will paint from the menu

  let isMouseDown = false;
  let currentLayer = 0;
  let layers: { [key: string]: [number, number] }[] = [
    {}, // Initialize the first layer as an empty object
    {},
    {},
  ];

  const [tilesetImageLoaded, setTilesetImageLoaded] = useState(false);

  useEffect(() => {
    tilesetImage.onload = function () {
      setTilesetImageLoaded(true);
    };
    tilesetImage.src = "/assets/TileEditorSpritesheet.png";
    const tilesetSourceElement = document.getElementById(
      "tileset-source"
    ) as HTMLImageElement;
    tilesetSourceElement.src = tilesetImage.src;
  }, [tilesetImage]);

  useEffect(() => {
    if (tilesetImageLoaded) {
      tilesetImage.onload = function () {
        draw();
        setLayer(0);
      };
    }
  }, [tilesetImageLoaded]);

  //Select tile from the Tiles grid
  tilesetContainer?.addEventListener("mousedown", (event) => {
    selection = getCoords(event);
    tilesetSelection.style.left = selection[0] * 32 + "px";
    tilesetSelection.style.top = selection[1] * 32 + "px";
  });

  //Handler for placing new tiles on the map
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

  //Bind mouse events for painting (or removing) tiles on click/drag
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

  //Utility for getting coordinates of mouse click
  function getCoords(e: MouseEvent): [number, number] {
    let { x, y } = (e.target as HTMLElement).getBoundingClientRect();
    let mouseX = e.clientX - x;
    let mouseY = e.clientY - y;
    return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
  }

  //converts data to image:data string and pipes into new browser tab
  function exportImage() {
    let data = canvas.toDataURL();
    let image = new Image();
    image.src = data;

    let w = window.open("");
    w?.document.write(image.outerHTML);
  }

  // Reset state to empty
  function clearCanvas() {
    layers[0] = {};
    layers[1] = {};
    layers[2] = {};
    draw();
  }

  function setLayer(newLayer: number) {
    // Update the layer
    currentLayer = newLayer;

    // Update the UI to show updated layer
    let oldActiveLayer = document.querySelector(".layer.active");
    if (oldActiveLayer) {
      oldActiveLayer.classList.remove("active");
    }
    (
      document.querySelector(
        `[tile-layer="${currentLayer}"]`
      ) as HTMLButtonElement
    )?.classList.add("active");
  }

  function draw() {
    let ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log(canvas.width, canvas.height);

      let size_of_crop = 32;

      layers.forEach((layer) => {
        Object.keys(layer).forEach((key) => {
          //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
          let positionX = Number(key.split("-")[0]);
          let positionY = Number(key.split("-")[1]);
          let [tilesheetX, tilesheetY] = layer[key];

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
  }

  //Default image for booting up -> Just looks nicer than loading empty canvas

  return (
    <div className="card">
      <header>
        <h1>Tile Map Editor</h1>
        <div>
          <button className="button-as-link" onClick={clearCanvas}>
            Clear Canvas
          </button>
          <button className="primary-button" onClick={exportImage}>
            Export Image
          </button>
        </div>
      </header>
      <div className="card_body">
        <aside>
          <label>Tiles</label>
          <div className="tileset-container">
            <img id="tileset-source" crossOrigin="anonymous" alt="타일셋" />
            <div className="tileset-container_selection"></div>
          </div>
        </aside>
        <div className="card_right-column">
          <canvas width={480} height={480} />
          <p className="instructions">
            <strong>Click</strong> to paint.
            <strong>Shift+Click</strong> to remove.
          </p>
          <div>
            <label>Editing Layer: </label>
            <ul className="layers">
              <li>
                <button
                  className="layer"
                  tile-layer="2"
                  onClick={() => setLayer(2)}
                >
                  Top Layer
                </button>
              </li>
              <li>
                <button
                  className="layer"
                  tile-layer="1"
                  onClick={() => setLayer(1)}
                >
                  Middle Layer
                </button>
              </li>
              <li>
                <button
                  className="layer"
                  tile-layer="0"
                  onClick={() => setLayer(0)}
                >
                  Bottom Layer
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
