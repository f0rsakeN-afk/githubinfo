import axios from "axios";
import { GithubUser, GithubRepo } from "@/types";
import { BASE_URL } from "@/config";

export const githubAPI = {
  getUser: async (username: string): Promise<GithubUser> => {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    return response.data;
  },
  getUserRepos: async (username: string): Promise<GithubRepo[]> => {
    const response = await axios.get(
      `${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`
    );
    return response.data;
  },
};
