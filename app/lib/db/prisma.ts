import { PrismaClient } from "./prisma/generated";

declare global {
  // avoid multiple instances when hot-reloading
  var prismaClient: PrismaClient;
}

globalThis.prismaClient ??= new PrismaClient();

const prisma = globalThis.prismaClient;

export default prisma;
