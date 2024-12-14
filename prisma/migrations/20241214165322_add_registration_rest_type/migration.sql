-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "students_email_key";

-- DropIndex
DROP INDEX "students_phone_number_key";

-- AlterTable
ALTER TABLE "modules" ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "registrations" ADD COLUMN     "rest" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "email" DROP NOT NULL;
