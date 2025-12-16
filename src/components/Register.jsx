import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    fechaNacimiento: '',
    password: '',
    codigo: ''
  });
  const [mensaje, setMensaje] = useState('');

  const { registrarUsuario } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    const result = await registrarUsuario(e, formData);

    if (result.success) {
      setMensaje({ type: 'success', text: result.message || 'Registro exitoso' });
      setFormData({
        nombre: '',
        email: '',
        edad: '',
        fechaNacimiento: '',
        password: '',
        codigo: ''
      });
      // Redirigir a la pantalla principal tras un breve mensaje
      setTimeout(() => navigate('/'), 1200);
    } else {
      setMensaje({ type: 'error', text: result.message || 'No se pudo registrar' });
    }
  };

  return (
    <div>
      <section className="formulario-register">

        {/* BOTÓN VOLVER ATRÁS */}
        <button
          onClick={() => navigate(-1)}
          className="categoria-btn"
          style={{ marginBottom: '15px' }}
        >
          Volver atrás
        </button>

        <h3>📝 Registro</h3>

        <form id="form-registro" onSubmit={handleSubmit}>
          <input
            type="text"
            id="reg-nombre"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            id="reg-email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            id="reg-edad"
            name="edad"
            placeholder="Edad"
            value={formData.edad}
            onChange={handleChange}
            required
            min="1"
          />

          <input
            type="date"
            id="reg-fecha-nacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            id="reg-password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            id="reg-codigo"
            name="codigo"
            placeholder="Código de descuento (opcional)"
            value={formData.codigo}
            onChange={handleChange}
          />

          <button type="submit">Registrarse</button>
        </form>

        <Link to="/login" className="boton-iniciar-sesion">
          Iniciar Sesión
        </Link>

        {mensaje && (
          <p id="mensaje" className={mensaje.type}>
            {mensaje.text}
          </p>
        )}

      </section>
    </div>
  );
};

export default Register;
