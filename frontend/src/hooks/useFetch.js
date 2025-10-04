import { useState, useEffect, useCallback, useRef } from 'react'

const useFetch = (fetchFunction, params = {}, options = {}) => {
  const {
    initialData = null,
    pollInterval = null,
    retryAttempts = 3,
    retryDelay = 1000,
    onSuccess = null,
    onError = null,
  } = options

  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)
  
  const retryCountRef = useRef(0)
  const pollIntervalRef = useRef(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      console.log('🔄 useFetch: Starting fetch, setting loading=true')
      setLoading(true)
      setError(null)
      retryCountRef.current = 0
    }

    try {
      console.log('🚀 useFetch: Calling fetchFunction...')
      const result = await fetchFunction(params)
      console.log('📦 useFetch: Got result:', result)
      console.log('📦 useFetch: Result type:', typeof result)
      console.log('📦 useFetch: mountedRef.current:', mountedRef.current)
      
      console.log('✅ useFetch: Setting data and clearing loading state (loading=false)')
      setData(result)
      setError(null)
      setLoading(false)
      setLastFetch(new Date())
      retryCountRef.current = 0
      
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      
      if (mountedRef.current) {
        if (retryCountRef.current < retryAttempts) {
          retryCountRef.current += 1
          console.log(`Retrying... Attempt ${retryCountRef.current}/${retryAttempts}`)
          
          setTimeout(() => {
            if (mountedRef.current) {
              fetchData(true)
            }
          }, retryDelay * retryCountRef.current)
        } else {
          setError(err.message || 'An error occurred while fetching data')
          
          if (onError) {
            onError(err)
          }
        }
      }
    } finally {
      if (mountedRef.current && !isRetry) {
        setLoading(false)
      }
    }
  }, [fetchFunction, params, retryAttempts, retryDelay, onSuccess, onError])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Polling setup
  useEffect(() => {
    if (pollInterval && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        fetchData()
      }, pollInterval)

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    }
  }, [pollInterval, fetchData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  return {
    data,
    loading,
    error,
    refresh,
    lastFetch,
    isRetrying: retryCountRef.current > 0,
  }
}

export default useFetch
