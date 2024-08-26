import { DCAForm, History } from "./DCA.components";

export const DCA = () => {
  return (
    <div className="flex w-full flex-col justify-center gap-2 lg:min-h-[calc(100vh_-_100px)] lg:flex-row lg:pt-4">
      <DCAForm />
      <History />
    </div>
  );
};
