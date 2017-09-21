<?php
	$dbconn = new mysqli("mysql.stud.ntnu.no", "it1901group8", "nullstressjoggedress", "it1901group8_festival");
	if ($dbconn->connect_error){
		die("Connection Failed: " . $dbconn->connect_error);
	}

	$username = $_POST['username'];
	$password = $_POST['password'];

	$sql = "SELECT brukertype FROM bruker WHERE brukernavn='" . $username . "' AND passord='" . $password . "'" ;
	$konrig = "SELECT uid FROM konsert_rigging"

	$konTek = $dbconn->query($konrig) //
	$login_id = $dbconn->query($sql); //Sender query for å hente passord og brukernavn-feltet



	if ($login_id->num_rows > 0) {
	    // output data of each row
	    while($row = $login_id->fetch_assoc()) {
	        echo $row["brukertype"];
	    }
	} else {
	    echo "0";
	}
	$dbconn->close();

			/*ser ntnu selv viser gammelt format så bruker det de anbefaler. Kommentert ut kode er kode for hvordan nettsider mener det skal gjøres nå. Hvis det som står over
			fungerer - slett utkommentert kode.

			$db = new mysqli("mysql.stud.ntnu.no", "it1901group8", "nullstressjoggedress", "it1901group8_festival");
			$bandNavn = $mysqli_query($db, "SELECT" * FROM band";


			Vi må bare se hvilken som virker */

?>
