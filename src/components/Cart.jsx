import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getDescuento,
    getTotal,
    clearCart
  } = useCart();

  const { usuarioActivo } = useUser();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const handleQuantityChange = (productCode, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity >= 0) {
      updateQuantity(productCode, quantity);
    }
  };

  return (
    <div>
      <section id="carrito">

        {/* BOTÓN VOLVER ATRÁS */}
        <button
          onClick={() => navigate(-1)}
          className="categoria-btn"
          style={{ marginBottom: '15px' }}
        >
          Volver atrás
        </button>

        <h2>🛒 Carrito de Compras</h2>

        {cartItems.length === 0 ? (
          <p>Tu carrito está vacío. ¡Agrega algunos productos deliciosos!</p>
        ) : (
          <>
            <div id="items-carrito">
              {cartItems.map(item => {
                const precioUnitario = parseFloat(
                  item.producto.precio.replace(/\./g, '').replace(' CLP', '')
                );
                const precioTotal = precioUnitario * item.cantidad;

                return (
                  <div key={item.producto.codigo} className="item-carrito">
                    <div className="item-info">
                      <h3>{item.producto.nombre}</h3>
                      <p><strong>Código:</strong> {item.producto.codigo}</p>
                      <p><strong>Tipo:</strong> {item.producto.tipo}</p>
                      <p><strong>Tamaño:</strong> {item.producto.tamano}</p>
                      <p><strong>Precio unitario:</strong> {formatPrice(precioUnitario)}</p>
                      {item.mensajePersonalizado && (
                        <p>
                          <strong>Mensaje personalizado:</strong> {item.mensajePersonalizado}
                        </p>
                      )}
                    </div>

                    <div className="item-controls">
                      <div className="cantidad-control">
                        <label>Cantidad:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.producto.codigo,
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <p className="precio-total">
                        <strong>Total:</strong> {formatPrice(precioTotal)}
                      </p>

                      <button
                        className="btn-remover"
                        onClick={() => removeFromCart(item.producto.codigo)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="carrito-total">
              <p><strong>Subtotal:</strong> {formatPrice(getSubtotal())}</p>

              {getDescuento() > 0 && (
                <p>
                  <strong>Descuento ({usuarioActivo?.descuento}%):</strong>
                  {' '} -{formatPrice(getDescuento())}
                </p>
              )}

              <h3>Total del carrito: {formatPrice(getTotal())}</h3>

              <div className="carrito-acciones">
                <button className="btn-limpiar" onClick={clearCart}>
                  Limpiar Carrito
                </button>

                {!usuarioActivo && (
                  <p style={{ color: 'red', margin: '10px 0' }}>
                    Debes iniciar sesión para proceder al pago.
                  </p>
                )}

                <button
                  className="btn-comprar"
                  disabled={!usuarioActivo}
                  onClick={() => {
                    if (usuarioActivo) {
                      alert(
                        `Pago simulado exitoso. Total pagado: ${formatPrice(
                          getTotal()
                        )}`
                      );
                      clearCart();
                    }
                  }}
                >
                  Proceder al Pago
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Cart;
