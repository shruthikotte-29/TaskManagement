import { useState, useEffect } from "react";

// Sample Data
const initialData = [
  {
    phaseName: "ToDo",
    itemList: [
      {
        id: "11",
        taskName: "Pagination",
        assignee: "Praneet",
        startDate: "2024-10-22",
        priority: "4",
      },
      {
        id: "12",
        taskName: "Logo",
        assignee: "Vybhavi",
        startDate: "2024-09-15",
        priority: "1",
      },
    ],
  },
  {
    phaseName: "InProgress",
    itemList: [
      {
        id: "123",
        taskName: "Filter button",
        assignee: "Shiva",
        startDate: "2024-10-22",
        priority: "3",
      },
      {
        id: "124",
        taskName: "Images shown incorrect",
        assignee: "Ankitha",
        startDate: "2024-10-22",
        priority: "4",
      },
    ],
  },
  {
    phaseName: "Completed",
    itemList: [
      {
        id: "1234",
        taskName: "Fonts in home page",
        assignee: "Shyam",
        startDate: "2024-10-22",
        priority: "2",
      },
    ],
  },
];

function TaskBoard({ phaseName, itemList, onDrop }) {
  return (
    <div
      className="w-full p-2 border"
      onDragOver={(e) => e.preventDefault()} // Allows drop
      onDrop={onDrop} // Handles drop
    >
      <p>
        <strong>{phaseName}</strong>
      </p>
      {itemList.map((itemInfo) => (
        <div
          key={itemInfo.id}
          className="border w-full flex flex-col gap-1 bg-gray-100 rounded mb-2 p-2"
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData(
              "task",
              JSON.stringify({ itemInfo, phaseName })
            )
          }
        >
          <p>
            <strong>Task:</strong> {itemInfo.taskName}
          </p>
          <p>
            <strong>Assignee:</strong> {itemInfo.assignee}
          </p>
          <p>
            <strong>Start Date:</strong> {itemInfo.startDate}
          </p>
          <p>
            <strong>Priority:</strong> {itemInfo.priority}
          </p>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [taskData, setTaskData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    phaseName: "ToDo", // Default phase name
    taskName: "",
    assignee: "",
    startDate: "",
    priority: "",
  });

  // Load initial data from localStorage or use sample data
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("taskData"));
    if (storedData) {
      setTaskData(storedData);
    } else {
      setTaskData(initialData);
    }
  }, []);

  // Save task data to localStorage
  const saveDataToLocalStorage = (data) => {
    localStorage.setItem("taskData", JSON.stringify(data));
  };

  // Handle the drop event
  const handleDrop = (event, newPhaseName) => {
    const { itemInfo, phaseName: oldPhaseName } = JSON.parse(
      event.dataTransfer.getData("task")
    );

    if (oldPhaseName === newPhaseName) return;

    const updatedTaskData = taskData.map((phase) => {
      if (phase.phaseName === oldPhaseName) {
        return {
          ...phase,
          itemList: phase.itemList.filter((item) => item.id !== itemInfo.id),
        };
      } else if (phase.phaseName === newPhaseName) {
        return {
          ...phase,
          itemList: [...phase.itemList, itemInfo],
        };
      }
      return phase;
    });

    setTaskData(updatedTaskData);
    saveDataToLocalStorage(updatedTaskData); // Save updated data to localStorage
  };

  
  const openModal = () => {
    setShowModal(true);
  };

 
  const closeModal = () => {
    setShowModal(false);
    setNewTask({
      phaseName: "ToDo",
      taskName: "",
      assignee: "",
      startDate: "",
      priority: "",
    });
  };

  // Handle save for the new task
  const handleSaveTask = () => {
    const newId = Math.random().toString(36).substr(2, 9); // Create random ID
    const updatedTaskData = taskData.map((phase) => {
      if (phase.phaseName === newTask.phaseName) {
        return {
          ...phase,
          itemList: [
            ...phase.itemList,
            { ...newTask, id: newId }, // Add new task with generated ID
          ],
        };
      }
      return phase;
    });

    setTaskData(updatedTaskData);
    saveDataToLocalStorage(updatedTaskData); // Save updated data to localStorage
    closeModal(); 
  };

  return (
    <div className="h-full w-full flex flex-col text-center p-4">
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">Task Management System</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40"
          onClick={openModal}
        >
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 h-full mt-4">
        {taskData &&
          taskData.map((taskInfo) => (
            <div
              key={taskInfo.phaseName}
              className="border-2 rounded flex justify-center"
            >
              <TaskBoard
                phaseName={taskInfo.phaseName}
                itemList={taskInfo.itemList}
                onDrop={(e) => handleDrop(e, taskInfo.phaseName)}
              />
            </div>
          ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>

            {/* Dropdown for Phase Name */}
            <select
              className="border p-2 mb-2 w-full"
              value={newTask.phaseName}
              onChange={(e) =>
                setNewTask({ ...newTask, phaseName: e.target.value })
              }
            >
              <option value="ToDo">ToDo</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
            </select>

            <input
              type="text"
              className="border p-2 mb-2 w-full"
              placeholder="Task Name"
              value={newTask.taskName}
              onChange={(e) =>
                setNewTask({ ...newTask, taskName: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 mb-2 w-full"
              placeholder="Assignee"
              value={newTask.assignee}
              onChange={(e) =>
                setNewTask({ ...newTask, assignee: e.target.value })
              }
            />
            <input
              type="date"
              className="border p-2 mb-2 w-full"
              placeholder="Start Date"
              value={newTask.startDate}
              onChange={(e) =>
                setNewTask({ ...newTask, startDate: e.target.value })
              }
            />
            <input
              type="number"
              className="border p-2 mb-2 w-full"
              placeholder="Priority (1-5)"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleSaveTask}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
