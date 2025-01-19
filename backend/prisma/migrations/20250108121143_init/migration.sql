-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'ONGOING', 'FINISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "StartTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
