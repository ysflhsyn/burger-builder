import { useEffect, useState } from 'react';

export default axios => {
  const [error, setError] = useState(null);

  const reqInterceptor = axios.interceptors.request.use(req => {
    setError(null);
    return req;
  });

  const resInterceptor = axios.interceptors.response.use(res => res, error => {
    setError(error);
  });

  useEffect(() => () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    }      
  , [reqInterceptor, resInterceptor, axios]);

  const clearError = () => {
    setError(null);
  };

  return [error, clearError];
};