import { AppBar, Toolbar, Typography, Stack, Button, Avatar } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link, useNavigate } from "react-router-dom";
import "../stylesheets/navbar.scss";
import { useState, useEffect, useContext } from 'react';
import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();       // clear user and token
    navigate("/");        // redirect to home
  };

  return (
    <div>
      <div className='ribbon'>
        {!currentUser ? (
          <Button color='inherit' component={Link} to="/login">LOGIN</Button>
        ) : (
          <ProfileMenu height={30} width={30} onLogout={handleLogout} />
        )}

        <span>WE OFFER FRAMING SERVICES • DELIVERY IN 3-6 BUSINESS DAYS</span>

        <span>SHOP NOW</span>
      </div>

      <AppBar position="fixed" sx={{ top: isScrolled ? 0 : "40px", transition: "top 0.3s cubic-bezier(0.25,0.8,0.25,1)", zIndex: 1200 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button color='inherit' component={Link} to="/">
            <Typography variant='h4'>ARTFRAME</Typography>
          </Button>

          <Stack direction='row' spacing={2} justifyContent={'center'} alignItems={'center'}>
            <Button color='inherit' size='large' component={Link} to="/browse">ARTWORKS</Button>
            <Button color='inherit' size='large' component={Link} to="/featured">FEATURED ARTISTS</Button>
            <Button color='inherit' size='large' component={Link} to="/style">STYLES</Button>
            <Button color='inherit' size='large' component={Link} to="/gallery">GALLERY</Button>
            <Button color='inherit' size='large' component={Link} to="/bestsellers">BEST SELLERS</Button>
          </Stack>

          <Stack direction='row' spacing={2}>
            <SearchBar />

            <Button color='inherit' component={Link} to="/cart" disabled={!currentUser}>
              <ShoppingCartOutlinedIcon /> CART
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
