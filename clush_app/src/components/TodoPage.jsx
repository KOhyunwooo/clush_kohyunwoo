import React from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';

function TodoPage({ todos, setTodos, addTodo, toggleTodo, deleteTodo, moveTodo }) {
  return (
    <div className="todo-page">
      <h1>Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos={todos}
        setTodos={setTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        moveTodo={moveTodo}  // moveTodo 전달
      />
    </div>
  );
}

export default TodoPage;
