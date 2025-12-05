import { useUi } from "@/stores/ui";

export const LoaderOverlay = () => {
  const { isLoading } = useUi();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="pulse-loader" />
    </div>
  );
};
