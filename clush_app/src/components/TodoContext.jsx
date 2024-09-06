import React, { createContext, useState, useEffect, useContext } from 'react';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
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
    setTodos([...todos, { text, completed: false }]);
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
    setDeletedTodos(deletedTodos.filter(t => t !== todo));
  };

  const moveTodo = (fromIndex, toIndex) => {
    const updatedTodos = [...todos];
    const [movedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedTodo);
    setTodos(updatedTodos);
  };

  return (
    <TodoContext.Provider value={{
      todos,
      setTodos,
      deletedTodos,
      setDeletedTodos,
      addTodo,
      toggleTodo,
      deleteTodo,
      restoreTodo,
      moveTodo
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);