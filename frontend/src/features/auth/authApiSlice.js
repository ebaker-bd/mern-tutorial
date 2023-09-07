import apiSlice from '../../app/api/apiSlice';
import { logout } from './authSlice';

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
            await queryFulfilled;
            dispatch(logout());
            dispatch(apiSlice.util.resetApiState());
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
      }),
    };
  },
});

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = apiSlice;
