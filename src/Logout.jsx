import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = () => {
  const navigate = useNavigate();
  let timeout;

  const resetTimeout = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      localStorage.clear();
      alert("You have been logged out due to inactivity.");
      navigate("/login");
    }, 30000); // 30 seconds
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);

    resetTimeout(); // Start timeout on mount

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
    };
  }, [navigate]);

  return null;
};

export default useAutoLogout;
