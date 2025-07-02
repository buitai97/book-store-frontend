import { Col, Row, Skeleton, Space } from "antd"
import { useState } from "react";


type SizeType = 'default' | 'small' | 'large';

const BookLoader = () => {
    const [active, setActive] = useState(false);
    const [block, setBlock] = useState(false);
    const [size, setSize] = useState<SizeType>('default');

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <Skeleton.Input
                                active={true}
                                block={true}
                                style={{ width: "100%", height: 250 }}
                            />
                            <div style={{ overflow: "hidden", display: "flex", justifySelf: "center", gap: 20, marginTop: 20 }}>
                                <Skeleton.Image active={true} style={{ width: 50, height: 50, padding: 10 }} />
                                <Skeleton.Image active={true} style={{ width: 50, height: 50, padding: 10 }} />
                                <Skeleton.Image active={true} style={{ width: 50, height: 50, padding: 10 }} />
                            </div>

                        </Col>
                        <Col md={14} sm={24}>
                            <Skeleton
                                paragraph={{ rows: 3 }}
                                active={true}
                                style={{ marginBottom: 10 }}
                            />

                            <Skeleton
                                paragraph={{ rows: 2 }}
                                active={true}
                            />
                            <Space>
                                <Skeleton.Button size={"small"} style={{ marginTop: 10 }} />
                                <Skeleton.Button size={"small"} style={{ marginTop: 10 }} />
                            </Space>
                        </Col>
                    </Row>
                </div>
            </div>

        </div>
    )
}

export default BookLoader