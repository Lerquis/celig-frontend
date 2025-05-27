// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class TestimonialApi extends HttpClient {
  constructor() {
    super("/testimonial");
  }

  getTestimonials() {
    return this.request({ method: "GET" });
  }

  deleteTestimonial(id, token) {
    return this.request({
      method: "DELETE",
      endpoint: `/${id}`,
      token,
    });
  }

  createTestimonial(data, token) {
    return this.request({
      method: "POST",
      body: data,
      token,
    });
  }

  updateTestimonial(id, data, token) {
    return this.request({
      method: "PUT",
      endpoint: `/${id}`,
      body: data,
      token,
    });
  }
}

export const testimonialApi = new TestimonialApi();
