import { createContext, useContext, useState, useEffect } from 'react';

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
    /*
      👉 PRIORIDAD:
      1) Si existe usuario en localStorage → usarlo
      2) Si NO existe → crear ADMIN fake para testeo
    */

    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (usuario && token) {
      setUsuarioActivo(JSON.parse(usuario));
      setLoading(false);
      return;
    }

    /* ====== MODO TEST ADMIN (ELIMINAR AL CONECTAR BACKEND) ====== */
    const adminFake = {
      id: 1,
      nombre: 'Administrador',
      email: 'admin@test.com',
      rol: 'ADMIN'
    };

    setUsuarioActivo(adminFake);
    setLoading(false);
  }, []);

  /* ================== LOGIN REAL (LISTO PARA BACKEND) ================== */
  const loginUsuario = async (event, formData) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Credenciales incorrectas'
        };
      }

      setUsuarioActivo(data.usuario);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      localStorage.setItem('token', data.token);

      return { success: true, message: 'Inicio de sesión exitoso' };

    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  };

  /* ================== LOGOUT ================== */
  const logoutUsuario = () => {
    setUsuarioActivo(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  /* ================== VERIFICADORES ================== */
  const esAdmin = () => usuarioActivo?.rol === 'ADMIN';
  const estaAutenticado = () => !!usuarioActivo;

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
    logoutUsuario,
    aplicarTortaGratis,
    esAdmin,
    estaAutenticado,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
