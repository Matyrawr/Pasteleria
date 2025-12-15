import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Productos from "./components/Productos";
import Cart from "./components/Cart";
import Inventario from "./components/Inventario";

import "./styles/Estilos.css";

/* ================= RUTA PROTEGIDA ADMIN ================= */
const AdminRoute = ({ children }) => {
  const { usuarioActivo } = useUser();

  // No logueado
  if (!usuarioActivo) {
    return <Navigate to="/login" replace />;
  }

  // Logueado pero no admin
  if (usuarioActivo.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* ================= APP ================= */
function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <Routes>

              {/* RUTAS PÚBLICAS */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/carrito" element={<Cart />} />

              {/* ================= RUTA ADMIN ================= */}
              <Route
                path="/admin/inventario"
                element={
                  <AdminRoute>
                    <Inventario />
                  </AdminRoute>
                }
              />

              {/* SECCIONES */}
              <Route path="/testimonios" element={<Home />} />
              <Route path="/contacto" element={<Home />} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </Router>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
