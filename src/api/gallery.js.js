// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class GalleryApi extends HttpClient {
  constructor() {
    super("/gallery");
  }

  getGallery() {
    return this.request({ method: "GET" });
  }

  createImage(token = "", data) {
    return this.request({ method: "PATCH", token, body: data });
  }

  deleteImage(token, name) {
    return this.request({ method: "DELETE", endpoint: `/${name}`, token });
  }
}

export const galleryApi = new GalleryApi();
