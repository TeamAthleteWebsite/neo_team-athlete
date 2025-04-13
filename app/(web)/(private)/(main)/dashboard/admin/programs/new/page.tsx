"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProgramForm } from "../components/ProgramForm";

export default function NewProgramPage() {
  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-accent">
          <Link
            href="/dashboard/admin/programs"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-accent/20 text-gray-600 hover:text-accent transition-colors mb-4 mr-4"
            aria-label="Retour aux programmes"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          Nouveau Programme
        </h1>
        <div className="bg-white/80 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-4">
          <ProgramForm />
        </div>
      </div>
    </div>
  );
}
