CREATE TABLE `payment_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientTransactionId` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`amount` int NOT NULL,
	`payphoneTransactionId` int,
	`status` enum('pending','approved','cancelled','error') NOT NULL DEFAULT 'pending',
	`statusCode` int,
	`authorizationCode` varchar(64),
	`cardType` varchar(32),
	`cardBrand` varchar(128),
	`lastDigits` varchar(8),
	`payphoneResponse` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_transactions_clientTransactionId_unique` UNIQUE(`clientTransactionId`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`userId` int,
	`plan` varchar(32) NOT NULL DEFAULT 'monthly',
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`amountPaid` int NOT NULL,
	`transactionId` varchar(64),
	`authorizationCode` varchar(64),
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`isPromo` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
