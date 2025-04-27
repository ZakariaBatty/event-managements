/*
  Warnings:

  - You are about to drop the `CountryContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryEvent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[countryId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CountryContact" DROP CONSTRAINT "CountryContact_contactId_fkey";

-- DropForeignKey
ALTER TABLE "CountryContact" DROP CONSTRAINT "CountryContact_countryId_fkey";

-- DropForeignKey
ALTER TABLE "CountryEvent" DROP CONSTRAINT "CountryEvent_countryId_fkey";

-- DropForeignKey
ALTER TABLE "CountryEvent" DROP CONSTRAINT "CountryEvent_eventId_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "countryId" TEXT;

-- DropTable
DROP TABLE "CountryContact";

-- DropTable
DROP TABLE "CountryEvent";

-- CreateIndex
CREATE UNIQUE INDEX "Contact_countryId_key" ON "Contact"("countryId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
