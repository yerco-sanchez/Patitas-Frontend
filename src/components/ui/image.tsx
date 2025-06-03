import * as React from "react";
import { cn } from "@/lib/utils";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow?: boolean;
  bordered?: boolean;
}

const radiusMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      alt,
      radius = "md",
      shadow = false,
      bordered = false,
      ...props
    },
    ref
  ) => {
    return (
      <img
        ref={ref}
        alt={alt}
        className={cn(
          "object-cover",
          radiusMap[radius],
          shadow && "shadow-md",
          bordered && "border border-border",
          className
        )}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";
