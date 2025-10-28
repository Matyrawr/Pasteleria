import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');
  const { loginUsuario } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    const result = loginUsuario(e, formData);
    setMensaje(result.message);

    if (result.success) {
      setMensaje({ type: 'success', text: result.message });
      setTimeout(() => {
        navigate('/');
      }, 300);
    } else {
      setMensaje({ type: 'error', text: result.message });
    }
  };

  return (
    <div>
      <section id="cuenta">
        <div className="formulario-container">
          <div className="formulario">
          <h3>Accede a tu cuenta</h3>
          <form id="form-login" onSubmit={handleSubmit}>
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Iniciar Sesión</button>
          </form>

          <Link to="/register" className="boton-registro">
            Registrarse
          </Link>
          {mensaje && (
            <p id="mensaje" className={mensaje.type}>
              {mensaje.text}
            </p>
          )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
