import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";


import Admins from "../pages/Admins";
import Home from "../components/Home";
import Dashboard from "../pages/Dashboard";
import News from "../pages/News";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "dashboard",
        element: <Home />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
       
      
            {
                path: 'admin',
                element: <Admins />
            },
            {
                path: 'newsletter',
                element: <News />
            },
         
       
        ]
    }
])


const Router = () => {
    return <RouterProvider router={router} />;
};

export default Router;
