import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useTodo } from "./TodoContext";

const ItemType = "TODO_ITEM";

function TodoItemMobile({ todo, index, updateTodoText, setIsEditing, moveTodo }) {
  const { todos,setTodos,toggleTodo, deleteTodo } = useTodo();
  const [isEditingLocal, setIsEditingLocal] = useState(todo.text === "");
  const [text, setText] = useState(todo.text);
   // todo.text가 변경될 때마다 text 상태를 업데이트
   useEffect(() => {
    setText(todo.text);
  }, [todo.text]);

  const inputRef = useRef(null);
  const touchTimer = useRef(null);
  const lastTap = useRef(0);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const touchStartPos = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(() => {
    setIsDraggingLocal(isDragging);
  }, [isDragging]);

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  useEffect(() => {
    if (isEditingLocal) {
      inputRef.current?.focus();
    }
    setIsEditing(isEditingLocal);
  }, [isEditingLocal, setIsEditing]);

    
    const finishEditing = () => {
      const newText = inputRef.current.value.trim();
      
      if (newText !== "" ) {
        updateTodoText(index, newText);
      } else {
        // 새로운 텍스트가 빈 문자열일 경우 해당 Todo 항목 삭제
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
      }
      
      setIsEditingLocal(false);
    };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
    }
  };

  const handleBlur = () => {
    finishEditing();
  };

  const handleLongPressStart = (e) => {
    if (!isDraggingLocal) {
      touchTimer.current = setTimeout(() => {
        setIsEditingLocal(true);
      }, 500);
    }
  };

  const handleLongPressEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const TAP_DELAY = 300;
    if (now - lastTap.current < TAP_DELAY) {
      deleteTodo(index);
    }
    lastTap.current = now;
  };

  const handleTouchStart = (e) => {
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    handleLongPressStart(e);
    handleDoubleTap();
  };

  const handleTouchMove = (e) => {
    if (touchStartPos.current) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
      
      if (deltaX > 10 || deltaY > 10) {
        handleLongPressEnd();
        setIsDraggingLocal(true);
      }
    }
  };

  const handleTouchEnd = () => {
    handleLongPressEnd();
    touchStartPos.current = null;
    setTimeout(() => setIsDraggingLocal(false), 100);
  };

  const handleClick = () => {
    if (!isEditingLocal && !isDraggingLocal) {
      if (text.trim() === "") {
        // 빈 입력 상태에서 클릭하면 해당 항목 삭제
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
      } else {
        toggleTodo(index);
      }
    }
  };

  return (
    <li
      ref={(node) => drag(drop(node))}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "4px",
        backgroundColor: "#fff",
        transform: isDragging ? "scale(0.98)" : "scale(1)",
        transition: "transform 0.1s ease, opacity 0.1s ease",
        textDecoration: todo.completed ? "line-through" : "none",
        userSelect: "none",
      }}
    >
      {isEditingLocal ? (
        <input
        className="editing-input"
          ref={inputRef}
          type="text"
          defaultValue={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span>{todo.text}</span>
      )}
    </li>
  );
}

export default TodoItemMobile;
