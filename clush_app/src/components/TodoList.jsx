import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import TodoItem from './TodoItem.jsx';
import TodoItemMobile from './TodoItemMobile.jsx';

function TodoList({ todos, moveTodo, toggleTodo, deleteTodo, updateTodoText, handleAddTodo }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const listRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !isEditing) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT') {
          e.preventDefault();
          handleAddTodo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAddTodo, isEditing]);

  const backendForDND = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <ul ref={listRef} style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo, index) => (
          isMobile ? (
            <TodoItemMobile
              key={todo.id}
              index={index}
              todo={todo}
              moveTodo={moveTodo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateTodoText={updateTodoText}
              setIsEditing={setIsEditing}
            />
          ) : (
            <TodoItem
              key={todo.id}
              index={index}
              todo={todo}
              moveTodo={moveTodo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateTodoText={updateTodoText}
              setIsEditing={setIsEditing}
            />
          )
        ))}
      </ul>
    </DndProvider>
  );
}

export default TodoList;