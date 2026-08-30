-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "logoUploadId" TEXT;

-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "filename" TEXT,
ADD COLUMN     "size" INTEGER;
