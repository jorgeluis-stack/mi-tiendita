// src/context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("super-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("super-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // EL ESCUDO: Reconoce 'pieza', 'Pieza', 'pz', 'PZ' ignorando espacios
  const esPieza = (unit) => {
    if (!unit) return false;
    const normalizado = unit.toLowerCase().trim();
    return normalizado === 'pieza' || normalizado === 'pz';
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) => 
      prev.map(item => {
        if (item.id === id) {
          let newQty;
          if (esPieza(item.unit)) {
            // Para piezas: forzar SIEMPRE entero absoluto, sin importar el valor de amount
            const currentQty = item.quantity || 1;
            newQty = Math.max(1, Math.round(currentQty + amount));
          } else {
            // Para medidas: decimales, mínimo 0.25
            newQty = Math.max(0.25, item.quantity + amount);
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => {
        if (esPieza(item.unit)) {
          return item.quantity >= 1;
        } else {
          return item.quantity >= 0.25;
        }
      })
    );
  };

  const updateQuantityForPieces = (id, newQuantity) => {
    setCart((prev) => 
      prev.map(item => {
        if (item.id === id && esPieza(item.unit)) {
          // Forzar valor entero absoluto para piezas
          const roundedQty = Math.max(1, Math.round(newQuantity));
          return { ...item, quantity: roundedQty };
        }
        return item;
      }).filter(item => {
        if (esPieza(item.unit)) {
          return item.quantity >= 1;
        } else {
          return item.quantity >= 0.25;
        }
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateQuantityForPieces, clearCart, total, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);