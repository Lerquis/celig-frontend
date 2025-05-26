// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class TestimonialApi extends HttpClient {
  constructor() {
    super("/testimonial");
  }

  getTestimonials() {
    return this.request({ method: "GET" });
  }
}

export const testimonialApi = new TestimonialApi();
