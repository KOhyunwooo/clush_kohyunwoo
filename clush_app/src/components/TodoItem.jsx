import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "TODO_ITEM";

function TodoItem({ todo, index, moveTodo, toggleTodo, deleteTodo }) {
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef(null);

  const [{ isDragging: dragging }, drag] = useDrag({
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

  useEffect(() => {
    setIsDragging(dragging);
  }, [dragging]);

  const handleClick = () => {
    if (!isDragging) {
      toggleTodo(index);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    deleteTodo(index);
  };

  return (
    <li
      ref={(node) => {
        drag(drop(node));
        ref.current = node;
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
        cursor: isDragging ? "grabbing" : "pointer",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "4px",
        backgroundColor: "#fff",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {todo.text}
    </li>
  );
}

export default TodoItem;
