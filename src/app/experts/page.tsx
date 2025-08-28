// app/experts/page.js
import Image from "next/image";

type Expert = {
  login: { uuid: string };
  name: { first: string; last: string };
  location: { city: string; country: string };
  picture: { large: string };
};

async function getExperts(): Promise<Expert[]> {
  const res = await fetch("https://randomuser.me/api/?results=9", {
    cache: "no-store", // SSR fresh fetch
  });
  const data = await res.json();
  return data.results;
}

export default async function ExpertsPage() {
  const experts = await getExperts();

  const adviceSamples = [
    "Rotate your crops to improve soil fertility",
    "Use compost to enrich your farm naturally",
    "Harvest early in the morning for fresher produce",
    "Keep soil moist but avoid overwatering",
    "Support local pollinators by planting flowers",
    "Store produce in a cool, dry place to last longer",
    "Use mulch to retain soil moisture and suppress weeds",
    "Practice crop rotation to maintain soil health",
    "Incorporate cover crops to improve soil structure",
  ];

  return (
    <main className="max-w-6xl mx-auto p-6 h-screen">
      <h1 className="text-3xl font-bold mb-8">Meet Our Experts</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experts.map((expert: Expert, idx: number) => (
          <div
            key={expert.login.uuid}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src={expert.picture.large}
                alt={`${expert.name.first} ${expert.name.last}`}
                width={80}
                height={80}
                className="rounded-full border-2 border-green-400"
                unoptimized
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {expert.name.first} {expert.name.last}
                </h2>
                <p className="text-sm text-green-600">
                  {expert.location.city}, {expert.location.country}
                </p>
              </div>
            </div>

            <p className="italic text-green-700">
              “{adviceSamples[idx % adviceSamples.length]}”
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
