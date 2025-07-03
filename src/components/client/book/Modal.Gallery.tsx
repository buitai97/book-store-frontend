import { Col, Modal, Row, Image } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import './modal.gallery.scss'

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string,
        thumbnail: string,
        originalClass: string,
        thumbnailClass: string,
    }[];
    title: string;
}
const ModalGallery = (props: IProps) => {
    const { isOpen, setIsOpen, currentIndex, items, title } = props
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null)

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex)
        }
    }, [isOpen, currentIndex])
    return (
        <Modal
            width={'60vw'}
            open={isOpen}
            onCancel={() => { setIsOpen(false) }}
            footer={null}
            closable={false}
            className="modal-gallery"
        >
            <ImageGallery
                ref={refGallery}
                items={items}
                showPlayButton={false}
                showFullscreenButton={false}
                startIndex={currentIndex}
                showThumbnails={true}
                thumbnailPosition="bottom"
                onSlide={(i) => setActiveIndex(i)}
                slideDuration={0}
                
            />

        </Modal>
    )
}

export default ModalGallery;