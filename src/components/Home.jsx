import Nav from './Nav';

const Home = () => {
  return (
    <div>
      <Nav />
      <header>
        <h1>Pastelería Mil Sabores</h1>
        <p>¡Todo el sabor para tu paladar!</p>
      </header>

      <main>
        {/* Sobre Nosotros */}
        <section id="sobre-nosotros">
          <h2>📖 Sobre Nosotros</h2>
          <p>Pastelería 1000 Sabores celebra su 50 aniversario como un referente en la repostería chilena. Famosa por su participación en un récord Guinness en 1995, cuando colaboró en la creación de la torta más grande del mundo, la pastelería busca renovar su sistema de ventas online para ofrecer una experiencia de compra moderna y accesible para sus clientes.</p>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrDF3rHxHqyOSeBa61Pl4boGSWMjV-mGGig&s" alt="Aniversario 50 años" />
        </section>

        {/* Alcance */}
        <section id="alcance" className="alcance-proyecto">
          <h2>📌 Alcance del Proyecto</h2>
          <p>Desarrollo de una plataforma de e-commerce que permita a los usuarios comprar productos de repostería...</p>
        </section>

        {/* Misión y Visión */}
        <section className="mision-vision-container">
          <div className="mision">
            <h2>🎯 Misión</h2>
            <p>Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería.</p>
          </div>
          <div className="vision">
            <h2>🌟 Visión</h2>
            <p>Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía.</p>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="testimonios">
          <h2>💬 Testimonios</h2>
          <blockquote>"Excelente atención y productos de calidad..." – Mariana R.</blockquote>
          <blockquote>"La consulta veterinaria me salvó con mi gato..." – Luis T.</blockquote>
        </section>

        {/* Contacto */}
        <section id="contacto">
          <h2>📬 Contáctanos</h2>
          <form>
            <input type="text" name="nombre" placeholder="Tu nombre" required />
            <input type="email" name="email" placeholder="Tu correo electrónico" required />
            <textarea name="mensaje" rows="4" placeholder="Escribe tu mensaje aquí..." required></textarea>
            <input type="submit" value="Enviar" />
          </form>
        </section>

        {/* Referencias */}
        <footer>
          <h2>🔗 Referencias</h2>
          <ul>
            <li><a href="https://disenowebakus.net/domine-html-y-dhtml-primeros-pasos.php" target="_blank" rel="noopener noreferrer">Guía HTML</a></li>
            <li><a href="https://desarrolloweb.com/articulos/etiquetas-semanticas-html5.html" target="_blank" rel="noopener noreferrer">Etiquetas HTML5</a></li>
            <li><a href="https://www.purina.cl/" target="_blank" rel="noopener noreferrer">Purina Chile</a></li>
          </ul>
        </footer>
      </main>

      {/* Botón subir */}
      <button id="btn-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </div>
  );
};

export default Home;
