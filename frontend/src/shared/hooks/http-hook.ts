import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(async (
    url: string,
    method: ('GET' | 'POST' | 'PATCH' | 'DELETE') = 'GET',
    body?: BodyInit,
    headers: HeadersInit = {}
  ) => {
    setIsLoading(true);
    const httpAbortController = new AbortController();
    activeHttpRequests.current.push(httpAbortController);
    
    
    try {
      const response = await fetch(url, {
        method, body, headers,
        signal: httpAbortController.signal,
      });
      const data = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl!==httpAbortController
      )

      if (!response.ok)
        throw new Error(data.message);
      setIsLoading(false);

      return data;
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message)
      throw err;
    }

  }, [])
  const clearError = () => setError(undefined)

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(val => val.abort())
    }
  }, [])

  return { isLoading, error, sendRequest, clearError }
}