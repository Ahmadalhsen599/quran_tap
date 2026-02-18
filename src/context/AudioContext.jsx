import { createContext, useContext, useRef, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const ayahAudio = useRef(null);
  const adhanAudio = useRef(null);

  const [ayahVolume, setAyahVolume] = useState(
    Number(localStorage.getItem("ayahVolume")) || 0.5
  );

  const [adhanVolume, setAdhanVolume] = useState(
    Number(localStorage.getItem("adhanVolume")) || 0.5
  );

  function changeAyahVolume(value) {
    setAyahVolume(value);
    localStorage.setItem("ayahVolume", value);
    if (ayahAudio.current) ayahAudio.current.volume = value;
  }

  function changeAdhanVolume(value) {
    setAdhanVolume(value);
    localStorage.setItem("adhanVolume", value);
    if (adhanAudio.current) adhanAudio.current.volume = value;
  }

  return (
    <AudioContext.Provider
      value={{
        ayahAudio,
        adhanAudio,
        ayahVolume,
        adhanVolume,
        changeAyahVolume,
        changeAdhanVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);