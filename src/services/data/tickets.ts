import { HaivyWrapper } from "./base";

export class HaivyTickets extends HaivyWrapper {
  async getTickets(signal: AbortSignal) {
    const { data } = await this.getUser();

    if (!data.user) {
      throw new Error("User is not logged in");
    }

    const uid = data.user.id;

    return this.client
      .from("ticket")
      .select("*")
      .or(`created_by.eq.${uid},assigned_to.eq.${uid}`)
      .order("date_created", { ascending: false })
      .abortSignal(signal);
  }
}
