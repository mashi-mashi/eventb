-- CreateTable
CREATE TABLE "BiTemporalArticle" (
    "biTemporalId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BiTemporalArticle_pkey" PRIMARY KEY ("biTemporalId")
);
