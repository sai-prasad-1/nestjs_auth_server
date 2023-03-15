import { Role } from "@prisma/client";

export function validateRole(role: string): role is Role {
    return (
      role === Role.ADMIN ||
      role === Role.SUPER_ADMIN ||
      role === Role.FINAL_STATION_USER ||
      role === Role.PRODUCTION_USER ||
      role === Role.QC_USER
    );
  }
  