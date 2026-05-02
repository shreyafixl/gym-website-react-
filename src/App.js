import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ClassesPage from "./pages/ClassesPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import EquipmentPage from "./pages/EquipmentPage";
import AboutPage from "./pages/AboutPage";
import TrainersPage from "./pages/TrainersPage";
import GalleryPage from "./pages/GalleryPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import FAQPage from "./pages/FAQPage";
import FacilitiesPage from "./pages/FacilitiesPage";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
