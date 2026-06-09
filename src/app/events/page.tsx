import { EventCalendar } from "@/components/events/EventCalendar";
import { BadgeShelf } from "@/components/events/BadgeShelf";
import { SectionHeading } from "@/components/ui/CozyCard";

export const metadata = { title: "Events · Ourchat 🎀" };

export default function EventsPage() {
  return (
    <div className="space-y-10">
      <section>
        <SectionHeading
          emoji="🎀"
          title="Parties & Game Nights"
          subtitle="Upcoming cozy gatherings. RSVP to grow your garden — each event links back to our Discord."
        />
        <EventCalendar />
      </section>

      <section>
        <SectionHeading
          emoji="🏆"
          title="Sticker Badges"
          subtitle="Collectible cuties you earn by being part of the community."
        />
        <BadgeShelf />
      </section>
    </div>
  );
}
