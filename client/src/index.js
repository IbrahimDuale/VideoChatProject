import ReactDOM from 'react-dom/client';
import App from "./App";
import LoginPage from "./Components/LoginPage";
import Room from "./Components/Room";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<LoginPage />} />
                <Route path=":roomName" element={<Room />} />
            </Route>
        </Routes>
    </BrowserRouter>
);