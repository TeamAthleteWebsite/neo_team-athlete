"use client";

import { type Prospect } from "@/lib/types/prospect.types";
import { Gender } from "@prisma/client";
import { ProspectActions } from "./ProspectActions";

const genderLabels: Record<Gender, string> = {
  [Gender.MALE]: "Homme",
  [Gender.FEMALE]: "Femme",
};

interface ProspectsTableProps {
  prospects: Prospect[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCall?: (phone: string) => void;
}

export const ProspectsTable = ({
  prospects,
  onView,
  onDelete,
}: ProspectsTableProps) => {
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-3 bg-gray-50 rounded-t-lg font-medium text-sm text-gray-500">
        <div>Nom</div>
        <div>Email</div>
        <div>Sexe</div>
        <div>Téléphone</div>
        <div>Objectif</div>
        <div>Inscription</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Prospects List */}
      <div className="space-y-2">
        {prospects.map((prospect) => (
          <div
            key={prospect.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
          >
            {/* Mobile View */}
            <div className="block md:hidden p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {prospect.name} {prospect.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{prospect.email}</p>
                </div>
                <ProspectActions
                  prospect={prospect}
                  onView={onView}
                  onDelete={onDelete}
                  onCall={handleCall}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Sexe:</span>{" "}
                  {prospect.gender ? genderLabels[prospect.gender] : "-"}
                </div>
                <div>
                  <span className="text-gray-500">Téléphone:</span>{" "}
                  {prospect.phone || "-"}
                </div>
                <div>
                  <span className="text-gray-500">Inscription:</span>{" "}
                  {formatDate(prospect.createdAt)}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Objectif:</span>{" "}
                  {prospect.goal || "-"}
                </div>
              </div>
              <OnboardingStatus isOnboarded={prospect.isOnboarded} />
            </div>

            {/* Desktop View */}
            <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-4 items-center">
              <div className="font-medium">
                {prospect.name} {prospect.lastName}
              </div>
              <div className="text-gray-600">{prospect.email}</div>
              <div>{prospect.gender ? genderLabels[prospect.gender] : "-"}</div>
              <div>{prospect.phone || "-"}</div>
              <div>{prospect.goal || "-"}</div>
              <div>{formatDate(prospect.createdAt)}</div>
              <div className="flex items-center justify-end gap-2">
                <OnboardingStatus isOnboarded={prospect.isOnboarded} />
                <ProspectActions
                  prospect={prospect}
                  onView={onView}
                  onDelete={onDelete}
                  onCall={handleCall}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface OnboardingStatusProps {
  isOnboarded: boolean;
}

const OnboardingStatus = ({ isOnboarded }: OnboardingStatusProps) => (
  <span
    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
      isOnboarded
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {isOnboarded ? "Complété" : "Boarding non commencé"}
  </span>
);
