import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

const Nav = () => {
  const { usuarioActivo, logoutUsuario } = useUser();
  const { getTotalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav>
      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        ☰
      </button>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/#sobre-nosotros" onClick={() => setMenuOpen(false)}>Sobre Nosotros</Link>
        <Link to="/productos" onClick={() => setMenuOpen(false)}>Productos</Link>
        <Link to="/carrito" onClick={() => setMenuOpen(false)}>Carrito ({getTotalItems()})</Link>
        <Link to="/#testimonios" onClick={() => setMenuOpen(false)}>Testimonios</Link>
        <Link to="/#contacto" onClick={() => setMenuOpen(false)}>Contacto</Link>
        {usuarioActivo ? (
          <>
            <span>Hola, {usuarioActivo.nombre}</span>
            <button className="btn-logout" onClick={logoutUsuario}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
