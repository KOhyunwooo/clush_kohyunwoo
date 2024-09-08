import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "../css/App.scss";
import "../css/common/_reset.scss";

import TodoPage from "./TodoPage.jsx";
import Trash from "./Trash.jsx";
import Settings from "./Settings.jsx";

import { Pagination } from "swiper/modules";
import { TodoProvider } from "./TodoContext";

function App() {
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      const images = ["/images/1.png", "/images/2.png", "/images/3.png"];
      return `<span class="${className}" style="background-image: url(${images[index]});"></span>`;
    },
  };

  return (
    <TodoProvider>
      <Swiper
        initialSlide={1}
        pagination={pagination}
        modules={[Pagination]}
        className="mySwiper"
        touchStartPreventDefault={false}
        noSwipingClass="no-swiping"
      >
        <SwiperSlide>
          <Trash />
        </SwiperSlide>
        <SwiperSlide>
          <TodoPage />
        </SwiperSlide>
        <SwiperSlide>
          <Settings />
        </SwiperSlide>
      </Swiper>
    </TodoProvider>
  );
}

export default App;
