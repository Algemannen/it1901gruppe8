<?php
/*
ASCII-art tekst fra http://www.patorjk.com/software/taag/#p=display&f=Dot%20Matrix&t=Text


 */

// Skru på debug
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

//Funksjon for rekkefølge av tilbudselementer
function reorder_offers($i){
    $map = array(0,1,4,2,3,5,6,7,8,9,10,11,12,13,14,15);
    return $map[$i];
}

// Header for php-enkoding
header('Content-type: text/plain; charset=utf-8');

// Koble til databasen og returner oppkoblingen som objekt
$dbconn = new mysqli("mysql.stud.ntnu.no", "it1901group8", "nullstressjoggedress", "it1901group8_festival");

//Sjekke om oppkoblingen fungerer
if ($dbconn->connect_error){
    header('HTTP/1.0 504 Connection Failed' . $mysqli->connect_errno . " " . $dbconn->connect_error);
    die();
}

// Databasen bruker bokstaver fra utf8-standarden. Viktig for at f.eks ÆØÅ skal fungere.
$dbconn->set_charset("utf8");

// Henter ut hvilken funksjon som skal kalles.
$method = $_GET['method'];
// $method = 'serveringInfo';
// echo 'e';
switch ($method) {
    /// Dette er en metode for å sjekke at oppkobling mot serveren fungerer
case 'ping':
    echo 'hei';
    break;

    /// Metode for å logge på serveren, tar inn brukernavn og passord. Returnerer brukerobjekt.
case 'login':

    $query = "SELECT *
        FROM bruker
        WHERE brukernavn= ?
        AND passord= ?";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørring til databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {
        // Binder brukernavn og pasord som strenger
        $stmt->bind_param('ss', $username, $password);

        // Leser brukernavn og passord
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Utfør spørringen
        $stmt->execute();

        // Hent resultatet fra spørringen
        $result = $stmt->get_result();

        // Hent ut første rad fra en spørring
        $encode = $result->fetch_assoc();

        // Hvis brukeren ikke finnes i databasen, returner en feilmelding og avslutt.
        if (empty($encode)) {
            header('HTTP/1.0 401 Unauthorized user.');
            die();
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*
      _  _  _  _
    _(_)(_)(_)(_)_
   (_)          (_)   _  _  _  _  _  _  _    _  _  _  _     _  _  _  _      _  _  _  _
   (_)_  _  _  _    _(_)(_)(_)(_)(_)(_)(_)_ (_)(_)(_)(_)_  (_)(_)(_)(_)_  _(_)(_)(_)(_)
     (_)(_)(_)(_)_ (_)       (_) _  _  _ (_)(_)        (_)(_) _  _  _ (_)(_)_  _  _  _
    _           (_)(_)       (_)(_)(_)(_)(_)(_)        (_)(_)(_)(_)(_)(_)  (_)(_)(_)(_)_
   (_)_  _  _  _(_)(_)_  _  _(_)_  _  _  _  (_)        (_)(_)_  _  _  _     _  _  _  _(_)
     (_)(_)(_)(_)    (_)(_)(_) (_)(_)(_)(_) (_)        (_)  (_)(_)(_)(_)   (_)(_)(_)(_)


 */

    /// Returnerer en komplett liste av alle scener.
case 'getListOfScenes':
    $query = "SELECT *
        FROM scene
        ORDER BY sid DESC";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørring for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Utfører spørring
        $stmt->execute();

        // Får resultat fra spørring
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*
       _  _  _                                                                           _
    _ (_)(_)(_) _                                                                       (_)
   (_)         (_)    _  _  _     _  _  _  _      _  _  _  _  _  _  _   _       _  _  _ (_) _  _   _  _  _  _
   (_)             _ (_)(_)(_) _ (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)_(_)(_)(_)(_)
   (_)            (_)         (_)(_)        (_)(_)       (_) _  _  _ (_) (_)(_)         (_)     (_)_  _  _  _
   (_)          _ (_)         (_)(_)        (_)(_)       (_)(_)(_)(_)(_) (_)            (_)     _ (_)(_)(_)(_)_
   (_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _(_)_  _  _  _   (_)            (_)_  _(_) _  _  _  _(_)
      (_)(_)(_)      (_)(_)(_)   (_)        (_)  (_)(_)(_) (_)(_)(_)(_)  (_)              (_)(_)  (_)(_)(_)(_)


 */

    /// Returnerer en liste over konserter brukeren hjelper til med rigging på en gitt festival
case 'getListOfConcertsForTechs':

    $query = "SELECT scene.navn AS snavn, band.navn, band.bid, konsert.kid, dato, start_tid, slutt_tid, scene.sid, fid, konsert_rigging.uid
        FROM konsert
        INNER JOIN scene ON konsert.sid = scene.sid
        INNER JOIN konsert_band ON konsert.kid = konsert_band.kid
        INNER JOIN band ON konsert_band.bid = band.bid
        INNER JOIN konsert_rigging ON konsert_rigging.kid = konsert.kid
        WHERE konsert_rigging.uid = ?
        AND fid = ?";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Binder brukerid som et heltall
        $stmt->bind_param('ii', $brukerid, $fid);

        // Leser brukerid fra metodekallet
        $brukerid = $_POST['userid'];

        // Leser inn festival
        $fid = $_POST['fid'];

        // Utfører spørringen
        $stmt->execute();

        // Får resultatet fra spørring
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*
       _  _  _                                                                           _
    _ (_)(_)(_) _                                                                       (_)
   (_)         (_)    _  _  _     _  _  _  _      _  _  _  _  _  _  _   _       _  _  _ (_) _  _   _  _  _  _
   (_)             _ (_)(_)(_) _ (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)_(_)(_)(_)(_)
   (_)            (_)         (_)(_)        (_)(_)       (_) _  _  _ (_) (_)(_)         (_)     (_)_  _  _  _
   (_)          _ (_)         (_)(_)        (_)(_)       (_)(_)(_)(_)(_) (_)            (_)     _ (_)(_)(_)(_)_
   (_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _(_)_  _  _  _   (_)            (_)_  _(_) _  _  _  _(_)
      (_)(_)(_)      (_)(_)(_)   (_)        (_)  (_)(_)(_) (_)(_)(_)(_)  (_)              (_)(_)  (_)(_)(_)(_)


 */

    /// Returnerer en liste over konserter som foregår på en gitt scene på en gitt festival
case 'getListOfConcertsByScene':

    $query = "SELECT *
        FROM konsert
        INNER JOIN konsert_band ON konsert.kid = konsert_band.kid
        INNER JOIN band ON konsert_band.bid = band.bid
        WHERE konsert.sid = ?
        AND fid = ?";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Binder brukerid som heltall
        $stmt->bind_param('ii', $sid, $fid);

        // Leser inn sceneid
        $sid = $_POST['sceneid'];

        // Leser inn festival
        $fid = $_POST['fid'];

        // Utfører spørringen
        $stmt->execute();

        // Returnerer resultat fra spørringen
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

    /// Returnerer en liste over alle teknikere på en gitt scene

    /// Returnerer en liste over alle konserter med hvem som spiller på konserten på en gitt festival
case 'getListOfConcertesByFestival':

    // Gjør klar sql-setning
    $query = "SELECT k.kid, b.navn, k.dato, s.navn as snavn
        FROM konsert k
        INNER JOIN konsert_band kb ON kb.kid = k.kid
        INNER JOIN band b ON b.bid = kb.kid
        INNER JOIN scene s ON k.sid = s.sid
        WHERE fid = ?
        ORDER BY k.kid ASC";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt->bind_param('i', $fid);

        // Leser inn konsertid
        $fid = $_POST['fid'];

        // Utfør sql-setning
        $stmt->execute();

        // Henter resultat fra spørring
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;



    /// Returnerer en liste over alle band på en gitt festival
    case 'getListofBandsAndConcertes':

        // Gjør klar sql-setning
        $query1 = "SELECT DISTINCT band.bid, band.navn
            FROM band
            INNER JOIN konsert_band ON band.bid = konsert_band.bid
            INNER JOIN konsert ON konsert.kid = konsert_band.kid
            WHERE konsert.fid = ?
            ORDER BY band.navn ASC";

        // Gjør klar objekt for spørring
        $stmt1 = $dbconn->stmt_init();

        // Gjør klar spørringen for databsen
        if(!$stmt1->prepare($query1)) {
            header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
        } else {

            // Bind konsertid som heltall
            $stmt1->bind_param('i', $fid);

            // Leser inn konsertid
            $fid = $_POST['fid'];

            // Utfør sql-setning
            $stmt1->execute();

            // Henter resultat fra spørring
            $result1 = $stmt1->get_result();

            // Hent ut alle rader fra en spørring
            $encode1 = array();
            while ($row = $result1->fetch_assoc()) {
                $encode1[] = $row;
            }

            // Avslutt sql-setning
            $stmt1->close();


            // Gjør klar sql-setning
            $query2 = "SELECT knavn, kid FROM konsert WHERE fid = ?";

            // Gjør klar objekt for spørring
            $stmt2 = $dbconn->stmt_init();

            // Gjør klar spørringen for databsen
            if(!$stmt2->prepare($query2)) {
                header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
            } else {

                // Bind konsertid som heltall
                $stmt2->bind_param('i', $fid);

                // Leser inn konsertid
                $fid = $_POST['fid'];

                // Utfør sql-setning
                $stmt2->execute();

                // Henter resultat fra spørring
                $result2 = $stmt2->get_result();

                // Hent ut alle rader fra en spørring
                $encode2 = array();
                while ($row = $result2->fetch_assoc()) {
                    $encode2[] = $row;
                }

                // Avslutt sql-setning
                $stmt2->close();

            // Returner json-string med data
            echo ("[" . json_encode($encode1) . "," . json_encode($encode2) . "]");

          }
        }

        break;

/*
       _  _  _                                                                           _
    _ (_)(_)(_) _                                                                       (_)
   (_)         (_)    _  _  _     _  _  _  _      _  _  _  _  _  _  _   _       _  _  _ (_) _  _   _  _  _  _
   (_)             _ (_)(_)(_) _ (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)_(_)(_)(_)(_)
   (_)            (_)         (_)(_)        (_)(_)       (_) _  _  _ (_) (_)(_)         (_)     (_)_  _  _  _
   (_)          _ (_)         (_)(_)        (_)(_)       (_)(_)(_)(_)(_) (_)            (_)     _ (_)(_)(_)(_)_
   (_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _(_)_  _  _  _   (_)            (_)_  _(_) _  _  _  _(_)
      (_)(_)(_)      (_)(_)(_)   (_)        (_)  (_)(_)(_) (_)(_)(_)(_)  (_)              (_)(_)  (_)(_)(_)(_)


 */

    /// Returnerer en liste over alle konserter med hvem som spiller på konserten på en gitt festival
case 'getListOfConcertesByFestival':

    // Gjør klar sql-setning
    $query = "SELECT k.kid, b.navn, k.dato, s.navn as snavn
        FROM konsert k
        INNER JOIN konsert_band kb ON kb.kid = k.kid
        INNER JOIN band b ON b.bid = kb.kid
        INNER JOIN scene s ON k.sid = s.sid
        WHERE fid = ?
        ORDER BY k.kid ASC";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt->bind_param('i', $fid);

        // Leser inn konsertid
        $fid = $_POST['fid'];

        // Utfør sql-setning
        $stmt->execute();

        // Henter resultat fra spørring
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*
       _  _  _                                                                           _
    _ (_)(_)(_) _                                                                       (_)
   (_)         (_)    _  _  _     _  _  _  _      _  _  _  _  _  _  _   _       _  _  _ (_) _  _   _  _  _  _
   (_)             _ (_)(_)(_) _ (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)_(_)(_)(_)(_)
   (_)            (_)         (_)(_)        (_)(_)       (_) _  _  _ (_) (_)(_)         (_)     (_)_  _  _  _
   (_)          _ (_)         (_)(_)        (_)(_)       (_)(_)(_)(_)(_) (_)            (_)     _ (_)(_)(_)(_)_
   (_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _(_)_  _  _  _   (_)            (_)_  _(_) _  _  _  _(_)
      (_)(_)(_)      (_)(_)(_)   (_)        (_)  (_)(_)(_) (_)(_)(_)(_)  (_)              (_)(_)  (_)(_)(_)(_)


 */

    /// Returnerer en liste over konserter med de som spiller på en gitt festival som tilhører en gitt manager
case 'getListOfConcertesByFestivalAndId':

    // Gjør klar sql-setning
    $query = "SELECT k.kid, b.navn, k.dato, s.navn as snavn
        FROM konsert k
        INNER JOIN konsert_band kb ON kb.kid = k.kid
        INNER JOIN band b ON b.bid = kb.kid
        INNER JOIN scene s ON k.sid = s.sid
        WHERE fid = ?
        AND b.manager_uid = ?
        ORDER BY k.kid ASC";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt->bind_param('ii', $fid, $uid);

        // Leser inn konsertid
        $fid = $_POST['fid'];

        // Leser inn konsertid
        $uid = $_POST['uid'];

        // Utfør sql-setning
        $stmt->execute();

        // Henter resultat fra spørring
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

    /// Returnerer en liste over alle teknikere på en gitt scene

/*
    _  _  _  _  _                      _                              _                  _
   (_)(_)(_)(_)(_)                    (_)                            (_)                (_)
         (_)  _  _  _  _      _  _  _ (_) _  _  _    _  _  _  _    _  _      _  _  _  _  _      _  _  _       _  _  _  _      _  _  _  _
         (_) (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_ (_)(_)(_)(_)_ (_)(_)   _(_)(_)(_)(_)(_)    (_)(_)(_) _   (_)(_)(_)(_)_  _(_)(_)(_)(_)
         (_)(_) _  _  _ (_)(_)        (_)        (_)(_)        (_)   (_)  (_)           (_)     _  _  _ (_)  (_)        (_)(_)_  _  _  _
         (_)(_)(_)(_)(_)(_)(_)        (_)        (_)(_)        (_)   (_)  (_)           (_)   _(_)(_)(_)(_)  (_)        (_)  (_)(_)(_)(_)_
         (_)(_)_  _  _  _  (_)_  _  _ (_)        (_)(_)        (_) _ (_) _(_)_  _  _  _ (_) _(_)_  _  _ (_)_ (_)        (_)   _  _  _  _(_)
         (_)  (_)(_)(_)(_)   (_)(_)(_)(_)        (_)(_)        (_)(_)(_)(_) (_)(_)(_)(_)(_)(_) (_)(_)(_)  (_)(_)        (_)  (_)(_)(_)(_)


 */

    /// Returnerer en liste over alle teknikere forbundet med en gitt konsert
case 'getListOfTechs':

    // Gjør klar sql-setning
    $query = "SELECT *
        FROM bruker
        INNER JOIN konsert_rigging ON bruker.uid = konsert_rigging.uid
        WHERE kid = ?";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt->bind_param('i', $kid);

        // Leser inn konsertid
        $kid = $_POST['concertid'];

        // Utfør sql-setning
        $stmt->execute();

        // Henter resultat fra spørring
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

    /*
    _  _  _  _  _                      _                                                                             _
   (_)(_)(_)(_)(_)                    (_)                                                                           (_)
         (_)  _  _  _  _      _  _  _ (_) _  _  _             _  _  _  _     _  _  _  _     _  _  _  _      _  _  _ (_)   _  _  _  _
         (_) (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_          (_)(_)(_)(_)_  (_)(_)(_)(_)_  (_)(_)(_)(_)_  _(_)(_)(_)(_) _(_)(_)(_)(_)
         (_)(_) _  _  _ (_)(_)        (_)        (_)         (_)        (_)(_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _  _
         (_)(_)(_)(_)(_)(_)(_)        (_)        (_)         (_)        (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)        (_)  (_)(_)(_)(_)_
         (_)(_)_  _  _  _  (_)_  _  _ (_)        (_)         (_)        (_)(_)_  _  _  _  (_)_  _  _  _  (_)_  _  _ (_)   _  _  _  _(_)
         (_)  (_)(_)(_)(_)   (_)(_)(_)(_)        (_)         (_)        (_)  (_)(_)(_)(_)   (_)(_)(_)(_)   (_)(_)(_)(_)  (_)(_)(_)(_)


     */

    /// Returnerer en lste over tekniske behov for en gitt konsert.
case 'getListOfTechnicalNeeds':

    // Gjør klar sql-setning
    $query = "SELECT *
        FROM tekniske_behov
        WHERE kid = ?";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt->bind_param('i', $kid);

        // Leser inn konsertid
        $kid = $_POST['concertid'];

        // Utfør sql-setning
        $stmt->execute();

        // Henter resultat fra spørring
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*
       _  _  _                                                               _
      (_)(_)(_)                                                             (_)
         (_)    _  _  _  _      _  _  _  _     _  _  _  _   _       _  _  _ (_) _  _
         (_)   (_)(_)(_)(_)_  _(_)(_)(_)(_)   (_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)
         (_)   (_)        (_)(_)_  _  _  _   (_) _  _  _ (_) (_)(_)         (_)
         (_)   (_)        (_)  (_)(_)(_)(_)_ (_)(_)(_)(_)(_) (_)            (_)     _
       _ (_) _ (_)        (_)   _  _  _  _(_)(_)_  _  _  _   (_)            (_)_  _(_)
      (_)(_)(_)(_)        (_)  (_)(_)(_)(_)    (_)(_)(_)(_)  (_)              (_)(_)


        _                                   _                                                                             _
       (_)                                 (_)                                                                           (_)
     _ (_) _  _    _  _  _  _      _  _  _ (_) _  _  _             _  _  _  _     _  _  _  _     _  _  _  _      _  _  _ (_)   _  _  _  _
    (_)(_)(_)(_)  (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_          (_)(_)(_)(_)_  (_)(_)(_)(_)_  (_)(_)(_)(_)_  _(_)(_)(_)(_) _(_)(_)(_)(_)
       (_)       (_) _  _  _ (_)(_)        (_)        (_)         (_)        (_)(_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _  _
       (_)     _ (_)(_)(_)(_)(_)(_)        (_)        (_)         (_)        (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)        (_)  (_)(_)(_)(_)_
       (_)_  _(_)(_)_  _  _  _  (_)_  _  _ (_)        (_)         (_)        (_)(_)_  _  _  _  (_)_  _  _  _  (_)_  _  _ (_)   _  _  _  _(_)
         (_)(_)    (_)(_)(_)(_)   (_)(_)(_)(_)        (_)         (_)        (_)  (_)(_)(_)(_)   (_)(_)(_)(_)   (_)(_)(_)(_)  (_)(_)(_)(_)


 */

    /// Sette inn tekniske behov i databasen
case 'insertTechnicalNeeds':

    // Gjør klar sql-setning
    $query = "INSERT INTO tekniske_behov (kid, tittel, behov)
        VALUES (?,?,?)";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt->bind_param('iss', $kid,$tittel,$behov);

        // Leser inn konsertid
        $kid = $_POST['concertid'];

        //Leser inn behov
        $behov = $_POST['behov'];

        if (strlen($behov) == 0) {
            header("HTTP/1.0 400 Bad Request: Zero-length string");
            die();
        }

        //Leser inn tittel
        $tittel = $_POST['tittel'];

        if (strlen($tittel) == 0) {
            header("HTTP/1.0 400 Bad Request: Zero-length string");
            die();
        }

        // Utfør sql-setning
        $stmt->execute();

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*

    _  _  _  _                   _  _                     _
   (_)(_)(_)(_)                 (_)(_)                   (_)
    (_)      (_)_   _  _  _  _     (_)    _  _  _  _   _ (_) _  _    _  _  _  _
    (_)        (_) (_)(_)(_)(_)_   (_)   (_)(_)(_)(_)_(_)(_)(_)(_)  (_)(_)(_)(_)_
    (_)        (_)(_) _  _  _ (_)  (_)  (_) _  _  _ (_)  (_)       (_) _  _  _ (_)
    (_)       _(_)(_)(_)(_)(_)(_)  (_)  (_)(_)(_)(_)(_)  (_)     _ (_)(_)(_)(_)(_)
    (_)_  _  (_)  (_)_  _  _  _  _ (_) _(_)_  _  _  _    (_)_  _(_)(_)_  _  _  _
   (_)(_)(_)(_)     (_)(_)(_)(_)(_)(_)(_) (_)(_)(_)(_)     (_)(_)    (_)(_)(_)(_)


        _                                   _                                                                             _
       (_)                                 (_)                                                                           (_)
     _ (_) _  _    _  _  _  _      _  _  _ (_) _  _  _             _  _  _  _     _  _  _  _     _  _  _  _      _  _  _ (_)   _  _  _  _
    (_)(_)(_)(_)  (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_          (_)(_)(_)(_)_  (_)(_)(_)(_)_  (_)(_)(_)(_)_  _(_)(_)(_)(_) _(_)(_)(_)(_)
       (_)       (_) _  _  _ (_)(_)        (_)        (_)         (_)        (_)(_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _  _
       (_)     _ (_)(_)(_)(_)(_)(_)        (_)        (_)         (_)        (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)        (_)  (_)(_)(_)(_)_
       (_)_  _(_)(_)_  _  _  _  (_)_  _  _ (_)        (_)         (_)        (_)(_)_  _  _  _  (_)_  _  _  _  (_)_  _  _ (_)   _  _  _  _(_)
         (_)(_)    (_)(_)(_)(_)   (_)(_)(_)(_)        (_)         (_)        (_)  (_)(_)(_)(_)   (_)(_)(_)(_)   (_)(_)(_)(_)  (_)(_)(_)(_)



 */

    /// Slette tekniske behov fra databasen
case 'deleteTechnicalNeed' :

    $query = "DELETE FROM tekniske_behov
        WHERE tbid = ?";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt->bind_param('i', $tbid);

        // Leser inn konsertid
        $tbid = $_POST['tbid'];

        // Utfør sql-setning
        $stmt->execute();

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*
      _  _  _  _                                                        _
    _(_)(_)(_)(_)_                                                     (_)
   (_)          (_)  _  _  _  _     _  _  _     _       _  _   _  _  _ (_) _  _  _
   (_)_  _  _  _    (_)(_)(_)(_)_  (_)(_)(_) _ (_)_  _ (_)(_)_(_)(_)(_)(_)(_)(_)(_)_
     (_)(_)(_)(_)_ (_) _  _  _ (_)  _  _  _ (_)  (_)(_)     (_)        (_)        (_)
    _           (_)(_)(_)(_)(_)(_)_(_)(_)(_)(_)  (_)        (_)        (_)        (_)
   (_)_  _  _  _(_)(_)_  _  _  _ (_)_  _  _ (_)_ (_)        (_)_  _  _ (_)        (_)
     (_)(_)(_)(_)    (_)(_)(_)(_)  (_)(_)(_)  (_)(_)          (_)(_)(_)(_)        (_)


 */

    /// Søker etter band i databsen
case 'search':
    $text = "%{$_POST['text']}%";
    $type = $_POST['type'];
    $fid = $_POST['fid'];

    switch ($type) {
    case 'band':

        $query = "SELECT navn, bid AS id FROM band WHERE navn LIKE ?";

        $stmt = $dbconn->stmt_init();

        if(!$stmt->prepare($query)) {
            header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
        } else {


            $stmt->bind_param("s", $text);

            // Utfør sql-setning
            $stmt->execute();

            // Henter resultat fra spørring
            $result = $stmt->get_result();

            // Hent ut alle rader fra en spørring
            $encode = array();
            while ($row = $result->fetch_assoc()) {
                $encode[] = $row;
            }

            // Returner json-string med data
            echo json_encode($encode);

            // Avslutt sql-setning
            $stmt->close();
        }
        break;

    /*
    _           _                                                                             _
   (_)       _ (_)                                                                           (_)
   (_)    _ (_)      _  _  _     _  _  _  _      _  _  _  _     _  _  _  _   _       _  _  _ (_) _  _
   (_) _ (_)      _ (_)(_)(_) _ (_)(_)(_)(_)_  _(_)(_)(_)(_)   (_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)
   (_)(_) _      (_)         (_)(_)        (_)(_)_  _  _  _   (_) _  _  _ (_) (_)(_)         (_)
   (_)   (_) _   (_)         (_)(_)        (_)  (_)(_)(_)(_)_ (_)(_)(_)(_)(_) (_)            (_)     _
   (_)      (_) _(_) _  _  _ (_)(_)        (_)   _  _  _  _(_)(_)_  _  _  _   (_)            (_)_  _(_)
   (_)         (_)  (_)(_)(_)   (_)        (_)  (_)(_)(_)(_)    (_)(_)(_)(_)  (_)              (_)(_)


     */

        /// Søker konserter i databasen etter sjanger
    case 'konsert':
        $query = "SELECT knavn AS navn, kid AS id, sjanger AS columnTwo FROM konsert WHERE NOT fid = ? AND sjanger LIKE ?";

        $stmt = $dbconn->stmt_init();

        if(!$stmt->prepare($query)) {
            header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
        } else {


            $stmt->bind_param("is", $fid, $text);

            // Utfør sql-setning
            $stmt->execute();

            // Henter resultat fra spørring
            $result = $stmt->get_result();

            // Hent ut alle rader fra en spørring
            $encode = array();
            while ($row = $result->fetch_assoc()) {
                $encode[] = $row;
            }

            // Returner json-string med data
            echo json_encode($encode);

            // Avslutt sql-setning
            $stmt->close();
            break;
        }

    /*
      _  _  _  _
    _(_)(_)(_)(_)_
   (_)          (_)   _  _  _  _  _  _  _    _  _  _  _     _  _  _  _
   (_)_  _  _  _    _(_)(_)(_)(_)(_)(_)(_)_ (_)(_)(_)(_)_  (_)(_)(_)(_)_
     (_)(_)(_)(_)_ (_)       (_) _  _  _ (_)(_)        (_)(_) _  _  _ (_)
    _           (_)(_)       (_)(_)(_)(_)(_)(_)        (_)(_)(_)(_)(_)(_)
   (_)_  _  _  _(_)(_)_  _  _(_)_  _  _  _  (_)        (_)(_)_  _  _  _
     (_)(_)(_)(_)    (_)(_)(_) (_)(_)(_)(_) (_)        (_)  (_)(_)(_)(_)


     */

        /// Søker etter band i databasen etter scene
    case 'scene':
        $query = "SELECT DISTINCT b.navn, b.bid AS id, s.navn AS columnTwo
            FROM band b
            INNER JOIN konsert_band kb ON kb.bid = b.bid
            INNER JOIN konsert k ON k.kid = kb.kid
            INNER JOIN scene s ON k.sid = s.sid
            WHERE s.navn LIKE ?";

        $stmt = $dbconn->stmt_init();

        if(!$stmt->prepare($query)) {
            header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
        } else {


            $stmt->bind_param("s", $text);

            // Utfør sql-setning
            $stmt->execute();

            // Henter resultat fra spørring
            $result = $stmt->get_result();

            // Hent ut alle rader fra en spørring
            $encode = array();
            while ($row = $result->fetch_assoc()) {
                $encode[] = $row;
            }

            // Returner json-string med data
            echo json_encode($encode);

            // Avslutt sql-setning
            $stmt->close();
            break;
        }

    default:
        // Skriv en default her
        break;
    }
    break;

/*
    _  _  _  _                                              _           _  _  _                    _  _
   (_)(_)(_)(_) _                                          (_)         (_)(_)(_)                 _(_)(_)
    (_)        (_)   _  _  _       _  _  _  _      _  _  _ (_)            (_)    _  _  _  _   _ (_) _    _  _  _
    (_) _  _  _(_)  (_)(_)(_) _   (_)(_)(_)(_)_  _(_)(_)(_)(_)            (_)   (_)(_)(_)(_)_(_)(_)(_)_ (_)(_)(_) _
    (_)(_)(_)(_)_    _  _  _ (_)  (_)        (_)(_)        (_)            (_)   (_)        (_)  (_)  (_)         (_)
    (_)        (_) _(_)(_)(_)(_)  (_)        (_)(_)        (_)            (_)   (_)        (_)  (_)  (_)         (_)
    (_)_  _  _ (_)(_)_  _  _ (_)_ (_)        (_)(_)_  _  _ (_)          _ (_) _ (_)        (_)  (_)  (_) _  _  _ (_)
   (_)(_)(_)(_)     (_)(_)(_)  (_)(_)        (_)  (_)(_)(_)(_)         (_)(_)(_)(_)        (_)  (_)     (_)(_)(_)
 */

    /// Henter ut en stor mengde informasjon om et gitt band fra databasen
case 'getBandInfo':

    /*
    [0] Generell informasjon om band
     */


    $query1 = "SELECT navn, bio, popularitet, sjanger AS bsjanger, fornavn, etternavn, email, bilde_url
        FROM band b
        INNER JOIN bruker br ON b.manager_uid = br.uid
        WHERE b.bid = ?";

    $stmt1 = $dbconn->stmt_init();

    if(!$stmt1->prepare($query1)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {


        $stmt1->bind_param("i", $bid);

        // Leser inn band id
        $bid = $_POST['bid'];

        // Utfør sql-setning
        $stmt1->execute();

        // Henter resultat fra spørring
        $result1 = $stmt1->get_result();

        // Hent ut alle rader fra en spørring
        $encode1 = array();
        while ($row1 = $result1->fetch_assoc()) {
            $encode1[] = $row1;
        }


        // Avslutt sql-setning
        $stmt1->close();
    }


    /*
    [1] Album spilt inn av band
     */

    // Gjør klar sql-setning
    $query3 = "SELECT *
        FROM album
        WHERE bid = ?";

    // Gjør klar objekt for spørring
    $stmt3 = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt3->prepare($query3)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt3->bind_param('i', $bid);

        // Leser inn band id
        $bid = $_POST['bid'];

        // Utfører spørringen
        $stmt3->execute();

        // Får resultatet fra spørring
        $result3 = $stmt3->get_result();

        // Hent ut alle rader fra en spørring
        $encode3 = array();
        while ($row3 = $result3->fetch_assoc()) {
            $encode3[] = $row3;
        }


        // Avslutt sql-setning
        $stmt3->close();
    }

    /*
    [2] Tidligere konserter band har spilt på
     */

    // Gjør klar sql-setning
    $query4 = "SELECT *
        FROM band_tidligere_konserter
        WHERE bid = ?";

    // Gjør klar objekt for spørring
    $stmt4 = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt4->prepare($query4)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt4->bind_param('i', $bid);

        // Leser inn band id
        $bid = $_POST['bid'];

        // Utfør sql-setning
        $stmt4->execute();

        // Henter resultat fra spørring
        $result4 = $stmt4->get_result();

        // Hent ut alle rader fra en spørring
        $encode4 = array();
        while ($row4 = $result4->fetch_assoc()) {
            $encode4[] = $row4;
        }


        // Avslutt sql-setning
        $stmt4->close();
    }

    /*
    [3] Presseomtaler fra media
     */

    // Gjør klar sql-setning
    $query5 = "SELECT link, link_text
        FROM band_presseomtale
        WHERE bid = ?";

    // Gjør klar objekt for spørring
    $stmt5 = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt5->prepare($query5)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt5->bind_param('i', $bid);

        // Leser inn band id
        $bid = $_POST['bid'];

        // Utfør sql-setning
        $stmt5->execute();

        // Henter resultat fra spørring
        $result5 = $stmt5->get_result();

        // Hent ut alle rader fra en spørring
        $encode5 = array();
        while ($row = $result5->fetch_assoc()) {
            $encode5[] = $row;
        }


        // Avslutt sql-setning
        $stmt5->close();
    }


    // Koder bandinformasjon til liste over javascriptobjekter
    echo ("[" . json_encode($encode1) . "," . json_encode($encode3) . "," . json_encode($encode4) . "," . json_encode($encode5) . "]");

    break;
/*
       _  _  _                                                                           _                  _  _  _  _                                                                _
    _ (_)(_)(_) _                                                                       (_)                (_)(_)(_)(_) _                                                            (_)
   (_)         (_)    _  _  _     _  _  _  _      _  _  _  _  _  _  _   _       _  _  _ (_) _  _           (_)         (_) _  _  _  _    _  _  _  _       _  _  _    _       _  _  _ (_) _  _
   (_)             _ (_)(_)(_) _ (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)          (_) _  _  _ (_)(_)(_)(_)(_)_ (_)(_)(_)(_)_  _ (_)(_)(_) _(_)_  _ (_)(_)(_)(_)(_)(_)
   (_)            (_)         (_)(_)        (_)(_)       (_) _  _  _ (_) (_)(_)         (_)                (_)(_)(_)(_)  (_) _  _  _ (_)(_)        (_)(_)         (_) (_)(_)         (_)
   (_)          _ (_)         (_)(_)        (_)(_)       (_)(_)(_)(_)(_) (_)            (_)     _          (_)   (_) _   (_)(_)(_)(_)(_)(_)        (_)(_)         (_) (_)            (_)     _
   (_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _(_)_  _  _  _   (_)            (_)_  _(_)         (_)      (_) _(_)_  _  _  _  (_) _  _  _(_)(_) _  _  _ (_) (_)            (_)_  _(_)
      (_)(_)(_)      (_)(_)(_)   (_)        (_)  (_)(_)(_) (_)(_)(_)(_)  (_)              (_)(_)           (_)         (_) (_)(_)(_)(_) (_)(_)(_)(_)     (_)(_)(_)    (_)              (_)(_)
                                                                                                                                        (_)
                                                                                                                                        (_)
 */

    /// Henter informasjon for økonomisk rapport om en konsert fra databasen
case 'getConcertReport':
    $query = "SELECT konsert.tilskuere, konsert.billettpris, konsert.kostnad, konsert.sjanger
        FROM konsert
        INNER JOIN scene ON konsert.sid = scene.sid
        INNER JOIN konsert_band ON konsert.kid = konsert_band.kid
        INNER JOIN band ON konsert_band.bid = band.bid
        WHERE konsert.kid = ?
        AND fid = ?";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Binder brukerid som heltall
        $stmt->bind_param('ii', $cid, $fid);

        // Leser inn sceneid
        $cid = $_POST['cid'];
        $fid = $_POST['fid'];

        // Utfører spørringen
        $stmt->execute();

        // Returnerer resultat fra spørringen
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*
      _  _  _  _   _  _               _              _  _  _                                                                           _
    _(_)(_)(_)(_)_(_)(_)             (_)          _ (_)(_)(_) _                                                                       (_)
   (_)          (_)  (_)     _  _  _ (_)         (_)         (_)    _  _  _     _  _  _  _      _  _  _  _  _  _  _   _       _  _  _ (_) _  _
   (_)          (_)  (_)   _(_)(_)(_)(_)         (_)             _ (_)(_)(_) _ (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)
   (_)          (_)  (_)  (_)        (_)         (_)            (_)         (_)(_)        (_)(_)       (_) _  _  _ (_) (_)(_)         (_)
   (_)          (_)  (_)  (_)        (_)         (_)          _ (_)         (_)(_)        (_)(_)       (_)(_)(_)(_)(_) (_)            (_)     _
   (_)_  _  _  _(_)_ (_) _(_)_  _  _ (_)         (_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _(_)_  _  _  _   (_)            (_)_  _(_)
     (_)(_)(_)(_) (_)(_)(_) (_)(_)(_)(_)            (_)(_)(_)      (_)(_)(_)   (_)        (_)  (_)(_)(_) (_)(_)(_)(_)  (_)              (_)(_)


       _  _  _                    _  _
      (_)(_)(_)                 _(_)(_)
         (_)    _  _  _  _   _ (_) _    _  _  _
         (_)   (_)(_)(_)(_)_(_)(_)(_)_ (_)(_)(_) _
         (_)   (_)        (_)  (_)  (_)         (_)
         (_)   (_)        (_)  (_)  (_)         (_)
       _ (_) _ (_)        (_)  (_)  (_) _  _  _ (_)
      (_)(_)(_)(_)        (_)  (_)     (_)(_)(_)


 */

    /// Henter ut informasjon om en (gammel) konsert
case 'getOldConcertInfo' :

    $query = "SELECT knavn, k.dato, k.tilskuere, k.billettpris, b.navn AS bnavn, s.navn, s.maks_plasser,
        k.kostnad, k.start_tid, k.slutt_tid, k.sjanger, b.bio, b.bilde_url,
        b.popularitet, b.sjanger AS bsjanger, br.fornavn, br.etternavn, br.email
        FROM konsert k
        INNER JOIN konsert_band kb ON k.kid =kb.kid
        INNER JOIN band b ON b.bid = kb.bid
        INNER JOIN scene s ON s.sid = k.sid
        INNER JOIN bruker br ON b.manager_uid = br.uid
        WHERE k.kid = ?";

    // Gjør klar objekt for spørring
    $stmt = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Bind konsertid som heltall
        $stmt->bind_param('i', $kid);

        // Leser inn konsertid
        $kid = $_POST['kid'];

        // Utfør sql-setning
        $stmt->execute();

        // Henter resultat fra spørring
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;

/*

      _  _  _  _         _  _     _  _
    _(_)(_)(_)(_)_     _(_)(_)  _(_)(_)
   (_)          (_) _ (_) _  _ (_) _  _  _  _  _   _       _  _   _  _  _  _
   (_)          (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)_(_)(_)(_)(_)
   (_)          (_)   (_)      (_)  (_) _  _  _ (_) (_)(_)     (_)_  _  _  _
   (_)          (_)   (_)      (_)  (_)(_)(_)(_)(_) (_)          (_)(_)(_)(_)_
   (_)_  _  _  _(_)   (_)      (_)  (_)_  _  _  _   (_)           _  _  _  _(_)
     (_)(_)(_)(_)     (_)      (_)    (_)(_)(_)(_)  (_)          (_)(_)(_)(_)



 */

    /// For en gitt bruker, returnerer en liste over tilbud for godkjenning / avslag
case 'getOffers':

    // Leser inn brukertype
    $brukertype = (int)$_POST['brukertype'];

    // Manager
    if ($brukertype === 3) {
        $query = "SELECT tilbud.tid, tilbud.dato, tilbud.start_tid, tilbud.slutt_tid, tilbud.pris, tilbud.status AS statusflags, b.brukertype AS usertype,
            scene.navn AS scene_navn, band.navn AS band_navn, sender.fornavn AS sender_fornavn, sender.etternavn AS sender_etternavn
            FROM tilbud
            INNER JOIN scene ON scene.sid = tilbud.sid
            INNER JOIN band ON band.bid = tilbud.bid
            INNER JOIN bruker sender ON sender.uid = tilbud.sender_uid
            INNER JOIN bruker b ON b.uid = band.manager_uid
            WHERE band.manager_uid = ?
            ORDER BY tilbud.status ASC";
    }
    // Bookingansvarlig
    else if ($brukertype === 4) {
        $query = "SELECT tilbud.tid, tilbud.dato, tilbud.start_tid, tilbud.slutt_tid, tilbud.pris, tilbud.status AS statusflags, b.brukertype AS usertype,
            scene.navn AS scene_navn, band.navn AS band_navn, sender.fornavn AS sender_fornavn, sender.etternavn AS sender_etternavn
            FROM tilbud
            INNER JOIN scene ON scene.sid = tilbud.sid
            INNER JOIN band ON band.bid = tilbud.bid
            INNER JOIN bruker sender ON sender.uid = tilbud.sender_uid
            INNER JOIN bruker b ON b.uid = band.manager_uid
            WHERE tilbud.sender_uid = ?
            ORDER BY tilbud.status ASC";
    }
    // Bookingsjef
    else if ($brukertype === 5) {
        $query = "SELECT tilbud.tid, tilbud.dato, tilbud.start_tid, tilbud.slutt_tid, tilbud.pris, tilbud.status AS statusflags, b.brukertype AS usertype,
            scene.navn AS scene_navn, band.navn AS band_navn, sender.fornavn AS sender_fornavn, sender.etternavn AS sender_etternavn
            FROM tilbud
            INNER JOIN scene ON scene.sid = tilbud.sid
            INNER JOIN band ON band.bid = tilbud.bid
            INNER JOIN bruker sender ON sender.uid = tilbud.sender_uid
            INNER JOIN bruker b ON b.uid = band.manager_uid
            ORDER BY tilbud.status ASC";
    }




    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        if ($brukertype === 3 || $brukertype === 4) {
            // Binder brukerid som heltall
            $stmt->bind_param('i', $uid);
        }

        // Leser inn sceneid
        $uid = $_POST['uid'];

        // Utfører spørringen
        $stmt->execute();

        // Returnerer resultat fra spørringen
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {

        /*
            Brukertyper vi er interesserte i:
            3: manager
            4: bookingansvarlig
            5: bookingsjef
         */

            $should_encode = false;

            // Nytt tilbud, ikke godkjent av noen
            if (((int)$row['statusflags'] === 0 ) &&  ( $brukertype === 4 || $brukertype === 5)) {
                $should_encode = true;
            }
            // Tilbud godkjent av bookingsjef
            if ((((int)$row['statusflags'] & 1 ) === 1 ) &&  ( $brukertype === 3 || $brukertype === 4 || $brukertype === 5)) {
                $should_encode = true;
            }
            // Tilbud avslått av bookingsjef
            if ((((int)$row['statusflags'] & 2 ) === 2 ) && ( $brukertype === 4 || $brukertype === 5)) {
                $should_encode = true;
            }
            // Tilbud godkjent av manager
            if ((((int)$row['statusflags'] & 4 ) === 4 ) &&  ( $brukertype === 3 || $brukertype === 4 || $brukertype === 5)) {
                $should_encode = true;
            }
            // Tilbud avslått av manager
            if ((((int)$row['statusflags'] & 8 ) === 8 ) &&  ( $brukertype === 3 || $brukertype === 4 || $brukertype === 5)) {
                $should_encode = true;
            }

            // Bitflaggene gjør at hvis vi naivt sorterer etter tilbud.status så vil vi ikke få ting i den rekkefølgen vi ønsker, derfor har vi
            // en funksjon med oppgave å endre rekkefølgen tilbudene returneres i. (Vi ønsker at tilbud du som bruker skal prioritere skal komme øverst)
            if ($should_encode) {
                $encode[reorder_offers((int)$row['statusflags'])][] = $row;
            }
        }
        $returnString = "[";
        // Returner json-string med data
        foreach($encode as $array){
            $returnString .= json_encode($array) . ",";

        }
        echo substr_replace($returnString,"]",-1);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;
/*
    _  _  _                                                                           _                  _  _  _  _                     _                  _
 _ (_)(_)(_) _                                                                       (_)                (_)(_)(_)(_)_                  (_)                (_)
(_)         (_)    _  _  _     _  _  _  _      _  _  _  _  _  _  _   _       _  _  _ (_) _  _           (_)        (_) _       _  _  _  _      _  _  _  _  _     _  _  _  _      _  _  _  _
(_)             _ (_)(_)(_) _ (_)(_)(_)(_)_  _(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)          (_) _  _  _(_)(_)_  _ (_)(_)(_)(_)   _(_)(_)(_)(_)(_)   (_)(_)(_)(_)_  _(_)(_)(_)(_)
(_)            (_)         (_)(_)        (_)(_)       (_) _  _  _ (_) (_)(_)         (_)                (_)(_)(_)(_)    (_)(_)         (_)  (_)           (_)   (_)        (_)(_)        (_)
(_)          _ (_)         (_)(_)        (_)(_)       (_)(_)(_)(_)(_) (_)            (_)     _          (_)             (_)            (_)  (_)           (_)   (_)        (_)(_)        (_)
(_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)(_)_  _  _(_)_  _  _  _   (_)            (_)_  _(_)         (_)             (_)          _ (_) _(_)_  _  _  _ (_) _ (_)        (_)(_)_  _  _ (_)
   (_)(_)(_)      (_)(_)(_)   (_)        (_)  (_)(_)(_) (_)(_)(_)(_)  (_)              (_)(_)           (_)             (_)         (_)(_)(_) (_)(_)(_)(_)(_)(_)(_)        (_)  (_)(_)(_)(_)
                                                                                                                                                                                 _  _  _ (_)
                                                                                                                                                                                (_)(_)(_)
*/

    /// Henter informasjon relatert til pris
case 'getConcertPricingInfo':

  $query1 = "SELECT knavn, k.dato, k.tilskuere, k.billettpris, b.navn AS bnavn, s.navn, s.maks_plasser, k.kostnad, k.start_tid, k.slutt_tid, k.sjanger
          FROM konsert k
          INNER JOIN konsert_band kb ON k.kid =kb.kid
          INNER JOIN band b ON b.bid = kb.bid
          INNER JOIN scene s ON s.sid = k.sid
          WHERE k.billettpris IS NULL";

  // Gjør klar objekt for spørringen
  $stmt1 = $dbconn->stmt_init();

  // Gjør spørringen klar for databasen
  if(!$stmt1->prepare($query1)) {
    header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
  } else {

    // Utfører spørringen
    $stmt1->execute();

    // Returnerer resultat fra spørringen
    $result1 = $stmt1->get_result();

    // Hent ut alle rader fra en spørring
    $encode1 = array();
    while ($row = $result1->fetch_assoc()) {
        $encode1[] = $row;
    }

    // Avslutt sql-setning
    $stmt1->close();


    $query2 = "SELECT  navn, sid, maks_plasser FROM scene";

    // Gjør klar objekt for spørringen
    $stmt2 = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt2->prepare($query2)) {
      header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

      // Utfører spørringen
      $stmt2->execute();

      // Returnerer resultat fra spørringen
      $result2 = $stmt2->get_result();

      // Hent ut alle rader fra en spørring
      $encode2 = array();
      while ($row = $result2->fetch_assoc()) {
          $encode2[] = $row;
      }

      // Avslutt sql-setning
      $stmt2->close();

    // Returner json-string med data
    echo("[" . json_encode($encode1) . "," . json_encode($encode2) . "]");

    }
  }

    break;

/*
      _  _  _  _                     _                                     _  _     _  _
    _(_)(_)(_)(_)_                  (_)                                  _(_)(_)  _(_)(_)
   (_)          (_)  _  _  _  _   _ (_) _  _               _  _  _    _ (_) _  _ (_) _  _  _  _  _   _       _  _
   (_)_  _  _  _    (_)(_)(_)(_)_(_)(_)(_)(_)           _ (_)(_)(_) _(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)_(_)_  _ (_)(_)
     (_)(_)(_)(_)_ (_) _  _  _ (_)  (_)                (_)         (_)  (_)      (_)  (_) _  _  _ (_) (_)(_)
    _           (_)(_)(_)(_)(_)(_)  (_)     _          (_)         (_)  (_)      (_)  (_)(_)(_)(_)(_) (_)
   (_)_  _  _  _(_)(_)_  _  _  _    (_)_  _(_)         (_) _  _  _ (_)  (_)      (_)  (_)_  _  _  _   (_)
     (_)(_)(_)(_)    (_)(_)(_)(_)     (_)(_)              (_)(_)(_)     (_)      (_)    (_)(_)(_)(_)  (_)


                     _                         _
                    (_)                       (_)
      _  _  _  _  _ (_) _  _     _  _  _    _ (_) _  _   _         _    _  _  _  _
    _(_)(_)(_)(_)(_)(_)(_)(_)   (_)(_)(_) _(_)(_)(_)(_) (_)       (_) _(_)(_)(_)(_)
   (_)_  _  _  _    (_)          _  _  _ (_)  (_)       (_)       (_)(_)_  _  _  _
     (_)(_)(_)(_)_  (_)     _  _(_)(_)(_)(_)  (_)     _ (_)       (_)  (_)(_)(_)(_)_
      _  _  _  _(_) (_)_  _(_)(_)_  _  _ (_)_ (_)_  _(_)(_)_  _  _(_)_  _  _  _  _(_)
     (_)(_)(_)(_)     (_)(_)    (_)(_)(_)  (_)  (_)(_)    (_)(_)(_) (_)(_)(_)(_)(_)


 */

    /// Oppdaterer statusen på et tilbud, gjør ingen sjekker om statuskoden faktisk gir mening, dermed er det opp til javascript-funksjonen
    /// som kaller denne å sørge for at statuskoden er velformatert
case 'setOfferStatus':

    $query = "UPDATE tilbud
        SET status = ?
        WHERE tid = ?";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Binder brukerid som heltall
        $stmt->bind_param('ii', $status, $tid);

        // Leser inn status
        $status = $_POST['status'];

        // Leser inn sceneid
        $tid = $_POST['tid'];

        // Utfører spørringen
        $stmt->execute();

        // Avslutt sql-setning
        $stmt->close();
    }



    break;

    /// Returnerer en liste over alle band og alle scener
case 'getOfferFormInfo':


    // [1] Finner liste av band

    // Lager SQL-query
    $query1 = "SELECT bid, navn FROM band";

    // Gjør klar objekt for spørring
    $stmt1 = $dbconn->stmt_init();

    // Gjør klar spørringen for databsen
    if(!$stmt1->prepare($query1)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Utfør sql-setning
        $stmt1->execute();

        // Henter resultat fra spørring
        $result1 = $stmt1->get_result();

        // Hent ut alle rader fra en spørring
        $encode1 = array();
        while ($row = $result1->fetch_assoc()) {
            $encode1[] = $row;
        }

        // Avslutt sql-setning
        $stmt1->close();


        // [2] Finner liste av scener


        // Lager SQL-query
        $query2 = "SELECT sid, navn FROM scene";

        // Gjør klar objekt for spørring
        $stmt2 = $dbconn->stmt_init();

        // Gjør klar spørringen for databsen
        if(!$stmt2->prepare($query2)) {
            header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
        } else {

            // Utfør sql-setning
            $stmt2->execute();

            // Henter resultat fra spørring
            $result2 = $stmt2->get_result();

            // Hent ut alle rader fra en spørring
            $encode2 = array();
            while ($row = $result2->fetch_assoc()) {
                $encode2[] = $row;
            }


          // [3] Finner start- og sluttdato for festivalen


          // Lager SQL-query
          $query3 = "SELECT startDag, sluttDag FROM festival WHERE fid = ?";

          // Gjør klar objekt for spørring
          $stmt3 = $dbconn->stmt_init();

          // Gjør klar spørringen for databsen
          if(!$stmt3->prepare($query3)) {
              header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
          } else {

              // Binder festivalid som heltall
              $stmt3->bind_param('i', $fid);

              // Leser inn variabler
              $fid = $_POST['fid'];

              // Utfør sql-setning
              $stmt3->execute();

              // Henter resultat fra spørring
              $result3 = $stmt3->get_result();

              // Hent ut alle rader fra en spørring
              $encode3 = array();
              while ($row = $result3->fetch_assoc()) {
                  $encode3[] = $row;
              }

            // Returner json-string med data
            echo ("[" . json_encode($encode1) . "," . json_encode($encode2) . "," . json_encode($encode3) . "]");

            // Avslutt sql-setning
            $stmt2->close();
        }}
    }
    break;

    /// Registrerer et nytt tilbud i databasen
case 'insertOffer':

    $query = "INSERT INTO tilbud (dato, start_tid, slutt_tid, pris, status, bid, sid, sender_uid)
        VALUES (?,?,?,?,0,?,?,?)";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Binder brukerid som heltall
        $stmt->bind_param('sssiiii', $dato, $start_tid, $slutt_tid, $pris, $bid, $sid, $uid);

        // Leser inn variabler
        $dato = $_POST['dato'];
        $start_tid = $_POST['start_tid'];
        $slutt_tid = $_POST['slutt_tid'];
        $pris = $_POST['pris'];
        $bid = $_POST['bid'];
        $sid = $_POST['sid'];
        $uid = $_POST['sender_uid'];

        if(strlen($dato) == 0 || strlen($start_tid) == 0 || strlen($slutt_tid) == 0
            || strlen($pris) == 0 || strlen($bid) == 0 || strlen($sid) == 0 || strlen($uid) == 0) {
            header("HTTP/1.0 400 Bad Request: Zero-length string");
            die();
        }

        // Utfører spørringen
        $stmt->execute();

        // Avslutt sql-setning
        $stmt->close();
    }
    break;

    /// Sletter et tilbud fra databasen
case 'deleteOffer':

    $query = "DELETE FROM tilbud WHERE tid = ?";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Binder brukerid som heltall
        $stmt->bind_param('i', $tid);

        // Leser inn variabler
        $tid = $_POST['tid'];

        // Utfører spørringen
        $stmt->execute();

        // Avslutt sql-setning
        $stmt->close();
    }
    break;
/*
    _  _  _  _                                                                                 _
  _(_)(_)(_)(_)_                                                                              (_)
 (_)          (_)  _  _  _  _   _       _  _  _               _  _  _  _  _   _       _  _  _  _     _  _  _  _      _  _  _  _
 (_)_  _  _  _    (_)(_)(_)(_)_(_)_  _ (_)(_)(_)_           _(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)   (_)(_)(_)(_)_  _(_)(_)(_)(_)
   (_)(_)(_)(_)_ (_) _  _  _ (_) (_)(_)        (_)_       _(_) (_) _  _  _ (_) (_)(_)         (_)   (_)        (_)(_)        (_)
  _           (_)(_)(_)(_)(_)(_) (_)             (_)_   _(_)   (_)(_)(_)(_)(_) (_)            (_)   (_)        (_)(_)        (_)
 (_)_  _  _  _(_)(_)_  _  _  _   (_)               (_)_(_)     (_)_  _  _  _   (_)          _ (_) _ (_)        (_)(_)_  _  _ (_)
   (_)(_)(_)(_)    (_)(_)(_)(_)  (_)                 (_)         (_)(_)(_)(_)  (_)         (_)(_)(_)(_)        (_)  (_)(_)(_)(_)
                                                                                                                     _  _  _ (_)
                                                                                                                (_)(_)(_)
*/

    /// Henter ut informasjon til serveringssjef
case 'serveringInfo':

    $query = "SELECT knavn, dato, start_tid, slutt_tid, tilskuere, sjanger
        FROM konsert
        WHERE konsert.sid = ?
        AND fid = ?";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

        // Binder brukerid som heltall
        $stmt->bind_param('ii', $sid, $fid);

        // Leser inn sceneid
        $sid = $_POST['sceneid'];

        // Leser inn festival
        $fid = $_POST['fid'];

        // Utfører spørringen
        $stmt->execute();

        // Returnerer resultat fra spørringen
        $result = $stmt->get_result();

        // Hent ut alle rader fra en spørring
        $encode = array();
        while ($row = $result->fetch_assoc()) {
            $encode[] = $row;
        }

        // Returner json-string med data
        echo json_encode($encode);

        // Avslutt sql-setning
        $stmt->close();
    }

    break;
/*
    _  _  _                     _  _                                            _
 _ (_)(_)(_) _                 (_)(_)                                          (_)
(_)         (_)   _  _  _         (_)    _  _  _  _    _  _  _  _      _  _  _ (_)   _  _  _     _       _  _
(_)              (_)(_)(_) _      (_)   (_)(_)(_)(_)_ (_)(_)(_)(_)_  _(_)(_)(_)(_)  (_)(_)(_) _ (_)_  _ (_)(_)
(_)               _  _  _ (_)     (_)  (_) _  _  _ (_)(_)        (_)(_)        (_)   _  _  _ (_)  (_)(_)
(_)          _  _(_)(_)(_)(_)     (_)  (_)(_)(_)(_)(_)(_)        (_)(_)        (_) _(_)(_)(_)(_)  (_)
(_) _  _  _ (_)(_)_  _  _ (_)_  _ (_) _(_)_  _  _  _  (_)        (_)(_)_  _  _ (_)(_)_  _  _ (_)_ (_)
   (_)(_)(_)     (_)(_)(_)  (_)(_)(_)(_) (_)(_)(_)(_) (_)        (_)  (_)(_)(_)(_)  (_)(_)(_)  (_)(_)

*/

case 'getListOfConcertDays':
  $query = "SELECT startDag, sluttDag FROM festival WHERE fid = ?";

    // Gjør klar objekt for spørringen
    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

      // Binder brukerid som heltall
      $stmt->bind_param('i', $fid);

      // Leser inn sceneid
      $fid = $_POST['fid'];

      // Utfører spørringen
      $stmt->execute();

      // Returnerer resultat fra spørringen
      $result = $stmt->get_result();

      // Hent ut alle rader fra en spørring

      // Returner json-string med data
      echo json_encode($result->fetch_assoc());

      // Avslutt sql-setning
      $stmt->close();
}
break;

case 'getOffersForCalender':
    $query = "SELECT scene.navn AS snavn, tilbud.*, band.* FROM tilbud
            INNER JOIN band ON tilbud.bid = band.bid
            INNER JOIN scene ON tilbud.sid = scene.sid
    ";

    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {

      // Utfører spørringen
      $stmt->execute();

      // Returnerer resultat fra spørringen
      $result = $stmt->get_result();

      // Hent ut alle rader fra en spørring

      // Returner json-string med data
      $encode = array();
      while ($row = $result->fetch_assoc()) {
          $encode[] = $row;
      }

      echo json_encode($encode);

      // Avslutt sql-setning
      $stmt->close();
  }
break;

case 'getConcertsForCalender':
    $query = "SELECT scene.navn AS snavn, band.*, konsert.* FROM konsert
            INNER JOIN konsert_band ON konsert.kid = konsert_band.kid
            INNER JOIN band ON konsert_band.bid = band.bid
            INNER JOIN scene ON konsert.sid = scene.sid
    ";

    $stmt = $dbconn->stmt_init();

    // Gjør spørringen klar for databasen
    if(!$stmt->prepare($query)) {
        header("HTTP/1.0 500 Internal Server Error: Failed to prepare statement.");
    } else {


      // Utfører spørringen
      $stmt->execute();

      // Returnerer resultat fra spørringen
      $result = $stmt->get_result();

      // Hent ut alle rader fra en spørring

      // Returner json-string med data
      $encode2 = array();
      while ($row = $result->fetch_assoc()) {
          $encode2[] = $row;
      }

      echo json_encode($encode2);

      // Avslutt sql-setning
      $stmt->close();
  }
break;

    /// Hvis det er en skrivefeil i metodekallet så returnerer vi denne feilbeskjeden.
default:
    header('HTTP/1.0 501 Not implemented method.');
    die();
    break;
}

//Lukker oppkoblingen til databasen
$dbconn->close();
?>
