CREATE TABLE `Point` (
  `id` varchar(36) NOT NULL,
  `amount` int(11) NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_ab4c313d9d938090be0d467c05` (`userId`),
  CONSTRAINT `FK_ab4c313d9d938090be0d467c058` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `PointHistory` (
  `id` varchar(36) NOT NULL,
  `amount` int(11) NOT NULL,
  `totalUserPoint` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `revision` int(11) NOT NULL,
  `pointType` varchar(255) NOT NULL,
  `historyDate` varchar(255) NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `reviewId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_1e91d49b321f941f4d30f613a7` (`userId`,`reviewId`,`id`),
  KEY `FK_b940996ffee2f385ecbedcd2be8` (`reviewId`),
  CONSTRAINT `FK_b940996ffee2f385ecbedcd2be8` FOREIGN KEY (`reviewId`) REFERENCES `Review` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_d2eb55785d350e5a700acfce592` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `Photo` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `reviewId` varchar(36) DEFAULT NULL,
  `placeId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b97f4b968fb7926fb8412d57c10` (`reviewId`),
  KEY `FK_6a1664e6f5bc6446f8e5c5a1477` (`placeId`),
  CONSTRAINT `FK_6a1664e6f5bc6446f8e5c5a1477` FOREIGN KEY (`placeId`) REFERENCES `Place` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_b97f4b968fb7926fb8412d57c10` FOREIGN KEY (`reviewId`) REFERENCES `Review` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `Place` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `Review` (
  `id` varchar(36) NOT NULL,
  `content` varchar(255) NOT NULL,
  `reviewDate` varchar(255) NOT NULL,
  `placeId` varchar(36) DEFAULT NULL,
  `userId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_08570722bc8f5f3978086c4fc76` (`placeId`),
  KEY `FK_0d904edee7210750be2fe4c4dba` (`userId`),
  CONSTRAINT `FK_08570722bc8f5f3978086c4fc76` FOREIGN KEY (`placeId`) REFERENCES `Place` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_0d904edee7210750be2fe4c4dba` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `User` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

