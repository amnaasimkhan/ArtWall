import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
//main
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../ScrollToTop';
import Homepage from '../pages/gen/Homepage';
import Register from '../pages/gen/Register';
import Login from '../pages/gen/Login';
import Cart from '../pages/gen/Cart';
import ArtworkDetail from '../pages/gen/ArtworkDetail';
import Browse from '../pages/gen/Browse';
import Featured from '../pages/gen/Featured';
import FeaturedLanding from '../pages/gen/FeaturedLanding';
import GalleryLanding from '../pages/gen/GalleryLanding';
import Gallery from '../pages/gen/Gallery';
import StylePage from '../pages/gen/StylePage';
import Profile from '../pages/gen/Profile';
import Payment from '../pages/gen/Payment';
import Cancel from '../pages/gen/Cancel';
import Success from '../pages/gen/Success';

//admin
import AdminNavbar from '../components/admin/Navbar';
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
import AdminLogin from '../pages/admin/AdminLogin';

//main
const MainLayout = () => (
  <>
    <ScrollToTop />
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

//admin
const AdminLayout = () => {

  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;

  if (currentUser.role !== "admin") return <Navigate to="/" />;
  return (
    <>
      <ScrollToTop />
      <Box sx={{ display: "flex" }}>
        <AdminNavbar />
        <SideBar />
        <Box sx={{ p: 3, mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </>
  )
};

const router = createBrowserRouter([

  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/detail/:artwork_id", element: <ArtworkDetail /> },
      { path: "/browse", element: <Browse best={false} /> },
      { path: "/bestsellers", element: <Browse best={true} /> },
      { path: "/featured", element: <FeaturedLanding /> },
      { path: "/feature/:feature_id", element: <Featured /> },
      { path: "/gallery", element: <GalleryLanding /> },
      { path: "/gallery/:room_id", element: <Gallery /> },
      { path: "/style", element: <StylePage /> },
      { path: "/profile", element: <Profile /> },
      { path: "/cart", element: <Cart /> },
      { path: "/payment", element: <Payment /> },
      { path: "/cancel", element: <Cancel /> },
      { path: "/success", element: <Success /> },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/adminLogin",
    element: <AdminLogin/>
  },


  {
    path: "/admin",
    element: <AdminLayout />,
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
    ],
  },
]);

export default router;
