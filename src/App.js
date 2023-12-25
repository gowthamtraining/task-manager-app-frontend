import './App.css';
import TaskManagerApp from './components/taskmanagerapp';
export const url = process.env.REACT_APP_URL


function App() {
  return (
    <div>
      <TaskManagerApp/>
    </div>
    
  );
}

export default App;
