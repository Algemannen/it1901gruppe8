// Globale variables

// Siden URL
var options = "";

// Brukervariabler
var user = {type: 0, id: 0, name: "NONAME"};

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

    function getListOfScenes(bruker) {

        l = [{name: "stor", id:0}, {name: "middels", id:1}, {name: "liten", id:2}];

        let container = $("<ul></ul>").addClass("scenelist");
        let backButton =  $("<button></button>").text("Tilbake").addClass("scene_button_back").hide();
        container.append(backButton);

        for (i in l) {
            let scenePoint = $("<li></li>").addClass("scenePoint");
            let scene =  $("<button></button>").text(l[i].name).addClass("scene_button");
            let concerts = getListOfConcertesByScene(bruker,l[i]).hide()
            scenePoint.append(scene,concerts);
            container.append(scenePoint);
        }
        return container;
    }

    // Lager et html-element med konserter filtrert etter scene
    function getListOfConcertesByScene(bruker, scene) {
        // TODO: database-call: (userid)
        let l = []
        if (bruker.type == 1 && scene.id == 0) {
            l = [{name: "Konsert 1", id:0}, {name: "Konsert 2", id:1}];
        } else if (bruker.type == 1 && scene.id == 1) {
            l = [{name: "Konsert 3", id:2}];
        } else if (bruker.type == 1 && scene.id == 2) {
            l = [{name: "Konsert 4", id:3}, {name:"Konsert 5", id:4}];
        }

        return buildListOfConcerts(bruker,l);
    }

    // Lager et html-element med konserter
    function getListOfConcertes(bruker) {
        // TODO: database-call: (userid)
        let l = []
        if (bruker.type == 1) {
            l = [{name: "Konsert 1", id:0}, {name: "Konsert 2", id:1}, {name: "Konsert 3", id:2}, {name: "Konsert 4", id:3}, {name:"Konsert 5", id:4}];
        } else if (bruker.type == 2) {
            l = [{name:"Konsert 1", id:0}, {name: "Konsert 2", id:1}];
        }
        return buildListOfConcerts(bruker,l);
    }

    // Bygger en korrekt liste av scener
    function buildListOfConcerts(bruker,list) {
        let listContainer = $("<ul></ul>").addClass("concertlist");
        for (i in list) {
            let listPoint = $("<li></li>");
            let concertInfo = $("<span></span>").text(list[i].name);
            let concertButton = $("<button></button>").addClass("concert_button").text("Mer info");
            listPoint.append(concertInfo, concertButton, getConcertInfo(bruker, list[i].id));
            listContainer.append(listPoint);
        }
        return listContainer;
    }

    // Lager et html-element med informasjon om en konsert
    function getConcertInfo(bruker, concertID) {
        // TODO: database-call(userid, concertID)

        // Vi bygger et HTML-element
        let container = $("<div></div>").text("informasjon om konsert med ID:"+concertID).addClass("concertInfo");
        if (bruker.type = 1) {
            container.append("<br> Teknikere", getListOfTechnicians(bruker, concertID));
        }
        container.hide();
        return container;
    }

    // Lager et html-element med teknikere som hører til en konsert
    function getListOfTechnicians(bruker, concertID) {
        // TODO database-call: (userid,concertID)
        let l = ["Jens", "Nils", "Truls"];

        // Vi bygger et HTML-element
        let listContainer = $("<ul></ul>").addClass("technicianlist");
        for (i in l) {
            let listPoint = $("<li></li>").text( l[i]);
            listContainer.append(listPoint);
        }
        return listContainer;
    }

    // FUNCTIONS

    // Tegner siden på nytt etter brukertype
    function redraw() {
        switch(user.type) {
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
                $("#root").html("<p>Error: invalid usertype "+user.type+"</p>");
        }
        console.log("Pagestate:"+user.type);
    }

    // Finner sidens URL-addresse
    function parseUrl( url ) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    }

    // Henter informasjon fra bruker- og passord-felt og prøver å logge inn
    function logon() {
        user.name = $("#username_field").val();
        password = $('#password_field').val();
        console.log("Username "+user.name);

        $.ajax({ url: '/database.php',
            data: {username: user.name, password: password},
            type: 'post',
            success: function(output) {
                user.type = parseInt(output);
                if (user.type === 0) {
                    alert("Feil passord eller brukernavn.");
                }
                redraw();
            },
            error: function(xmlhttprequest, textstatus, message) {
                if(textstatus==="timeout") {
                    alert("Timeout feil, kan ikke koble til databasen");
                } else {
                    alert(textstatus);
                }
            }
        });

    }

    // Logger ut, for nå så laster den bare siden på nytt
    function logout() {
        console.log("Logout");
        location.reload();
    }

    // EVENTS

    // Debug-knapper
    $(".debug_button").click(function() {
        user.type = parseInt(this.id);
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
        $(this).next('.concertInfo').slideToggle();

        if ($.trim($(this).text()) === "Mer info") {
            $(this).text("Skjul");
        } else {
            $(this).text("Mer info");
        }
    });

    // Fang trykk på knapp for mer informasjon om scene
    $('body').on('click', ".scene_button", function () {
        let concertID = parseInt(this.id);
        $(this).next('.concertlist').show();
        $(".scene_button_back").show()
        $(".scene_button").hide();
    });

    // Fang trykk på knapp for mindre informasjon om scene
    $('body').on('click', ".scene_button_back", function () {
        let concertID = parseInt(this.id);
        $('.concertlist').hide();
        $('.scene_button_back').hide();
        $(".scene_button").show();
    });

    // VIKTIG FUNKSJON: Kan injesere innhold i DOM-treet etter ajax-oppdatering.
    $(document).ajaxComplete(function() {
        $('#username').html(user.name);
        $('#listofconcerts').append(getListOfConcertes(user));
        $('#listofscenes').append(getListOfScenes(user));
    });



});
