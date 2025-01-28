import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Auth from "./components/Auth";
import Community from "./components/Community";
import Profile from "./components/Profile";
import Credits from "./components/Credits";
import SoroBuilder from "./components/SoroBuilder";
import Navbar from "./components/Navbar";
import { auth } from "./firebaseConfig";
import Generate from "./components/Generate";
import Documentation from "./components/Documentation";
import PaymentSuccess from "./components/PaymentSuccess";
import { Loader } from "lucide-react"

function ProtectedRoute({ children, user }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}

function ProtectedRouteNoNavbar({ children, user }) {
  const location = useLocation();

  // Si no está autenticado, redirigir al inicio
  if (!user) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // Si se intenta acceder a /smartcontract sin el estado `authorized`, redirigir
  if (location.pathname === "/smartcontract" && !location.state?.authorized) {
    return <Navigate to="/community" />;
  }

  return <>{children}</>;
}


function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#1a1f2b] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader className="w-12 h-12 text-[#3898FF] animate-spin" />
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text animate-pulse">
          Loading...
        </h2>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthChecked(true); // Indica que hemos comprobado el estado de autenticación
    });
    return unsubscribe;
  }, []);

  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<Auth user={user} />} />

        {/* Rutas protegidas */}
        <Route
          path="/community"
          element={
            <ProtectedRoute user={user}>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credits"
          element={
            <ProtectedRoute user={user}>
              <Credits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />
        <Route
          path="/generate"
          element={
            <ProtectedRoute user={user}>
              <Generate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docs"
          element={
            <ProtectedRoute user={user}>
              <Documentation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/smartcontract"
          element={
            <ProtectedRouteNoNavbar user={user}>
              <SoroBuilder />
            </ProtectedRouteNoNavbar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
