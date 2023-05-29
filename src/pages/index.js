import IndexLayout from "../layouts/IndexLayout";
import Index from './Index/Index'
import Auth from "./Auth/Auth";
import Network from './Network/Network'
import Chats from "./Chats/Chats";

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <IndexLayout/>,
        children: [
            { path: '/', element: <Index/> },
            { path: '/auth', element: <Auth/> },
            { path: '/network', element: <Network/> },
            { path: '/chats', element: <Chats/> }
        ]
    }
])