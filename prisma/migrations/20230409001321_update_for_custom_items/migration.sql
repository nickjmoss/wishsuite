-- AlterTable
ALTER TABLE "item" ALTER COLUMN "most_wanted" SET DEFAULT false,
ALTER COLUMN "reserved" SET DEFAULT false,
ALTER COLUMN "external_id" DROP NOT NULL;
