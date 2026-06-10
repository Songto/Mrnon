import { PlantGarden } from "@/components/garden/PlantGarden";
import { SeedGacha } from "@/components/garden/SeedGacha";
import { SectionHeading } from "@/components/ui/CozyCard";

export const metadata = { title: "Garden · Ourchat 🌿" };

export default function GardenPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        icon="leaf"
        title="The Member Garden"
        subtitle="Every cozy moment grows your plant. Water a friend's to help it bloom — and roll the daily seed gacha to complete your collection."
      />
      <SeedGacha />
      <PlantGarden />
    </div>
  );
}
