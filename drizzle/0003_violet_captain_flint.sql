CREATE TABLE `code_activations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`deviceId` varchar(128) NOT NULL,
	`platform` varchar(16),
	`email` varchar(320),
	`ipAddress` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `code_activations_id` PRIMARY KEY(`id`)
);
