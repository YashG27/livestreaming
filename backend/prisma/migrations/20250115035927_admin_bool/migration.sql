/*
  Warnings:

  - You are about to drop the column `StartTime` on the `Session` table. All the data in the column will be lost.
  - Added the required column `roomName` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAdmin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "StartTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roomName" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Slides" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "Slides_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Slides" ADD CONSTRAINT "Slides_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
