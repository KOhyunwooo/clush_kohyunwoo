import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "TODO_ITEM";

function TodoItem({ todo, index, moveTodo, toggleTodo, updateTodoText, deleteTodo, setIsEditing }) {
  const [isEditingLocal, setIsEditingLocal] = useState(todo.text === '');
  const [text, setText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditingLocal) {
      inputRef.current?.focus();
    }
    setIsEditing(isEditingLocal);
  }, [isEditingLocal, setIsEditing]);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleBlur = () => {
    finishEditing();
  };

  const finishEditing = () => {
    if (text.trim() !== '') {
      updateTodoText(index, text);
      setIsEditingLocal(false);
    } else {
      deleteTodo(index);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsEditingLocal(true);
  };

  const handleClick = () => {
    if (!isEditingLocal) {
      toggleTodo(index);
    }
  };

  return (
    <li
      className="no-swiping"
      ref={(node) => drag(drop(node))}
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.preventDefault();
        deleteTodo(index);
      }}
      onContextMenu={handleContextMenu}
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
        cursor: isDragging ? "grabbing" : "pointer",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "4px",
        backgroundColor: "#fff",
        opacity: isDragging ? 0.3 : 1,
        transform: isDragging ? "scale(0.98)" : "scale(1)",
        transition: "transform 0.5s ease, opacity 0.5s ease",
      }}
    >
      {isEditingLocal ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        todo.text
      )}
    </li>
  );
}

export default TodoItem;