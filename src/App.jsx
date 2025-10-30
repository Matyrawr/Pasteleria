import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Productos from './components/Productos';
import Cart from './components/Cart';
import './styles/Estilos.css';

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/carrito" element={<Cart />} />
              {/* Rutas adicionales para otras secciones */}
              <Route path="/testimonios" element={<Home />} />
              <Route path="/contacto" element={<Home />} />
            </Routes>
          </Router>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
