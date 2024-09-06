import React, { createContext, useState, useEffect, useContext } from "react";

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

  // todos와 deletedTodos 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("deletedTodos", JSON.stringify(deletedTodos));
  }, [todos, deletedTodos]);

  // 새로운 todo를 추가하는 함수
  const addTodo = (text) => {
    setTodos([...todos, { text, completed: false }]);
  };

  // 특정 인덱스의 todo의 완료 상태를 토글하는 함수
  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  // 특정 인덱스의 todo를 삭제하고 deletedTodos에 추가하는 함수
  const deleteTodo = (index) => {
    const todoToDelete = todos[index];
    const newTodos = [...todos];
    newTodos.splice(index, 1); // 인덱스에서 todo를 삭제
    setTodos(newTodos);
    setDeletedTodos([...deletedTodos, todoToDelete]); // 삭제된 todos에 추가
  };

  // 삭제된 todo를 복원하는 함수
  const restoreTodo = (todo) => {
    setTodos([...todos, todo]); // todos에 추가
    setDeletedTodos(deletedTodos.filter((t) => t !== todo)); // deletedTodos에서 제거
  };

  // todo의 위치를 이동시키는(드래그) 함수
  const moveTodo = (fromIndex, toIndex) => {
    const updatedTodos = [...todos];
    const [movedTodo] = updatedTodos.splice(fromIndex, 1); // 원래 위치에서 todo를 제거합니다.
    updatedTodos.splice(toIndex, 0, movedTodo); // 새 위치에 todo를 추가합니다.
    setTodos(updatedTodos);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        deletedTodos,
        setDeletedTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
        restoreTodo,
        moveTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
