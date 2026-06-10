import { ChatRoom } from "@/components/chat/ChatRoom";

export const metadata = { title: "Tearoom · Ourchat 🍵" };

export default function TearoomPage() {
  return (
    <div className="space-y-5">
      {/* cozy header banner */}
      <div
        className="relative overflow-hidden rounded-cozy border border-white/60 p-6 shadow-cozy sm:p-7"
        style={{ background: "linear-gradient(135deg,#FFE3EC,#E5DEFF 60%,#DDEBFF)" }}
      >
        <span className="pointer-events-none absolute -right-3 -top-4 text-8xl opacity-15">🫖</span>
        <span className="pointer-events-none absolute bottom-1 right-20 text-4xl opacity-15">🍪</span>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-cocoa sm:text-3xl">
          <span className="animate-float-slow">🍵</span> The Tearoom
        </h1>
        <p className="mt-1 max-w-lg text-sm text-cocoa-soft">
          Chat live in the public lobby, or open a private room with a code for just your friends.
        </p>
      </div>
      <ChatRoom />
    </div>
  );
}
