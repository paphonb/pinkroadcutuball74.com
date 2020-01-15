import { useState, useCallback, useEffect } from "react"
import qs from "qs"

import HttpProvider, { useHttpContext } from "./HttpProvider"

const mockData = {
  '/register': () => {
    return { success: true }
  }
}

export { HttpProvider, useHttpContext }

export function useFakePost(url) {
  const { setPromise, ...rest } = usePromise()
  const execute = useCallback(body => {
    return setPromise(new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockData[url]) {
          alert(`post to ${url}\n${JSON.stringify(body)}`)
          resolve(mockData[url])
        } else {
          reject('404 not found')
        }
      }, 300)
    }))
  }, [url, setPromise])
  return { ...rest, execute }
}

export function usePromise() {
  const [state, setState] = useState({})
  useEffect(() => {
    if (!state.promise) {
      return
    }

    let canceled = false
    const { promise, resolve, reject } = state
    promise
      .then(data => {
        if (!canceled) {
          resolve(data)
          setState({ data })
        }
      })
      .catch(error => {
        if (!canceled) {
          reject(error)
          setState({ error })
        }
      })
    return () => canceled = true
  }, [state])

  const setPromise = useCallback(promise => {
    return new Promise((resolve, reject) => {
      setState({ promise, resolve, reject })
    })
  }, [])

  const { data, error } = state
  return { loading: !!state.promise, data, error, setPromise }
}

export function usePostStatus(url) {
  const { http } = useHttpContext()
  const { setPromise, ...result } = usePromise()
  const execute = useCallback(body => {
    return setPromise(http.post(url, qs.stringify(body)))
  }, [http, url, setPromise])
  return { ...result, execute }
}

export function useGet(url) {
  const { http } = useHttpContext()
  const { setPromise, ...result } = usePromise()
  const execute = useCallback(() => {
    return setPromise(http.get(url))
  }, [http, url, setPromise])
  useEffect(() => {
    execute()
  }, [url, execute])
  return { ...result, execute }
}