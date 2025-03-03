/*
  Warnings:

  - You are about to drop the column `chapters` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `episodes` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Watchlist` table. All the data in the column will be lost.
  - Added the required column `contentId` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "episodes" INTEGER,
    "chapters" INTEGER
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Watchlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "currentEp" INTEGER,
    "currentChap" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Watchlist_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Watchlist" ("createdAt", "currentChap", "currentEp", "id", "status", "updatedAt", "userId") SELECT "createdAt", "currentChap", "currentEp", "id", "status", "updatedAt", "userId" FROM "Watchlist";
DROP TABLE "Watchlist";
ALTER TABLE "new_Watchlist" RENAME TO "Watchlist";
CREATE UNIQUE INDEX "Watchlist_userId_contentId_key" ON "Watchlist"("userId", "contentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Content_title_key" ON "Content"("title");
