import {
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import apiSlice from '../../app/api/apiSlice';

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return (
      (a.completed === b.completed) ? 0
        : a.completed ? 1 : -1);
  },
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getNotes: builder.query({
        query: () => { return '/notes'; },
        validateStatus:
        (response, result) => { return response.status === 200 && !result.isError; },
        transformResponse: (responseData) => {
          const loadedNotes = responseData.map((note) => {
            note.id = note._id;
            return note;
          });
          return notesAdapter.setAll(initialState, loadedNotes);
        },
        providesTags: (result, error, arg) => {
          if (result?.ids) {
            return [
              { type: 'Note', id: 'LIST' },
              ...result.ids.map((id) => { return { type: 'Note', id }; }),
            ];
          } return [{ type: 'Note', id: 'LIST' }];
        },
      }),
      addNewNote: builder.mutation({
        query: (initialNoteData) => {
          return {
            url: '/notess',
            method: 'POST',
            body: {
              ...initialNoteData,
            },
          };
        },
        invalidatesTags: [
          { type: 'User', id: 'LIST' },
        ],
      }),
      updateNote: builder.mutation({
        query: (initialNoteData) => {
          return {
            url: '/notes',
            method: 'PATCH',
            body: {
              ...initialNoteData,
            },
          };
        },
        invalidatesTags: (result, error, arg) => {
          return [
            { type: 'Note', id: arg.id },
          ];
        },
      }),
      deleteNote: builder.mutation({
        query: ({ id }) => {
          return {
            url: '/notes',
            method: 'DELETE',
            body: { id },
          };
        },
        invalidatesTags: (result, error, arg) => {
          return [
            { type: 'Note', id: arg.id },
          ];
        },
      }),
    };
  },
});

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => { return notesResult.data; }, // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors((state) => { return selectNotesData(state) ?? initialState; });
