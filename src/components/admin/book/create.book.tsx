import { Modal } from "antd"

interface IProps {
    setOpenCreateModal: (v: boolean) => void,
    openCreateModal: boolean,

}


const CreateBookModal = (props: IProps) => {
    const { openCreateModal, setOpenCreateModal } = props
    const handleOk = () => {
        setOpenCreateModal(false);
    };

    const handleCancel = () => {
        setOpenCreateModal(false);
    };
    return (

        <>
            <Modal
                title="Basic Modal"
                open={openCreateModal}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    )
}

export default CreateBookModal