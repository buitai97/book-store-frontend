import BookDetail from "@/components/client/book/book.detail"
import BookLoader from "@/components/client/book/book.loader"
import { getBookByIDAPI } from "@/services/api"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"




const BookPage = () => {
    let { id } = useParams()
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null)
    const [isLoadingBook, setIsLoadingBook] = useState<boolean>(false)


    useEffect(() => {
        const fetchBook = async () => {
            setIsLoadingBook(true)
            if (id) {
                const res = await getBookByIDAPI(id)
                setCurrentBook(res?.data ?? null)
            }
            setIsLoadingBook(false)
        }
        fetchBook()
    }, [id])
    return (
        <div>

            {isLoadingBook ?
                <BookLoader />
                :
                <BookDetail
                    currentBook={currentBook}
                />
            }
        </div>
    )


}

export default BookPage