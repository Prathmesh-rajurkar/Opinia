import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<h1>Hello World</h1>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
