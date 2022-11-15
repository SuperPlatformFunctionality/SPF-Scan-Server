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
    `validator` varchar(42) NOT NULL DEFAULT "unknown",
    `block_ts` bigint(16) unsigned NOT NULL, -- block timestamp
    PRIMARY KEY `pk_block_no`(`block_no`) USING BTREE,
    UNIQUE INDEX `uk_block_hash_substrate`(`block_hash_substrate`) USING BTREE,
    UNIQUE INDEX `uk_block_hash_evm`(`block_hash_evm`) USING BTREE,
    INDEX `idx_validator`(`validator`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `account` (
    `id` bigint(16) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
    `account_address` varchar(128) NOT NULL,
    `nick_name` varchar(32) NOT NULL,
    `init_block_no` bigint(16) unsigned NOT NULL,  -- from 0
    `balance` varchar(32) DEFAULT '0',
    PRIMARY KEY `pk_id`(`id`) USING BTREE,
    INDEX `idx_account_address`(`account_address`) USING BTREE,
    INDEX `idx_nick_name`(`nick_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `tx_record` (
    `id` bigint(16) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
    `tx_hash` varchar(128) NOT NULL,
    `block_no` bigint(16) unsigned NOT NULL,  -- from 0
    `block_ts` bigint(16) unsigned NOT NULL,  -- block timestamp
    `tx_type` varchar(32) NOT NULL,
    `address_from` varchar(42) NOT NULL,
    `address_to` varchar(42) NOT NULL,
    `value` varchar(32) NOT NULL,
    `nonce` bigint(10),
    `gas_price` varchar(32), -- gwei
    `gas_limit` varchar(32),
    `gas_used`  varchar(32),
    `tx_fee`    varchar(32), -- gwei
    PRIMARY KEY `pk_id`(`id`) USING BTREE,
    INDEX `idx_tx_hash`(`tx_hash`) USING BTREE,
    INDEX `idx_block_no`(`block_no`) USING BTREE,
    INDEX `idx_address_from`(`address_from`) USING BTREE,
    INDEX `idx_address_to`(`address_to`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
