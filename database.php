<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<?php
			$db = new mysqli("mysql.stud.ntnu.no", "it1901group8", "nullstressjoggedress", "it1901group8_festival");
			if ($db->connection_error){
				die("Connection Failed: " . $db->connection_error);
			}
			$bandNavn = $mysqli->query("SELECT navn FROM band"); //Funksjon for hvordan lagre bandnavn fra liste band inn i en variabel $bandNavn

			echo "<span>" . $bandNavn . "</span>"

			/*ser ntnu selv viser gammelt format så bruker det de anbefaler. Kommentert ut kode er kode for hvordan nettsider mener det skal gjøres nå. Hvis det som står over
			fungerer - slett utkommentert kode.

			$db = new mysqli("mysql.stud.ntnu.no", "it1901group8", "nullstressjoggedress", "it1901group8_festival");
			$bandNavn = $mysqli_query($db, "SELECT" * FROM band";


			Vi må bare se hvilken som virker */

		?>
	</body>
</html>
