import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <h1>Online Reminder System</h1>
      {token && <div className="clock">{currentTime.toLocaleString()}</div>}
      {token && <button onClick={handleLogout} className="logout-btn">Logout</button>}
    </header>
  );
};

export default Header; 