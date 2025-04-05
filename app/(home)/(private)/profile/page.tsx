"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement profile update logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulation
      console.log("Profile updated");
    } catch (err: unknown) {
      console.error("Erreur de mise à jour:", err);
      setError(
        "Une erreur est survenue lors de la mise à jour. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Team Athlete Logo"
          width={120}
          height={80}
          className="mx-auto"
          priority
        />
        <h2 className="mt-6 text-3xl font-bold text-white">Mon Profil</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Gérez vos informations personnelles
        </p>
      </div>

      <form onSubmit={handleProfileUpdate} className="mt-8 space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="firstName" className="sr-only">
              Prénom
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
              placeholder="Prénom"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="sr-only">
              Nom
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
              placeholder="Nom"
            />
          </div>
          <div>
            <label htmlFor="phone" className="sr-only">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
              placeholder="Téléphone"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
              placeholder="Email"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
          </Button>
        </div>
      </form>
    </div>
  );
}
