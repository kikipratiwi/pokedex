import {useEffect, useState} from 'react'
import axios from 'axios'

const usePagination = (url) => {
    const LIMIT = 20
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [next, setNext] = useState()

    async function fetchData(url) {
        try {
            const {data: response} = await axios.get(url, {
                params: {
                    offset: LIMIT * page,
                    limit: LIMIT,
                },
            })

            setNext(response.next)
            setData((prev) => [...prev, ...response.results])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(url)
    }, [page])

    return {
        data,
        next,
        setPage,
    }
}

export default usePagination
