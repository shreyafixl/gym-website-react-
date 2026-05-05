import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./App.css";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const ClassesPage = lazy(() => import("./pages/ClassesPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const EquipmentPage = lazy(() => import("./pages/EquipmentPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TrainersPage = lazy(() => import("./pages/TrainersPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const FacilitiesPage = lazy(() => import("./pages/FacilitiesPage"));
const DashboardPage        = lazy(() => import("./pages/DashboardPage"));
const TrainerDashboardPage = lazy(() => import("./pages/TrainerDashboardPage"));
const AdminDashboardPage   = lazy(() => import("./pages/AdminDashboardPage"));
const SuperAdminDashboardPage = lazy(() => import("./pages/SuperAdminDashboardPage"));

// Loading component
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/trainers" element={<TrainersPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dashboard"            element={<DashboardPage />} />
              <Route path="/dashboard/trainer"   element={<TrainerDashboardPage />} />
              <Route path="/dashboard/admin"     element={<AdminDashboardPage />} />
              <Route path="/dashboard/superadmin" element={<SuperAdminDashboardPage />} />
            </Routes>
          </Suspense>
          <Footer />
          <ScrollToTop />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
