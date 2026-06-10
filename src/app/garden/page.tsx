import { PlantGarden } from "@/components/garden/PlantGarden";
import { SectionHeading } from "@/components/ui/CozyCard";

export const metadata = { title: "Garden · Ourchat 🌿" };

export default function GardenPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        icon="leaf"
        title="The Member Garden"
        subtitle="Every cozy moment grows your plant. Water a friend's to help it bloom — and see who's curled up online right now."
      />
      <PlantGarden />
    </div>
  );
}
