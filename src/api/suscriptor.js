// lib/BlogApi.js
import { HttpClient } from "../classes/HttpClient.js";

export class SuscriptorApi extends HttpClient {
  constructor() {
    super("/suscriptor");
  }

  getSuscriptors(token = "") {
    return this.request({ method: "GET", token });
  }

  createSuscriptor(token = "", data) {
    return this.request({ method: "POST", token, body: data });
  }
}

export const suscriptorApi = new SuscriptorApi();
