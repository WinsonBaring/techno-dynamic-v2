import React, { useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import lionLogo from 'assets/lionlogo.png';

import { AppBar as MuiAppBar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const Appbar = () => {
  const { user, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  return (
    // TODO: change color to palette color
    <MuiAppBar position='static' color='transparent'>
      <Toolbar>
        <Box display='flex' alignItems='center' flexGrow={1}>
          <img src={lionLogo} alt='lion logo' width='40' height='40' />
          <Typography
            display={{ xs: 'none', sm: 'flex' }}
            variant='h6'
            component='div'
            sx={{ ml: 2 }}>
            Technopreneurship
          </Typography>
        </Box>
        <Box flexGrow={0}>
          <Tooltip title='Open Settings'>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0
              }}>
              <Avatar>
                {user?.first_name?.charAt(0).toUpperCase()}
                {user?.last_name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{
              mt: 4.5
            }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}>
            {/* TODO: Add Profile Navigation Handling  */}
            <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default Appbar;
