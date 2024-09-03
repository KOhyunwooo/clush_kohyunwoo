import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
//scss불러오기
import "../css/App.scss";

// 페이지 컴포넌트들
import TodoPage from "./TodoPage.jsx";
import Trash from "./Trash.jsx";
import Settings from "./Settings.jsx";

// Swiper 모듈
import { Pagination } from "swiper/modules";

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [deletedTodos, setDeletedTodos] = useState(() => {
    const savedDeletedTodos = localStorage.getItem("deletedTodos");
    return savedDeletedTodos ? JSON.parse(savedDeletedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("deletedTodos", JSON.stringify(deletedTodos));
  }, [todos, deletedTodos]);

  const addTodo = (text) => {
    const newTodos = [...todos, { text, completed: false }];
    setTodos(newTodos);
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const todoToDelete = todos[index];
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    setDeletedTodos([...deletedTodos, todoToDelete]);
  };

  const restoreTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      // 이미지 네이션 설정
      const images = ["/images/1.png", "/images/2.png", "/images/3.png"];

      return `<span class="${className}" style="background-image: url(${images[index]});"></span>`;
    },
  };

  return (
    <Swiper
      initialSlide={1}
      pagination={pagination}
      modules={[Pagination]}
      className="mySwiper"
    >
      <SwiperSlide>
        <Trash
          deletedTodos={deletedTodos}
          setDeletedTodos={setDeletedTodos}
          restoreTodo={restoreTodo}
        />
      </SwiperSlide>
      <SwiperSlide>
        <TodoPage
          todos={todos}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Settings />
      </SwiperSlide>
    </Swiper>
  );
}

export default App;