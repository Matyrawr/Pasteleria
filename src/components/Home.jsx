import Nav from './Nav';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import pastelesVarios from '../assets/images/Pasteles-Varios.png';

const Home = () => {
  const location = useLocation();
  const { aplicarTortaGratis } = useUser();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const tortaCumpleanos = aplicarTortaGratis();
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
          <img src={pastelesVarios} alt="Pasteles Varios" />
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
          <blockquote>"¡La torta de chocolate de Pastelería Mil Sabores fue perfecta para el cumpleaños de mi hijo! Deliciosa y hermosa presentación." – Mariana R.</blockquote>
          <blockquote>"Compré una tarta de frutas para la reunión familiar y todos quedaron encantados. ¡Volveré por más!" – Luis T.</blockquote>
          <blockquote>"Sus productos sin azúcar son una maravilla. Saludable y sabroso, ideal para mi dieta." – Ana G.</blockquote>
          <blockquote>"La empanada de manzana es mi favorita. Siempre fresca y con ese toque tradicional chileno." – Carlos M.</blockquote>
          <blockquote>"Pedí una torta especial para mi boda y superó todas mis expectativas. ¡Gracias por hacer mi día inolvidable!" – Sofía L.</blockquote>
        </section>

        {/* Torta de Cumpleaños Gratis */}
        {tortaCumpleanos && (
          <section id="cumpleanos" className="cumpleanos">
            <h2>🎂 ¡Feliz Cumpleaños!</h2>
            <p>¡Como estudiante de Duoc, tienes una torta gratis en tu cumpleaños!</p>
            <div className="torta-gratis">
              <h3>{tortaCumpleanos.nombre}</h3>
              <p>{tortaCumpleanos.descripcion}</p>
              <p><strong>Precio:</strong> {tortaCumpleanos.precio}</p>
            </div>
          </section>
        )}

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
            <li><a href="https://www.allrecipes.com/recipes/276/desserts/cakes/" target="_blank" rel="noopener noreferrer">Recetas de Pasteles</a></li>
          </ul>
        </footer>
      </main>

      {/* Botón subir */}
      <button id="btn-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </div>
  );
};

export default Home;
