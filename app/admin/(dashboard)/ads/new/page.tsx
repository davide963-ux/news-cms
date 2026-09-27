import AdForm from "@/components/admin/AdForm";
import { createAd } from "@/lib/actions/ads";

export default function NewAdPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Reklamë e re</h1>
      <AdForm action={createAd} />
    </div>
  );
}
