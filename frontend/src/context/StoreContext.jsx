
import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  
  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  
  const clearCart = () => {
    setCartItems([]);
  };

  
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    // temporary fix for project
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }
}, []);

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        user,
        setUser
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;