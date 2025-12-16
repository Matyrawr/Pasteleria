import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSearchParams, Link } from 'react-router-dom';

const PagoResultado = () => {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState(null);
  const [error, setError] = useState(null);
  const { usuarioActivo, getAuthHeader, invalidarCodigoDescuento } = useUser();

  useEffect(() => {
    const tokenWs = searchParams.get('token_ws');
    if (!tokenWs) {
      setError('No se recibió token_ws');
      return;
    }

    const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

    // Intentar primero commit (devuelve más datos). Si falla, consultar status.
    const doCommit = async () => {
      const res = await fetch(`${API}/api/transbank/commit?token_ws=${encodeURIComponent(tokenWs)}`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Error al confirmar pago');
      return json; // { status, amount, buyOrder, cardNumber, authorizationCode }
    };

    const doStatus = async () => {
      const res = await fetch(`${API}/api/transbank/status?token_ws=${encodeURIComponent(tokenWs)}`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Error al consultar estado');
      return json; // { status, amount, buyOrder }
    };

    (async () => {
      try {
        const commit = await doCommit();
        setEstado(commit);
        // Si commit exitoso y hay código de usuario, marcar como usado
        try {
          const okStatuses = ['AUTHORIZED', 'APPROVED', 'SUCCESS'];
          if (usuarioActivo?.codigoDescuento && okStatuses.includes((commit.status || '').toUpperCase())) {
            await fetch(`${API}/api/promos/mark-used?code=${encodeURIComponent(usuarioActivo.codigoDescuento)}`, {
              method: 'POST',
              headers: getAuthHeader()
            });
            invalidarCodigoDescuento();
          }
        } catch (_) {}
      } catch (err) {
        try {
          const status = await doStatus();
          setEstado(status);
          // En caso de que commit falle pero status sea exitoso, marcar usado
          try {
            const okStatuses = ['AUTHORIZED', 'APPROVED', 'SUCCESS'];
            if (usuarioActivo?.codigoDescuento && okStatuses.includes((status.status || '').toUpperCase())) {
              await fetch(`${API}/api/promos/mark-used?code=${encodeURIComponent(usuarioActivo.codigoDescuento)}`, {
                method: 'POST',
                headers: getAuthHeader()
              });
              invalidarCodigoDescuento();
            }
          } catch (_) {}
        } catch (e2) {
          setError(err.message || e2.message);
        }
      }
    })();
  }, [searchParams]);

  return (
    <section style={{ maxWidth: 700, margin: '40px auto', padding: 24, border: '1px solid #ddd', borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
      <h2 style={{ marginBottom: 12 }}>Resultado del Pago</h2>
      {!estado && !error && <p>Cargando resultado...</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {estado && (
        <div style={{ lineHeight: 1.8 }}>
          <p><strong>Estado:</strong> {estado.status}</p>
          <p><strong>Monto:</strong> {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(estado.amount || 0)}</p>
          <p><strong>Orden de compra:</strong> {estado.buyOrder}</p>
          {estado.authorizationCode && <p><strong>Código de autorización:</strong> {estado.authorizationCode}</p>}
          {estado.cardNumber && <p><strong>Últimos dígitos:</strong> {estado.cardNumber}</p>}
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <Link to="/" className="categoria-btn">Volver al inicio</Link>
        <span style={{ margin: '0 10px' }}></span>
        <Link to="/carrito" className="categoria-btn">Volver al carrito</Link>
      </div>
    </section>
  );
};

export default PagoResultado;
