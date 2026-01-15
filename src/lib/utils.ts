import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const isBase64Image = (imageData: string) => {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
};

export const checkStatus = (
  status: "DRAFT" | "DEVELOPMENT" | "PRODUCTION" | "DEPRECATED"
) => {
  switch (status) {
    case "DRAFT":
      return "secondary";
    case "DEVELOPMENT":
      return "warning";
    case "PRODUCTION":
      return "success";
    case "DEPRECATED":
      return "destructive";
    default:
      return "default";
  }
};

export const checkVisibility = (
  visibility: "PRIVATE" | "PUBLIC" | "UNLISTED"
) => {
  switch (visibility) {
    case "PRIVATE":
      return "secondary";
    case "PUBLIC":
      return "success";
    case "UNLISTED":
      return "destructive";
    default:
      return "default";
  }
};
