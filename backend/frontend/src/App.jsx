import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Mood from "./pages/mood";
import ForgotPassword from "./pages/forgot-password/forgot-password";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Home />} />

        <Route path="/mood" element={<Mood/>} />

        <Route  path="/forgot-password" element={<ForgotPassword />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;