import React, { createContext, useState, useContext } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [activePopup, setActivePopup] = useState(null);

  const openPopup = (popupName) => {
    setActivePopup(popupName);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <PopupContext.Provider value={{ activePopup, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
