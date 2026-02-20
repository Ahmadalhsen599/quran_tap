import React, { useState, useEffect, useRef } from "react";
import { MdSpeed } from "react-icons/md";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import {
  FiShuffle,
  FiSkipBack,
  FiSkipForward,
  FiRepeat,
  FiMoreHorizontal
} from "react-icons/fi";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { FaMosque } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import "./verse.css";
import { usePopup } from "../../context/PopupContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
const Verse = function () {
  const today = new Date();
  const { activePopup, openPopup, closePopup } = usePopup();
  const getTodayDate = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };
  const countries = [ "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Bangladesh", "Brazil", "Canada", "Chile", "China", "Egypt", "France", "Germany", "India", "Indonesia", "Iraq", "Italy", "Jordan", "Kenya", "Malaysia", "Netherlands", "Nigeria", "Pakistan", "Qatar", "Saudi Arabia", "South Africa", "Spain", "Syria", "Turkey", "United Arab Emirates", "United Kingdom", "United States", "Yemen"]; // مصفوفة الدول
  const cities = [ "Damascus", "Aleppo", "Homs", "Latakia", "Baghdad", "Dubai", "Istanbul", "London", "New York", "Paris", "Cairo", "Karachi", "Islamabad", "Riyadh", "Jeddah", "Kuala Lumpur", "Jakarta", "Dhaka", "Beirut", "Manama", "Doha", "Kuwait City", "Amman", "Tunis", "Algiers", "Casablanca"];    // مصفوفة المدن
  const [verse_ayah, setverse_ayah] = useState([]);
  const [number_of_ayah, setnumber_of_ayah] = useState(0);
  const [current_surah, setcurrent_surah] = useState("");
  const [quran_verses, setquran_verses] = useState([]);
  const [current_verse_length, setcurrent_verse_length] = useState(0);
  const [active_addan, setactiveaddan] = useState(false);
  const [prayer_time_setting, setprayer_time_setting] = useState(false);
  const [city, setcity] = useState("Damascus");
  const [country, setcountry] = useState("Syria");
  const [salaTime, setsallaTime] = useState([]);
  const [index, setindex] = useState(0);
  const { ayahAudio, adhanAudio } = useAudio();
  const audio = ayahAudio;
  const addan_sound = adhanAudio;
  const [vers_sound_index, setVerse_sound_index] = useState(1);
  const [surah_index, setsurah_index] = useState(1);
  const [active, setActive] = useState(false);
  const [active_change_vers, setactivechangevrs] = useState(false);
  const [surah, setSurah] = useState({});
  const pendingAyahRef = useRef(null);
const [showSearch, setShowSearch] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [allAyahs, setAllAyahs] = useState([]);


  // حالات جديدة للسرعة والتكرار
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);        // سرعة التشغيل الحالية
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);     // إظهار/إخفاء قائمة السرعة
  const [repeat, setRepeat] = useState(false);                   // حالة التكرار

  function deactivate() {
    setActive(!active);
  }

  useEffect(() => {
    axios.get(`https://api.alquran.cloud/v1/surah/${surah_index}/ar.alafasy`)
      .then((data) => {
        const ayahs = data.data.data.ayahs;
        setSurah(ayahs);
        setcurrent_verse_length(ayahs.length);

        if (pendingAyahRef.current !== null) {
          if (pendingAyahRef.current === "last") {
            setindex(ayahs.length - 1);
          } else {
            const targetAyah = pendingAyahRef.current;
            if (targetAyah >= 1 && targetAyah <= ayahs.length) {
              setindex(targetAyah - 1);
            }
          }
          pendingAyahRef.current = null;
        }
      });
  }, [surah_index]);
useEffect(() => {
  axios.get("https://api.alquran.cloud/v1/quran/ar.alafasy")
    .then(res => {
      const surahs = res.data.data.surahs;
      const ayahs = [];
      surahs.forEach(surah => {
        surah.ayahs.forEach(ayah => {
          ayahs.push({
            text: ayah.text,
            surahNumber: surah.number,
            surahName: surah.name,
            ayahNumber: ayah.numberInSurah
          });
        });
      });
      setAllAyahs(ayahs);
    });
}, []);
useEffect(() => {
  if (searchTerm.trim() === "") {
    setSearchResults([]);
    return;
  }

  const filtered = allAyahs.filter(ayah =>
    ayah.text.includes(searchTerm)
  );

  setSearchResults(filtered.slice(0, 50)); // عرض أول 50 نتيجة فقط
}, [searchTerm]);
function handleSearchResultClick(result) {
  setsurah_index(result.surahNumber);
  pendingAyahRef.current = result.ayahNumber;
  setShowSearch(false);
  setSearchTerm("");
}

  const handleNext = () => {
    if (index < surah.length - 1) {
      setindex(prev => prev + 1);
    } else {
      setsurah_index(prev => prev + 1);
      setindex(0);
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      setindex(prev => prev - 1);
    } else if (surah_index > 1) {
      const previousSurahNumber = surah_index - 1;
      pendingAyahRef.current = "last";
      setsurah_index(previousSurahNumber);
    }
  };

  useEffect(() => {
    axios.get("https://api.alquran.cloud/v1/surah").then((response) => {
      setquran_verses(response.data.data);
    });
  }, []);

  // تحميل الصوت عند تغير الآية أو السورة
  useEffect(() => {
    if (!audio.current) return;
    if (!surah[index]) return;

    const verseNumber = surah[index].number;
    const verseAudio = `/api/audio/quran/audio/64/ar.abdulsamad/${verseNumber}.mp3`;

    audio.current.src = verseAudio;
    audio.current.load();
    audio.current.playbackRate = playbackSpeed; // تطبيق السرعة الحالية

    if (active) {
      audio.current.play().catch(err => console.log(err));
    }
  }, [index, surah, active, playbackSpeed]); // أضفنا playbackSpeed كتأثير عند تغيير السرعة

  // دالة تشغيل/إيقاف الصوت
  async function ActivateSound() {
    if (!audio.current) return;
    if (!surah[index]) return;

    const verseNumber = surah[index].number;
    const verseAudio = `/api/audio/quran/audio/64/ar.abdulsamad/${verseNumber}.mp3`;

    audio.current.src = verseAudio;
    audio.current.load();
    audio.current.playbackRate = playbackSpeed;

    if (!active) {
      try {
        await audio.current.play();
        setActive(true);
      } catch (err) {
        console.log("Audio play error:", err);
      }
    } else {
      audio.current.pause();
      setActive(false);
    }
  }

  // دالة التكرار (تبديل الحالة)
  const toggleRepeat = () => {
    setRepeat(prev => !prev);
  };

  // دالة إظهار/إخفاء قائمة السرعة
  const toggleSpeedMenu = () => {
    // setShowSpeedMenu(prev => !prev);
    if(activePopup==="speedMenu"){
    closePopup();
    }
    else
      openPopup("speedMenu");
    
  };

  // دالة تغيير السرعة
  const setSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (audio.current) {
      audio.current.playbackRate = speed;
    }
    setShowSpeedMenu(false); // إخفاء القائمة بعد الاختيار
  };

  // تطبيق السرعة عند تغييرها عبر useEffect (احتياطي)
  useEffect(() => {
    if (audio.current) {
      audio.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // باقي دوال الصلاة والأذان (كما هي)
  useEffect(() => {
    if (!city || !country) return;

    axios.get(
      `https://api.aladhan.com/v1/timingsByCity/${getTodayDate()}`,
      {
        params: {
          city: city,
          country: country,
          method: 3
        }
      }
    )
      .then(res => {
        setsallaTime(res.data.data.timings);
      })
      .catch(err => {
        console.error("Error fetching prayer times:", err);
      });
  }, [city, country]);

  useEffect(() => {
    let timeoutId = null;
    
    const scheduleNextCheck = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const prayerTimes = [
        convertToMinutes(salaTime.Fajr),
        convertToMinutes(salaTime.Dhuhr),
        convertToMinutes(salaTime.Asr),
        convertToMinutes(salaTime.Maghrib),
        convertToMinutes(salaTime.Isha)
      ].filter(time => time > 0);
      
      const futurePrayers = prayerTimes.filter(time => time > currentMinutes);
      const nextPrayerTime = futurePrayers.length > 0 
        ? Math.min(...futurePrayers)
        : prayerTimes[0] + 1440;
      
      const minutesUntilNextPrayer = nextPrayerTime - currentMinutes;
      
      if (minutesUntilNextPrayer > 0) {
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000;
        
        timeoutId = setTimeout(() => {
          checkCurrentPrayerTime();
          scheduleNextCheck();
        }, msUntilNextMinute);
      }
    };
    
    const checkCurrentPrayerTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      const prayers = [
        { name: "الفجر", time: convertTo24Hour(salaTime.Fajr) },
        { name: "الظهر", time: convertTo24Hour(salaTime.Dhuhr) },
        { name: "العصر", time: convertTo24Hour(salaTime.Asr) },
        { name: "المغرب", time: convertTo24Hour(salaTime.Maghrib) },
        { name: "العشاء", time: convertTo24Hour(salaTime.Isha) }
      ];
      
      prayers.forEach(prayer => {
        const [prayerHour, prayerMinute] = prayer.time;
        if (currentHour === prayerHour && currentMinute === prayerMinute) {
          aladdan_sound("active");
          
          setTimeout(() => {
            aladdan_sound("deactivate");
          }, 60000);
        }
      });
    };
    
    if (active_addan) {
      scheduleNextCheck();
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [active_addan, salaTime]);

  function convertToMinutes(time24) {
    if (!time24) return 0;
    const [hours, minutes] = time24.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function convertTo24Hour(time24) {
    if (!time24) return [0, 0];
    const [hourStr, minuteStr] = time24.split(":");
    return [parseInt(hourStr, 10), parseInt(minuteStr, 10)];
  }

  function convertTo12Hour(time24, is_for_prayertime) {
    const [hourStr, minute] = time24.split(":");
    if (is_for_prayertime) {
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return `${hour}:${minute} ${ampm}`;
    } else {
      let hour = parseInt(hourStr, 10);
      hour = hour % 12;
      let minutes = parseInt(minute);
      return [hour, minutes];
    }
  }

  function aladdan_sound(state) {
    if (state === "active") {
      addan_sound.current.play();
    } else {
      addan_sound.current.pause();
    }
  }

  function toggel_prayer_time_setting() {
    setprayer_time_setting(!prayer_time_setting);
  }

  function on_change_selector(e) {
    const selectedSurahName = e.target.value;
    setcurrent_surah(selectedSurahName);
    
    const selectedSurah = quran_verses.find(surah => surah.name === selectedSurahName);
    
    if (selectedSurah) {
      const ayahNumbers = [];
      for (let i = 1; i <= selectedSurah.numberOfAyahs; i++) {
        ayahNumbers.push(i);
      }
      setverse_ayah(ayahNumbers);
    } else {
      setverse_ayah([]);
    }
  }

  function on_change_selector2(e) {
    setnumber_of_ayah(parseInt(e.target.value, 10));
  }

  function on_submite() {
    const selectedSurah = quran_verses.find((data) => data.name === current_surah);
    if (!selectedSurah) return;

    const newSurahNumber = selectedSurah.number;
    const newAyahNumber = parseInt(number_of_ayah, 10);

    setsurah_index(newSurahNumber);
    pendingAyahRef.current = newAyahNumber;
    setactivechangevrs(false);
  }

  return (
    <div className="Vers_main">
      <div className="vers">
        <div className="d1">
          <div className="" onClick={() => setactivechangevrs(true)}>
            <span>Al-Baqarah (مدنية - 286 آية)</span>
          </div>
          <div className="">
            <span>abdulsamad</span>
          </div>
          <div className="">
            {/* <span>البحث في الآيات</span> */}
            <span style={{cursor:"pointer"}} onClick={() => setShowSearch(true)}>
  البحث في الآيات
</span>
          </div>
        </div>
        <div className="d2">
          {surah[index]?.text + ` ${surah[index]?.numberInSurah.toLocaleString('ar-EG')} ` || "" + surah[index]?.number}
        </div>
        <div className="d3">
          {/* أيقونة التكرار مع تغيير اللون عند التفعيل */}
          <FiRepeat 
            onClick={toggleRepeat} 
            style={{ color: repeat ? '#10b981' : 'inherit', cursor: 'pointer' }} 
          />
          <FiSkipBack onClick={handlePrevious} />
          <div className="sound" onClick={ActivateSound}>
            {!active ? <FaPlay /> : <FaPause />}
          </div>
          <audio
            ref={audio}
            onEnded={() => {
              if (repeat) {
                // إذا كان التكرار مفعّلاً، نعيد تشغيل نفس الآية
                audio.current.currentTime = 0;
                audio.current.play().catch(err => console.log(err));
              } else {
                // وإلا ننتقل إلى التالية
                if (index < surah.length - 1) {
                  setindex(prev => prev + 1);
                } else {
                  setsurah_index(prev => prev + 1);
                  setindex(0);
                }
              }
            }}
            crossOrigin="anonymous"
          />
          <FiSkipForward onClick={handleNext} />
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <MdSpeed onClick={toggleSpeedMenu} style={{ cursor: 'pointer' }} />
            {activePopup==="speedMenu" && (
              <div  className="speed-menu" >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                  <div
                    key={speed}
                    onClick={() => setSpeed(speed)}
                    style={{
                      padding: '4px 12px',
                      cursor: 'pointer',
                      backgroundColor: playbackSpeed === speed ? '#e2e8f0' : 'transparent',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}
                  >
                    {speed}x
                  </div>
                ))}
              </div>
            )}
          </div>
          <FiMoreHorizontal onClick={() => {}} />
        </div>
      </div>

      {/* باقي الأجزاء (تغيير الآية، أوقات الصلاة، إعدادات الصلاة) كما هي */}
      <div className={!active_change_vers ? "change_verse none" : "change_verse"}>
        <div className="change_vers_title">
          تغيير الآية
          <FaTimes className="closeicon" onClick={() => setactivechangevrs(false)} />
        </div>
        <select className="selector2" onChange={(e) => on_change_selector(e)}>
          {quran_verses.map((data, index) => (
            <option key={index}>{data.name}</option>
          ))}
        </select>
        <select className="selector2" onChange={(e) => on_change_selector2(e)}>
          {verse_ayah?.map((data, index) => (
            <option key={index}>{data}</option>
          ))}
        </select>
        <button className="bu3" onClick={on_submite}>submite</button>
      </div>

      <div className="prayer_times">
        <div className="prayer_name">
          <div className="prayer_name_to">منذ العصر</div>
          <div className="prayer_name_from">7m حتى المغرب</div>
        </div>
        <div className="prayer_line"></div>
        <div className="prayer_localTime">
          <div><p>العشاء</p><p>{salaTime.Isha ? convertTo12Hour(salaTime.Isha, true) : "--:--"}</p></div>
          <div><p className="prayer">المغرب</p><p>{salaTime.Maghrib ? convertTo12Hour(salaTime.Maghrib, true) : "--:--"}</p></div>
          <div><p className="prayer">العصر</p><p>{salaTime.Asr ? convertTo12Hour(salaTime.Asr, true) : "--:--"}</p></div>
          <div><p className="prayer">الظهر</p><p>{salaTime.Dhuhr ? convertTo12Hour(salaTime.Dhuhr, true) : "--:--"}</p></div>
          <div><p className="prayer">الشروق</p><p>{salaTime.Sunrise ? convertTo12Hour(salaTime.Sunrise, true) : "--:--"}</p></div>
          <div><p className="prayer">الفجر</p><p>{salaTime.Fajr ? convertTo12Hour(salaTime.Fajr, true) : "--:--"}</p></div>
        </div>
        <div className="volume">
          {!active_addan ? <HiVolumeOff size={20} onClick={() => setactiveaddan(!active_addan)} /> : <HiVolumeUp size={20} onClick={() => setactiveaddan(!active_addan)} />}
        </div>
        <div className="musqe">
          <FaMosque onClick={toggel_prayer_time_setting} />
        </div>
      </div>

      <div className={prayer_time_setting ? "prayer_time_setting" : "prayer_time_setting none"}>
        <div className="top_nav">
          اعدادات الصلاة
          <FaTimes onClick={toggel_prayer_time_setting} className="closeicon" />
        </div>
        <p className="region">الموقع</p>
        <div className="prayer_time_region_data">
          <div className="country_input">
            <p>Country</p>
            <select className="sellector1" onChange={(e) => setcountry(e.target.value)} defaultValue="Syria">
              {countries.map(country => (
                <option value={country} key={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="city_input">
            <p>City</p>
            <select className="sellector1" onChange={(e) => setcity(e.target.value)}>
              {cities.map(city => (
                <option value={city} key={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* نافذة البحث */}
{showSearch && (
  <div className="search_overlay">
    <div className="search_box">
      
      <div className="search_header">
        <span>البحث في الآيات</span>
        <FaTimes onClick={() => setShowSearch(false)} style={{cursor:"pointer"}} />
      </div>

      <input
        type="text"
        placeholder="اكتب كلمة البحث..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search_input"
      />

      <div className="search_results">
        {searchResults.length === 0 && searchTerm !== "" && (
          <p style={{textAlign:"center"}}>لا توجد نتائج</p>
        )}

        {searchResults.map((result, i) => (
          <div
            key={i}
            className="search_item"
            onClick={() => handleSearchResultClick(result)}
          >
            <p className="search_text">
              {result.text}
            </p>
            <p className="search_ref">
              {result.surahName} - {result.ayahNumber}
            </p>
          </div>
        ))}
      </div>

    </div>
  </div>
)}
 <div className="altafser-favorite">
  <p>اضف للمفضلة <FaHeart size={24} color="red" />
 </p>
  <p>التفسير  <FiBookmark size={24} color="blue" /></p>
 </div>
    </div>
  );
};

export default Verse;