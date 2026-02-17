import Cropper from "react-easy-crop";
import { useState } from "react";
import getCroppedImg from "../../utils/cropImage";

type Props = {
  image: string;
  onSave: (img: string) => void;
  onClose: () => void;
};

function PhotoCropper({
  image,
  onSave,
  onClose,
}: Props) {
  const [crop, setCrop] =
    useState({ x: 0, y: 0 });

  const [zoom, setZoom] =
    useState(1);

  const [croppedArea, setCroppedArea] =
    useState<any>(null);

  const onCropComplete = (
    _: any,
    croppedPixels: any
  ) => {
    setCroppedArea(
      croppedPixels
    );
  };

  const handleSave =
    async () => {
      const croppedImg =
        await getCroppedImg(
          image,
          croppedArea
        );

      onSave(croppedImg);
    };

  return (
    <div className="cropper-overlay">

      {/* MODAL */}
      <div className="cropper-modal">

        {/* CROP AREA */}
        <div className="cropper-container">

          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={
              onCropComplete
            }
          />

        </div>

        {/* CONTROLS */}
        <div className="cropper-controls">

          {/* <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) =>
              setZoom(
                Number(
                  e.target.value
                )
              )
            }
          /> */}

          <div className="cropper-buttons">

            <button
              onClick={onClose}
              className="cancel-btn"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="save-btn"
            >
              Save
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default PhotoCropper;
