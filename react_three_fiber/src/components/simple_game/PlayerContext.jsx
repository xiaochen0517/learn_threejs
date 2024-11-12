import React, {createContext, useRef} from "react";

export const PlayerContext = createContext(null);

export default function PlayerProvider({children}) {
  const playBodyRef = useRef();

  return (
    <PlayerContext.Provider value={playBodyRef}>
      {children}
    </PlayerContext.Provider>
  );
};
