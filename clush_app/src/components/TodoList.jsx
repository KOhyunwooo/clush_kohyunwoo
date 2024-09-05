import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import TodoItem from './TodoItem.jsx';
import TodoItemMobile from './TodoItemMobile.jsx';

function TodoList({ todos, moveTodo, toggleTodo, deleteTodo, updateTodoText }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const backendForDND = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo, index) => (
          isMobile ? (
            <TodoItemMobile
              key={index}
              index={index}
              todo={todo}
              moveTodo={moveTodo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateTodoText={updateTodoText} // 전달
            />
          ) : (
            <TodoItem
              key={index}
              index={index}
              todo={todo}
              moveTodo={moveTodo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateTodoText={updateTodoText} // 전달
            />
          )
        ))}
      </ul>
    </DndProvider>
  );
}

export default TodoList;
