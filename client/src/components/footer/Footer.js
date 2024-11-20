export default function Footer() {
    return (
      <footer style={{
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#eee',
          color: '#444',
          borderTop: '1px solid #666',          
      }}>
        <p><span style={{ fontWeight: 'bold' }}>Fraga esse Tempero. PUC Minas</span> &copy; 2024</p>
      </footer>
    );
}