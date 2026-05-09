CREATE TABLE `card_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`cardToken` varchar(255) NOT NULL,
	`cardHolder` varchar(255) NOT NULL,
	`documentId` varchar(20) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`cardBrand` varchar(64),
	`lastDigits` varchar(8),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `card_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `status` enum('active','expired','cancelled','past_due') NOT NULL DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `payment_transactions` ADD `isRecurringCharge` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_transactions` ADD `cardTokenId` int;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `isRecurring` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `cardTokenId` int;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `failedChargeAttempts` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `lastChargeAttempt` timestamp;