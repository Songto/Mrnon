import { ChatRoom } from "@/components/chat/ChatRoom";
import { SectionHeading } from "@/components/ui/CozyCard";

export const metadata = { title: "Tearoom · Ourchat 🍵" };

export default function TearoomPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        emoji="🍵"
        title="The Tearoom"
        subtitle="Chat live in the public lobby, or open a private room with a code for just your friends."
      />
      <ChatRoom />
    </div>
  );
}
