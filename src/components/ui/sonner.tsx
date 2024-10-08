import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-custom-gray-100 dark:bg-custom-dark-500  group-[.toaster]:text-custom-black dark:text-white  group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-primary-500 dark:bg-primary-300 0 group-[.toast]:text-custom-black dark:text-white ",
          cancelButton:
            "group-[.toast]:bg-error-500 group-[.toast]:text-gray-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
