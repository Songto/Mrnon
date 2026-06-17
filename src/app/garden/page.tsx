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
        subtitle="Plants grow when friends water them — give a buddy's plant a daily drink, and roll the seed gacha to grow your own collection."
      />
      <SeedGacha />
      <PlantGarden />
    </div>
  );
}
