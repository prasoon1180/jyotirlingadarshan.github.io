import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Homepage } from "@/pages/Homepage";
import { TempleDetailPage } from "@/pages/TempleDetailPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/temple/:id" element={<TempleDetailPage />} />
          </Routes>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
