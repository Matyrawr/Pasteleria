import { useState } from 'react';
import { useProduct } from '../context/ProductContext';

const Productos = () => {
  const { productosFiltrados, filtroTipo, filtroTamano, setFiltroTipo, setFiltroTamano } = useProduct();
  const [mensajesPersonalizados, setMensajesPersonalizados] = useState({});

  const tipos = ["Todos", ...new Set(useProduct().productos.map(p => p.tipo))];
  const tamanos = ["Todos", ...new Set(useProduct().productos.map(p => p.tamano))];

  const handleMensajeChange = (codigo, mensaje) => {
    setMensajesPersonalizados({
      ...mensajesPersonalizados,
      [codigo]: mensaje
    });
  };

  const agregarAlCarrito = (producto) => {
    const mensaje = mensajesPersonalizados[producto.codigo] || '';
    alert(`Producto "${producto.nombre}" agregado al carrito${mensaje ? ` con mensaje: "${mensaje}"` : ''}`);
    // Aquí iría la lógica para agregar al carrito
  };

  return (
    <div>
      <section id="catalogo">
        <h2>Catálogo</h2>
      <div id="categorias">
        <div>
          <strong>Filtrar por Tipo:</strong>
          {tipos.map(tipo => (
            <button
              key={tipo}
              className={`categoria-btn ${filtroTipo === tipo ? 'active' : ''}`}
              onClick={() => setFiltroTipo(tipo)}
            >
              {tipo}
            </button>
          ))}
        </div>
        <div>
          <strong>Filtrar por Tamaño:</strong>
          {tamanos.map(tam => (
            <button
              key={tam}
              className={`categoria-btn ${filtroTamano === tam ? 'active' : ''}`}
              onClick={() => setFiltroTamano(tam)}
            >
              {tam}
            </button>
          ))}
        </div>
      </div>
      <div id="productos">
        {productosFiltrados.length === 0 ? (
          <p>No hay productos en esta categoría.</p>
        ) : (
          productosFiltrados.map(prod => (
            <div key={prod.codigo} className="producto-card">
              <h3 className="producto-nombre">{prod.nombre}</h3>
              <p className="producto-codigo"><strong>Código:</strong> {prod.codigo}</p>
              <p><strong>Tipo:</strong> {prod.tipo}</p>
              <p><strong>Tamaño:</strong> {prod.tamano}</p>
              <p className="producto-precio"><strong>Precio:</strong> {prod.precio}</p>
              <p className="producto-descripcion">{prod.descripcion}</p>
              <label>Mensaje personalizado:</label>
              <input
                type="text"
                placeholder="Escribe tu mensaje"
                className="mensaje-personalizado"
                value={mensajesPersonalizados[prod.codigo] || ''}
                onChange={(e) => handleMensajeChange(prod.codigo, e.target.value)}
              />
              <button
                className="btn-agregar"
                onClick={() => agregarAlCarrito(prod)}
              >
                Agregar al carrito
              </button>
            </div>
          ))
        )}
      </div>
      </section>
    </div>
  );
};

export default Productos;
