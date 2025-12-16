import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const Nav = () => {
  const { usuarioActivo, esAdmin, logoutUsuario } = useUser();
  const { getTotalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/#sobre-nosotros" onClick={closeMenu}>
          Sobre Nosotros
        </Link>

        <Link to="/productos" onClick={closeMenu}>
          Productos
        </Link>

        <Link to="/carrito" onClick={closeMenu}>
          Carrito ({getTotalItems()})
        </Link>

        <Link to="/#testimonios" onClick={closeMenu}>
          Testimonios
        </Link>

        <Link to="/#contacto" onClick={closeMenu}>
          Contacto
        </Link>

        {/* 🔐 SOLO ADMIN */}
        {esAdmin() && (
          <Link to="/admin/inventario" onClick={closeMenu}>
            Inventario
          </Link>
        )}

        {/* 👤 USUARIO LOGUEADO */}
        {usuarioActivo ? (
          <>
            <span className="nav-usuario">
              Hola, {usuarioActivo.nombre}
            </span>
            <button
              className="btn-logout"
              onClick={() => {
                logoutUsuario();
                closeMenu();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/register" onClick={closeMenu}>
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
