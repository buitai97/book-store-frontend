import { Modal, Tabs, TabsProps } from "antd"
import UpdateInformation from "./update.information";
import UpdatePassword from "./update.password";


interface IProps {
    isManageUserModalOpen: boolean
    closeManageUserModal: () => void
    showManageUserModal: () => void
}

const ManageUserModal = (props: IProps) => {
    const { closeManageUserModal, isManageUserModalOpen, showManageUserModal } = props

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Information',
            children: <UpdateInformation />
        },
        {
            key: '2',
            label: 'Change Password',
            children: <UpdatePassword />
        }
    ];

    return (
        <Modal
            title="Manage User"
            open={isManageUserModalOpen}
            onCancel={closeManageUserModal}
            footer={<></>}
            width={"60%"}
        >
            <Tabs defaultActiveKey="1" items={tabItems} onChange={(key) => { console.log(key) }} />
        </Modal>
    )
}

export default ManageUserModal
