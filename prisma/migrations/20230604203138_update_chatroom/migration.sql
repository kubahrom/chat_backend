/*
  Warnings:

  - You are about to drop the `_ChatRoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ChatRoomToUser" DROP CONSTRAINT "_ChatRoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatRoomToUser" DROP CONSTRAINT "_ChatRoomToUser_B_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "authorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ChatRoomToUser";

-- CreateTable
CREATE TABLE "_ChatRoomUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatRoomUsers_AB_unique" ON "_ChatRoomUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatRoomUsers_B_index" ON "_ChatRoomUsers"("B");

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomUsers" ADD CONSTRAINT "_ChatRoomUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomUsers" ADD CONSTRAINT "_ChatRoomUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
