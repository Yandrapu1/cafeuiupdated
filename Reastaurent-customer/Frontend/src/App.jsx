import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'white', backgroundColor: 'red', minHeight: '100vh' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load pages
const Layout = lazy(() => import("./components/Layout/Layout"));
const Home = lazy(() => import("./Pages/Home/Home"));
const MenuPage = lazy(() => import("./Pages/Menu/MenuPage"));
const AboutPage = lazy(() => import("./Pages/About/AboutPage"));
const GalleryPage = lazy(() => import("./Pages/Gallery/GalleryPage"));
const ContactPage = lazy(() => import("./Pages/Contact/ContactPage"));
const LoginPage = lazy(() => import("./Pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./Pages/Auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./Pages/Auth/ForgotPasswordPage"));
const ProfilePage = lazy(() => import("./Pages/Profile/ProfilePage"));
const CheckoutPage = lazy(() => import("./Pages/Checkout/CheckoutPage"));
const Office = lazy(() => import("./Pages/Office/Office"));
const OrderDetails = lazy(() => import("./Pages/OrderDetails/OrderDetails"));

const PageLoader = () => (
  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#666"
  }}>
    Loading page...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="contact" element={<ContactPage />} />
              
              {/* Auth Flow */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Profile & Checkout */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="office" element={<Office />} />
            </Route>
            {/* Add more routes here as needed */}
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
