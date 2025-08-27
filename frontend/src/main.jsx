import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";

import Home from './pages/Home.jsx';
import Doctors from './pages/Doctors.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import SignUp from './pages/SignUp.jsx';


const router=createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/doctors",
        element: <Doctors />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path:"/signup",
        element:<SignUp />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    
  </StrictMode>,
)
