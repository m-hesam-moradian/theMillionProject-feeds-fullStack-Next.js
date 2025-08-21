/*
  Warnings:

  - You are about to drop the column `postId` on the `polloption` table. All the data in the column will be lost.
  - You are about to drop the column `votes` on the `polloption` table. All the data in the column will be lost.
  - Added the required column `pollId` to the `PollOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `polloption` DROP FOREIGN KEY `PollOption_postId_fkey`;

-- AlterTable
ALTER TABLE `polloption` DROP COLUMN `postId`,
    DROP COLUMN `votes`,
    ADD COLUMN `pollId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isSubscribed` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Poll` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `expiresAt` DATETIME(3) NULL,

    UNIQUE INDEX `Poll_postId_key`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PollVote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `pollOptionId` INTEGER NOT NULL,
    `pollId` INTEGER NOT NULL,

    UNIQUE INDEX `PollVote_userId_pollId_key`(`userId`, `pollId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Poll` ADD CONSTRAINT `Poll_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PollOption` ADD CONSTRAINT `PollOption_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PollVote` ADD CONSTRAINT `PollVote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PollVote` ADD CONSTRAINT `PollVote_pollOptionId_fkey` FOREIGN KEY (`pollOptionId`) REFERENCES `PollOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PollVote` ADD CONSTRAINT `PollVote_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
