import { redirect } from "next/navigation";

// The Events tab became the Friend Feed — keep old links working.
export default function EventsPage() {
  redirect("/feed");
}
