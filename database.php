<?php
	$mysqli = new mysqli("https://mysqladmin.stud.ntnu.no/", "it1901group8", "nullstressjoggedress", "it1901group8_festival");

	$bandNavn = $mysqli->query("SELECT navn FROM band") //

?>