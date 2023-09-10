import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3500',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log('Sending refresh token');

    // Send refresh token to get new access token
    const refreshResults = await baseQuery('/auth/refresh', api, extraOptions);
    if (refreshResults?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResults.data }));

      // retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResults?.error?.status === 403) {
        refreshResults.error.data.message = ' Your login has expired. ';
      }
      return refreshResults;
    }
  }

  return result;
};
const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Note', 'User'],
  endpoints: (builder) => { return {}; },
});

export default apiSlice;
