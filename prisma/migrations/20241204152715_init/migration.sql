-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'PAID', 'ORDERED', 'SHIPPED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "enhancedUrl" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "stripeId" TEXT,
    "prodigiId" TEXT,
    "shipping" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
