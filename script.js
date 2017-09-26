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

        l = [];

        $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: user.name, usertype: user.type},
        type: 'post',
        success: function(output) {
          console.log(output);
            l = jQuery.parseJSON(output);

            let container = $("<ul></ul>").addClass("scenelist");
            let backButton =  $("<button></button>").text("Tilbake").addClass("scene_button_back").hide();
            container.append(backButton);

            for (i in l) {
                getListOfConcertesByScene(bruker,l[i])
            }

        },
        error: function(xmlhttprequest, textstatus, message) {
            if(textstatus==="timeout") {
                alert("Timeout feil, kan ikke koble til databasen");
            } else {
                console.log("Error: "+message);
            }
        }
        });

        
    }

    // Lager et html-element med konserter filtrert etter scene
    function getListOfConcertesByScene(bruker, scene) {
        let l = []

        $.ajax({ url: '/database.php?method=getListOfConcertsByScene',
        data: {username: user.name, usertype: user.type, sceneid: scene.sid},
        type: 'post',
        success: function(output) {
            console.log(output);
            l = jQuery.parseJSON(output);
            console.log(l);

            let scenePoint = $("<li></li>").addClass("scenePoint");
            let concerts = buildListOfConcerts(bruker,l).hide();
            let buttonContainer = $("<span></span>").addClass("sceneButtonContainer");
            
            let scene =  $("<button></button>").text(l[i].kid).addClass("scene_button");
            buttonContainer.append(scene);
            scenePoint.append(buttonContainer,concerts);
            
            $('scenelist').append(scenePoint);
        },
        error: function(xmlhttprequest, textstatus, message) {
            if(textstatus==="timeout") {
                alert("Timeout feil, kan ikke koble til databasen");
            } else {
                console.log("Error: "+message);
            }
        }
        });

        
    }

    // Lager et html-element med konserter
    function getListOfConcertes(bruker) {
        let l = [];

        $.ajax({ url: '/database.php?method=getCompleteListOfConcerts',
        data: {username: user.name, usertype: user.type},
        type: 'post',
        success: function(output) {
            console.log(output);
            l = jQuery.parseJSON(output);
            console.log(l);

            let scenePoint = $("<li></li>").addClass("scenePoint");
            let concerts = buildListOfConcerts(bruker,l).hide();
            let buttonContainer = $("<span></span>").addClass("sceneButtonContainer");
            
            let scene =  $("<button></button>").text("Dummy").addClass("scene_button");
            buttonContainer.append(scene);
            scenePoint.append(buttonContainer,concerts);
            
            $('scenelist').append(scenePoint);
            
        },
        error: function(xmlhttprequest, textstatus, message) {
            if(textstatus==="timeout") {
                alert("Timeout feil, kan ikke koble til databasen");
            } else {
                console.log("Error: "+message);
            }
        }
        });

        
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
                    $('#username').html(user.name);
                    getListOfConcertes(user);
                    getListOfScenes(user);
                }});
                break;
            case 2: // Bruker er teknikker
                $.ajax({url: "tekni.html",dataType: 'html', success: function(result){
                    $("#root").html(result);
                    $('#username').html(user.name);
                    getListOfConcertes(user);
                }});
                break;
            default:
                $("#root").html("<p>Error: invalid usertype "+user.type+"</p>");
        }
        console.log("Pagestate:"+user.type);
    }

    function assertType(object, type) {
        if (jQuery.type(object) !== type) {
            console.log("Fatal typefeil: "+object+" er "+jQuery.type(object)+",og ikke "+type);
        }

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

        $.ajax({ url: '/database.php?method=login',
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
                    console.log("Error: "+message);
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
        //$(".scenelist_c").addClass('.scenelist');
        //$(".scenelist_c").removeClass('.scenelist_c')
        $(this).parent().next('.concertlist').show();
        $(".scene_button_back").show()
        $(".scene_button").hide();
    });

    // Fang trykk på knapp for mindre informasjon om scene
    $('body').on('click', ".scene_button_back", function () {
        let concertID = parseInt(this.id);
        //$(".scenelist").addClass('.scenelist_c');
        //$(".scenelist").removeClass('.scenelist')
        $('.concertlist').hide();
        $('.scene_button_back').hide();
        $(".scene_button").show();

    });


});
