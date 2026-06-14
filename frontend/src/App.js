import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Feed from './components/Feed';
import Login from './components/Login';
import Signup from './components/Signup';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <BrowserRouter>
      <NavigationBar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
