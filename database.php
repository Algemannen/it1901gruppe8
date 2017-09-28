<?php
	$dbconn = new mysqli("mysql.stud.ntnu.no", "it1901group8", "nullstressjoggedress", "it1901group8_festival"); //Oppkobling til database
	if ($dbconn->connect_error){
		die("Connection Failed: " . $dbconn->connect_error);
	} //Sjekke om oppkoblingen fungerer

	$method = $_GET['method']; // Henter ut hvilken funksjon som skal kalles.


	switch ($method) {
		case 'login':

			$username = $_POST['username']; //Henter ut brukernavn fra input-feltet på brukersiden
			$password = $_POST['password']; //Henter ut passord fra input-feltet på brukersiden

			$sql = "SELECT brukertype FROM bruker WHERE brukernavn='" . $username . "' AND passord='" . $password . "'" ; //Bruker variablene over for å lage sql-setningen

			$login_id = $dbconn->query($sql); //Sender query for å hente passord og brukernavn-feltet

			if ($login_id->num_rows > 0) { //Sjekker om du får noe data returnert fra databasen
					// output data of each row
					while($row = $login_id->fetch_assoc()) { //Returnerer brukertype, som er et nummer. Hvis brukertype ikke fins, får man returnert 0.
							echo $row["brukertype"];
					}
			} else {
					echo "0";
			}

			break;

		case 'getListOfScenes': //Denne fungerer ikke. Brukes kun av arrangør. Henter ut informasjon om scener
			$sql = "SELECT * FROM scene"; //Setning for å hente informasjon
			$scener = $dbconn->query($sql);

			$sceneEncode = array(); //Oppretter et array

			while($row = $scener->fetch_assoc()) {
				$sceneEncode[] = $row; // Lagrer info fra rader inn i arrayet
			}

			echo json_encode($sceneEncode); //Gjør det til et jsonobject.

			break;

		case 'getCompleteListOfConcerts': //Laget en liste over alle konserter
			#$sql = "SELECT * FROM konsert";

			$sql = "SELECT *
				FROM konsert
				INNER JOIN scene ON konsert.sid = scene.sid
				INNER JOIN konsert_band ON konsert.kid = konsert_band.kid
				INNER JOIN band ON konsert_band.bid = band.bid";
			$konserter = $dbconn->query($sql); //setning for å hente informasjon

			$encode = array(); //Oppretter et array

			while($row = $konserter->fetch_assoc()) {
			   $encode[] = $row; //lagrer alle radene
			}

			echo json_encode($encode); //gjør det til et jsonobject og sender det


			break;

			/*if ($konserter->num_rows > 0) {
				while($row = $konserter->fetch_assoc()) {
					echo json_encode($row);
				}
			}*/
		case 'getListOfConcertsByScene': //Lager en liste av konserter filtrer på scene

			$sid = $_POST['sceneid']; //henter ut scene

			#$sql = "SELECT * FROM konsert WHERE sid ='" . $sid . "'";
			$sql = "SELECT *
				FROM konsert
				INNER JOIN konsert_band ON konsert.kid = konsert_band.kid
				INNER JOIN band ON konsert_band.bid = band.bid
				WHERE sid ='" . $sid . "'"; //setning for å hente ut informasjon fra database
			$konsertListe = $dbconn->query($sql);

			$konListeEncode = array(); //lager et array

			while($row = $konsertListe->fetch_assoc()){
				$konListeEncode[] = $row; //henter informasjon fra radene
			}

			echo json_encode($konListeEncode); //sender et jsonobject med informasjonen

			break;

		case 'getListOfTechs': //Lager en liste over teknikere

			$konsertid = $_POST['concertid'];

			$sql = "SELECT *
				FROM bruker
				INNER JOIN konsert_rigging ON bruker.uid = konsert_rigging.uid
				WHERE kid = " . $konsertid .""; //henter ut teknikere baser på konsert
			$teknikere = $dbconn->query($sql);
			$tekEncode = array(); //lager et array


			while($row = $teknikere->fetch_assoc()){
				$tekEncode[] = $row; //setter inn informasjon fra radene i arrayet
			}

			echo json_encode($tekEncode); //Sender informasjonen som et jsonobjekt

			break;

		default:
			echo "Ingen metode spesifisert"; //Hvis det ikke er en metode sendes dette
			break;
	}


	$dbconn->close(); //Lukker oppkoblingen til databasen
?>
