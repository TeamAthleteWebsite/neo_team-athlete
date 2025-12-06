import { getCurrentUser } from "@/src/actions/user.actions";
import { notFound } from "next/navigation";
import MeasurementsBlock from "./MeasurementsBlock";

export const dynamic = "force-dynamic";

export default async function MeasurementsPage() {
	const user = await getCurrentUser();

	if (!user) {
		notFound();
	}

	return <MeasurementsBlock user={user} />;
}
