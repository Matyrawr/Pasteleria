import { createContext, useContext, useState, useEffect } from 'react';

// Utilidad para decodificar payload de JWT sin librerías externas
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (_) {
    return null;
  }
}

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ======================================================
     SESIÓN PERSISTENTE + MODO TEST ADMIN (FRONT ONLY)
     ====================================================== */
  useEffect(() => {
    // Requerimiento: al iniciar la app no debe haber sesiones activas
    // Limpiar cualquier token/usuario persistido al cargar
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioActivo(null);
    setLoading(false);
  }, []);

  /* ================== LOGIN REAL (LISTO PARA BACKEND) ================== */
  const loginUsuario = async (event, formData) => {
    event.preventDefault();

    try {
      const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
      const response = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        return {
          success: false,
          message: data.message || 'Credenciales incorrectas'
        };
      }

      // Guardar token y derivar rol desde el JWT
      localStorage.setItem('token', data.token);
      const payload = parseJwt(data.token);
      const rol = payload?.authorities?.[0] || payload?.role || 'USER';
      const email = payload?.sub || formData.email;
      const nombre = payload?.nombre || email;
      const usuario = { nombre, email, rol };

      setUsuarioActivo(usuario);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      return { success: true, message: 'Inicio de sesión exitoso' };

    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  };

  /* ================== REGISTRO ================== */
  const registrarUsuario = async (event, formData) => {
    event.preventDefault();
    try {
      const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
      // Adaptar tipos: edad como número, fechaNacimiento ISO (yyyy-MM-dd)
      const payload = {
        nombre: formData.nombre?.trim(),
        email: formData.email?.trim(),
        edad: formData.edad ? Number(formData.edad) : null,
        fechaNacimiento: formData.fechaNacimiento || null,
        password: formData.password
      };

      const response = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'No se pudo registrar el usuario'
        };
      }

      // Al registrar, el backend devuelve token; iniciar sesión automáticamente
      if (data.token) {
        localStorage.setItem('token', data.token);
        const payloadJwt = parseJwt(data.token);
        const rol = payloadJwt?.authorities?.[0] || payloadJwt?.role || 'USER';
        const email = payloadJwt?.sub || payload.email;
        const nombre = payloadJwt?.nombre || payload.nombre;

        // Beneficios por registro: cumpleaños y/o código (validado en backend)
        const today = new Date();
        const fechaNac = payload.fechaNacimiento ? new Date(`${payload.fechaNacimiento}T00:00:00`) : null;
        const esCumple = !!(fechaNac && today.getDate() === fechaNac.getDate() && today.getMonth() === fechaNac.getMonth());
        const codigo = (formData.codigo || '').trim();

        // Validar código en backend (si viene)
        let porcentajeCodigo = 0;
        let codigoNormalizado = null;
        if (codigo) {
          try {
            const token = localStorage.getItem('token');
            const resPromo = await fetch(`${API}/api/promos/validate?code=${encodeURIComponent(codigo)}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const promo = await resPromo.json().catch(() => ({}));
            if (resPromo.ok && promo && promo.valid) {
              porcentajeCodigo = (Number(promo.percent) || 0) / 100;
              codigoNormalizado = promo.code || codigo;
            }
          } catch (_) {
            // Si falla la validación, no aplicar descuento por código
            porcentajeCodigo = 0;
            codigoNormalizado = codigo;
          }
        }

        const esMayor50 = typeof payload.edad === 'number'
          ? payload.edad >= 50
          : (fechaNac ? (((today - fechaNac) / (1000*60*60*24*365.25)) >= 50) : false);

        const usuario = {
          nombre,
          email,
          rol,
          fechaNacimiento: payload.fechaNacimiento || null,
          // Torta gratis solo si cumple hoy y es correo @duocuc.cl
          tortaGratis: esCumple && String(email).toLowerCase().endsWith('@duocuc.cl'),
          codigoDescuento: codigoNormalizado || null,
          porcentajeCodigo,
          descuentoMayor50: esMayor50
        };
        setUsuarioActivo(usuario);
        localStorage.setItem('usuario', JSON.stringify(usuario));
      }

      // Mensaje de beneficios según credenciales
      const beneficios = [];
      // Cumpleaños → regalo (solo dominio @duocuc.cl)
      if (payload.fechaNacimiento) {
        const d = new Date(`${payload.fechaNacimiento}T00:00:00`);
        const esHoy = d && new Date().getDate() === d.getDate() && new Date().getMonth() === d.getMonth();
        if (esHoy && String(payload.email || '').toLowerCase().endsWith('@duocuc.cl')) {
          beneficios.push('🎉 ¡Feliz cumpleaños! (DUOC UC) Tienes una torta de regalo.');
        }
      }
      // Código de descuento validado
      if ((formData.codigo || '').trim()) {
        // Reflejar el porcentaje si lo tenemos en usuarioActivo (pudo setearse arriba)
        const pct = (usuarioActivo?.porcentajeCodigo ? Math.round(usuarioActivo.porcentajeCodigo * 100) : undefined);
        beneficios.push(pct ? `🏷️ Código aplicado: ${pct}% en tu primera compra.` : '🏷️ Código aplicado: descuento en tu primera compra.');
      }
      // Mayor de 50 años (50%)
      {
        const now = new Date();
        const fn = payload.fechaNacimiento ? new Date(`${payload.fechaNacimiento}T00:00:00`) : null;
        const mayor50 = typeof payload.edad === 'number' ? payload.edad >= 50 : (fn ? (((now - fn) / (1000*60*60*24*365.25)) >= 50) : false);
        if (mayor50) {
          beneficios.push('🧾 Descuento 50% aplicado por ser mayor de 50 años.');
        }
      }

      const mensaje = ['Registro exitoso'].concat(beneficios).join(' ');
      return { success: true, message: mensaje };
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  /* ================== LOGOUT ================== */
  const logoutUsuario = () => {
    setUsuarioActivo(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  // Invalidar código de descuento localmente (tras uso)
  const invalidarCodigoDescuento = () => {
    if (!usuarioActivo) return;
    const actualizado = { ...usuarioActivo, porcentajeCodigo: 0, codigoDescuento: null };
    setUsuarioActivo(actualizado);
    localStorage.setItem('usuario', JSON.stringify(actualizado));
  };

  /* ================== VERIFICADORES ================== */
  const esAdmin = () => {
    const r = usuarioActivo?.rol;
    return r === 'ADMIN' || r === 'ROLE_ADMIN';
  };
  const estaAutenticado = () => !!localStorage.getItem('token');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /* ================== TORTA CUMPLEAÑOS ================== */
  const aplicarTortaGratis = () => {
    if (!usuarioActivo || !usuarioActivo.tortaGratis) return null;

    const hoy = new Date();
    const fecha = new Date(usuarioActivo.fechaNacimiento);

    if (
      hoy.getDate() === fecha.getDate() &&
      hoy.getMonth() === fecha.getMonth()
    ) {
      return {
        codigo: 'CUMPLEANOS',
        tipo: 'Especial',
        tamano: 'Grande',
        nombre: 'Torta de Cumpleaños Gratis',
        precio: '0 CLP',
        descripcion: 'Beneficio exclusivo por tu cumpleaños'
      };
    }
    return null;
  };

  /* ================== CONTEXTO ================== */
  const value = {
    usuarioActivo,
    loginUsuario,
    registrarUsuario,
    logoutUsuario,
    aplicarTortaGratis,
    invalidarCodigoDescuento,
    esAdmin,
    estaAutenticado,
    getAuthHeader,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
