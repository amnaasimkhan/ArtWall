import { createBrowserRouter, RouterProvider, Route, Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/admin/Navbar';
import SideBar from '../components/admin/SideBar';
import Landing from '../pages/admin/Landing';
import ArtistMgmt from '../pages/admin/ArtistMgmt';
import ArtworkMgmt from '../pages/admin/ArtworkMgmt';
import OrderMgmt from '../pages/admin/OrderMgmt';
import CustomerMgmt from '../pages/admin/CustomerMgmt';
import GalleryMgmt from '../pages/admin/GalleryMgmt';
import FrameMgmt from '../pages/admin/FrameMgmt';
import CreateGallery from '../pages/admin/CreateGallery';
import CreateArtist from '../pages/admin/CreateArtist';
import CreateArtwork from '../pages/admin/CreateArtwork';
import CreateFrame from '../pages/admin/CreateFrame';
import SalesAnalytics from '../pages/admin/SalesAnalytics';
import BestsellerAnalytics from '../pages/admin/BestsellerAnalytics';
import VariantAnalytics from '../pages/admin/VariantAnalytics';

import { Box } from '@mui/material';

import ScrollToTop from '../ScrollToTop';


const Layout = () => {
  return (
    <>
    <ScrollToTop/>
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <SideBar />
        <Box sx={{ p: 3, mt: 8, }}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </>


  )
}

const router = createBrowserRouter([
  {
    path: "admin",
    element: <Layout />,
    children: [
     { path: "", element: <Landing /> },
      { path: "manage/artist", element: <ArtistMgmt /> },
      { path: "manage/artist/create", element: <CreateArtist /> },
      { path: "manage/artwork", element: <ArtworkMgmt /> },
      { path: "manage/artwork/create", element: <CreateArtwork /> },
      { path: "manage/order", element: <OrderMgmt /> },
      { path: "manage/customer", element: <CustomerMgmt /> },
      { path: "manage/gallery", element: <GalleryMgmt /> },
      { path: "manage/gallery/create", element: <CreateGallery /> },
      { path: "manage/frame", element: <FrameMgmt /> },
      { path: "manage/frame/create", element: <CreateFrame /> },
      { path: "analytics/sales", element: <SalesAnalytics /> },
      { path: "analytics/bestselling", element: <BestsellerAnalytics /> },
      { path: "analytics/variants", element: <VariantAnalytics/> },

    ]
  }
])

export default router;