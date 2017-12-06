<?php

$name = $_GET['username'];
$topic = $_GET['topic'];
$specific = $_GET['specific'];
$db = new SQLite('users.db');
$db->exec('CREATE TABLE users(name varchar(255), topic varchar(255), specific varchar(255), locX varchar(255), locY varchar(255))');
$db->exec('INSERT INTO users (name, topic, specific, locX, locY) VALUES("'.$name..'","'.$topic.'","'.$specific.'",0.0,0.0")');

?>
