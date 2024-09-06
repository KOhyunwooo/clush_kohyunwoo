import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useTodo } from "./TodoContext";

const ItemType = "TODO_ITEM";

function TodoItemMobile({ todo, index, updateTodoText, setIsEditing }) {
  const { todos, setTodos, toggleTodo, deleteTodo, moveTodo } = useTodo();

  // 로컬 상태: 편집 모드 여부와 텍스트 상태 관리
  const [isEditingLocal, setIsEditingLocal] = useState(todo.text === "");
  const [text, setText] = useState(todo.text);

  // 입력 필드에 대한 참조 설정
  const inputRef = useRef(null);

  // 터치 관련 타이머와 마지막 탭 시간 저장용 참조 변수
  const touchTimer = useRef(null);
  const lastTap = useRef(0); // 마지막으로 탭한 시간 저장

  // 편집 모드일 때 입력 필드에 포커스를 설정하고, 상위 컴포넌트로 편집 상태 전달
  useEffect(() => {
    if (isEditingLocal) {
      inputRef.current?.focus();
    }
    setIsEditing(isEditingLocal); // 상위 컴포넌트에 편집 상태 전달
  }, [isEditingLocal, setIsEditing]);

  // Drag and Drop 설정: 현재 항목을 드래그할 때의 상태 수집
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop 대상이 되었을 때 처리: 다른 항목을 드래그하여 순서를 바꾸는 로직
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index); // 항목 순서 변경
        draggedItem.index = index;
      }
    },
  });

  // 편집 완료: 텍스트가 비어있지 않으면 업데이트, 비어있으면 항목 삭제
  const finishEditing = () => {
    if (text.trim() !== "") {
      updateTodoText(index, text); // 텍스트가 존재하면 업데이트
      setIsEditingLocal(false); // 편집 모드 해제
    } else {
      // 텍스트가 비어있으면 해당 Todo 항목 삭제
      const newTodos = [...todos];
      newTodos.splice(index, 1); // 해당 인덱스의 항목을 삭제
      setTodos(newTodos);
    }
  };

  // 엔터 키로 편집 완료 처리
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

  // 길게 누르면 편집 모드로 전환
  const handleLongPressStart = () => {
    // 0.5초 이상 길게 누르면 편집 모드로 전환
    touchTimer.current = setTimeout(() => {
      setIsEditingLocal(true);
    }, 500); // 500ms 후 편집 모드로 전환
  };

  // 길게 누르기 끝났을 때 타이머 해제
  const handleLongPressEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current); // 길게 누르기 타이머 해제
    }
  };

  // 더블 탭 감지: 두 번의 탭이 짧은 시간 안에 발생하면 항목 삭제
  const handleDoubleTap = () => {
    const now = Date.now();
    const TAP_DELAY = 300; // 300ms 이내에 두 번의 탭이 발생하면 더블 탭으로 인식
    if (now - lastTap.current < TAP_DELAY) {
      deleteTodo(index); 
    }
    lastTap.current = now; // 마지막 탭 시간 기록
  };

  // 항목 클릭 시 완료 상태 토글
  const handleClick = () => {
    if (!isEditingLocal) {
      toggleTodo(index); // 편집 모드가 아니면 완료 상태 토글
    }
  };

  return (
    <li
      ref={(node) => drag(drop(node))} // 드래그 및 드롭 대상 설정
      onClick={handleClick} // 항목 클릭 시 완료 상태 토글
      onTouchStart={(e) => {
        handleLongPressStart(e); // 길게 누름 시작 감지
        handleDoubleTap(); // 더블 탭 감지
      }}
      onTouchEnd={handleLongPressEnd} // 길게 누름 끝 감지
      style={{
        textDecoration: todo.completed ? "line-through" : "none", 
        
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
          ref={inputRef} // 입력 필드에 포커스 설정
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)} 
          onBlur={handleBlur} // 입력 필드 포커스를 잃었을 때 편집 완료
          onKeyDown={handleKeyDown} // 엔터 키로 편집 완료
        />
      ) : (
        todo.text
      )}
    </li>
  );
}

export default TodoItemMobile;
