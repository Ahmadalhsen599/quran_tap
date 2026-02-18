import React, { useEffect, useState } from "react";
import { FaVolumeUp, FaCog, FaPaintRoller, FaBookmark, FaLeaf, FaTimes } from "react-icons/fa";
import { usePopup } from "../../context/PopupContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import "./footer.css";

const Footer = function () {

  const { activePopup, openPopup, closePopup } = usePopup();

  const {
    ayahVolume,
    adhanVolume,
    changeAyahVolume,
    changeAdhanVolume
  } = useAudio();

  const my_background = [
    "/image-6-DXoPmvju.png",
    "/image-8-BWMmF9yc.png",
    "/MasjidNabawi.jpg",
    "/image-0-DG0ritwv.png",
    "/image-3-B6164L1c.png",
    "/image-4-uO-OL_Bk.png",
    "/image-2-C8Ai7yYU.png",
    "/image-7-Bpr2sKcS.png"
  ];

  // تحميل الخلفية المحفوظة
  useEffect(() => {
    const savedUrl = localStorage.getItem("url");
    const main_body = document.getElementById("main_body");
    if (savedUrl && main_body) {
      main_body.style.backgroundImage = `url('${savedUrl}')`;
    }
  }, []);

  function change_background(i) {
    const newUrl = my_background[i];
    localStorage.setItem("url", newUrl);
    const main_body = document.getElementById("main_body");
    if (main_body) {
      main_body.style.backgroundImage = `url('${newUrl}')`;
    }
  }

  return (
    <div className="footer">

      <div className="leftside">
        <FaCog color="white" size={23} />
        <FaVolumeUp color="white" size={23} onClick={() => openPopup("soundMenu")} />
        <FaPaintRoller color="white" size={23} onClick={() => openPopup("chBk")} />
      </div>

      <div className="rightside">
        <FaBookmark color="white" size={23} />
        <button className="bu1">
          شارك الثواب <FaLeaf color="green" />
        </button>
      </div>

      {/* تغيير الخلفية */}
      <div className={activePopup === "chBk" ? "change_background" : "change_background none"}>
        <div className="change_nav">
          <FaTimes className="closeicon" onClick={closePopup} color="white" />
          <p className="display_setting">إعدادات العرض</p>
        </div>

        <p className="p1">الخلفية</p>

        <div className="background_type">
          {my_background.map((data, index) => (
            <img
              key={index}
              onClick={() => change_background(index)}
              className="my_bk"
              src={data}
              alt=""
            />
          ))}
        </div>
      </div>

      {/* التحكم بالصوت */}
      <div className={activePopup === "soundMenu" ? "sound_popup" : "sound_popup none"}>
        <div className="sound_nav">
          <FaTimes className="closeicon" onClick={closePopup} />
        </div>

        <p>مستوى صوت الأذان</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={adhanVolume}
          onChange={(e) => changeAdhanVolume(parseFloat(e.target.value))}
          className="slider"
        />

        <p>مستوى صوت الآية</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={ayahVolume}
          onChange={(e) => changeAyahVolume(parseFloat(e.target.value))}
          className="slider"
        />
      </div>

    </div>
  );
};

export default Footer;
