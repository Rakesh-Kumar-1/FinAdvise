import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { Navigation, EffectCoverflow } from "swiper/modules";
import "./CSS/Test.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Test = () => {
  const [items, setItem] = useState([]);

  const fetchAdvisors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/fetch-advisor");
      setItem(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, []);

  return (
    <div className="slider-wrapper">
      <Swiper
        effect = 'coverflow'
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        spaceBetween={100}
        navigation
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[Navigation, EffectCoverflow]}
        className="advisor-swiper"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="advisor-card">
              <h3>{item.name}</h3>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Phone:</strong> {item.phone}</p>
              <p><strong>Specialization:</strong> {item.specialization}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Test;
