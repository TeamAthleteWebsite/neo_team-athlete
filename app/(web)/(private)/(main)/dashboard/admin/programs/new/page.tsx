"use client";

import { createProgram } from "@/src/actions/program.actions";
import { ProgramForm } from "../components/ProgramForm";

export default function NewProgramPage() {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nouveau Programme</h1>
        <ProgramForm
          onSubmit={createProgram}
          submitLabel="Créer le programme"
        />
      </div>
    </div>
  );
}
