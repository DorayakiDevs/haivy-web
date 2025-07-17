import type { HaivySupabase } from "@services/init";

export class HaivyWrapper {
  client: HaivySupabase;

  constructor(client: HaivySupabase) {
    this.client = client;
  }

  isLoggedIn() {
    return !!this.client.auth.getUser();
  }

  getUser() {
    return this.client.auth.getUser();
  }
}
