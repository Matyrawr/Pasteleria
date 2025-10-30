import { createContext, useContext, useState, useEffect } from 'react';

// ------------------ USUARIOS ------------------
const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  // Crear usuario demo si no existe
  useEffect(() => {
    const storedUsuarios = JSON.parse(localStorage.getItem('usuarios'));
    if (!storedUsuarios) {
      const demo = [{
        nombre: "Demo",
        email: "demo@demo.com",
        password: "1234",
        edad: 30,
        descuento: 0,
        tortaGratis: false
      }];
      localStorage.setItem('usuarios', JSON.stringify(demo));
      setUsuarios(demo);
    } else {
      setUsuarios(storedUsuarios);
    }

    const storedUsuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (storedUsuarioActivo) {
      setUsuarioActivo(storedUsuarioActivo);
    }
  }, []);

  // ------------------ VALIDACIÓN ------------------
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ------------------ REGISTRO ------------------
  const registrarUsuario = (event, formData) => {
    event.preventDefault();

    const { nombre, email, edad, fechaNacimiento, password, codigo } = formData;

    if (!nombre || !email || !edad || !password) {
      return { success: false, message: "Por favor, completa todos los campos." };
    }

    if (!validarEmail(email)) {
      return { success: false, message: "Por favor ingresa un correo válido." };
    }

    if (usuarios.find(u => u.email === email)) {
      return { success: false, message: "Este correo ya está registrado." };
    }

    let descuento = 0;
    if (edad >= 50) descuento = Math.max(descuento, 50);
    if (codigo === "FELICES50") descuento = Math.max(descuento, 10);

    const tortaGratis = email.endsWith("@duocuc.cl");

    const nuevoUsuario = { nombre, email, edad: parseInt(edad), fechaNacimiento, password, descuento, tortaGratis };

    const nuevosUsuarios = [...usuarios, nuevoUsuario];
    setUsuarios(nuevosUsuarios);
    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));

    let mensaje = `¡Registro exitoso! `;
    if (descuento > 0) mensaje += `Tienes un descuento del ${descuento}%. `;
    if (tortaGratis) mensaje += `¡Tienes una torta gratis en tu cumpleaños 🎂!`;

    return { success: true, message: mensaje };
  };

  // ------------------ LOGIN ------------------
  const loginUsuario = (event, formData) => {
    event.preventDefault();

    const { email, password } = formData;

    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (!usuario) {
      return { success: false, message: "Correo o contraseña incorrectos." };
    }

    let mensaje = `¡Bienvenido/a, ${usuario.nombre}!`;
    if (usuario.descuento > 0) mensaje += `\nTienes un ${usuario.descuento}% de descuento.`;
    if (usuario.tortaGratis) mensaje += `\nTienes una torta gratis en tu cumpleaños 🎂.`;

    setUsuarioActivo(usuario);
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    sessionStorage.setItem('usuarioEmail', usuario.email);

    return { success: true, message: mensaje };
  };

  // ------------------ LOGOUT ------------------
  const logoutUsuario = () => {
    setUsuarioActivo(null);
    localStorage.removeItem('usuarioActivo');
    sessionStorage.removeItem('usuarioEmail');
  };

  // ------------------ PERFIL ------------------
  const actualizarPerfil = (event, formData) => {
    event.preventDefault();

    const { nombre, email, edad } = formData;
    const emailActual = sessionStorage.getItem('usuarioEmail');

    if (!nombre || !email || !edad) {
      return { success: false, message: "Completa todos los campos." };
    }

    if (!validarEmail(email)) {
      return { success: false, message: "Correo inválido." };
    }

    const index = usuarios.findIndex(u => u.email === emailActual);
    if (index === -1) {
      return { success: false, message: "Usuario no encontrado." };
    }

    const usuarioActualizado = { ...usuarios[index], nombre, email, edad: parseInt(edad) };
    const nuevosUsuarios = [...usuarios];
    nuevosUsuarios[index] = usuarioActualizado;

    setUsuarios(nuevosUsuarios);
    setUsuarioActivo(usuarioActualizado);
    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
    sessionStorage.setItem('usuarioEmail', email);

    return { success: true, message: "Perfil actualizado correctamente." };
  };

  // Función para verificar si es cumpleaños
  const esCumpleanos = (usuario) => {
    if (!usuario.fechaNacimiento) return false;
    const hoy = new Date();
    const fechaNac = new Date(usuario.fechaNacimiento);
    return hoy.getDate() === fechaNac.getDate() && hoy.getMonth() === fechaNac.getMonth();
  };

  // Función para aplicar torta gratis si es cumpleaños
  const aplicarTortaGratis = () => {
    if (!usuarioActivo || !usuarioActivo.tortaGratis) return null;
    if (esCumpleanos(usuarioActivo)) {
      // Retornar un producto especial de cumpleaños gratis
      return {
        codigo: "CUMPLEANOS",
        tipo: "Especial",
        tamano: "Grande",
        nombre: "Torta de Cumpleaños Gratis",
        precio: "0 CLP",
        descripcion: "¡Feliz cumpleaños! Esta torta es gratis para estudiantes de Duoc."
      };
    }
    return null;
  };

  const value = {
    usuarios,
    usuarioActivo,
    registrarUsuario,
    loginUsuario,
    logoutUsuario,
    actualizarPerfil,
    aplicarTortaGratis
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
