// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class BlogApi extends HttpClient {
  constructor() {
    super("/blog");
  }

  getBlogsByTag(tag = "") {
    return this.request({ method: "GET", endpoint: `/tags?tag=${tag}` });
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
}

export const blogApi = new BlogApi();
