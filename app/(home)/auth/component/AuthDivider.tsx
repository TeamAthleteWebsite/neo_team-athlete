export const AuthDivider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-600" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-gray-900 rounded-sm text-zinc-200">
          Ou continuer avec
        </span>
      </div>
    </div>
  );
};
