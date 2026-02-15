import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useBoard } from "../context/BoardContext";

function Board() {
  const { logout, user } = useAuth();
  const { state, dispatch } = useBoard();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAddTask = () => {
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      description: "",
      priority,
      dueDate,
      tags: [],
      createdAt: new Date().toISOString(),
      status: "Todo"
    };

    dispatch({ type: "ADD_TASK", payload: newTask });

    setTitle("");
    setPriority("Low");
    setDueDate("");
  };

  const handleSaveEdit = (id) => {
    if (!editValue.trim()) return;

    dispatch({
      type: "EDIT_TASK",
      payload: { id, title: editValue }
    });

    setEditingId(null);
    setEditValue("");
  };

  const getFilteredTasks = (status) => {
    let tasks = state.tasks.filter((task) => task.status === status);

    if (searchTerm) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPriority !== "All") {
      tasks = tasks.filter((task) => task.priority === filterPriority);
    }

    if (sortOrder === "asc") {
      tasks = tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    if (sortOrder === "desc") {
      tasks = tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
    }

    return tasks;
  };

  const renderTask = (task) => (
    <div
      key={task.id}
      style={{
        marginBottom: "15px",
        border: "1px solid #ccc",
        padding: "10px"
      }}
    >
      {editingId === task.id ? (
        <>
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <button onClick={() => handleSaveEdit(task.id)}>Save</button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </>
      ) : (
        <>
          <div style={{ fontWeight: "bold" }}>{task.title}</div>
          <small>Priority: {task.priority}</small>
          <br />
          <small>Due: {task.dueDate || "Not set"}</small>
          <br />

          <button
            onClick={() => {
              setEditingId(task.id);
              setEditValue(task.title);
            }}
          >
            Edit
          </button>

          {task.status !== "Todo" && (
            <button
              onClick={() =>
                dispatch({
                  type: "MOVE_TASK",
                  payload: { id: task.id, status: "Todo" }
                })
              }
            >
              Move to Todo
            </button>
          )}

          {task.status !== "Doing" && (
            <button
              onClick={() =>
                dispatch({
                  type: "MOVE_TASK",
                  payload: { id: task.id, status: "Doing" }
                })
              }
            >
              Move to Doing
            </button>
          )}

          {task.status !== "Done" && (
            <button
              onClick={() =>
                dispatch({
                  type: "MOVE_TASK",
                  payload: { id: task.id, status: "Done" }
                })
              }
            >
              Move to Done
            </button>
          )}

          <button
            onClick={() =>
              dispatch({
                type: "DELETE_TASK",
                payload: task.id
              })
            }
          >
            Delete
          </button>
        </>
      )}
    </div>
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1>Task Board</h1>
      <p>Welcome, {user?.email}</p>

      <button onClick={logout}>Logout</button>

      <button
        onClick={() => {
          const confirmReset = window.confirm(
            "Are you sure you want to reset the board?"
          );
          if (confirmReset) {
            dispatch({ type: "RESET_BOARD" });
          }
        }}
        style={{ marginLeft: "10px" }}
      >
        Reset Board
      </button>

      <hr />

      <h3>Add Task</h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button onClick={handleAddTask}>Add</button>

      <hr />

      <h3>Search & Filter</h3>

      <input
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
      >
        <option value="All">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="none">No Sort</option>
        <option value="asc">Sort by Due Date ↑</option>
        <option value="desc">Sort by Due Date ↓</option>
      </select>

      <hr />

      <div style={{ display: "flex", gap: "40px" }}>
        <div>
          <h3>Todo</h3>
          {getFilteredTasks("Todo").map(renderTask)}
        </div>

        <div>
          <h3>Doing</h3>
          {getFilteredTasks("Doing").map(renderTask)}
        </div>

        <div>
          <h3>Done</h3>
          {getFilteredTasks("Done").map(renderTask)}
        </div>
      </div>

      <hr />

      <h3>Activity Log</h3>

      {state.activityLog.slice(0, 10).map((log, index) => (
        <div key={index}>
          <small>
            {log.message} — {new Date(log.time).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default Board;
