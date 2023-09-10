import apiSlice from '../../app/api/apiSlice';
import { logout, setCredentials } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      login: builder.mutation({
        query: (credential) => {
          return {
            url: '/auth',
            method: 'POST',
            body: { ...credential },
          };
        },
      }),
      sendLogout: builder.mutation({
        query: () => {
          return {
            url: '/auth/logout',
            method: 'POST',
          };
        },
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log(data);
            dispatch(logout());

            // Wait til component realizes it dismounted
            setTimeout(() => {
              dispatch(apiSlice.util.resetApiState());
            }, 1000);
          } catch (err) {
            console.log(err);
          }
        },
      }),
      refresh: builder.mutation({
        query: () => {
          return {
            url: '/auth/refresh',
            method: 'GET',
          };
        },
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log(data);
            const { accessToken } = data;
            dispatch(setCredentials({ accessToken }));
          } catch (err) {
            console.log(err);
          }
        },
      }),
    };
  },
});

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = apiSlice;
