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
  const DESCUENTO_MAYOR_50_PCT = 0.50; // 50%
  const DESCUENTO_CODIGO_PCT = 0.05;   // 5% por defecto para otros códigos (solo si backend no provee)

  // Porcentaje de descuento según backend (fuente de verdad)
  const getCodigoDescuentoPct = () => {
    const pct = typeof usuarioActivo?.porcentajeCodigo === 'number' ? usuarioActivo.porcentajeCodigo : 0;
    return pct > 0 ? pct : 0;
  };

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
    const subtotal = getSubtotal();
    if (!usuarioActivo) return 0;
    let descuento = 0;
    if (usuarioActivo.descuentoMayor50) {
      descuento += subtotal * DESCUENTO_MAYOR_50_PCT;
    }
    const pctCodigo = getCodigoDescuentoPct();
    if (usuarioActivo.codigoDescuento && pctCodigo > 0) {
      descuento += subtotal * pctCodigo;
    }
    return Math.round(descuento);
  };

  // Desglose de descuentos para UI
  const getDesgloseDescuento = () => {
    const subtotal = getSubtotal();
    if (!usuarioActivo) return [];
    const items = [];
    if (usuarioActivo.descuentoMayor50) {
      items.push({ label: 'Descuento por ser mayor de 50 años (50%)', amount: Math.round(subtotal * DESCUENTO_MAYOR_50_PCT) });
    }
    const pct = getCodigoDescuentoPct();
    if (usuarioActivo.codigoDescuento && pct > 0) {
      const code = String(usuarioActivo.codigoDescuento).trim().toUpperCase();
      const pctLabel = Math.round(pct * 100);
      const label = `Descuento por código ${code} (${pctLabel}%)`;
      items.push({ label, amount: Math.round(subtotal * pct) });
    }
    return items;
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
    getDesgloseDescuento,
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
