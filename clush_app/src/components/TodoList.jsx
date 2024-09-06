import React, { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import TodoItem from "./TodoItem.jsx";
import TodoItemMobile from "./TodoItemMobile.jsx";
import { useTodo } from "./TodoContext.jsx";

function TodoList({ updateTodoText, handleAddTodo }) {
  const { todos, toggleTodo, deleteTodo, moveTodo } = useTodo();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const listRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //엔터키다운 이벤트/////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        // 엔터키를 눌렀을 때
        if (!isEditing) {
          // 현재 편집 모드가 아닐 때만 새로운 Todo 추가
          e.preventDefault();
          handleAddTodo();
        } else {
          // 편집 모드일 때는 엔터키로 편집 완료
          setIsEditing(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleAddTodo, isEditing]);
  /////////////////////////////////////////////////////////////////////////////////////////

  //마우스 좌클릭/////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const handleClick = (e) => {
      if (
        // e.target.classList.contains("click-this-add-list") // 클릭된 요소가 .click-this-add-todo-list일 때만 처리
        listRef.current &&
        !listRef.current.contains(e.target) &&
        e.target.closest(".todo-page") &&
        !e.target.closest(".todo-list")
      ) {
        if (!isEditing) {
          e.preventDefault();
          handleAddTodo();
        } else {
          setIsEditing(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [handleAddTodo, isEditing]);
  ///////////////////////////////////////////////////////////////////////////////////////////

  const backendForDND = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <ul ref={listRef} style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo, index) =>
          isMobile ? (
            <TodoItemMobile
              key={index}
              index={index}
              todo={todo}
              updateTodoText={updateTodoText}
              setIsEditing={setIsEditing}
              moveTodo={moveTodo}
            />
          ) : (
            <TodoItem
              key={index}
              index={index}
              todo={todo}
              moveTodo={moveTodo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateTodoText={updateTodoText}
              setIsEditing={setIsEditing}
            />
          )
        )}
      </ul>
    </DndProvider>
  );
}

export default TodoList;
