import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "TODO_ITEM";

function TodoItem({ todo, index, moveTodo, toggleTodo, deleteTodo }) {
  const ref = useRef(null);

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

  return (
    <li
    className="no-swiping"
      ref={(node) => {
        drag(drop(node));
        ref.current = node;
      }}
      onClick={() => !isDragging && toggleTodo(index)}
      onDoubleClick={(e) => {
        e.preventDefault();
        deleteTodo(index);
      }}
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
      {todo.text}
    </li>
  );
}

export default TodoItem;
