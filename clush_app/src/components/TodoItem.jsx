import React from 'react';

function TodoItem({ todo, index, toggleTodo, deleteTodo }) {
  const handleClick = () => {
    toggleTodo(index);
  };

  const handleDoubleClick = () => {
    deleteTodo(index);
  };

  return (
    <li
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ 
        textDecoration: todo.completed ? 'line-through' : 'none',
        cursor: 'pointer'
      }}
    >
      {todo.text}
    </li>
  );
}

export default TodoItem;
