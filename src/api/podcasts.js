// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class PodcastApi extends HttpClient {
  constructor() {
    super("/podcast");
  }

  getPodcasts() {
    return this.request({ method: "GET" });
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
