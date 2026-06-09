import { SectionHeading } from "@/components/ui/CozyCard";
import { FeedBoard } from "@/components/feed/FeedBoard";

export const metadata = { title: "Feed · OURCHAT Teaparty 🌷" };

export default function FeedPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        emoji="🌷"
        title="Friend Feed"
        subtitle="Drop a 90-minute card when you're looking for someone to play or chat with — and wave at folks you'd like to meet."
      />
      <FeedBoard />
    </div>
  );
}
