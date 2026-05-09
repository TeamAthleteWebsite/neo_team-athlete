import { getCurrentUser } from "@/src/actions/user.actions";
import { notFound } from "next/navigation";
import CoachOfferBlock from "./CoachOfferBlock";

export const dynamic = "force-dynamic";

export default async function CoachOfferPage() {
	const user = await getCurrentUser();

	if (!user) {
		notFound();
	}

	return <CoachOfferBlock user={user} />;
}
