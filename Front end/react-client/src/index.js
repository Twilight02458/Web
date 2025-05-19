import React from "react";
import ReactDOM from "react-dom/client"; // Sử dụng API mới
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
<<<<<<< HEAD

const root = ReactDOM.createRoot(document.getElementById("root")); // Tạo root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
=======
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
>>>>>>> a18e969 (Add Chat)
);