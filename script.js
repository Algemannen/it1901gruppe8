// Globale variables

// Siden URL
var options = "";

// Brukervariabler
var usertype = 0;
var username = "NONAME";
var userid = 0;

// Variable som refererer til siden sinnhold
var listofconcerts = [];
var listoftechnicians = [];

// Functions to run after DOM is ready
$(document).ready(function(){
    // Initsiering

    // Vi lagrer url-en i options-stringen slik at du vi kan lese den senere
    options = parseUrl(window.location.href);
        // Regex for å finne ut om ?debug-kommandoen er inkludert i URL
        if (/debug/i.test(options)) {
            $(".debug").show();
        }
    // Oppdater skjermen så vi får med alle ajax-kall
    redraw();

    // Database queries

    // Lager et html-element med teknikere som hører til en konsert
    function getListOfTechnicians(concertID) {
        // TODO database-call: (userid,concertID)
        let l = ["Jens", "Nils", "Truls"];

        // Vi bygger HTML-element
        let str = "<ul class='technicianlist'>";
        for (i in l) {
            str+= "<li>"+l[i]+"</li>";
        }
        str+="</ul>";
        return str;
    }

    // Lager et html-element med konserter
    function getListOfConcertes() {
        // TODO: database-call: (userid)
        let l = []
        if (usertype == 1) {
            l = ["Konsert 1", "Konsert 2", "Konsert 3", "Konsert 4", "Konsert 5"];
        } else if (usertype == 2) {
            l = ["Konsert 1", "Konsert 2"];
        }
        // Get from database
        let concertID = 0;
        /* Refaktorering
        let listContainer = $("<ul></ul>").addClass("concertlist");
        for (i in l) {
            listContainer.append...
        }
        */
        let str = "<ul class='concertlist'>";
        for (i in l) {
            str+= "<li><span>"+l[i]+"</span><button class='concert_button' id='"+concertID+"'>Mer info</button>"+"</li>";
        }
        str+="</ul>";
        return str;
    }

    // Lager et html-element med informasjon om en konsert
    function getConcertInfo(concertID) {
        // TODO: database-call(userid, concertID)
        let str ="<div>";
        str += "informasjon om konsert med ID:"+concertID;
        if (usertype == 1) {
            str += "<br> Teknikere: "
            str+=getListOfTechnicians(concertID);
        }
        str += "</div>";
        console.log(str);
        return str;
    }
    

    // FUNCTIONS

    // Tegner siden på nytt etter brukertype
    function redraw() {
        switch(usertype) {
            case 0: // Ikke pålogget
                $.ajax({url: "no_user.html",dataType: 'html', success: function(result){
                    $("#root").html(result);
                }});
                break;
            case 1: // Bruker er arrangør
                $.ajax({url: "arrang.html",dataType: 'html', success: function(result){
                        $("#root").html(result);
                }});
                break;
            case 2: // Bruker er teknikker
                $.ajax({url: "tekni.html",dataType: 'html', success: function(result){
                    $("#root").html(result);
                }});
                break;
            default:
                $("#root").html("<p>Error: invalid usertype "+usertype+"</p>");
        }
        console.log("Pagestate:"+usertype);
    }

    // Finner sidens URL-addresse
    function parseUrl( url ) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    } 

    // Henter informasjon fra bruker- og passord-felt og prøver å logge inn
    function logon() {
        username = $("#username_field").val();
        console.log("Username "+username);
        // TODO
        if (username.charAt(0) == 'a') {
            usertype = 1;
        } else if (username.charAt(0) == 'b') {
            usertype = 2;
        }
        redraw();
    }

    // Logger ut, for nå så laster den bare siden på nytt
    function logout() {
        console.log("Logout");
        location.reload();
    }

    // EVENTS

    // Debug-knapper
    $(".debug_button").click(function() {
        usertype = parseInt(this.id);
        redraw();
    });

    // Fang 'enter'-trykk fra brukernavn-feltet
    $('body').on('keyup', "#username_field", function (e) {
        if (e.keyCode === 13) {
           logon();
        }
    });

    // Fang 'enter'trykk fra passord-feltet
    $('body').on('keyup', "#password_field", function (e) {
        if (e.keyCode === 13) {
           logon();
        }
    });

    // Fant trykk på påloggingsknappen
    $('body').on('click', ".login_button", function () {
        logon();
    });

    // Fang trykk på avloggingsknappen
    $('body').on('click', ".logout_button", function () {
        logout();
    });

    // Fang trykk på knapp for mer informasjon om konsert
    $('body').on('click', ".concert_button", function () {
        let concertID = parseInt(this.id);
        console.log("Get concert info");
        $(this).after(getConcertInfo(concertID));
        // Denne funksjonen skjuler bare knappen etter å ha blitt kallet, alternativ: bruk $(...).toggle();
        $(this).hide();
    });

    // VIKTIG FUNKSJON: Kan injsere innhold i DOM-treet etter ajax-oppdatering.
    $(document).ajaxComplete(function() {
        $('#username').html(username);
        $('#listofconcerts').html(getListOfConcertes());
    });

    

});