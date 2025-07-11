import { useState, useEffect } from "react";
import { UserContext } from "./UserContext"; 

export const UserProvider = ({ children }) => {
  const [position, setPosition] = useState(() => {
    const stored = localStorage.getItem("position");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (position) {
      localStorage.setItem("position", JSON.stringify(position));
    } else {
      localStorage.removeItem("position");
    }
  }, [position]);

  return (
    <UserContext.Provider value={{ position, setPosition }}>
      {children}
    </UserContext.Provider>
  );
};
