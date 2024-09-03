import React from 'react';

function Trash({ deletedTodos = [], setDeletedTodos, restoreTodo }) {
  const handleRestore = (index) => {
    restoreTodo(deletedTodos[index]);
    const newDeletedTodos = [...deletedTodos];
    newDeletedTodos.splice(index, 1);
    setDeletedTodos(newDeletedTodos);
  };

  const handlePermanentDelete = (index) => {
    const newDeletedTodos = [...deletedTodos];
    newDeletedTodos.splice(index, 1);
    setDeletedTodos(newDeletedTodos);
  };

  return (
    <div>
      <h1>Trash</h1>
      <ul>
        {deletedTodos.map((todo, index) => (
          <li key={index}>
            {todo.text}
            <button onClick={() => handleRestore(index)}>복원</button>
            <button onClick={() => handlePermanentDelete(index)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trash;
