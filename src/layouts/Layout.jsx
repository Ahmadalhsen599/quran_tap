import React from "react";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import Verse from "../components/verse/verse.jsx";
import "./Layout.css";
import { useState,useEffect } from "react";
const Layout=function(){
    return(<div className="Main_layout">
       <Navbar/>
    
       <Verse/>
     
       <Footer/>
    </div>);
}
export default Layout