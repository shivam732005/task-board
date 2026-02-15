import { createContext, useContext, useReducer, useEffect } from "react";

const BoardContext = createContext();

const initialState = {
  tasks: [],
  activityLog: []
};

function boardReducer(state, action) {
  switch (action.type) {

    case "LOAD_BOARD":
      return action.payload;

    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        activityLog: [
          { message: "Task created", time: new Date().toISOString() },
          ...state.activityLog
        ]
      };

    case "MOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
        activityLog: [
          { message: "Task moved", time: new Date().toISOString() },
          ...state.activityLog
        ]
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => task.id !== action.payload
        ),
        activityLog: [
          { message: "Task deleted", time: new Date().toISOString() },
          ...state.activityLog
        ]
      };

    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, title: action.payload.title }
            : task
        ),
        activityLog: [
          { message: "Task edited", time: new Date().toISOString() },
          ...state.activityLog
        ]
      };

      case "RESET_BOARD":
  return {
    tasks: [],
    activityLog: []
  };


    default:
      return state;
  }
}


export function BoardProvider({ children }) {
//   const [state, dispatch] = useReducer(boardReducer, initialState);

const [state, dispatch] = useReducer(
  boardReducer,
  initialState,
  (initial) => {
    const saved = localStorage.getItem("board");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initial;
      }
    }
    return initial;
  }
);


  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(state));
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  return useContext(BoardContext);
}
