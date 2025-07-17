import { HaivyWrapper } from "./base";

export class HaivyUsers extends HaivyWrapper {
  rows: Haivy.Table<"user_details">["Row"][] = [];

  async load() {
    if (!this.isLoggedIn()) {
      throw new Error("User is not authenticated");
    }

    return this.client.from("user_details").select("*");
  }
}
