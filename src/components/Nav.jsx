import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Nav = () => {
  const { usuarioActivo, logoutUsuario } = useUser();

  return (
    <nav>
      <Link to="/">Sobre Nosotros</Link>
      <Link to="/sucursales">Sucursales</Link>
      <Link to="/productos">Productos</Link>
      <Link to="/testimonios">Testimonios</Link>
      <Link to="/contacto">Contacto</Link>
      {usuarioActivo ? (
        <>
          <span>Hola, {usuarioActivo.nombre}</span>
          <button onClick={logoutUsuario}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
