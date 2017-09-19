
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
		<?php
			$db = new mysqli("mysql.stud.ntnu.no", "it1901group8", "nullstressjoggedress", "it1901group8_festival");
			if ($db->connect_error){
				die("Connection Failed: " . $db->connect_error);
			}
			$fornavn = $db->query("SELECT * FROM bruker"); //Funksjon for hvordan lagre bandnavn fra liste band inn i en variabel $bandNavn



			if ($fornavn->num_rows > 0) {
			    // output data of each row
			    while($row = $fornavn->fetch_assoc()) {
			        echo "id: " . $row["uid"]. " - Name: " . $row["fornavn"]. " " . $row["etternavn"]. "<br>";
			    }
			} else {
			    echo "0 results";
			}
			$db->close();

			/*ser ntnu selv viser gammelt format så bruker det de anbefaler. Kommentert ut kode er kode for hvordan nettsider mener det skal gjøres nå. Hvis det som står over
			fungerer - slett utkommentert kode.

			$db = new mysqli("mysql.stud.ntnu.no", "it1901group8", "nullstressjoggedress", "it1901group8_festival");
			$bandNavn = $mysqli_query($db, "SELECT" * FROM band";


			Vi må bare se hvilken som virker */

		?>
	</body>
</html>
