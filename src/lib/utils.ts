import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function progressToRate(status: string) {
  switch (status) {
    case "in_progress":
      return 50;
    case "completed":
      return 100;
    case "mastered":
      return 100;
    default:
      return 0;
  }
}
