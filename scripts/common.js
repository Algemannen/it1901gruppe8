/*

Javascript-side som inneholder funksjoner og variabler som blir brukt av flere (eller alle) andre script, må lastes først

*/





// Brukervariabler
var user = {type: 0, id: 0, name: "NONAME"};

// Bestemmer om siden skal vise utviklerinformasjon
var debug_mode = false;

// Teller hvor mange tilbud som venter på brukerrespons
var ventende_tilbud = 0;

// Lager et html-element med informasjon om en konsert
function getConcertInfo(bruker, concert) {

    // Vi bygger et HTML-element
    let container = $("<div></div>").text(" ").addClass("concertInfo").attr('id', 'cid' + concert.kid);
    if (bruker.type===1) {
        let maindiv = $("<div></div>").addClass("behov");
        let tb = $("<h3></h3>").text("Tekniske Behov:");
        maindiv.append(tb);
        getTechnicalNeedsByKid(bruker.id,concert.kid, concert.navn, concert.dato, maindiv);
        getListOfTechnicians(bruker, concert);
        container.append(maindiv);
    } else if (bruker.type===2) {
        let tb = $("<h3></h3>").text("Tekniske Behov:");
        container.append(tb);
        getTechnicalNeedsByKid(bruker.id, concert.kid, concert.navn, concert.dato, '#cid'+concert.kid);
    } else if (bruker.type == 5) {
        let concertReportDiv = $("<div></div>").addClass("EcReport");
        let cost_report = $("<h3></h3>").text("Økonomisk rapport:");
        concertReportDiv.append(cost_report);
        BSbuildConcertReport(concert.kid, concert.navn, concertReportDiv);
        container.append(concertReportDiv);
    }
    container.hide();
    return container;
}

// Lager et html-element med teknikere som hører til en konsert (ARRABGØR)
function getListOfTechnicians(bruker, concert) {

    $.ajax({ url: '/database.php?method=getListOfTechs',
        data: {username: user.name, usertype: user.type, concertid: concert.kid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Vi bygger et HTML-element
            let listContainer = $("<div></div>").addClass("technicianlist");
            listContainer.append("<h3>Teknikere: </h3>");

            for (i in l) {
                let listPoint = $("<span></span><br>").text(l[i].fornavn +' '+ l[i].etternavn);
                listContainer.append(listPoint);
            }

            listContainer.append(listContainer);
            $('#cid'+concert.kid).append(listContainer);


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

//Try catch funksjon for json-parse
function safeJsonParse(output) {
    try{
        l = jQuery.parseJSON(output);
    }
    catch(err){
        console.log(err);
        console.log(output);
        $("#root").after(output);
    }
    return l;
}

/*
Hvordan bruke denne:

html_id skal være en id eller klasse f.eks #root som listen settes inn i.
list skal være en liste over objekter
formatingunction skal være en funksjon som tar ett objekt fra list og gjør det til html
det forventes at formateringsunfksjonen skal være på formen:

    function(html_id, element) {
        let container = $("<span></span>");

        ...

        $("#"+html_id).append(container);
    }

Denne funksjonen er async-sikker og har som hovedoppgave å redusere boilerplate-kode i forbindelse med listebygging i sammenheng med ajax
*/
function injectList(html_id, list, formatingfunction) {
    if (list.length === 0) {
        return;
    }
    let listContainer = $("<ul></ul>");
    let child_id = [];
    for (let i = 0; i<list.length; i++) {
        child_id.push(html_id+"_"+i+"_");
        let listElement = $("<li></li>").attr("id",child_id[i]);
        listContainer.append(listElement);
    }

    $("#"+html_id).append(listContainer);

    for (let i = 0; i<list.length; i++) {
        formatingfunction(child_id[i],list[i]);
    }
}



// Bygger en korrekt liste av scener
function buildListOfConcerts(bruker,list) {
    let listContainer = $("<ul></ul>").addClass("concertlist");
    for (let i in list) {
        let listPoint = $("<li></li>");
        let concertInfo = $("<div></div>").addClass("button_text").text(' ' + list[i].navn +' | ' + list[i].dato +  ' | ' + list[i].start_tid + " - " + list[i].slutt_tid);
        let concertButton = $("<button></button>").addClass("concert_button").text("Mer info");
        listPoint.append(concertInfo, concertButton, getConcertInfo(bruker, list[i]));
        listContainer.append(listPoint);
    }
    return listContainer;
}

// Bygger HTML for tekniske behov
function getTechnicalNeedsByKid(bruker_id,kid, kname, dato, container) {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfTechnicalNeeds',
        data: {concertid: kid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Vi bygger et HTML-element
            let kid = $("<h3></h3").text('Konsert : ' + kname + " - " + dato).addClass("tb_overskrift");
            let listContainer = $("<div></div>").addClass("behov");
            listContainer.append(kid);
            if (l.length === 0) {
                listContainer.append('Ingen tekniske behov meldt enda.')
            }
            listContainer.append('<br>');
            for (i in l) {
                let tittel = $("<span></span>").text('Tittel: ').css('font-weight', 'bold');
                let tittel2 = $("<span></span><br>").text(l[i].tittel);
                let behov2 = $("<span></span><br>").text(l[i].behov);
                let behov = $("<span></span>").text('Beskrivelse: ').css('font-weight', 'bold');
                listContainer.append(tittel, tittel2, behov, behov2)
                if (bruker_id === 3) {
                    let delete_button = $("<button>Slett</button>").addClass("delete_technical_need").addClass("delete_button").val(l[i].tbid);
                    listContainer.append(delete_button);
                }
                listContainer.append('<br>');

            }
            $(container).append(listContainer);

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


// Bygger en liste over alle tilbud mottat av brukeren
function injectOffers(bruker) {
    $.ajax({ url: '/database.php?method=getOffers',
        data: {uid:bruker.id, brukertype:bruker.type},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output);

            // Registrerer y-posisjon på skjermen, vi bruker dette posisjonen for å forhindre at skjermen scrollen hvis et tilbud endres eller slettes
            ventende_tilbud = 0;
            let yoffset = window.pageYOffset;
            $("#manager_tilbud").empty();

            injectList("manager_tilbud",l,function(html_id,element){

                injectList(html_id,element,function(html_id,element){



                    // Overskrift
                    let overskrift = $("<h2></h2>");
                    let band_navn = $("<span></span>").text("Band: "+element.band_navn);
                    let scene_navn = $("<span></span>").text("Scene: "+element.scene_navn);
                    overskrift.append(band_navn," på ", scene_navn);

                    // Sender
                    //let sender = $("<p></p>");
                    let sender_navn = $("<span></span><br>").text("Sender: "+element.sender_fornavn +" "+element.sender_etternavn);
                    //sender.append(sender_navn);


                    // Tidspunkt
                    //let tidsinfo = $("<p></p>");
                    let dato = $("<span></span><br>").text("Dato: "+element.dato);
                    let start_tid = $("<span></span><br>").text("Start: "+element.start_tid);
                    let slutt_tid = $("<span></span><br>").text("Slutt: "+element.slutt_tid);
                    //tidsinfo.append(dato, start_tid, slutt_tid);


                    // Pris
                    //let prisinfo = $("<p></p>")
                    let pris = $("<span></span><br>").text("Pris: "+element.pris);
                    //prisinfo.append(pris);

                    let obj = JSON.stringify({tid:element.tid, statusflags:parseInt(element.statusflags)});

                    let buttons = $("<span></span>").addClass("manager_buttons");
                    let status_text = $("<p></p>").html(getStatusName(element.statusflags));
                    buttons.append(status_text);

                    // Bookingansvarlig skal ha muligheten til å slette ubehandlede tilbud eller tilbud som har blitt avslått
                    if (bruker.type === 4 && (element.statusflags === 0 || (element.statusflags & 2) === 2  || (element.statusflags & 8  ) === 8)) {
                        let delete_button = $("<button>Slett</button>").addClass("offer_button_delete").val(obj);
                        buttons.append(delete_button);
                    }

                    // Manager og bookingsjef skal kunne akseptere ubehandlede tilbud
                    if ((bruker.type === 3 && (element.statusflags & 1 ) === 1 && (element.statusflags & 4) === 0 )
                        || (bruker.type === 5 && element.statusflags === 0)) {
                        let accept_button = $("<button>Godta</button>").addClass("offer_button_accept").val(obj);
                        buttons.append(accept_button);

                        ventende_tilbud++;
                    }

                    // Manager og bookingsjef skal kunne avslå ubehandlede tilbud
                    if ((bruker.type === 3 && (element.statusflags & 1 ) === 1 && (element.statusflags & 4) === 0 )
                        || (bruker.type === 5 && element.statusflags === 0)) {
                        let reject_button = $("<button>Avslå</button>").addClass("offer_button_reject").val(obj);
                        buttons.append(reject_button);
                    }


                    $("#"+html_id).append(overskrift, dato, start_tid, slutt_tid, pris, sender_navn, buttons);
                    $("#"+html_id).addClass(getStatusColor(element.statusflags)).addClass("tilbud");
                    /*if (debug_mode) {
                let status = $("<span></span>").text("Status: "+element.statusflags);
                $("#"+html_id).append(status);
            }*/
                });
            });

            // Scroll skjermen til tidligere registrerte y-posisjon etter alle tilbud er lagt inn.
            window.scrollTo(0,yoffset);

            // Hvis brukeren har tilbud som må sees på så setter vi knappen til en stil som gjør at brukeren legger merke til det.
            if (ventende_tilbud > 0) {
                $(".tilbuds_notifikasjon").addClass("tilbud_attention");
            }
            else {
                $(".tilbud_attention").removeClass("tilbud_attention");
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

/*
    Bitflags status
    1 : Tilbud godkjent av bookingsjef
    2 : Tilbud avslått av bookingsjef
    4 : Tilbud godkjent av manager
    8 : Tilbud avslått av manager
    */

// Returnerer navnet på css-klasse som bestemmer sitlen til forskjellige statustyper
function getStatusColor(statusflags) {
    if ((statusflags &  2) == 2 || (statusflags & 8 ) == 8) {
        return "reject"
    }
    else if ((statusflags & 1 ) == 1 && (statusflags & 4) == 4) {
        return  "accept";
    }
    else if ((statusflags &  1) == 1 && (statusflags & 4 ) == 0) {
        return "partial-accept";
    }
    else {
        return "unknown"
    }
}

// Returnerer den tekstlige beskrivelsen til forskjellige statustyper
function getStatusName(statusflags) {
    if ((statusflags &  2) == 2 || (statusflags & 8 ) == 8) {
        return "Avslått"
    }
    else if ((statusflags & 1 ) == 1 && (statusflags & 4) == 4) {
        return  "Akseptert av <br> manager";
    }
    else if ((statusflags &  1) == 1 && (statusflags & 4 ) == 0) {
        return "Akseptert av <br> bookingsjef";
    }
    else {
        return "Avventer <br> godkjenning"
    }
}

// Returnerer hvilket bitflag som skal settes ved aksept fra bruker
function getAcceptStatusFlag(usertype) {
    if (usertype == 3) {
        return 4;
    }
    else if (usertype == 5) {
        return 1;
    }
    else {
        console.log("Usertype mismatch: "+usertype);
    }
}

// Returnerer hvilket bitflag som skal settes ved avslag fra bruker
function getRejectStatusFlag(usertype) {
    if (usertype == 3) {
        return 8;
    }
    else if (usertype == 5) {
        return 2;
    }
    else {
        console.log("Usertype mismatch: "+usertype);
    }
}

// Oppdaterer status på tilbud
function updateOfferStatus(obj) {
    $.ajax({ url: '/database.php?method=setOfferStatus',
        data: {tid:obj.tid, status:obj.statusflags},
        type: 'post',
        success: function(output) {
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

// Sletter et tilbud
function deleteOffer(obj) {
    $.ajax({ url: '/database.php?method=deleteOffer',
        data: {tid:obj.tid},
        type: 'post',
        success: function(output) {
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

// Henter informasjon om band eller konsert
function getSearchInfo(searchtype, id, container, bruker) {
    $(container).empty();

    if (searchtype === 'band' | searchtype === 'scene') {
        $.ajax({ url: '/database.php?method=getBandInfo',
            data: {bid: id},
            type: 'post',
            success: function(output) {
                l = safeJsonParse(output); //gjør en try-catch sjekk.
                let bandOverskrift = $("<h2></h2>").text(l[0][0].navn).addClass("centeredText");
                $(container).append(bandOverskrift);

                //Lager HTML-kode for nøkkelinformasjon om band
                createBandInfoHTML(l[0], container);

                // Lager HTML-kode til albuminformasjon
                if (l[2].length > 0  && searchtype === 'band') { createAlbumListHTML(l[2], container); }

                // Lager HTML-kode til tidligere konserter
                if (l[3].length > 0 && bruker.type === 4) { createOldConcertListHTML(l[3], container); }

                //Lager HTML-kode for presseomtaler
                if (l[4].length > 0 && bruker.type === 6) { createMediaReviewHTML(l[4], container); }
            },
            error: function(xmlhttprequest, textstatus, message) {
                if(textstatus==="timeout") {
                    alert("Timeout feil, kan ikke koble til databasen");

                } else {
                    console.log("Error: "+message);
                }
            }
        })}
    else {

        $.ajax({ url: '/database.php?method=getOldConcertInfo',
            data: {kid: id},
            type: 'post',
            success: function(output) {
                l = safeJsonParse(output); //gjør en try-catch sjekk.

                //Lager HTML-kode for Konserten
                createConcertInfoHTML(l[0], container);

                if (bruker.type === 4) {
                  createConcertDetailsHTML(l[0], container);
                } else if (bruker.type === 6) {
                  let bandOverskrift = $("<h3></h3>").text(l[0].bnavn).addClass("centeredText");
                  $(container).append(bandOverskrift);
                  createBandInfoHTML(l, container);
                }
            },
            error: function(xmlhttprequest, textstatus, message) {
                if(textstatus==="timeout") {
                    alert("Timeout feil, kan ikke koble til databasen");
                } else {
                    console.log("Error: "+message);
                }
            }
        })};
}

// Lager HTML-kode til bandinformasjon
function createBandInfoHTML(list, container) {
  let bandInfo = $("<div></div>").addClass("bandInfo");
  let bandInformation = $("<div></div>").addClass("nokkelinfo");
  let bandImage = $('<img class="bandImage"/>').attr('src', list[0].bilde_url.replace("\/", "/"));
  let bio = $("<span></span><br>").text("Bio: " + list[0].bio);
  let popularitet = $("<span></span><br>").text("Popularitet: " +list[0].popularitet);
  let sjanger = $("<span></span><br><br>").text("Sjanger: " + list[0].sjanger);
  let manager = $("<span></span><br>").text("Manager Informasjon").css("font-weight", "bold");
  let managerFornavn = $("<span></span><br>").text(list[0].fornavn + " " + list[0].etternavn);
  let managerEmail = $("<span></span>").text(list[0].email);
  bandInformation.append(bio, popularitet, sjanger, manager, managerFornavn, managerEmail)
  bandInfo.append(bandImage, bandInformation);
  $(container).append(bandInfo);
}

// Lager HTML-kode til albuminformasjon
function createAlbumListHTML(list, container) {

    let albumDiv = $("<div></div>").addClass("albumsalg");
    let albumOverskrift = $("<h3></h3>").text("Album").addClass("centeredText");
    let albumTable = $("<table></table>");
    let albumHeader = $("<tr></tr>");
    let albumHeaderNavn = $("<th></th>").text("Albumnavn");
    let albumHeaderAar = $("<th></th>").text("Utgivelsesår");
    let albumHeaderSalg = $("<th></th>").text("Salgtall");
    albumHeader.append(albumHeaderNavn, albumHeaderAar, albumHeaderSalg);
    albumTable.append(albumHeader);

    for (i in list) {
        let tableRow = $("<tr></tr>");
        let albumNavn = $("<td></td>").text(list[i].navn);
        let albumAar = $("<td></td>").text(list[i].utgitt_aar);
        let albumSalg = $("<td></td>").text(list[i].salgstall);
        tableRow.append(albumNavn, albumAar, albumSalg);
        albumTable.append(tableRow);
    }
    albumDiv.append(albumOverskrift, albumTable);
    $(container).append(albumDiv);
}

// Lager HTML-kode til tidligere konserter
function createOldConcertListHTML(list, container) {

      let konsertDiv = $("<div></div>").addClass("tidligereKonserter");
      let konsertOverskrift = $("<h3></h3>").text("Tidligere Konserter").addClass("centeredText");
      let konsertTable = $("<table></table>");
      let konsertHeader = $("<tr></tr>");
      let konsertHeaderNavn = $("<th></th>").text("Konsertnavn");
      let konsertHeaderLokasjon = $("<th></th>").text("Lokasjon");
      let konsertHeaderDato = $("<th></th>").text("Dato");
      let konsertHeaderTilskuere = $("<th></th>").text("Tilskuere");
      konsertHeader.append(konsertHeaderNavn, konsertHeaderLokasjon, konsertHeaderDato, konsertHeaderTilskuere);
      konsertTable.append(konsertHeader);

      for (i in list) {
          let tableRow = $("<tr></tr>");
          let konsertNavn = $("<td></td>").text(list[i].navn);
          let konsertLokasjon = $("<td></td>").text(list[i].lokasjon);
          let konsertDato = $("<td></td>").text(list[i].dato);
          let konsertTilskuere = $("<td></td>").text(list[i].tilskuere);
          tableRow.append(konsertNavn, konsertLokasjon, konsertDato, konsertTilskuere);
          konsertTable.append(tableRow);
      }
      konsertDiv.append(konsertOverskrift, konsertTable);
      $(container).append(konsertDiv);
}

//Lager HTML-kode for Presseomtaler
function createMediaReviewHTML(list, container) {
    let omtaleDiv = $("<div></div>").addClass("bandOmtale");
    let omtaleOverskrift = $("<h3></h3>").text("Presseomtaler").addClass("centeredText");
    omtaleDiv.append(omtaleOverskrift);

    for (i in list) {
      let link = $("<a target='_blank'></a><br>").attr('href', list[i].link).text(list[i].link);
      omtaleDiv.append(link);
    }
    $(container).append(omtaleDiv);
}

// Lager HTML-kode for en konsert
function createConcertInfoHTML(list, container) {
  let konsertOverskrift = $("<h2></h2>").text(list.knavn).addClass("centeredText");
  let konsertInfo = $("<div></div>").addClass("keyConcertInfo");
  let konsertDato = $("<span></span><br>").text("Dato: " + list.dato);
  let konsertStartTid = $("<span></span><br>").text("Start-tid: " + list.start_tid);
  let konsertSluttTid = $("<span></span><br>").text("Slutt-tid: " + list.slutt_tid);
  let konsertBand = $("<span></span><br>").text("Artist: " + list.bnavn);
  let konsertSjanger = $("<span></span><br>").text("Sjanger: " + list.sjanger);
  let konsertScene = $("<span></span><br>").text("Scene: " + list.navn);
  konsertInfo.append(konsertBand, konsertSjanger, konsertDato, konsertStartTid, konsertSluttTid, konsertScene);
  $(container).append(konsertOverskrift, konsertInfo);
}

// Lager HTML-kode for konsert-detaljer med økonomisk resultat
function createConcertDetailsHTML(list, container) {
  let konsertDetaljerOverskrift = $("<h4></h4>").text("Detaljer");
  let konsertDetaljer = $("<div></div>").addClass("concertDetails");
  let konsertTilskuere = $("<span></span><br>").text("Antall tilskuere: " + list.tilskuere);
  let konsertMaks = $("<span></span><br>").text("Maksimalt antall plasser på scene: " + list.maks_plasser);
  let konsertLedigePlasser = $("<span></span><br>").text("Antall ledige plasser under konsert: " + (list.maks_plasser - list.tilskuere));
  let konsertInntekt = $("<span></span><br>").text("Inntekter fra billettsalg: " + (list.billettpris * list.tilskuere));
  let konsertOverskudd = $("<span></span><br>").text("Økonomisk gevinst: " + ((list.billettpris * list.tilskuere) - list.kostnad));
  let konsertKostnad = $("<span></span><br>").text("Kostnad for band: " + list.kostnad);
  let konsertPris = $("<span></span><br>").text("Billettpris: " + list.billettpris);
  konsertDetaljer.append(konsertDetaljerOverskrift, konsertMaks, konsertTilskuere, konsertLedigePlasser, konsertKostnad, konsertPris, konsertInntekt, konsertOverskudd);
  $(container).append(konsertDetaljer);
}
