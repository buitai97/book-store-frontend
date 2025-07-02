import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Flex, Form, GetProp, InputNumber, message, Pagination, Rate, Row, Spin, Tabs, TabsProps, Typography } from "antd"
import './home.scss'
import { useEffect, useState } from "react";
import { getBookCategoriesAPI, getBooksAPI } from "@/services/api";
import { convertNumberToVND } from "@/services/helper";
import { Link } from "react-router-dom";


interface FilterValues {
    price?: {
        min?: number;
        max?: number;
    };
    categories?: string[]
}

const items: TabsProps['items'] = [
    {
        key: '&sort=-sold',
        label: 'Popular',
        children: <></>,
    },
    {
        key: '&sort=-updatedAt',
        label: 'New Arrivals',
        children: <></>,

    },
    {
        key: '&sort=price',
        label: 'Lowest To Highest',
        children: <></>,
    },
    {
        key: '&sort=-price',
        label: 'Highest To Lowest',
        children: <></>,
    },
];

const HomePage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [bookList, setBookList] = useState<IBookTable[]>([])

    const [categoryOptions, setCategoryOptions] = useState<string[]>()
    const [currentPage, setCurrentPage] = useState<number>()
    const [currentPageSize, setCurrentPageSize] = useState<number>()
    const [sortQuery, setSortQuery] = useState<string>("&sort=-sold")
    const [checkedCategories, setCheckedCategories] = useState<string[]>()
    const [minPrice, setMinPrice] = useState<number | null>()
    const [maxPrice, setMaxPrice] = useState<number | null>()

    const [form] = Form.useForm()

    const fetchData = async () => {
        setIsLoading(true)
        let query = `current=${currentPage}&pageSize=${currentPageSize}`
        let categoryFilterQuery = checkedCategories ? `&category=${checkedCategories}` : ""
        let priceFilterQuery = ``
        priceFilterQuery += minPrice ? `&price>=${minPrice}` : ""
        priceFilterQuery += maxPrice ? `&price<=${maxPrice}` : ""
        if (sortQuery) {
            query += sortQuery
        }
        if (categoryFilterQuery) {
            query += `&category=${checkedCategories}`
        }
        const res = await getBooksAPI(query)
        if (res && res.data) {
            setBookList(res.data.result)
        }
        else {
            console.log(res.error)
        }
        setIsLoading(false)
    }

    const handleCheckboxChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValue) => {
        setCheckedCategories(checkedValue as string[])
    }

    const handleApplyFilter: GetProp<typeof Form, 'onFinish'> = (values) => {
        const filterValues = values as FilterValues
        const { min, max } = filterValues?.price ?? {}
        if (min && max) {
            if (min > max) {
                message.info("Invalid range!")
                return
            }
        }
        setMinPrice(min)
        setMaxPrice(max)
    }

    const handleResetFilter = () => {
        setMinPrice(null)
        setMaxPrice(null)
        setCheckedCategories([])
        form.resetFields()
    }

    const handleTabChange: GetProp<typeof Tabs, 'onChange'> = (key) => {
        setSortQuery(key)
        setCurrentPage(1)
    }

    const handlePaginationChange: GetProp<typeof Pagination, 'onChange'> = async (page, pageSize) => {
        setCurrentPage(page)
        setCurrentPageSize(pageSize)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getBookCategoriesAPI()
                setCategoryOptions(categories?.data ?? [])
            } catch (error) {
                console.log('Failed to fetch categories: ', error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchData()
    }, [currentPage, currentPageSize, sortQuery, checkedCategories, minPrice, maxPrice])




    return (
        <>
            <Row gutter={[16, 24]}>
                <Col md={4} xs={0} style={{ padding: "1rem" }}>

                    <Flex justify="space-between">
                        <span> <FilterTwoTone /> Filter </span>
                        <span onClick={handleResetFilter} style={{ cursor: "pointer" }}><ReloadOutlined /> Reset </span>
                    </Flex>


                    <Form
                        onFinish={handleApplyFilter}
                        labelCol={{ span: 6 }}
                        form={form}
                    >
                        <Form.Item<FilterValues> name="categories">
                            <Checkbox.Group style={{ display: "flex", flexDirection: "column" }} options={categoryOptions} onChange={handleCheckboxChange} />
                        </Form.Item>
                        <Divider></Divider>
                        <Form.Item<FilterValues> name={['price', 'min']} label="From" rules={[{ type: 'number', min: 0, message: "Number can't be negative" }]}>
                            <InputNumber style={{ width: "100%" }} placeholder="Min"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="₫"
                                parser={(value) => value?.replace(/\\s?|(,*)/g, '') as unknown as number}
                            />
                        </Form.Item>
                        <Form.Item<FilterValues> name={['price', 'max']} label="To" rules={[{ type: 'number', min: 0, message: "Number can't be negative" }]}>
                            <InputNumber placeholder="Max"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="₫"
                                parser={(value) => value?.replace(/\\s?|(,*)/g, '') as unknown as number}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Apply Filter
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider></Divider>

                    <Flex gap="middle" vertical>
                        <Flex gap="middle">
                            <Rate defaultValue={5} />
                        </Flex>
                        <Flex gap="middle">
                            <Rate defaultValue={4} allowClear={false} />
                            <span>Up</span>
                        </Flex>
                        <Flex gap="middle">
                            <Rate defaultValue={3} allowClear={false} />
                            <span>Up</span>
                        </Flex><Flex gap="middle">
                            <Rate defaultValue={2} allowClear={false} />
                            <span>Up</span>
                        </Flex><Flex gap="middle">
                            <Rate defaultValue={1} allowClear={false} />
                            <span>Up</span>
                        </Flex>
                    </Flex>

                </Col>
                <Col md={20} xs={24} >
                    <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} />
                    <Spin tip="Loading..." spinning={isLoading}>
                        <div className="wrapper">

                            <div className="flex-container">
                                {bookList.map((book) => (
                                    <div className="card" key={book._id}>
                                        <Link to={`/book/${book._id}`}>
                                            <img className="card__image" src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.thumbnail}`} alt="card item" />
                                            <div className="card__title">
                                                <Typography.Paragraph ellipsis={{ rows: 2, expandable: false }}>
                                                    {book.mainText}
                                                </Typography.Paragraph>
                                            </div>
                                        </Link>

                                        <div className="card_price">
                                            {convertNumberToVND(book.price)}
                                        </div>

                                        <div className="card_rating">
                                            <Rate style={{ fontSize: 12 }} disabled allowHalf defaultValue={5} />
                                            <span style={{ margin: "10px" }}>{book.sold || 0} Sold</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Spin>
                    

                    <Divider></Divider>
                    <Pagination
                        align="center"
                        style={{ margin: "1rem" }}
                        current={currentPage}
                        pageSize={currentPageSize}
                        showSizeChanger
                        pageSizeOptions={[5, 10, 20, 50]}
                        onChange={handlePaginationChange}
                    />
                </Col>

            </Row >
        </>
    )
}
export default HomePage