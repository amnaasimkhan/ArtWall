import { AppBar, Toolbar, Typography, Stack, Button, Box, InputBase, Avatar } from '@mui/material'
import ProfileMenu from '../../components/ProfileMenu'
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';


const Navbar = () => {
    return (
        <AppBar position='fixed'>
            <Toolbar sx={{
                display: "flex",
                justifyContent: "space-between",
                transition: 'box-shadow 0.3s',
                '&:hover': {
                    boxShadow: 3,
                }
            }}>
                <Typography variant='h4'>ARTFRAME</Typography>
                <Button color='inherit' component={Link} to={"/admin/"}>
                    <Typography variant='h4'>DASHBOARD</Typography>
                </Button>
                <ProfileMenu height={50} width={50} />
            </Toolbar>
        </AppBar>


    )
}

export default Navbar