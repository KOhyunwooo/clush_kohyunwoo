import React from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';

function TodoPage({ todos, setTodos, addTodo, toggleTodo, deleteTodo, moveTodo }) {

  // 텍스트 업데이트 함수 추가
  const updateTodoText = (index, newText) => {
    const newTodos = [...todos];
    newTodos[index] = { ...newTodos[index], text: newText };
    setTodos(newTodos);
  };

  return (
    <div className="todo-page">
      <h1>Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos={todos}
        setTodos={setTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        moveTodo={moveTodo}
        updateTodoText={updateTodoText}  // updateTodoText 전달
      />
    </div>
  );
}

export default TodoPage;
