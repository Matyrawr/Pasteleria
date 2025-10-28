import { createContext, useContext, useState, useEffect } from 'react';

// ------------------ PRODUCTOS ------------------
const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {

 const productos = [

  { codigo:"TC001", tipo:"Cuadrada", tamano:"Mediana", nombre:"Torta Cuadrada de Chocolate", precio:"45.000 CLP", descripcion:"Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales." },
  { codigo:"TC002", tipo:"Cuadrada", tamano:"Grande", nombre:"Torta Cuadrada de Frutas", precio:"50.000 CLP", descripcion:"Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones." },
  { codigo:"TT001", tipo:"Circular", tamano: "null", nombre:"Torta Circular de Vainilla", precio:"40.000 CLP", descripcion:"Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión."},
  { codigo:"TT002", tipo:"Circular", tamano: "null", nombre:"Torta Circular de Manjar", precio:"42.000 CLP", descripcion:"Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos."},
  { codigo:"PI001", tipo:"Individual", tamano: "null", nombre:"Mousse de Chocolate", precio:"5.000 CLP", descripcion:"Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate."},
  { codigo:"PI002", tipo:"Individual", tamano: "null", nombre:"Tiramisú Clásico", precio:"5.500 CLP", descripcion:"Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida."},
  { codigo:"PSA001", tipo:"Sin Azúcar", tamano: "null", nombre:"Torta Sin Azúcar de Naranja", precio:"48.000 CLP", descripcion:"Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables."},
  { codigo:"PSA002", tipo:"Sin Azúcar", tamano: "null", nombre:"Cheesecake Sin Azúcar", precio:"47.000 CLP", descripcion:"Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa."},
  { codigo:"PT001", tipo:"Tradicional", tamano: "null", nombre:"Empanada de Manzana", precio:"3.000 CLP", descripcion:"Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda."},
  { codigo:"PT002", tipo:"Tradicional", tamano: "null", nombre:"Tarta de Santiago", precio:"6.000 CLP", descripcion:"Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos."},
  { codigo:"PG001", tipo:"Sin Gluten", tamano: "null", nombre:"Brownie Sin Gluten", precio:"4.000 CLP", descripcion:"Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor."},
  { codigo:"PG002", tipo:"Sin Gluten", tamano: "null", nombre:"Pan Sin Gluten", precio:"3.500 CLP", descripcion:"Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida."},
  { codigo:"PV001", tipo:"Vegana", tamano: "null", nombre:"Torta Vegana de Chocolate", precio:"50.000 CLP", descripcion:"Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos."},
  { codigo:"PV002", tipo:"Vegana", tamano: "null", nombre:"Galletas Veganas de Avena", precio:"4.500 CLP", descripcion:"Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano."},
  { codigo:"TE001", tipo:"Especial", tamano: "null", nombre:"Torta Especial de Cumpleaños", precio:"55.000 CLP", descripcion:"Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos."},
  { codigo:"TE002", tipo:"Especial", tamano: "null", nombre:"Torta Especial de Boda", precio:"60.000 CLP", descripcion:"Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda."},

 ];

  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroTamano, setFiltroTamano] = useState("Todos");

  useEffect(() => {
    filtrarProductos();
  }, [filtroTipo, filtroTamano]);

  const filtrarProductos = () => {
    let filtrados = productos;

    if (filtroTipo !== "Todos") {
      filtrados = filtrados.filter(p => p.tipo === filtroTipo);
    }
    if (filtroTamano !== "Todos") {
      filtrados = filtrados.filter(p => p.tamano === filtroTamano);
    }

    setProductosFiltrados(filtrados);
  };

  const value = {
    productos,
    productosFiltrados,
    filtroTipo,
    filtroTamano,
    setFiltroTipo,
    setFiltroTamano
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
