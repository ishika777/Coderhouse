import { useState, useEffect } from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { setAuth } from '../store/auth-slice';


const useLoadingWithRefresh = () => {
    
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axios.get("http://localhost:3000/api/refresh", {
                    withCredentials : true
                })
                dispatch(setAuth(data))
                setLoading(false);

            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        })()
    }, [])

    return {loading}

}

export default useLoadingWithRefresh