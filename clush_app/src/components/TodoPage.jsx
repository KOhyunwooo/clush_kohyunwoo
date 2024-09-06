import React from "react";
import TodoList from "./TodoList.jsx";
import { useTodo } from "./TodoContext.jsx";

function TodoPage() {
  // 컨텍스트 사용
  const { todos, setTodos, addTodo, toggleTodo, deleteTodo, moveTodo } =
    useTodo();

  // 텍스트 업데이트 함수
  const updateTodoText = (index, newText) => {
    const newTodos = [...todos];
    newTodos[index] = { ...newTodos[index], text: newText };
    setTodos(newTodos);
  };

  // 새로운 todo 추가 함수
  const handleAddTodo = () => {
    addTodo("");
  };

  return (
    <div className="todo-page">
      <h1>Todo List</h1>
      <TodoList updateTodoText={updateTodoText} handleAddTodo={handleAddTodo} />
      <div className="todolist-bg"></div>
    </div>
  );
}

export default TodoPage;
