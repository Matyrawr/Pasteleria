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

 const productosBase = [

  { codigo:"TC001", tipo:"Cuadrada", tamano:"Mediana", nombre:"Torta Cuadrada de Chocolate", precio:"45.000 CLP", descripcion:"Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.", imagen: new URL('../assets/images/Torta-Cuadrada-de-Chocolate.png', import.meta.url).href },
  { codigo:"TC002", tipo:"Cuadrada", tamano:"Grande", nombre:"Torta Cuadrada de Frutas", precio:"50.000 CLP", descripcion:"Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.", imagen: new URL('../assets/images/Torta-Cuadrada-de-Frutas.png', import.meta.url).href },
  { codigo:"TT001", tipo:"Circular", tamano: "Mediana", nombre:"Torta Circular de Vainilla", precio:"40.000 CLP", descripcion:"Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.", imagen: new URL('../assets/images/Torta-Circular-de-Vainilla.png', import.meta.url).href },
  { codigo:"TT002", tipo:"Circular", tamano: "Grande", nombre:"Torta Circular de Manjar", precio:"42.000 CLP", descripcion:"Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.", imagen: new URL('../assets/images/Torta-Circular-de-Manjar.png', import.meta.url).href },
  { codigo:"PI001", tipo:"Individual", tamano: "Pequeño", nombre:"Mousse de Chocolate", precio:"5.000 CLP", descripcion:"Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.", imagen: new URL('../assets/images/Mousse-de-Chocolate.png', import.meta.url).href },
  { codigo:"PI002", tipo:"Individual", tamano: "Pequeño", nombre:"Tiramisú Clásico", precio:"5.500 CLP", descripcion:"Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.", imagen: new URL('../assets/images/Tiramisú-Clásico.png', import.meta.url).href },
  { codigo:"PSA001", tipo:"Sin Azúcar", tamano: "Mediana", nombre:"Torta Sin Azúcar de Naranja", precio:"48.000 CLP", descripcion:"Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.", imagen: new URL('../assets/images/Torta-Sin-Azúcar-de-Naranja.png', import.meta.url).href },
  { codigo:"PSA002", tipo:"Sin Azúcar", tamano: "Grande", nombre:"Cheesecake Sin Azúcar", precio:"47.000 CLP", descripcion:"Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.", imagen: new URL('../assets/images/Cheesecake-Sin-Azúcar.png', import.meta.url).href },
  { codigo:"PT001", tipo:"Tradicional", tamano: "Pequeño", nombre:"Empanada de Manzana", precio:"3.000 CLP", descripcion:"Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.", imagen: new URL('../assets/images/Empanada-de-Manzana.png', import.meta.url).href },
  { codigo:"PT002", tipo:"Tradicional", tamano: "Pequeño", nombre:"Tarta de Santiago", precio:"6.000 CLP", descripcion:"Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.", imagen: new URL('../assets/images/Tarta-de-Santiago.png', import.meta.url).href },
  { codigo:"PG001", tipo:"Sin Gluten", tamano: "Pequeño", nombre:"Brownie Sin Gluten", precio:"4.000 CLP", descripcion:"Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.", imagen: new URL('../assets/images/Brownie-Sin-Gluten.png', import.meta.url).href },
  { codigo:"PG002", tipo:"Sin Gluten", tamano: "Pequeño", nombre:"Pan Sin Gluten", precio:"3.500 CLP", descripcion:"Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.", imagen: new URL('../assets/images/Pan-Sin-Gluten.png', import.meta.url).href },
  { codigo:"PV001", tipo:"Vegana", tamano: "Mediana", nombre:"Torta Vegana de Chocolate", precio:"50.000 CLP", descripcion:"Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.", imagen: new URL('../assets/images/Torta-Vegana-de-Chocolate.png', import.meta.url).href },
  { codigo:"PV002", tipo:"Vegana", tamano: "Pequeño", nombre:"Galletas Veganas de Avena", precio:"4.500 CLP", descripcion:"Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.", imagen: new URL('../assets/images/Galletas-Veganas-de-Avena.png', import.meta.url).href },
  { codigo:"TE001", tipo:"Especial", tamano: "Grande", nombre:"Torta Especial de Cumpleaños", precio:"55.000 CLP", descripcion:"Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.", imagen: new URL('../assets/images/Torta-Especial-de-Cumpleaños.png', import.meta.url).href },
  { codigo:"TE002", tipo:"Especial", tamano: "Grande", nombre:"Torta Especial de Boda", precio:"60.000 CLP", descripcion:"Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.", imagen: new URL('../assets/images/Torta-Especial-de-Boda.png', import.meta.url).href },
 ];

  const [productos, setProductos] = useState(productosBase);
  const [productosFiltrados, setProductosFiltrados] = useState(productosBase);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroTamano, setFiltroTamano] = useState("Todos");
  const [stockPorNombre, setStockPorNombre] = useState({});

  // Función para cargar productos dinámicos desde backend y mezclar con base
  const refreshProductos = async () => {
    try {
      const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
      const r = await fetch(`${API}/api/productos`);
      const lista = r.ok ? await r.json() : [];
      if (!Array.isArray(lista)) return;

      // Mapear stock por nombre
      const mapa = {};
      lista.forEach(p => {
        if (p?.nombre) mapa[p.nombre] = Number(p.stock ?? 0);
      });
      setStockPorNombre(mapa);

      // Mapear productos backend a esquema mínimo del catálogo
      const backendProductos = lista.map(p => ({
        codigo: p.id ? `BK-${p.id}` : (p.codigo || p.nombre),
        tipo: p.categoria || 'Backend',
        tamano: 'N/A',
        nombre: p.nombre,
        precio: `${Number(p.precio ?? 0).toLocaleString('es-CL')} CLP`,
        descripcion: p.descripcion || '',
        imagen: (() => {
          const url = p.imageUrl;
          if (!url) return undefined;
          // Si es URL absoluta (http/https), usar tal cual; si es ruta relativa (/uploads/..), prefijar API
          if (/^https?:\/\//i.test(url)) return url;
          return `${API}${url.startsWith('/') ? url : `/${url}`}`;
        })()
      }));

      const merged = [...productosBase, ...backendProductos];
      setProductos(merged);
      setProductosFiltrados(merged);
    } catch (_) {}
  };

  // Cargar al montar
  useEffect(() => { refreshProductos(); }, []);

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
    setFiltroTamano,
    stockPorNombre,
    refreshProductos
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
