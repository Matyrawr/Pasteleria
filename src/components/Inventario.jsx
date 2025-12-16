import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useProduct } from "../context/ProductContext";

<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
    ⬆ Volver arriba
</button>

const Inventario = () => {
  const { usuarioActivo, esAdmin, getAuthHeader } = useUser();
  const { refreshProductos } = useProduct();
  const navigate = useNavigate();

  /* ================== PRODUCTOS ================== */
  const [productos, setProductos] = useState([]);

  /* ================== FORMULARIO ================== */
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    tipo: "",
    tamano: "",
    precio: "",
    descripcion: "",
    stock: "",
    imagenFile: null,
    imagenUrl: ""
  });

  const [productoEditando, setProductoEditando] = useState(null);

  /* ================== GUARDIA ADMIN ================== */
  if (!esAdmin()) {
    return <h2 style={{ textAlign: "center" }}>⛔ Acceso denegado</h2>;
  }

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
    fetch(`${API}/api/productos`)
      .then((r) => r.json())
      .then((lista) => {
        if (Array.isArray(lista)) {
          setProductos(lista);
        }
      })
      .catch(() => {});
  }, []);

  /* ================== HANDLERS ================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
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
      stock: "",
      imagenFile: null,
      imagenUrl: ""
    });
    setProductoEditando(null);
  };

  const agregarProducto = async () => {
    // Validaciones mínimas en frontend para evitar 400 del backend
    if (!form.nombre?.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (!form.descripcion?.trim()) {
      alert("La descripción es obligatoria");
      return;
    }
    if (!form.tipo?.trim()) {
      alert("La categoría (tipo) es obligatoria");
      return;
    }
    if (!form.precio || Number(form.precio) < 1) {
      alert("El precio debe ser mayor a 0");
      return;
    }
    const body = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      // Backend espera BigDecimal; enviamos como string numérica para mayor compatibilidad
      precio: String(Number(form.precio)),
      stock: Number(form.stock),
      categoria: form.tipo
    };

    try {
      const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      const res = await fetch(`${API}/api/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        let msg = "Error al crear producto (requiere ADMIN)";
        try { const err = await res.json(); if (err?.message) msg = err.message; } catch (_) {}
        alert(msg);
        return;
      }
      const creado = await res.json();

      // Si hay imagen seleccionada por archivo, subirla
      if (form.imagenFile) {
        try {
          const formData = new FormData();
          formData.append('file', form.imagenFile);
          await fetch(`${API}/api/productos/${creado.id}/imagen`, {
            method: 'POST',
            headers: {
              ...getAuthHeader()
            },
            body: formData
          }).then(async r => {
            if (r.ok) {
              const actualizado = await r.json();
              setProductos([...productos, actualizado]);
            } else {
              // Si falla la imagen, al menos agregamos el creado sin imagen
              setProductos([...productos, creado]);
            }
          });
        } catch (_) {
          setProductos([...productos, creado]);
        }
      } else if (form.imagenUrl?.trim()) {
        // Si viene URL, asignarla
        try {
          const r2 = await fetch(`${API}/api/productos/${creado.id}/imagen-url`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            body: JSON.stringify({ url: form.imagenUrl.trim() })
          });
          if (r2.ok) {
            const actualizado = await r2.json();
            setProductos([...productos, actualizado]);
          } else {
            setProductos([...productos, creado]);
          }
        } catch (_) {
          setProductos([...productos, creado]);
        }
      } else {
        setProductos([...productos, creado]);
      }
      limpiarFormulario();
      // Actualizar el catálogo general
      refreshProductos();
    } catch (e) {
      alert("No se pudo conectar al backend");
    }
  };

  const editarProducto = (producto) => {
    setProductoEditando(producto.id);
    setForm(producto);
  };

  const guardarEdicion = async () => {
    // Validaciones mínimas
    if (!form.nombre?.trim()) { alert("El nombre es obligatorio"); return; }
    if (!form.descripcion?.trim()) { alert("La descripción es obligatoria"); return; }
    if (!form.tipo?.trim()) { alert("La categoría (tipo) es obligatoria"); return; }
    if (!form.precio || Number(form.precio) < 1) { alert("El precio debe ser mayor a 0"); return; }
    const body = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: String(Number(form.precio)),
      stock: Number(form.stock),
      categoria: form.tipo
    };
    try {
      const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      const res = await fetch(`${API}/api/productos/${productoEditando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        let msg = "Error al actualizar producto (requiere ADMIN)";
        try { const err = await res.json(); if (err?.message) msg = err.message; } catch (_) {}
        alert(msg);
        return;
      }
      const actualizadoBase = await res.json();

      // Subir imagen si fue cambiada
      let actualizado = actualizadoBase;
      if (form.imagenFile) {
        try {
          const formData = new FormData();
          formData.append('file', form.imagenFile);
          const imgRes = await fetch(`${API}/api/productos/${productoEditando}/imagen`, {
            method: 'POST',
            headers: {
              ...getAuthHeader()
            },
            body: formData
          });
          if (imgRes.ok) {
            actualizado = await imgRes.json();
          }
        } catch (_) {}
      } else if (form.imagenUrl?.trim()) {
        try {
          const r2 = await fetch(`${API}/api/productos/${productoEditando}/imagen-url`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            body: JSON.stringify({ url: form.imagenUrl.trim() })
          });
          if (r2.ok) {
            actualizado = await r2.json();
          }
        } catch (_) {}
      }

      setProductos(productos.map((p) => (p.id === productoEditando ? actualizado : p)));
      limpiarFormulario();
      refreshProductos();
    } catch (e) {
      alert("No se pudo conectar al backend");
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      const res = await fetch(`${API}/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader()
        }
      });
      if (res.status === 204) {
        setProductos(productos.filter((p) => p.id !== id));
        refreshProductos();
      } else {
        alert("Error al eliminar (requiere ADMIN)");
      }
    } catch (e) {
      alert("No se pudo conectar al backend");
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

          {/* Imagen del producto (opcional) */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="file" name="imagenFile" accept="image/*" onChange={handleChange} />
            <span>o</span>
            <input name="imagenUrl" placeholder="URL de la imagen" value={form.imagenUrl} onChange={handleChange} />
          </div>

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
