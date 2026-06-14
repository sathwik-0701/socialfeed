import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavigationBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-3 shadow-sm">
      <Container style={{ maxWidth: '600px' }}>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold' }}>
          🌍 Social Feed
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          {user ? (
            <>
              <span className="text-white me-3 align-self-center">
                Hi, {user.username}
              </span>
              <Button variant="light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" className="text-white">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/signup" className="text-white">
                Signup
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
