import { useCurrentApp } from "components/context/app.context"
const AppHeader = () => {
    const { currentUser } = useCurrentApp()
    return (
        <>
            <div>Hello, {currentUser?.fullName}</div>
        </>)
}

export default AppHeader