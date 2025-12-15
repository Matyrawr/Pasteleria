import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import fallbackImage from '../assets/images/Pasteles-Varios.png';

const Productos = () => {
  const {
    productos,
    productosFiltrados,
    filtroTipo,
    filtroTamano,
    setFiltroTipo,
    setFiltroTamano
  } = useProduct();

  const { addToCart } = useCart();
  const [mensajesPersonalizados, setMensajesPersonalizados] = useState({});
  const navigate = useNavigate();

  const tipos = ["Todos", ...new Set(productos.map(p => p.tipo))];
  const tamanos = ["Todos", ...new Set(productos.map(p => p.tamano))];

  const handleMensajeChange = (codigo, mensaje) => {
    setMensajesPersonalizados(prev => ({
      ...prev,
      [codigo]: mensaje
    }));
  };

  const agregarAlCarrito = (producto) => {
    const mensaje = mensajesPersonalizados[producto.codigo] || '';
    addToCart(producto, mensaje);
    alert(
      `Producto "${producto.nombre}" agregado al carrito${
        mensaje ? ` con mensaje: "${mensaje}"` : ''
      }`
    );
  };

  return (
    <div>
      <section id="catalogo">

        {/* Botón volver atrás */}
        <button
          onClick={() => navigate(-1)}
          className="categoria-btn"
          style={{ marginBottom: '15px' }}
        >
          Volver atrás
        </button>

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
            productosFiltrados.map(prod => {
              const imagen = prod.imagen || fallbackImage;
              return (
                <div key={prod.codigo} className="producto-card">
                  {imagen && (
                    <div className="producto-media">
                      <img
                        src={imagen}
                        alt={`Imagen de ${prod.nombre}`}
                        className="producto-img"
                      />
                    </div>
                  )}

                  <h3 className="producto-nombre">{prod.nombre}</h3>
                  <p className="producto-codigo">
                    <strong>Código:</strong> {prod.codigo}
                  </p>
                  <p><strong>Tipo:</strong> {prod.tipo}</p>
                  <p><strong>Tamaño:</strong> {prod.tamano}</p>
                  <p className="producto-precio">
                    <strong>Precio:</strong> {prod.precio}
                  </p>
                  <p className="producto-descripcion">{prod.descripcion}</p>

                  <label>Mensaje personalizado:</label>
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje"
                    className="mensaje-personalizado"
                    value={mensajesPersonalizados[prod.codigo] || ''}
                    onChange={(e) =>
                      handleMensajeChange(prod.codigo, e.target.value)
                    }
                  />

                  <button
                    className="btn-agregar"
                    onClick={() => agregarAlCarrito(prod)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              );
            })
          )}
        </div>

      </section>
    </div>
  );
};

export default Productos;
