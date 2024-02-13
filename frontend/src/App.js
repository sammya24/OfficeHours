import logo from './logo.svg';
import './App.css';
import Login from "./Components/Login"
import Signup from './Components/Signup';
import PendingApproval from './Components/PendingApproval'; 
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from "./Components/Home"
import Dashboard from './Components/Dashboard';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from './firebase'; 


const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false); 

      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);


  if (loading) {  
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
