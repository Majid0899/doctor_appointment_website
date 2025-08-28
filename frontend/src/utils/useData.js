import { useState, useEffect } from 'react'
import axios from 'axios'

const useData = (api) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await axios.get(`${backendUrl}/${api}`)
        setData(response.data)
        setServerError(null)
      } catch (error) {
        
        setServerError(error.response?.data?.error || error.message)
      } finally {
        setLoading(false)
      }
    }
    if (backendUrl) {
      fetchData()
    }
  }, [api])

  return { data, loading, serverError }
}

export default useData
