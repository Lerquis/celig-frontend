// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class PodcastApi extends HttpClient {
  constructor() {
    super("/podcast");
  }

  getPodcasts({ page, limit } = {}) {
    return this.request({ method: "GET", query: { page, limit } });
  }

  createPodcast(token, data) {
    return this.request({
      method: "POST",
      token,
      body: data,
    });
  }

  deletePodcast(id, token) {
    return this.request({
      method: "DELETE",
      token,
      endpoint: `/${id}`,
    });
  }
}

export const podcastApi = new PodcastApi();
