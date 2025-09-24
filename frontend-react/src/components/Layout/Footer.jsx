// src/components/Footer.jsx

const Footer = () => {
  return (
    <footer style={{
      marginTop: '4rem',
      padding: '2rem 0',
      backgroundColor: '#7d6a5e8c', // Marrón oscuro cálido
      color: 'white',
      textAlign: 'center',
      fontSize: '0.9rem',
      borderTop: '1px solid #B8A89D',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>TS Bio Consulting</strong>
        </p>
        <p style={{ margin: '0.5rem 0', color: '#E8D6C6' }}>
          Asesoría médica con inteligencia artificial local.
        </p>
        <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', color: '#B8A89D' }}>
          © 2025 Todos los derechos reservados. Desarrollado con privacidad y ética.
        </p>
      </div>
    </footer>
  );
};

export default Footer;