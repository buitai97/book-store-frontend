import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BookPage from 'components/pages/client/book'
import AboutPage from 'components/pages/client/about'
import HomePage from 'components/pages/client/home'
import LoginPage from 'components/pages/client/auth/login'
import RegisterPage from 'components/pages/client/auth/register'
import 'styles/global.scss'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/book", element: <BookPage /> },
      { path: "/about", element: <AboutPage /> },
    ]
  },

  {
    path: "/pages/client",
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
]
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Layout /> */}
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
