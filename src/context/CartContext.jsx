import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

// ------------------ CARRITO ------------------
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { usuarioActivo } = useUser();
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCart) {
      setCartItems(storedCart);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (product, customMessage = '') => {
    const existingItem = cartItems.find(item => item.producto.codigo === product.codigo);

    if (existingItem) {
      // Si ya existe, incrementar cantidad
      setCartItems(cartItems.map(item =>
        item.producto.codigo === product.codigo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      // Si no existe, agregar nuevo item
      setCartItems([...cartItems, {
        producto: product,
        cantidad: 1,
        mensajePersonalizado: customMessage
      }]);
    }
  };

  // Remover producto del carrito
  const removeFromCart = (productCode) => {
    setCartItems(cartItems.filter(item => item.producto.codigo !== productCode));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productCode, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productCode);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.producto.codigo === productCode
        ? { ...item, cantidad: newQuantity }
        : item
    ));
  };

  // Calcular subtotal del carrito (sin descuento)
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = parseFloat(item.producto.precio.replace(/\./g, '').replace(' CLP', ''));
      return total + (precio * item.cantidad);
    }, 0);
  };

  // Calcular descuento aplicado
  const getDescuento = () => {
    if (!usuarioActivo || !usuarioActivo.descuento) return 0;
    const subtotal = getSubtotal();
    return subtotal * (usuarioActivo.descuento / 100);
  };

  // Calcular total del carrito (con descuento aplicado)
  const getTotal = () => {
    const subtotal = getSubtotal();
    const descuento = getDescuento();
    return subtotal - descuento;
  };

  // Obtener cantidad total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getDescuento,
    getTotal,
    getTotalItems,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
