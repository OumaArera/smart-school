import React from 'react';
import { useNavigate } from 'react-router-dom';
import livingFaithLogo from './images/SCHOOL LOGO.PNG';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-100">
      <img src={livingFaithLogo} alt="Living Faith Education Centre" className="w-1/3 mb-8" />
      <button
        onClick={() => navigate('/login')}
        className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default Home;
