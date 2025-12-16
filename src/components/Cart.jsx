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
    getDesgloseDescuento,
    getTotal,
    clearCart
  } = useCart();

  const { usuarioActivo, estaAutenticado, getAuthHeader, invalidarCodigoDescuento } = useUser();

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

  const iniciarPago = async () => {
    if (!estaAutenticado()) {
      alert('⛔ Error: debes iniciar sesión para pagar.');
      return;
    }

    try {
      const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
      // Validar código promocional antes de crear transacción (para evitar reuso)
      if (usuarioActivo?.codigoDescuento) {
        try {
          const resVal = await fetch(`${API}/api/promos/validate?code=${encodeURIComponent(usuarioActivo.codigoDescuento)}`, {
            headers: getAuthHeader()
          });
          const val = await resVal.json().catch(() => ({}));
          if (!resVal.ok || !val?.valid || !val?.percent) {
            alert('Tu código promocional ya fue utilizado o no es válido. Se continuará sin descuento por código.');
            invalidarCodigoDescuento();
          }
        } catch (_) {
          // Si no se puede validar, continuar de todas formas
        }
      }
      const res = await fetch(`${API}/api/transbank/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ amount: getTotal() })
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || 'Error creando transacción');
      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        throw new Error('Respuesta inválida de Transbank');
      }
      const url = payload?.url;
      const token = payload?.token;
      if (!url || !token) throw new Error('Respuesta inválida de Transbank');

      // Transbank requiere enviar token_ws por POST; creamos un formulario temporal
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = token;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      alert('No se pudo iniciar el pago: ' + e.message);
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
                <div>
                  <strong>Descuentos:</strong>
                  <ul style={{ margin: '6px 0 0 18px' }}>
                    {getDesgloseDescuento().map((d, idx) => (
                      <li key={idx}>- {d.label}: {formatPrice(d.amount)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {usuarioActivo?.tortaGratis && (
                <p>🎂 Beneficio: torta de cumpleaños gratis disponible.</p>
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
                  onClick={iniciarPago}
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
