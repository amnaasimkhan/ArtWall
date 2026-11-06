import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Typography } from '@mui/material';
import { Link } from "react-router-dom";

export default function PermanentDrawer() {
  const mainItems = [
    { text: 'Customers', link: 'customer' },
    { text: 'Artists', link: 'artist' },
    { text: 'Inventory', link: 'artwork' },
    { text: 'Frames', link: 'frame' },
    { text: 'Orders', link: 'order' },
    { text: 'Gallery', link: 'gallery' },
    // { text: 'Size', link: 'size' }
  ]
  const secondaryItems = [
    { text: 'Sales', link: 'sales' },
    { text: 'Performance', link: 'bestselling' },
    { text: 'Variants', link: 'variants' }
  ]

  return (
    <Drawer
      variant="permanent"
      open="true"
      anchor="left"
      sx={{
        width: 200,
        '& .MuiDrawer-paper': {
          bgcolor: "primary.main",
          width: 200,
          border: 1,
          mt: 8,
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: 3,
          }
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <Typography variant='body2' sx={{ ml: 3, mt: 3 }}>GENERAL</Typography>
          {mainItems.map((item) => (
            <ListItem key={item.text} sx={{ py: 0 }} >
              <ListItemButton component={Link} to={`/admin/manage/${item.link}`}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography variant='body2' sx={{ ml: 3, mt: 3 }}>ANALYTICS</Typography>

        <List>
          {secondaryItems.map((item) => (
            <ListItem key={item.text} sx={{ py: 0 }}>
              <ListItemButton component={Link} to={`/admin/analytics/${item.link}`}>  
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
