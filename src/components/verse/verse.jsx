 import React from "react";
 import { useState,useEffect ,useRef} from "react";
 import { MdSpeed } from "react-icons/md";
 
 import axios from "axios";
 import { FaTimes } from "react-icons/fa";
 import addansound from "../../assets/quran/4027.mp3";
 import {
  FiShuffle,
  FiSkipBack,
  FiSkipForward,
  FiRepeat,
  FiMoreHorizontal
} from "react-icons/fi";
import { HiVolumeOff,HiVolumeUp} from "react-icons/hi";
import { FaMosque } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

 import "./verse.css"
import { Filter } from "lucide-react";
 const Verse=function (){
    const today = new Date();

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

    const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Bangladesh",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Egypt",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Iraq",
  "Italy",
  "Jordan",
  "Kenya",
  "Malaysia",
  "Netherlands",
  "Nigeria",
  "Pakistan",
  "Qatar",
  "Saudi Arabia",
  "South Africa",
  "Spain",
  "Syria",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Yemen"
];
const cities = [
  "Damascus",
  "Aleppo",
  "Homs",
  "Latakia",
  "Baghdad",
  "Dubai",
  "Istanbul",
  "London",
  "New York",
  "Paris",
  "Cairo",
  "Karachi",
  "Islamabad",
  "Riyadh",
  "Jeddah",
  "Kuala Lumpur",
  "Jakarta",
  "Dhaka",
  "Beirut",
  "Manama",
  "Doha",
  "Kuwait City",
  "Amman",
  "Tunis",
  "Algiers",
  "Casablanca"
]; 
    const [verse_ayah,setverse_ayah]=useState([]);
    const [number_of_ayah,setnumber_of_ayah]=useState(0);
    const [current_surah,setcurrent_surah]=useState("");
    const [quran_verses,setquran_verses]=useState([]);
    const[current_verse_length,setcurrent_verse_length]=useState(0);
    const[active_addan,setactiveaddan]=useState(false);
    const[prayer_time_setting,setprayer_time_setting]=useState(false);
    const[city,setcity]=useState("Damascus");
    const[country,setcountry]=useState("Syria");
    const [salaTime,setsallaTime]=useState([]);
    const [index,setindex]=useState(0);
    const audio = useRef(null);
    const addan_sound=useRef(0);
    const [vers_sound_index,setVerse_sound_index]=useState(1);
    const [surah_index,setsurah_index]=useState(1);
    const [active,setActive]=useState(false); 
    const [active_change_vers,setactivechangevrs]=useState(false);
    const [surah,setSurah]=useState({});
    const pendingAyahRef = useRef(null);
    function deactivate(){
        setActive(!active);
    }
 
 useEffect(() => {
  axios.get(`https://api.alquran.cloud/v1/surah/${surah_index}/ar.alafasy`)
    .then((data) => {
      const ayahs = data.data.data.ayahs;
      setSurah(ayahs);
      setcurrent_verse_length(ayahs.length); // ✅ استخدام الطول الصحيح

      // هل هناك آية معلقة نريد الانتقال إليها؟
      if (pendingAyahRef.current !== null) {
        const targetAyah = pendingAyahRef.current;
        // التأكد من أن رقم الآية ضمن النطاق الصحيح
        if (targetAyah >= 1 && targetAyah <= ayahs.length) {
          setindex(targetAyah - 1); // الـ index يبدأ من 0
          setVerse_sound_index(ayahs[targetAyah - 1].number); // رقم الآية المطلق
        }
        pendingAyahRef.current = null; // مسح القيمة بعد الاستخدام
      } else {
        // لو لم يكن هناك آية معلقة (حمل عادي للسورة)، ابدأ من أول آية
        setindex(0);
        setVerse_sound_index(1);
      }
    });
}, [surah_index]);
 
    // فقط عندما تتغير surah_index
    const handleNext = () => {
  if (index < surah.length - 1) {
    setindex(index + 1);
   setVerse_sound_index(prev=>prev+1);
  } else {
    // إذا كنا في آخر آية، انتقل للسورة التالية
    setsurah_index(surah_index + 1);
    setVerse_sound_index(prev=>prev+1);
    setindex(0); // ابدأ من أول آية
    // setVerse_sound_index(1);
  }
};
// دالة للآية السابقة
const handlePrevious = () => {
  if (index > 0) {
    setindex(index - 1);
    setVerse_sound_index(vers_sound_index-1);
  } else if (surah_index > 0) {
    // إذا كنا في أول آية ولدينا سورة سابقة
    setsurah_index(surah_index - 1);
    setindex(current_verse_length-1);
    if(vers_sound_index>0){
       setVerse_sound_index(vers_sound_index-1);
    }
   
    // لا تحدد index هنا، انتظر حتى يتم تحميل السورة الجديدة
  }
};
  useEffect(()=>{
    axios.get("https://api.alquran.cloud/v1/surah",).then((response)=>{
    console.log(response.data.data);
    setquran_verses(response.data.data);
    });
  },[]);
  useEffect(() => {
  if (!audio.current) return;
 const verseAudio = `/api/audio/quran/audio/64/ar.abdulsamad/${vers_sound_index}.mp3`;//https://cdn.islamic.network/quran/audio/128/ar.alafasy/8.mp3
audio.current.src = verseAudio;
  audio.current.load();
  console.log(vers_sound_index);
  // لو الصوت مفعل بالفعل
  if (active) {
    audio.current.play().catch(err => console.log("Audio play error:", err));
  }
}, [index]);
   useEffect(() => {
  if (!city || !country) return;

  console.log("CITY:", city);
console.log("COUNTRY:", country);


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
        console.log("i am working now");
        console.log(res.data.data);
      setsallaTime(res.data.data.timings);
      console.log(salaTime);
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
    
    // البحث عن أقرب وقت صلاة
    const prayerTimes = [
      convertToMinutes(salaTime.Fajr),
      convertToMinutes(salaTime.Dhuhr),
      convertToMinutes(salaTime.Asr),
      convertToMinutes(salaTime.Maghrib),
      convertToMinutes(salaTime.Isha)
    ].filter(time => time > 0);
    
    // فرز الأوقات للعثور على التالي
    const futurePrayers = prayerTimes.filter(time => time > currentMinutes);
    const nextPrayerTime = futurePrayers.length > 0 
      ? Math.min(...futurePrayers)
      : prayerTimes[0] + 1440; // إذا انتهت اليوم، انتظر لليوم التالي
    
    const minutesUntilNextPrayer = nextPrayerTime - currentMinutes;
    
    if (minutesUntilNextPrayer > 0) {
      // حساب المدة حتى الدقيقة التالية للتحقق
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000;
      
      timeoutId = setTimeout(() => {
        checkCurrentPrayerTime();
        scheduleNextCheck(); // جدول التحقق التالي
      }, msUntilNextMinute);
    }
  };
  
  const checkCurrentPrayerTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // مصفوفة أوقات الصلاة
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
        console.log(`🕌 وقت ${prayer.name}: ${prayerHour}:${prayerMinute}`);
        aladdan_sound("active");
        
        // إيقاف الأذان بعد دقيقة (60,000 ميلي ثانية)
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

// دالة مساعدة للتحويل إلى دقائق
function convertToMinutes(time24) {
  if (!time24) return 0;
  const [hours, minutes] = time24.split(":").map(Number);
  return hours * 60 + minutes;
}
// دالة مساعدة للتحويل إلى 24 ساعة
function convertTo24Hour(time24) {
  if (!time24) return [0, 0];
  
  const [hourStr, minuteStr] = time24.split(":");
  return [parseInt(hourStr, 10), parseInt(minuteStr, 10)];
}
function convertTo12Hour(time24,is_for_prayertime) {
  // time24  
  const [hourStr, minute] = time24.split(":");
  if(is_for_prayertime){
    
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12; // تحويل 0 إلى 12
  return `${hour}:${minute} ${ampm}`;
  }
 else if(!is_for_prayertime){
 let hour = parseInt(hourStr, 10);
 hour = hour % 12;
 let minutes=parseInt(minute);
 return [hour,minutes];
 }
  
}

 async function ActivateSound() {
  if (!audio.current) return;

  if (!active) {
    try {
      await audio.current.play();  // تأكد من التشغيل
      setActive(true);
    } catch (err) {
      console.log("Audio play error:", err);
    }
  } else {
    audio.current.pause();
    setActive(false);
  }
}

    function aladdan_sound(state){
    if(state==="active"){
    addan_sound.current.play();
    }
   else
   {
     addan_sound.current.pause();
   }
   
    }
    function toggel_prayer_time_setting(){
        setprayer_time_setting(!prayer_time_setting);
        console.log(prayer_time_setting);
    }
  function on_change_selector(e) {
    const selectedSurahName = e.target.value;
    setcurrent_surah(selectedSurahName);
    
    // البحث عن السورة المختارة
    const selectedSurah = quran_verses.find(surah => surah.name === selectedSurahName);
    
    if (selectedSurah) {
        // إنشاء مصفوفة أرقام الآيات باستخدام map (أو for loop)
        const ayahNumbers = [];
        for (let i = 1; i <= selectedSurah.numberOfAyahs; i++) {
            ayahNumbers.push(i);
        }
        // ✅ تحديث الحالة الجديدة
        setverse_ayah(ayahNumbers);
    } else {
        setverse_ayah([]); // إذا لم توجد السورة
    }
}
function on_change_selector2(e) {
  setnumber_of_ayah(parseInt(e.target.value, 10)); // ✅ نص → رقم
}
function on_submite() {
  const selectedSurah = quran_verses.find((data) => data.name === current_surah);
  if (!selectedSurah) return;

  const newSurahNumber = selectedSurah.number;     // رقم السورة (1-114)
  const newAyahNumber = parseInt(number_of_ayah, 10); // تحويل النص إلى رقم

  // 1. تغيير رقم السورة (سيؤدي إلى إعادة جلب السورة الجديدة)
  setsurah_index(newSurahNumber);
  
  // 2. تخزين رقم الآية المطلوب في متغير عادي (ليس State) لاستخدامه بعد تحميل السورة
  // سنستخدم useRef لتخزين القيمة مؤقتًا
  pendingAyahRef.current = newAyahNumber;
  
  // 3. إخفاء لوحة التغيير
  setactivechangevrs(false);
}
    return(<div className="Vers_main"> <div className="vers">
      
        <div className="d1">
        <div className="" onClick={()=>setactivechangevrs(true)}> <span>Al-Baqarah (مدنية - 286 آية)</span></div>
        <div className=""> <span>Ayman Sowaid</span> </div>
        <div className=""> <span>البحث في الآيات</span></div>
        
        </div>
        <div className="d2">
          {
           surah[index]?.text+` ${surah[index]?.numberInSurah.toLocaleString('ar-EG')} `||""+surah[index]?.number
          }
 </div>
        <div className="d3">
   <FiRepeat  />
   <FiSkipBack onClick={handlePrevious} />
 <div className="sound" onClick={ActivateSound}>
  {!active ? <FaPlay /> : <FaPause />}
</div>
<audio ref={audio} onEnded={()=>{if(index<surah.length-1){
  setindex(index+1);
 setVerse_sound_index(vers_sound_index+1);
}
else if(index>=surah.length-1){
console.log("hi iam working");
setsurah_index(surah_index+1);
setindex(0);
 setVerse_sound_index(vers_sound_index+1);
}
}} crossOrigin="anonymous" />
  <audio src={addansound}   ref={addan_sound}></audio>
   <FiSkipForward onClick={handleNext} />
   <MdSpeed/>
   <FiMoreHorizontal onClick={()=>console.log("hiiii")}/>
        </div>
    </div>
     <div className={!active_change_vers?"change_verse none":"change_verse"}>
<div className="change_vers_title">تغيير الآية
  <FaTimes className="closeicon"/>
</div>
 <select className="selector2" onChange={(e)=>on_change_selector(e)}>
 {quran_verses.map((data,index)=>{return(<option key={index}>
 {data.name}
 
 

 </option>);})}
 </select>
  <select className="selector2" onChange={(e)=>on_change_selector2(e)}>
  {
   verse_ayah?.map((data,index)=>{return(
   <option key={index}>
    {data}
   </option>);}) 
  }
 </select>
 <button className="bu3" onClick={on_submite}>submite</button>
    </div>
    <div className="prayer_times"> 
        <div className="prayer_name">
            <div className="prayer_name_to">منذ العصر
</div>
            <div className="prayer_name_from">7m حتى المغرب
</div>
        </div>
        <div className="prayer_line"></div>
         <div className="prayer_localTime">

           <div><p>العشاء</p><p>{salaTime.Isha ? convertTo12Hour(salaTime.Isha,true) : "--:--"}</p></div>
           <div><p className="prayer">المغرب</p><p>{salaTime.Maghrib ? convertTo12Hour(salaTime.Maghrib,true) : "--:--"} </p></div>
           <div><p className="prayer">العصر</p><p>{salaTime.Asr ? convertTo12Hour(salaTime.Asr,true) : "--:--"}</p></div>
           <div><p className="prayer">الظهر</p><p>{salaTime.Dhuhr ? convertTo12Hour(salaTime.Dhuhr,true) : "--:--"}</p></div>
           <div><p className="prayer">الشروق</p><p>{salaTime.Sunrise ? convertTo12Hour(salaTime.Sunrise,true) : "--:--"}</p></div>
           <div><p className="prayer">الفجر</p><p>{salaTime.Fajr ? convertTo12Hour(salaTime.Fajr,true) : "--:--"}</p></div>
         </div>
        <div className="volume">  
            {!active_addan? <HiVolumeOff size={20}  onClick={()=>setactiveaddan(!active_addan)}/>:<HiVolumeUp size={20}  onClick={()=>setactiveaddan(!active_addan)}/>}  
        </div>
     <div className="musqe">
         <FaMosque onClick={toggel_prayer_time_setting} />
     </div>
    </div>
    <div className={prayer_time_setting?"prayer_time_setting":"prayer_time_setting none"}>
        <div className="top_nav">اعدادات الصلاة
            <FaTimes onClick={toggel_prayer_time_setting} className="closeicon"/>
         
        </div> <p className="region">الموقع</p> 
          <div className="prayer_time_region_data">
              
            

<div className="country_input">
  <p>Country</p>
  <select className="sellector1" onChange={(e)=>setcountry(e.target.value)} defaultChecked='Syria'>
    {countries.map(country => (
      <option value={country} key={country}>{country}</option>
    ))}
  </select>
</div>
 <div className="city_input">
  <p>City</p>
  <select className="sellector1" onChange={(e)=>setcity(e.target.value)}>
    {cities.map(city => (
      <option value={city} key={city}>{city}</option>
    ))}
  </select>
</div>

            </div>
    </div>
   
    </div>
    );
 }
 export default Verse;