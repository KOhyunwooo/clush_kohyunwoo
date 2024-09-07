import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useTodo } from "./TodoContext";

const ItemType = "TODO_ITEM";

function TodoItem({ todo, index, updateTodoText, setIsEditing }) {
  // 컨텍스트에서 Todo 관련 함수들 가져오기
  const { todos, setTodos, toggleTodo, deleteTodo, moveTodo } = useTodo();

  // 로컬 상태: 현재 항목이 편집 중인지 여부 및 텍스트 내용
  const [isEditingLocal, setIsEditingLocal] = useState(todo.text === "");
  
  
  const [text, setText] = useState(todo.text);
   // todo.text가 변경될 때마다 text 상태를 업데이트
   useEffect(() => {
    setText(todo.text);
  }, [todo.text]);


  const inputRef = useRef(null);

  // 편집 모드일 때 입력 필드에 포커스 설정 및 상위 컴포넌트에 편집 상태 전달
  useEffect(() => {
    if (isEditingLocal) {
      inputRef.current?.focus();
    }
    setIsEditing(isEditingLocal);
  }, [isEditingLocal, setIsEditing]);

  // Drag and Drop 설정
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });



  
 // 편집 완료 처리 함수
  const finishEditing = () => {
    const newText = inputRef.current.value.trim();
    
    if (newText !== "" ) {
      updateTodoText(index, newText);
    } else {
      // 새로운 텍스트가 빈 문자열일 경우 해당 Todo 항목 삭제
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
    }
    
    setIsEditingLocal(false);
  };

  // 입력 필드에서 엔터키를 눌렀을 때 편집 완료 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
    }
  };

  // 입력 필드가 포커스를 잃었을 때 편집 완료 처리
  const handleBlur = () => {
    finishEditing();
  };

  // 컨텍스트 메뉴(우클릭) 시 편집 모드로 전환
  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsEditingLocal(true);
  };

  // 항목 클릭 시 완료 상태 토글
  const handleClick = () => {
    if (!isEditingLocal) {
      toggleTodo(index);
    }
  };

  return (
    <li
      className="no-swiping"
      ref={(node) => drag(drop(node))}
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.preventDefault();
        deleteTodo(index);
      }}
      onContextMenu={handleContextMenu}
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
        cursor: isDragging ? "grabbing" : "pointer",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "4px",
        backgroundColor: "#fff",
        opacity: isDragging ? 0.3 : 1,
        transform: isDragging ? "scale(0.98)" : "scale(1)",
        transition: "transform 0.5s ease, opacity 0.5s ease",
      }}
    >
      {isEditingLocal ? (
        <input
          ref={inputRef}
          type="text"
          defaultValue={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        todo.text
      )}
    </li>
  );
}

export default TodoItem;
