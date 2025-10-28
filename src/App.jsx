import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Productos from './components/Productos';
import './styles/Estilos.css';

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/productos" element={<Productos />} />
            {/* Rutas adicionales para otras secciones */}
            <Route path="/sucursales" element={<Home />} />
            <Route path="/testimonios" element={<Home />} />
            <Route path="/contacto" element={<Home />} />
          </Routes>
        </Router>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
