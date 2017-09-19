<?php
	$mysqli = new mysqli("https://mysqladmin.stud.ntnu.no/", "it1901group8", "nullstressjoggedress", "it1901group8_festival");

	$bandNavn = $mysqli->query("SELECT navn FROM band") //Funksjon for hvordan lagre bandnavn fra liste band inn i en variabel $bandNavn