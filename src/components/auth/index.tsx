import { Button } from "antd"
import Result from "antd/es/result"
import { useCurrentApp } from "components/context/app.context"
import { Link, useLocation } from "react-router-dom"

interface IProps {
    children: React.ReactNode
}
export const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp()
    const location = useLocation()
    const isAdminRoute = location.pathname.includes("admin")
    console.log(user)

    if (!isAuthenticated) {
        return (<Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
        />)
    }

    else if (isAdminRoute && user?.role !== 'ADMIN') {
        return (<Result
            status="403"
            title="Not Login"
            subTitle="Please sign in to access this feature"
            extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
        />)
    }

    return (
        <div>
            {props.children}
        </div>
    )

}