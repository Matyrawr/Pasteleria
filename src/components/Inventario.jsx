import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
    ⬆ Volver arriba
</button>

const Inventario = () => {
  const { usuarioActivo } = useUser();
  const navigate = useNavigate();

  /* ================== MOCK PRODUCTOS ================== */
  const [productos, setProductos] = useState([
    {
      id: 1,
      codigo: "PAST001",
      nombre: "Torta Chocolate",
      tipo: "Torta",
      tamano: "Grande",
      precio: 15000,
      descripcion: "Torta de chocolate con relleno de manjar",
      stock: 10
    }
  ]);

  /* ================== FORMULARIO ================== */
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    tipo: "",
    tamano: "",
    precio: "",
    descripcion: "",
    stock: ""
  });

  const [productoEditando, setProductoEditando] = useState(null);

  /* ================== GUARDIA ADMIN ================== */
  if (!usuarioActivo || usuarioActivo.rol !== "ADMIN") {
    return <h2 style={{ textAlign: "center" }}>⛔ Acceso denegado</h2>;
  }

  /* ================== HANDLERS ================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setForm({
      codigo: "",
      nombre: "",
      tipo: "",
      tamano: "",
      precio: "",
      descripcion: "",
      stock: ""
    });
    setProductoEditando(null);
  };

  const agregarProducto = () => {
    const nuevoProducto = {
      ...form,
      id: Date.now(),
      precio: Number(form.precio),
      stock: Number(form.stock)
    };

    setProductos([...productos, nuevoProducto]);
    limpiarFormulario();
  };

  const editarProducto = (producto) => {
    setProductoEditando(producto.id);
    setForm(producto);
  };

  const guardarEdicion = () => {
    setProductos(
      productos.map((p) =>
        p.id === productoEditando ? { ...form } : p
      )
    );
    limpiarFormulario();
  };

  const eliminarProducto = (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  /* ================== UI ================== */
  return (
    <section id="catalogo">
      <button onClick={() => navigate(-1)}>⬅ Volver</button>

      <h2>📦 Inventario (Administrador)</h2>

      {/* ================= FORMULARIO ================= */}
      <div className="inventario-form">
        <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="tipo" placeholder="Tipo" value={form.tipo} onChange={handleChange} />
        <input name="tamano" placeholder="Tamaño" value={form.tamano} onChange={handleChange} />
        <input type="number" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />

        <textarea
          name="descripcion"
          placeholder="Descripción detallada del producto"
          value={form.descripcion}
          onChange={handleChange}
          className="descripcion-textarea"
        />

        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />

        {productoEditando ? (
          <>
            <button onClick={guardarEdicion}>Guardar</button>
            <button onClick={limpiarFormulario}>Cancelar</button>
          </>
        ) : (
          <button onClick={agregarProducto}>Agregar</button>
        )}
      </div>

      {/* ================= TABLA ================= */}
      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "1.5rem" }}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Tamaño</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.tipo}</td>
                <td>{p.tamano}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => editarProducto(p)}>Editar</button>
                  <button className="btn-remover" onClick={() => eliminarProducto(p.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );

};

export default Inventario;
