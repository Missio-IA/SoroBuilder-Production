import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { User, Menu, X, Zap, LogOut, CreditCard, Users, FileCode, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [credits, setCredits] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Suscripción en tiempo real al doc de usuario
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setCredits(docSnap.data().credits || 0);
      }
    });

    // Cancelar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("There was a problem logging out. Please try again.");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const navItems = [
    { name: "Community", path: "/community", icon: <Users size={18} /> },
    { name: "Credits", path: "/credits", icon: <CreditCard size={18} /> },
    { name: "Smart Contracts", path: "/generate", icon: <FileCode size={18} /> },
  ];

  return (
    <nav className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text"
              onClick={handleLogoClick}
            >
              SoroBuilder
            </h1>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-500 to-teal-500"
                    : "hover:bg-gray-700"
                } transition-all duration-300`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}

            {credits !== null && (
              <Link
                to="/credits"
                className="flex items-center px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
              >
                <Zap size={18} className="text-yellow-400 mr-2" />
                <span className="text-sm font-medium">  {credits} {credits === 1 ? "Credit" : "Credits"}</span>
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-all duration-300"
              >
                <User size={18} className="mr-2" />
                <span className="text-sm font-medium">Account</span>
                <ChevronDown size={18} className="ml-2" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-700 transition-all duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Botón hamburguesa */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-500 to-teal-500"
                    : "hover:bg-gray-700"
                } transition-all duration-300`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </div>
              </Link>
            ))}

            {credits !== null && (
              <Link
                to="/credits"
                className="flex items-center px-3 py-2 rounded-md bg-gray-700"
               >
                <Zap size={18} className="text-yellow-400 mr-2" />
                <span className="text-sm font-medium">{credits} {credits === 1 ? "Credit" : "Credits"}</span>
                </Link>
            )}

            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-all duration-300"
            >
              <div className="flex items-center">
                <LogOut size={18} className="mr-2" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
