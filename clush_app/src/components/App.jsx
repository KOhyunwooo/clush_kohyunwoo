import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "../css/App.scss";

import TodoPage from "./TodoPage.jsx";
import Trash from "./Trash.jsx";
import Settings from "./Settings.jsx";

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

  const moveTodo = (fromIndex, toIndex) => {
    const updatedTodos = [...todos];
    const [movedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedTodo);
    setTodos(updatedTodos);
  };



  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      
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
      touchStartPreventDefault={false} //스와이퍼 터치스타트 기본기능막기!
      // touchMoveStopPropagation={false} 
   
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
          setTodos={setTodos}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          moveTodo={moveTodo}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Settings />
      </SwiperSlide>
    </Swiper>
  );
}

export default App;
