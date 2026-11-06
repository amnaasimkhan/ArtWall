import { Box, Typography } from "@mui/material";
import ImageGrid from "../../components/ImageGrid";


//add a style highlight (like here's special boho styles)
//put filters on top (ahhhhhhhhh)
const Browse = ({ best }) => {
  return (
    <Box sx={{ py: 2 }}>
      <div style={{ marginLeft: 30, marginRight: '40%' }}>
        {best ?
          <>
            <Typography variant="h4" gutterBottom fontStyle='italic' fontFamily='Playfair Display' >
              Best Sellers
            </Typography>
            <Typography variant="subtitle" >
              Here you will find our most loved designs! We have an extensive range, with something to suit almost all homes and interior design styles. Our range is regularly updated with popular prints and exclusive designs so that our customers are always able to find something that suits them perfectly. Give your walls a makeover with trendy wall posters from Desenio!
            </Typography>
          </> :
          <>
            <Typography variant="h4" gutterBottom fontStyle='italic' fontFamily='Playfair Display' >
              Prints
            </Typography>
            <Typography variant="subtitle" >
              Here you will find our full range of stylish modern art prints! We have an extensive range, with something to suit almost all homes and interior design styles. Our range is regularly updated with popular prints and exclusive designs so that our customers are always able to find something that suits them perfectly. Give your walls a makeover with trendy wall posters from Artframe!
            </Typography>
          </> 
       }

      </div>
      <ImageGrid size={{ width: 400, height: "auto" }} num={18} type={best ? 'bestseller' : 'browse'} key={best ? 'bestseller' : 'browse'} /> {/*todo: make limit on bestseller conditional */}
    </Box>
  );
};

export default Browse;
