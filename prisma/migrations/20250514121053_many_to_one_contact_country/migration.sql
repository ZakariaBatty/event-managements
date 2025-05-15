/*
  Warnings:

  - You are about to drop the `_EventToLocation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[countryId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[locationId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_EventToLocation" DROP CONSTRAINT "_EventToLocation_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToLocation" DROP CONSTRAINT "_EventToLocation_B_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "countryId" TEXT,
ADD COLUMN     "locationId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeVerification" TEXT;

-- DropTable
DROP TABLE "_EventToLocation";

-- CreateIndex
CREATE UNIQUE INDEX "Event_countryId_key" ON "Event"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_locationId_key" ON "Event"("locationId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
