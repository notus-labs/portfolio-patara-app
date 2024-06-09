import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-custom-gray-100 group-[.toaster]:text-custom-black group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-primary-500 group-[.toast]:text-custom-black",
          cancelButton:
            "group-[.toast]:bg-error-500 group-[.toast]:text-gray-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
