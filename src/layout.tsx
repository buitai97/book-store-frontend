import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import AppFooter from "components/layout/app.footer"
import { useEffect } from "react"
import { fetchAccountAPI } from "./services/api"
import { useCurrentApp } from "./components/context/app.context"
import { PacmanLoader } from "react-spinners"

function Layout() {
  const { setCurrentUser, setIsAuthenticated, isAppLoading, setIsAppLoading } = useCurrentApp()
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setCurrentUser(res.data.user)
        setIsAuthenticated(true)
      }
      setIsAppLoading(false)
    }
    fetchAccount()
  }, [])
  return (
    <>
      {isAppLoading === false ?
        <div>
          <AppHeader />
          <Outlet />
          <AppFooter />
        </div>
        :
        <div>
          <PacmanLoader
            size={30}
            color="#3D90D7"
            style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

        </div>
      }
    </>
  )
}

export default Layout
