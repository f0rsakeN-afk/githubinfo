import { githubAPI } from "@/services/githubService";
import { GithubRepo, GithubUser, UserState } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: UserState = {
  user: null,
  repos: [] as GithubRepo[],
  loading: false,
  error: null,
};

interface fetchUserDataResponse {
  user: GithubUser;
  repos: GithubRepo[];
}

export const fetchUserData = createAsyncThunk<
  fetchUserDataResponse,
  string,
  { rejectValue: string }
>("user/fetchUserData", async (username: string, { rejectWithValue }) => {
  try {
    const [user, repos] = await Promise.all([
      githubAPI.getUser(username),
      githubAPI.getUserRepos(username),
    ]);
    return { user, repos };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.user = null;
      state.repos = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<fetchUserDataResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.repos = action.payload.repos;
          console.log(action.payload);
          state.error = null;
        }
      )
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserData } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectRepos = (state: { user: UserState }) => state.user.repos;
export const selectLoading = (state: { user: UserState }) => state.user.loading;
export const selectError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
