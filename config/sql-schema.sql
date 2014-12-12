

DROP TABLE IF EXISTS `ftpgroup`;
CREATE TABLE `ftpgroup` (
  `groupname` varchar(16) COLLATE utf8_bin NOT NULL DEFAULT '',
  `gid` smallint(6) NOT NULL DEFAULT '5500',
  `members` varchar(16) COLLATE utf8_bin NOT NULL DEFAULT '',
  KEY `groupname` (`groupname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT COMMENT='Table des groupes ProFTPD';

DROP TABLE IF EXISTS `ftpquotalimits`;
CREATE TABLE `ftpquotalimits` (
  `name` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `quota_type` enum('user','group','class','all') COLLATE utf8_bin NOT NULL DEFAULT 'user',
  `par_session` enum('false','true') COLLATE utf8_bin NOT NULL DEFAULT 'false',
  `limit_type` enum('soft','hard') COLLATE utf8_bin NOT NULL DEFAULT 'soft',
  `bytes_up_limit` float NOT NULL DEFAULT '0',
  `bytes_down_limit` float NOT NULL DEFAULT '0',
  `bytes_transfer_limit` float NOT NULL DEFAULT '0',
  `files_up_limit` int(10) unsigned NOT NULL DEFAULT '0',
  `files_down_limit` int(10) unsigned NOT NULL DEFAULT '0',
  `files_transfer_limit` int(10) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT COMMENT='Table des quotas ProFTPD';

DROP TABLE IF EXISTS `ftpquotatotal`;
CREATE TABLE `ftpquotatotal` (
  `name` varchar(30) COLLATE utf8_bin NOT NULL DEFAULT '',
  `quota_type` enum('user','group','class','all') COLLATE utf8_bin NOT NULL DEFAULT 'user',
  `bytes_up_total` float NOT NULL DEFAULT '0',
  `bytes_down_total` float NOT NULL DEFAULT '0',
  `bytes_transfer_total` float NOT NULL DEFAULT '0',
  `files_up_total` int(10) unsigned NOT NULL DEFAULT '0',
  `files_down_total` int(10) unsigned NOT NULL DEFAULT '0',
  `files_transfer_total` int(10) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT COMMENT='Table des compteurs des quotas ProFTPD';

-- ----------------------------
DROP TABLE IF EXISTS `ftpuser`;
CREATE TABLE `ftpuser` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userid` varchar(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `passwd` varchar(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `uid` smallint(6) NOT NULL DEFAULT '0',
  `gid` smallint(6) NOT NULL DEFAULT '5500',
  `homedir` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `shell` varchar(16) COLLATE utf8_bin NOT NULL DEFAULT '/bin/false',
  `count` int(11) NOT NULL DEFAULT '0',
  `accessed` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `LoginAllowed` enum('true','false') COLLATE utf8_bin NOT NULL DEFAULT 'true',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=COMPACT COMMENT='Table des utlisateurs ProFTPD';
