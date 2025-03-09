import React from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  ProductsPage,
  HomePage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  CheckoutPage,
  OrderSuccessPage,
  PaymentPage,
  SellerActivationPage,
  ShopLoginPage,
  OrderDetailsPage,
  TrackOrderPage,
} from "./Routes.js";

import useUserAuth from "./hooks/getUser.jsx";
import useSellerAuth from "./hooks/getSeller.jsx";
import ProtectedRoute from "./ProtectedRoute";
import {
  ShopHomePage,
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvent,
  ShopAllEvents,
  ShopAllCoupons,
  ShopPreviewPage,
  ShopAllOrders,
  ShopOrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopInboxPage,
} from "./ShopRoutes.js";
import SellerProtectedRoute from "./SellerProtectedRoute";
import Loader from "./components/Layout/Loader";
import useGetAllProducts from "./hooks/getAllProducts";
import useGetAllEvents from "./hooks/getAllEvents";

const App = () => {
  // const loading = useRecoilValue(loadingState);

  const { user, loading: userLoading } = useUserAuth();
  const { seller, loading: sellerLoading } = useSellerAuth();
  const sellerAuth = useSellerAuth();
  const allProducts = useGetAllProducts();
  const allEvents = useGetAllEvents();

  const loading = userLoading || sellerLoading;

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/activation/:activation_token"
              element={<ActivationPage />}
            />
            <Route
              path="/seller/activation/:activation_token"
              element={<SellerActivationPage />}
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/best-selling" element={<BestSellingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/track/order/:id"
              element={
                <ProtectedRoute>
                  <TrackOrderPage />
                </ProtectedRoute>
              }
            />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order/success" element={<OrderSuccessPage />} />
            <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
            {/* Shop Routes */}
            <Route path="/shop-create" element={<ShopCreatePage />} />
            <Route path="/shop-login" element={<ShopLoginPage />} />
            <Route
              path="/shop/:id"
              element={
                <SellerProtectedRoute>
                  <ShopHomePage />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <SellerProtectedRoute>
                  <ShopSettingsPage />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <SellerProtectedRoute>
                  <ShopDashboardPage />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-create-product"
              element={
                <SellerProtectedRoute>
                  <ShopCreateProduct />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-products"
              element={
                <SellerProtectedRoute>
                  <ShopAllProducts />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-refunds"
              element={
                <SellerProtectedRoute>
                  <ShopAllRefunds />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <SellerProtectedRoute>
                  <ShopOrderDetails />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-create-event"
              element={
                <SellerProtectedRoute>
                  <ShopCreateEvent />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-events"
              element={
                <SellerProtectedRoute>
                  <ShopAllEvents />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-coupons"
              element={
                <SellerProtectedRoute>
                  <ShopAllCoupons />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-orders"
              element={
                <SellerProtectedRoute>
                  <ShopAllOrders />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-messages"
              element={
                <SellerProtectedRoute>
                  <ShopInboxPage />
                </SellerProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
