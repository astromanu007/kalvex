import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseRequirements(reqText: string | null | undefined) {
  if (!reqText) return { title: "", parsed: [], remaining: "" };
  const lines = reqText.split("\n");
  const parsed: Array<{ label: string; value: string }> = [];
  const remainingLines: string[] = [];
  let title = "";
  let foundTitle = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Extract title from first non-empty line without a colon (max 60 chars)
    if (!foundTitle && !trimmed.includes(":") && trimmed.length < 60) {
      title = trimmed;
      foundTitle = true;
      return;
    }
    
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx > 0) {
      const label = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      if (label && value && label.length < 35 && value.length < 300) {
        parsed.push({ label, value });
      } else {
        remainingLines.push(trimmed);
      }
    } else {
      remainingLines.push(trimmed);
    }
  });

  return { title, parsed, remaining: remainingLines.join("\n").trim() };
}

export function getServiceTitle(serviceType: string | null | undefined, requirements: string | null | undefined): string {
  const { title } = parseRequirements(requirements);
  if (title) return title;
  
  if (!serviceType) return "Custom Order";
  return serviceType.replace(/_/g, " ");
}

/**
 * Detects if an order is an electronics/hardware store purchase.
 * Checks both the serviceType AND the requirements text (since some orders
 * were created with CUSTOM_PROJECT type but are actually electronics purchases).
 */
export function isElectronicsOrder(order: {
  serviceType?: string | null;
  requirements?: string | null;
}): boolean {
  if (order.serviceType === "HARDWARE_COMPONENTS") return true;
  if (order.requirements?.includes("ITEMS PURCHASED:")) return true;
  return false;
}
