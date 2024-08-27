import { CSSProperties } from "react";

import { AlertTriangle, Check, Info, X } from "lucide-react";

import styles from "@/components/shared/Toaster.module.scss";
import { Toaster as ToasterComponent } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export default function Toaster() {
  return (
    <ToasterComponent
      toastOptions={{
        classNames: {
          toast: cn(
            "bg-custom-gray-50 dark:bg-custom-dark-600 text-custom-black dark:text-white border-border dark:border-custom-dark-400 shadow-lg gap-1 py-3 flex flex-col items-start justify-start rounded-md",
            styles.toast,
          ),
          title: cn(
            "text-custom-black dark:text-white  font-sans font-normal text-sm",
            styles.title,
          ),
          description: "text-gray-600 font-sans font-normal text-sm",
          closeButton: cn(
            "px-4 py-3 text-gray-600 hover:text-custom-black dark:text-white  transition-colors !bg-transparent !border-none top-0 right-0 transform-none left-auto",
            styles.closeButton,
          ),
          content: "gap-1",
          icon: "absolute top-3 left-4 m-0 w-5 h-5",
        },
        style: {
          "--toast-svg-margin-start": 0,
          "--toast-svg-margin-end": 0,
          pointerEvents: "auto",
        } as CSSProperties,
      }}
      gap={2 * 4}
      icons={{
        success: (
          <Check className="h-5 w-5 text-primary-500 dark:text-primary-300" />
        ),
        info: (
          <Info className="h-5 w-5 text-information-500 dark:text-information-300" />
        ),
        warning: (
          <AlertTriangle className="h-5 w-5 text-warning-500 dark:text-warning-300" />
        ),
        error: <X className="h-5 w-5 text-error-500 dark:text-error-300" />,
      }}
      position="bottom-right"
      duration={4 * 1000}
      closeButton
    />
  );
}
