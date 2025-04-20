export const DashboardTitle = ({ title }: { title: string }) => {
  return (
    <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-8 text-accent">
      {title}
    </h1>
  );
};
