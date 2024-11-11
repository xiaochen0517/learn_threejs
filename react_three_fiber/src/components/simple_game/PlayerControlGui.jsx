import {Html} from "@react-three/drei";
import KeyboardButton from "../../view/KeyboardButton.jsx";

export default function PlayerControlGui() {

  const triggerKeyboardEvent = (key, keyCode, eventType = "keydown") => {
    const event = new KeyboardEvent(eventType, {
      key: key,
      code: keyCode,
      keyCode: keyCode,
      which: keyCode,
    });
    window.dispatchEvent(event);
  };

  return <>
    <Html fullscreen>
      <div className="w-full h-full p-2 flex items-end justify-center">
        <div className="p-2 flex flex-row gap-2 bg-neutral-700 bg-opacity-20 rounded-md">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center">
              <KeyboardButton
                onMouseDown={() => triggerKeyboardEvent("w", "KeyW")}
                onMouseUp={() => triggerKeyboardEvent("w", "KeyW", "keyup")}
              >W</KeyboardButton>
            </div>
            <div className="flex gap-2">
              <KeyboardButton
                onMouseDown={() => triggerKeyboardEvent("a", "KeyA")}
                onMouseUp={() => triggerKeyboardEvent("a", "KeyA", "keyup")}
              >A</KeyboardButton>
              <KeyboardButton
                onMouseDown={() => triggerKeyboardEvent("s", "KeyS")}
                onMouseUp={() => triggerKeyboardEvent("s", "KeyS", "keyup")}
              >S</KeyboardButton>
              <KeyboardButton
                onMouseDown={() => triggerKeyboardEvent("d", "KeyD")}
                onMouseUp={() => triggerKeyboardEvent("d", "KeyD", "keyup")}
              >D</KeyboardButton>
            </div>
          </div>
          <div className="flex flex-row items-end">
            <KeyboardButton
              className="w-36"
              onMouseDown={() => triggerKeyboardEvent("space", "Space")}
              onMouseUp={() => triggerKeyboardEvent("space", "Space", "keyup")}
            >Space</KeyboardButton>
          </div>
        </div>
      </div>
    </Html>
  </>;
}
