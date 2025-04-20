import { DashboardNavItem } from "@/components/features/DashboardNavItem";
import { getProspectsCount } from "@/src/actions/prospect.actions";

export const ProspectsItem = async () => {
  const prospectsCount = await getProspectsCount();

  return (
    <DashboardNavItem
      value={prospectsCount}
      iconName="Users"
      title="Prospects"
      route="/prospects"
    />
  );
};
