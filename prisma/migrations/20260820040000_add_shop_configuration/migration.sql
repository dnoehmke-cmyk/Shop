CREATE TABLE "ShopConfiguration" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "heading" TEXT NOT NULL DEFAULT 'Finde dein passendes Substrat',
    "intro" TEXT NOT NULL DEFAULT 'Beantworte drei kurze Fragen und erhalte eine passende Mischung.',
    "primaryColor" TEXT NOT NULL DEFAULT '#315c3b',
    "recommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ShopConfiguration_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ShopConfiguration_shop_key" ON "ShopConfiguration"("shop");
