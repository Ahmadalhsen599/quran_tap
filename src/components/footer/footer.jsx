 import React, { useRef } from "react";
 import { useState,useEffect } from "react";
 import { FaVolumeUp, FaCog ,FaPaintRoller } from 'react-icons/fa';
 import { FaBookmark } from 'react-icons/fa';
 import { FaLeaf } from "react-icons/fa";
 import { FaTimes } from "react-icons/fa";
 import "./footer.css"
import { colors } from "@mui/material";
 const  Footer=function(){
     const [acive_changeBk,setacive_changeBk]=useState(false);
     const my_background = [
        "./../../image-6-DXoPmvju.png",
        "./../../image-8-BWMmF9yc.png",
        "./../../MasjidNabawi.jpg",
        "./../../image-0-DG0ritwv.png",
        "./../../image-3-B6164L1c.png",
        "./../../image-4-uO-OL_Bk.png",
        "./../../image-2-C8Ai7yYU.png",
        "./../../image-7-Bpr2sKcS.png"
    ];
    // عند تحميل المكون، اقرأ القيمة المحفوظة وطبقها
        const savedUrl = localStorage.getItem("url");
        const main_body = document.getElementById("main_body");
        if (savedUrl && main_body) {
            main_body.style.backgroundImage = `url('${savedUrl}')`;
        }
    // مصفوفة التبعيات الفارغة [] تضمن أن هذا يعمل مرة واحدة عند التحميل
    function change_background(i) {
        const newUrl = my_background[i];
        localStorage.setItem("url", newUrl);
        const main_body = document.getElementById("main_body");
        if (main_body) {
            main_body.style.backgroundImage = `url('${newUrl}')`;
        }
    }
    function activate_changepk(){
        setacive_changeBk(!acive_changeBk);
    }
    return(
<div className="footer">
<div className="leftside"> 
    <FaCog  color="white" size={23}/> 
    <FaVolumeUp  color="white" size={23}/>
    <FaPaintRoller color="white" size={23} onClick={activate_changepk}/>
</div>
<div className="rightside">
<FaBookmark color="white" size={23}/>
<button className="bu1">
شارك الثواب
<FaLeaf color="green"/>
</button>
</div>
 <div className={ acive_changeBk? "change_background":"change_background none"}>
<div className= {  "change_nav"} >
<FaTimes className="closeicon" onClick={activate_changepk} color="white"/>
<p className="display_setting">إعدادات العرض
</p>
</div>
<p className="p1">الخلفية</p>
<div className="background_type">
    {my_background.map((data,index)=>{return(<img key={index} onClick={()=>change_background(index)} className="my_bk" src={data}></img>)})}
     </div>
</div>
    </div>
)
 }
 export default Footer