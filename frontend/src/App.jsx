import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext.jsx";
import "../static/style/style.css";

function App() {
  const { authUser } = useAuthContext();

  // Handle unknown routes
  const manageUnknownRoute = () => {
    return <Navigate to="/" replace />;
  };

  return (
    <div className="p-4 h-screen flex items-center justify-center parent-class chat-begin">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" replace /> : <SignUp />}
        />
        <Route path="*" element={manageUnknownRoute()} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
