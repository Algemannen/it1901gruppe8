/*




*/

// Globale variables
var current_fid = 1;
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

    // Sjekk om kobling mot databsen fungerer.
    pingDatabase();

    // Database queries

    function pingDatabase() {
        $.ajax({ url: '/database.php?method=ping',
        type: 'post',
        success: function(output) {
            console.log("Databasen sier "+output);
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

    function getListOfScenes(bruker) {

        l = [];

        $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: user.name, usertype: user.type},
        type: 'post',
        success: function(output) {
          console.log(output);
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            let container = $("<div></div>").addClass("scenelist");
            $('#listofscenes').append(container);

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
        data: {username: user.name, usertype: user.type, sceneid: scene.sid, fid:current_fid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            let scenePoint = $("<li></li>").addClass("scenePoint");
            let concerts = buildListOfConcerts(bruker,l);
            let sceneHead = $("<li></li>").text(scene.navn);
            let sceneInfo = $("<li></li>").text("Maks plasser: " + scene.maks_plasser);

            scenePoint.append(concerts);
            let scenediv = $("<ul></ul>").addClass("singleScene");
            scenediv.append(sceneHead,sceneInfo,scenePoint);
            $('.scenelist').append(scenediv);
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

        $.ajax({ url: '/database.php?method=getListOfConcertsForTechs',
        data: {username: user.name, usertype: user.type, userid: user.id, fid:current_fid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            let scenePoint = $("<li></li>").addClass("scenePoint");
            let concerts = buildListOfConcerts(bruker,l);
            scenePoint.append(concerts);

            $('#listofconcerts').append(scenePoint);

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
            let concertInfo = $("<div></div>").addClass("button_text").text(' ' + list[i].navn +' | ' + list[i].dato +  ' | ' + list[i].start_tid + " - " + list[i].slutt_tid);
            let concertButton = $("<button></button>").addClass("concert_button").text("Mer info");
            listPoint.append(concertInfo, concertButton, getConcertInfo(bruker, list[i]));
            listContainer.append(listPoint);
        }
        return listContainer;
    }

    // Lager et html-element med informasjon om en konsert
    function getConcertInfo(bruker, concert) {

        // Vi bygger et HTML-element
        let container = $("<div></div>").text(" ").addClass("concertInfo").attr('id', 'cid'+concert.kid);
        console.log(concert);
        if (bruker.type===1) {
            getListOfTechnicians(bruker, concert);
        } else if (bruker.type===2) {
            let concertDate = $("<span></span>").text(concert.dato);
            let concertScene = $("<span></span>").text(concert.snavn);
            let start = $("<span></span>").text(concert.start_tid);
            let slutt = $("<span></span>").text(concert.slutt_tid);
            container.append("Scene ",concertScene,"<br>Dato ",concertDate,"<br>Start ",start,"<br>Slutt ",slutt);
        }

        container.hide();
        return container;
    }

    // Lager et html-element med teknikere som hører til en konsert
    function getListOfTechnicians(bruker, concert) {

        $.ajax({ url: '/database.php?method=getListOfTechs',
        data: {username: user.name, usertype: user.type, concertid: concert.kid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Vi bygger et HTML-element
            let listContainer = $("<ul></ul>").addClass("technicianlist");
            for (i in l) {
                let listPoint = $("<li></li>").text(l[i].fornavn +' '+ l[i].etternavn);
                listContainer.append(listPoint);
            }

            if (bruker.type = 1) {
                listContainer.append(listContainer);
                $('#cid'+concert.kid).append("<div>Teknikere: </div>",listContainer);
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

    function getListOfTechnicalNeeds(kid) {
        let l = [];

        $.ajax({ url: '/database.php?method=getListOfTechnicalNeeds',
        data: {concertid: kid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Vi bygger et HTML-element
            let kid = $("<h2></h2").text('Konsert :' + l[0].kid);
            let listContainer = $("<ul></ul>").addClass("behov");
            for (i in l) {
                let tittel = $("<li></li>").text('Tittel :' + l[i].tittel);
                let behov = $("<li></li>").text('Beskrivelse :' + l[i].behov);
                listContainer.append(tittel,behov, '<hr>');
            }
            $('#tekniskebehov').append(kid,listContainer);

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
    function addNeedsForTechs(bruker, concert, title, needs) {

        $.ajax({ url: '/database.php?method=addNeedsForTechs',
        data: {username:user.name, usertype:user.type, concertid:concert.kid, title:title, needs:needs},
        type: 'post',
        success: function(output) {
            console.log(output);


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

            case 3: //Bruker er manager
                $.ajax({url: "manager.html",dataType: 'html', success: function(result){
                    $("#root").html(result);
                    $('#username').html(user.name);
                    getListOfTechnicalNeeds(user);
                }});
                break;
            case 4: //Bruker er bookingansvarlig
                $.ajax({url: "bookingans.html",dataType: 'html', success: function(result){
                  $("#root").html(result);
                  $('#username').html(user.name);
                  getListOfTechnicalNeeds(1);
                }});
            default:
                $("#root").html("<p>Error: invalid usertype "+user.type+"</p>");
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

        $.ajax({ url: '/database.php?method=login',
            data: {username: user.name, password: password},
            type: 'post',
            success: function(output) {
                let q = jQuery.parseJSON(output);
                user.type = parseInt(q.brukertype);
                user.id = parseInt(q.uid);
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

//Try catch funksjon for json-parse
function safeJsonParse(output) {
  try{
    l = jQuery.parseJSON(output);
  }
  catch(err){
    console.log(output);
    $("#root").after(output);
  }
  return l;
}
