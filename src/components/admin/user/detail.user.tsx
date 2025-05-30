import { FORMAT_DATE, FORMAT_DATE_US } from "@/services/helper";
import { Avatar, Button, Descriptions, DescriptionsProps, Drawer } from "antd"
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;
}


const DetailUser = (props: IProps) => {
    const { openViewDetail, setDataViewDetail, setOpenViewDetail, dataViewDetail } = props

    const onClose = () => {
        setOpenViewDetail(false)
        setDataViewDetail(null)
    }
    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: dataViewDetail?._id,
        },
        {
            key: '2',
            label: 'Name',
            children: dataViewDetail?.fullName,
        },
        {
            key: '3',
            label: 'Email',
            children: dataViewDetail?.email,
        },
        {
            key: '4',
            label: 'Phone',
            children: dataViewDetail?.phone,

        },
        {
            key: '5',
            label: 'Role',
            children: dataViewDetail?.role,

        }, {
            key: '6',
            label: 'Avatar',
            children: <Avatar size={40} src={avatarURL}></Avatar>,

        },
        {
            key: '7',
            label: 'Created At',
            children: dayjs(dataViewDetail?.createdAt).format(FORMAT_DATE_US),

        },
        {
            key: '8',
            label: 'Updated At',
            children: dayjs(dataViewDetail?.updatedAt).format(FORMAT_DATE_US),

        },

    ];
    return (
        <>
            <Drawer
                title="Users"
                closable={{ 'aria-label': 'Close Button' }}
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    bordered
                    title="User Info"
                    size="small"
                    extra={<Button type="primary">Edit</Button>}
                    items={items}
                    column={2}
                />
            </Drawer>
        </>
    )
}

export default DetailUser