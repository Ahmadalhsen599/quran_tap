import React from "react";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import Verse from "../components/verse/verse.jsx";
import "./Layout.css";
import { usePopup } from "../context/PopupContext.jsx";
import { useState,useEffect } from "react";
const Layout=function(){
    const { activePopup, openPopup, closePopup } = usePopup();
    return(<div className="Main_layout" >
         {activePopup && (
    <div className="overlay" onClick={closePopup}>
      <div
        className="popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* محتوى النافذة */}
      </div>
    </div>
  )}
       <Navbar/>
    
       <Verse/>
     
       <Footer/>
    </div>);
}
export default Layout