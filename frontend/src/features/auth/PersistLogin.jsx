import { Outlet, Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useRefreshMutation } from './authApiSlice';
import usePersist from '../hooks/usePersist';
import { selectCurrentToken } from './authSlice';

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSucess, setTrueSuccess] = useState(false);
  const [refresh,
    {
      isUninitialized,
      isLoading,
      isSuccess,
      isError,
      error,
    }] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 strict mode
      const verifyRefreshToken = async () => {
        console.log('verifying refresh token');
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (err) {
          console.log(err);
        }
      };
      if (!token && persist) verifyRefreshToken();
    }

    return () => { effectRan.current = true; };
  }, []);

  let content;
  if (!persist) { // persist : false
    console.log('Persist: False');
    content = <Outlet />;
  } else if (isLoading) { // persist: true, token: false
    console.log('Loading...');
    content = <p>Loading...</p>;
  } else if (isError) { // persist: true, token: false
    console.log('error');
    content = (
      <p className="errmsg">
        {error.data?.message}
        <Link to="/login"> Please login again</Link>
      </p>

    );
  } else if (isSuccess && trueSucess) { // persist: true token: true
    console.log('success');
    content = <Outlet />;
  } else if (token && isUninitialized) { // persist: true token: true
    console.log(`uninitalized : ${isUninitialized}`);
    content = <Outlet />;
  }
  return content;
};

export default PersistLogin;
