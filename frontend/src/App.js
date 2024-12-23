import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import Homepage from './components/Homepage';
import { Context } from './context/userContext';
function App() {
  return (
    <>
        <Router>
          <Context>
            <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/chats" element={<Chat/>}></Route>
            <Route path="/" element={<Homepage/>}></Route>
            </Routes>
          </Context>
        </Router>
    </>
  );
}

export default App;
