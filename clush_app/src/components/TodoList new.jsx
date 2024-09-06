import React, { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import TodoItem from "./TodoItem.jsx";
import TodoItemMobile from "./TodoItemMobile.jsx";
import { useTodo } from "./TodoContext.jsx";

function TodoList() {
  const { todos, addTodo, removeTodo, toggleTodo, deleteTodo, moveTodo, updateTodoText } = useTodo();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const listRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoId, setNewTodoId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        if (!isEditing) {
          e.preventDefault();
          handleAddTodo();
        } else {
          setIsEditing(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing]);

  const handleAddTodo = () => {
    const newTodo = { id: Date.now(), text: "", completed: false };
    addTodo(newTodo);
    setNewTodoId(newTodo.id);
    setIsEditing(true);
  };

  const handleClick = (e) => {
    if (
      listRef.current &&
      !listRef.current.contains(e.target) &&
      e.target.closest(".todo-page") &&
      !e.target.closest(".todo-list")
    ) {
      e.preventDefault();
      if (newTodoId !== null && todos.find(todo => todo.id === newTodoId)?.text === "") {
        removeTodo(newTodoId);
        setNewTodoId(null);
      } else {
        handleAddTodo();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [todos, newTodoId]);

  const touchBackendOptions = {
    delay: 50,
    delayTouchStart: 250,
  };

  const backendForDND = isMobile 
    ? (props) => TouchBackend(props, touchBackendOptions)
    : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <ul ref={listRef} style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo, index) =>
          isMobile ? (
            <TodoItemMobile
              key={todo.id}
              todo={todo}
              index={index}
              updateTodoText={(index, text) => {
                updateTodoText(todo.id, text);
                if (todo.id === newTodoId) {
                  setNewTodoId(null);
                }
              }}
              setIsEditing={setIsEditing}
              moveTodo={moveTodo}
            />
          ) : (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              moveTodo={moveTodo}
              toggleTodo={() => toggleTodo(todo.id)}
              deleteTodo={() => deleteTodo(todo.id)}
              updateTodoText={(text) => {
                updateTodoText(todo.id, text);
                if (todo.id === newTodoId) {
                  setNewTodoId(null);
                }
              }}
              setIsEditing={setIsEditing}
            />
          )
        )}
      </ul>
    </DndProvider>
  );
}

export default TodoList;