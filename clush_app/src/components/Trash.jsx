import React from "react";
import { useTodo } from "./TodoContext";

function Trash() {
  // 컨텍스트에서 필요한 데이터와 함수 가져오기
  const { deletedTodos, setDeletedTodos, restoreTodo } = useTodo();

  // 복원 핸들러
  const handleRestore = (index) => {
    restoreTodo(deletedTodos[index]);
    const newDeletedTodos = deletedTodos.filter((_, i) => i !== index);
    setDeletedTodos(newDeletedTodos);
  };

  // 영구 삭제 핸들러
  const handlePermanentDelete = (index) => {
    const newDeletedTodos = deletedTodos.filter((_, i) => i !== index);
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
