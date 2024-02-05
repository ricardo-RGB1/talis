/**
 * This file contains the database configuration and initialization.
 */

import { PrismaClient } from '@prisma/client'; 

declare global {
  var prisma: PrismaClient | undefined
}

/**
 * The database instance.
 * @type {PrismaClient}
 */
export const db: PrismaClient = globalThis.prisma || new PrismaClient(); 

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db 
}
 