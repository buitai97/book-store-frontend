import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";

const DashBoardPage = () => {
    const [dashboardStat, setDashboardStat] = useState<IDashBoard>()
    useEffect(() => {
        const getDashboardStat = async () => {
            const res = await getDashboardAPI()
            if (res && res.data) {
                setDashboardStat(res.data)
            } else {
                console.log(res.message)
            }
        }
        getDashboardStat()
    })
    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card>

                    <Statistic title="Users" value={dashboardStat?.countUser} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Books" value={dashboardStat?.countBook} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Orders" value={dashboardStat?.countOrder} />
                </Card>
            </Col>
        </Row>
    )
}

export default DashBoardPage;
