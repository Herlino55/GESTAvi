"use client";

import { getProduct } from "@/dal/get-produt";
import { useAuthStore } from "@/stores";
import Image from "next/image";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: "🌿",
      title: "Organic Feed",
      description: "Our chickens are fed with 100% organic feed, ensuring the highest quality eggs and meat.",
    },
    {
      icon: "🏡",
      title: "Free Range",
      description: "All our poultry roam freely in spacious, natural environments for healthier livestock.",
    },
    {
      icon: "✨",
      title: "Farm Fresh",
      description: "From our farm to your table in less than 24 hours, guaranteeing maximum freshness.",
    },
  ];

  const farmers = [
    { name: "Marie Dupont", role: "Head Farmer", avatar: "MD" },
    { name: "Jean Pierre", role: "Veterinarian", avatar: "JP" },
    { name: "Claire Martin", role: "Quality Manager", avatar: "CM" },
    { name: "Lucas Bernard", role: "Operations", avatar: "LB" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Welcome To {company.name}
          </h1>
        </div>
      </main>
    </div>
  );
};

export default Index;
