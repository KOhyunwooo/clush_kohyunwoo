import React from 'react';
import TodoList from './TodoList.jsx';

function TodoPage({ todos, setTodos, addTodo, toggleTodo, deleteTodo, moveTodo }) {
  // 텍스트 업데이트 함수
  const updateTodoText = (index, newText) => {
    const newTodos = [...todos];
    newTodos[index] = { ...newTodos[index], text: newText };
    setTodos(newTodos);
  };

  // 새로운 todo 추가 함수
  const handleAddTodo = () => {
    addTodo('');
  };

  return (
    <div className="todo-page">
      <h1>Todo List</h1>
      <TodoList
        todos={todos}
        setTodos={setTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        moveTodo={moveTodo}
        updateTodoText={updateTodoText}
        handleAddTodo={handleAddTodo}
      />
    </div>
  );
}

export default TodoPage;