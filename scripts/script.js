/*




*/


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
                    manager_uid = user.id;
                    injectListOfAllNeeds();
                    injectOffers(user);
                }});
                break;
            case 4: //Bruker er bookingansvarlig
                $.ajax({url: "bookingans.html",dataType: 'html', success: function(result){
                    $("#root").html(result);
                    $('#username').html(user.name);
                    getListOfTechnicalNeeds(user);
                }});
                break;
            case 5: //Bruker er bookingsjef
                $.ajax({url: "bookingsjef.html",dataType: 'html', success: function(result){
                    $("#root").html(result);
                    $('#username').html(user.name);
                    // getListOfTechnicalNeeds(user);
                }});
                break;
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
                    if(message=="Unauthorized user.") {
                      alert("Invalid username or password")
                    }
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

    // Fang trykk på radio-knaper for manager
    $('body').on('click', ".manager_radio", function () {
        manager_kid = parseInt(this.value);
        $('.needs_container').show();
    });


    // Sende inn behov for manager
    $('body').on('click', "#manager_submit", function () {
        let kid = manager_kid;
        let tittel = $("#title_field").val();
        let desc = $("#description_field").val();
        console.log("KID: "+kid);
        console.log("Tittel: "+tittel);
        console.log("Desc.: "+desc);
        $("#title_field").val('');
        $("#description_field").val('');

        registerConcertNeed(kid,tittel,desc);
    });



    $('body').on('click', ".bookingnavnsok", function () {

      let bandInfo = $("<div></div>").addClass("bandInfo");
      $("#informationlist").empty();

      $.ajax({ url: '/database.php?method=getBandInfo',
          data: {bid: this.value[1]},
          type: 'post',
          success: function(output) {
              console.log(output);
              l = safeJsonParse(output); //gjør en try-catch sjekk.
              let bandOverskrift = $("<h3></h3>").text(l[0][0].navn);

              // Lager HTML-kode til bandinformasjon
              let bandInformation = $("<div></div>").addClass("nokkelinfo");
              let bandImage = $('<img class="bandImage"/>').attr('src', l[0][0].bilde_url.replace("\/", "/"));
              let bio = $("<span></span><br>").text("Bio: " + l[0][0].bio);
              let popularitet = $("<span></span><br>").text("Popularitet: " +l[0][0].popularitet);
              let sjanger = $("<span></span><br>").text("Sjanger: " + l[0][0].sjanger);
              let manager = $("<span></span><br>").text("Manager Informasjon").css("font-weight", "bold");
              let managerFornavn = $("<span></span><br>").text(l[0][0].fornavn + " " + l[0][0].etternavn);
              let managerEmail = $("<span></span>").text(l[0][0].email);
              bandInformation.append(bio, popularitet, sjanger, manager, managerFornavn, managerEmail)
              bandInfo.append(bandImage, bandInformation);
              $("#informationlist").append(bandOverskrift, bandInfo);

              // Lager HTML-kode til albuminformasjon
              if (l[2].length > 0) {
                let albumDiv = $("<div></div>").addClass("albumsalg");
                let albumOverskrift = $("<h3></h3>").text("Album");
                let albumTable = $("<table></table>");
                let albumHeader = $("<tr></tr>");
                let albumHeaderNavn = $("<th></th>").text("Albumnavn");
                let albumHeaderAar = $("<th></th>").text("Utgivelsesår");
                let albumHeaderSalg = $("<th></th>").text("Salgtall");
                albumHeader.append(albumHeaderNavn, albumHeaderAar, albumHeaderSalg);
                albumTable.append(albumHeader);
                for (i in l[2]) {
                  let tableRow = $("<tr></tr>");
                  let albumNavn = $("<td></td>").text(l[2][i].navn);
                  let albumAar = $("<td></td>").text(l[2][i].utgitt_aar);
                  let albumSalg = $("<td></td>").text(l[2][i].salgstall);
                  tableRow.append(albumNavn, albumAar, albumSalg);
                  albumTable.append(tableRow);
                }
                albumDiv.append(albumOverskrift, albumTable);
                $("#informationlist").append(albumDiv);
              }

              // Lager HTML-kode til tidligere konserter
              if (l[3].length > 0) {
                let konsertDiv = $("<div></div>").addClass("tidligereKonserter");
                let konsertOverskrift = $("<h3></h3>").text("Tidligere Konserter");
                let konsertTable = $("<table></table>");
                let konsertHeader = $("<tr></tr>");
                let konsertHeaderNavn = $("<th></th>").text("Konsertnavn");
                let konsertHeaderLokasjon = $("<th></th>").text("Lokasjon");
                let konsertHeaderDato = $("<th></th>").text("Dato");
                let konsertHeaderTilskuere = $("<th></th>").text("Tilskuere");
                konsertHeader.append(konsertHeaderNavn, konsertHeaderLokasjon, konsertHeaderDato, konsertHeaderTilskuere);
                konsertTable.append(konsertHeader);
                for (i in l[3]) {
                  let tableRow = $("<tr></tr>");
                  let konsertNavn = $("<td></td>").text(l[3][i].navn);
                  let konsertLokasjon = $("<td></td>").text(l[3][i].lokasjon);
                  let konsertDato = $("<td></td>").text(l[3][i].dato);
                  let konsertTilskuere = $("<td></td>").text(l[3][i].tilskuere);
                  tableRow.append(konsertNavn, konsertLokasjon, konsertDato, konsertTilskuere);
                  konsertTable.append(tableRow);
                }
                konsertDiv.append(konsertOverskrift, konsertTable);
                $("#informationlist").append(konsertDiv);
              }

            //  $("#informationlist").append(bandOverskrift, bandInfo, albumTable);
          },
          error: function(xmlhttprequest, textstatus, message) {
              if(textstatus==="timeout") {
                  alert("Timeout feil, kan ikke koble til databasen");
              } else {
                  console.log("Error: "+message);
              }
          }
      });

    });

    $('body').on('click', "#tekniskebehov_knapp", function () {
        bookingfane(0);
    });

    $('body').on('click', "#sok_knapp", function () {
        bookingfane(1);
    });

    $('body').on('click', "#sokebutton", function () {
        search();
    });

    $('body').on('click', ".delete_technical_need", function () {
        deleteTechinalNeed(this.value);
    });

    

    $('body').on('click', "#booking_behov_knapp", function () {
        managerfane(0);
    });

    $('body').on('click', "#booking_tilbud_knapp", function () {
        managerfane(1);
    });







});
