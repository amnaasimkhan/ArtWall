import { Rnd } from "react-rnd";
import { useState } from "react";
import picture_2 from "../../assets/hero_2.jpg";
import "../../stylesheets/galleryeditor.scss";
import { Button } from "@mui/material";

const GalleryEditor = ({ onFreeze, bgImage }) => {
  const [rect, setRect] = useState({
    x: 100,
    y: 100,
    width: 150,
    height: 250,
  });

  const [frozenRects, setFrozenRects] = useState([]);

  function freezeRect() {
    const img = document.querySelector(".room-img");
    const imgW = img.offsetWidth;
    const imgH = img.offsetHeight;

    const newRect = {
      x: (rect.x / imgW) * 100,
      y: (rect.y / imgH) * 100,
      width: (rect.width / imgW) * 100,
      height: (rect.height / imgH) * 100,
      size: null,
    };

    const updated = [...frozenRects, newRect];
    setFrozenRects(updated);
    onFreeze(updated);
  }

  return (
    <div className="room-container">
      <div style={{ position: "relative" }}>
        <img
          src={`/api/images/${bgImage}`}
          className="room-img"
          alt=""
          style={{
            width: "800px",      
            height: "400px",     
            objectFit: "cover",  
            display: "block"
          }}
        />

        {frozenRects.map((r, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: `${r.width}%`,
              height: `${r.height}%`,
              border: "2px solid black",
              boxSizing: "border-box",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "0",
                background: "black",
                color: "white",
                padding: "2px 6px",
                fontSize: "12px",
                borderRadius: "3px",
              }}
            >
              {index + 1}
            </div>
          </div>
        ))}

        <Rnd
          bounds="parent"
          size={{ width: rect.width, height: rect.height }}
          position={{ x: rect.x, y: rect.y }}
          onDragStop={(e, d) => setRect({ ...rect, x: d.x, y: d.y })}
          onResizeStop={(e, dir, ref, delta, pos) =>
            setRect({
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              x: pos.x,
              y: pos.y,
            })
          }
        >
          <div className="drag-rect"></div>
        </Rnd>
      </div>

      <Button onClick={freezeRect} variant="contained" sx={{ mt: 2, bgcolor: "contrast.main" }}>
        Freeze Frame
      </Button>
    </div>
  );
};

export default GalleryEditor;
