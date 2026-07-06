<?php

function getDbConnection() {
    static $mysqli = null;

    if ($mysqli === null) {
        $mysqli = @new mysqli('127.0.0.1', 'root', '', '', 3306);

        if ($mysqli->connect_error) {
            throw new Exception('No se pudo conectar al servidor MySQL de XAMPP: ' . $mysqli->connect_error);
        }

        $mysqli->set_charset('utf8mb4');
    }

    return $mysqli;
}

function ensureDatabaseAndTable() {
    $mysqli = @new mysqli('127.0.0.1', 'root', '', '', 3306);

    if ($mysqli->connect_error) {
        throw new Exception('No se pudo conectar al servidor MySQL de XAMPP: ' . $mysqli->connect_error);
    }

    $mysqli->query('CREATE DATABASE IF NOT EXISTS inumorph_db');
    $mysqli->select_db('inumorph_db');

    $sql = "
        CREATE TABLE IF NOT EXISTS commissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(180) NOT NULL,
            preferred_datetime VARCHAR(30) NULL,
            item_quantity INT DEFAULT 1,
            phone VARCHAR(30) NOT NULL,
            service_type VARCHAR(80) NOT NULL,
            specifications TEXT NOT NULL,
            attachment_name VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";

    if (!$mysqli->query($sql)) {
        throw new Exception('No se pudo crear la tabla commissions: ' . $mysqli->error);
    }

    return $mysqli;
}
