import { getCurrentUser } from "@/src/actions/user.actions";
import { notFound } from "next/navigation";
import GenderBlock from "./GenderBlock";

export default async function GenderPage() {
	const user = await getCurrentUser();

	if (!user) {
		notFound();
	}

	return <GenderBlock user={user} />;
}
