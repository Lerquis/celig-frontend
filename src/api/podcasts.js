// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class PodcastApi extends HttpClient {
  constructor() {
    super("/podcast");
  }

  getPodcasts() {
    return this.request({ method: "GET" });
  }
}

export const podcastApi = new PodcastApi();
