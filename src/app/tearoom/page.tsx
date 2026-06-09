import { ChatRoom } from "@/components/chat/ChatRoom";
import { SectionHeading } from "@/components/ui/CozyCard";

export const metadata = { title: "Tearoom · Ourchat 🍵" };

export default function TearoomPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        emoji="🍵"
        title="The Tearoom"
        subtitle="Pull up a chair at a table and chat live. Your seat shows up for everyone."
      />
      <ChatRoom />
    </div>
  );
}
