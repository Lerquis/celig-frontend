// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class BlogApi extends HttpClient {
  constructor() {
    super("/blog");
  }

  getBlogsByTag(tag = "", { page, limit } = {}) {
    return this.request({
      method: "GET",
      endpoint: "/tags",
      query: { tag, page, limit },
    });
  }

  updateBlog(id, data, token) {
    return this.request({
      method: "PUT",
      endpoint: `/${id}`,
      body: data,
      token,
    });
  }

  createBlog(data, token) {
    return this.request({
      method: "POST",
      body: data,
      token,
    });
  }

  deleteBlog(id, token) {
    return this.request({
      method: "DELETE",
      endpoint: `/${id}`,
      token,
    });
  }

  updateView(id) {
    return this.request({
      method: "PATCH",
      endpoint: `/${id}`,
    });
  }
}

export const blogApi = new BlogApi();
