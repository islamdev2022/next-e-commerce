-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `picture1` VARCHAR(191) NULL,
    `picture2` VARCHAR(191) NULL,
    `picture3` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `sex` ENUM('male', 'female') NOT NULL,
    `size` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `brandName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
