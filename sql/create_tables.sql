-- drop database if exists spf_scan;
create database spf_scan default character set utf8mb4 collate utf8mb4_unicode_ci;

use spf_scan;

CREATE TABLE `chain_statistics` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
    `current_block_no` bigint(16) unsigned NOT NULL DEFAULT '0' COMMENT '当前已经记录的块高度',
    `tx_count`    bigint(16) unsigned NOT NULL DEFAULT '0' COMMENT '交易总数',
    `account_count`    bigint(16) unsigned NOT NULL DEFAULT '0' COMMENT '账户总数',
    `contract_count`   bigint(16) unsigned NOT NULL DEFAULT '0' COMMENT '合约总数',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY `pk_id`(`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `block_summary` (
    `block_no` bigint(10) unsigned NOT NULL,  -- from 0
    `block_hash_substrate` varchar(128) NOT NULL,
    `block_hash_evm` varchar(128) NOT NULL,
    `validator` varchar(36) NOT NULL DEFAULT "unknown",
    `block_ts` bigint(16) unsigned NOT NULL, -- block timestamp
    PRIMARY KEY `pk_block_no`(`block_no`) USING BTREE,
    UNIQUE INDEX `uk_block_hash_substrate`(`block_hash_substrate`) USING BTREE,
    UNIQUE INDEX `uk_block_hash_evm`(`block_hash_evm`) USING BTREE,
    INDEX `idx_validator`(`validator`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tx_transfer` (
    `tx_hash` varchar(128) NOT NULL,
    `block_no` bigint(16) unsigned NOT NULL,  -- from 0
    `block_hash` varchar(128) NOT NULL,
    `block_ts` bigint(16) unsigned NOT NULL, -- block timestamp
    `address_from` varchar(128) NOT NULL,
    `address_to` varchar(128) NOT NULL,
    `value` bigint(30) NOT NULL,
    PRIMARY KEY `pk_tx_hash`(`tx_hash`) USING BTREE,
    INDEX `idx_block_no`(`block_no`) USING BTREE,
    INDEX `idx_address_from`(`address_from`) USING BTREE,
    INDEX `idx_address_to`(`address_to`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
