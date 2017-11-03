/*

Javascript-funksjonalitet for bookingansvarlig-bruker

*/

let defaultcolor = 'rgba(255,255,255,0.4)'
let selectedcolor = 'rgba(0,0,0,0.4)'

// Funksjon for fanevisning på siden. Viser og skjuler faner basert på index
function bookingfane(index) {
    if (index==0) { // Viser tekniske behov
        $("#tekniskebehov").show();
        $("#tekniskebehov_knapp").css("background",selectedcolor);

        $("#sok").hide();
        $("#sok_knapp").css("background",defaultcolor);

        $("#bookingtilbud").hide();
        $("#bookingtilbud_knapp").css("background",defaultcolor);
    }
    else if (index == 1) { // Viser søke-fane
        $("#sok").show();
        $("#sok_knapp").css("background",selectedcolor);

        $("#tekniskebehov").hide();
        $("#tekniskebehov_knapp").css("background",defaultcolor);

        $("#bookingtilbud").hide();
        $("#bookingtilbud_knapp").css("background",defaultcolor);
    }
    else if (index == 2) { // Viser bookingtilbud-fane
        $("#bookingtilbud").show();
        $("#bookingtilbud_knapp").css("background",selectedcolor);

        $("#tekniskebehov").hide();
        $("#tekniskebehov_knapp").css("background",defaultcolor);

        $("#sok").hide();
        $("#sok_knapp").css("background",defaultcolor);
    }
}

// Henter tekniske behov for alle konserter på en festival
function getListOfTechnicalNeeds(bruker) {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfConcertesByFestival',
        data: {fid: current_fid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Henter tekniske behov for konserter
            for (i in l) {
                getTechnicalNeedsByKid(bruker.id,l[i].kid, l[i].navn, l[i].dato, '#tekniskebehov');
            }
        },
        error: function(xmlhttprequest, textstatus, message) {
            if(textstatus==="timeout") {
                alert("Timeout feil, kan ikke koble til databasen");
            } else {
                console.log("Error: "+message);
            }
        }
    })
};

// Gjør søk basert på tekstinput og radio-knapper og viser resultat i liste
function search() {
    let l = [];
    let inputText = $("#textinput").val();
    let searchType = $('input[name=type]:checked').val();
    $("#resultlist").empty();

    $.ajax({ url: '/database.php?method=search',
        data: {text: inputText, type: searchType, fid: current_fid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            if (l.length > 0) {
                let table = $("<table></table>");

                // Legger inn alle resultater som rader i en tabell
                for (i in l) {
                    let tableRow = $("<tr></tr>");
                    let obj = [searchType, l[i].id];
                    let tableElementNavn = $("<td></td>").text(l[i].navn).addClass("bookingnavnsok").val(obj);
                    tableRow.append(tableElementNavn);
                    table.append(tableRow);
                    $("#resultlist").append(table);

                }

                // Første treff skal velges som standard
                $('.bookingnavnsok').first().trigger('click');
            }

            // Lar bruker vite om søkeresultat var tomt
            else {
                $("#resultlist").append("Ingen resultater.");
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

// Funksjon for å hente informasjon til tilbuds-skjema
function getOfferFormInfo(){
    let l = [];

    $.ajax({ url: '/database.php?method=getOfferFormInfo',
        data: {fid: current_fid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Legger inn alle band i en dropdown-liste
            for (i in l[0]){
                let bandOption = $("<option></option>").text(l[0][i].navn).attr('value', l[0][i].bid);
                $("#bandSelect").append(bandOption);
            }

            // Legger inn alle scener i en dropdown-liste
            for (i in l[1]){
                let sceneOption = $("<option></option>").text(l[1][i].navn).attr('value', l[1][i].sid);
                $("#sceneSelect").append(sceneOption);
            }

            // Legger inn riktig min- og maxdato
            $("#tilbudDato").attr('min', l[2][0].startDag);
            $("#tilbudDato").attr('max', l[2][0].sluttDag);
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


// Funksjon som validerer tilbud-skjema. Sender tilbudet videre dersom validering godkjennes
function validateOfferData(){
    let dato = $("#tilbudDato").val();
    let starttid = $("#tilbudStarttid").val();
    let sluttid = $("#tilbudSluttid").val();
    let beløp = $("#tilbudBeløp").val();
    let scene = $("#sceneSelect").val();
    let band = $("#bandSelect").val();

    if (dato != '' && starttid != '' && sluttid != '' && beløp != ''){
        sendOffer(dato, starttid, sluttid, beløp, scene, band, user);
    } else {
        alert("Feltene er ikke riktig utfyllt.");
    }
}

// Funksjon for å lagre tilbud i database. Funksjonen antar korrekt info
function sendOffer(dato, starttid, sluttid, beløp, scene, band, bruker){
    console.log(dato, starttid, sluttid, beløp, scene, band, bruker.id);

    $.ajax({ url: '/database.php?method=insertOffer',
        data: {dato: dato, start_tid: starttid, slutt_tid: sluttid, pris: beløp, sid: scene, bid: band, sender_uid: bruker.id},
        type: 'post',
        success: function(output) {
            alert("Tilbudet er sendt.");

            // Nullstiller skjema
            resetOfferData();

            injectOffers(user);
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

// Nullstiller tilbud-skjema
function resetOfferData(){
    $("#tilbudDato").val('');
    $("#tilbudStarttid").val('');
    $("#tilbudSluttid").val('');
    $("#tilbudBeløp").val('');
}
