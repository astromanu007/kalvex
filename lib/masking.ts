import { Role } from "@prisma/client";

/**
 * Masks user identity based on the requester's role.
 * User/Student -> Sees Assignee as KV-E####
 * Writer/Dev -> Sees Client as KV-C####
 * Admin/Founder -> Sees full data
 */
export function maskIdentity(
  requesterRole: Role,
  targetData: { name: string; email: string; phone?: string | null; maskedId: string; role: Role }
) {
  if (requesterRole === Role.ADMIN || requesterRole === Role.FOUNDER) {
    return targetData;
  }

  if (requesterRole === Role.USER || requesterRole === Role.STUDENT) {
    if (targetData.role === Role.WRITER || targetData.role === Role.DEVELOPER) {
      return {
        ...targetData,
        name: "Kalvex Expert",
        email: `${targetData.maskedId}@kalvex.in`,
        phone: null,
      };
    }
  }

  if (requesterRole === Role.WRITER || requesterRole === Role.DEVELOPER) {
    if (targetData.role === Role.USER || targetData.role === Role.STUDENT) {
      return {
        ...targetData,
        name: "Kalvex Client",
        email: `${targetData.maskedId}@kalvex.in`,
        phone: null,
      };
    }
  }

  return targetData; // Default fallback
}
