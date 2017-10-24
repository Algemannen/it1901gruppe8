
let defaultcolor = 'rgba(255,255,255,0.4)'
let selectedcolor = 'rgba(0,0,0,0.4)'

function bookingfane(index) {
    if (index=="0") {
        $("#tekniskebehov").show();
        $("#tekniskebehov_knapp").css("background",selectedcolor);

        $("#sok").hide();
        $("#sok_knapp").css("background",defaultcolor);

        $("#bookingtilbud").hide();
        $("#bookingtilbud").css("background",defaultcolor);
    }
    else if (index == "1") {
        $("#sok").show();
        $("#sok_knapp").css("background",selectedcolor);

        $("#tekniskebehov").hide();
        $("#tekniskebehov_knapp").css("background",defaultcolor);

        $("#bookingtilbud").hide();
        $("#bookingtilbud").css("background",defaultcolor);
    }
    else if (index == "2") {
        $("#bookingtilbud").show();
        $("#bookingtilbud").css("background",selectedcolor);

        $("#tekniskebehov").hide();
        $("#tekniskebehov_knapp").css("background",defaultcolor);

        $("#sok").hide();
        $("#sok_knapp").css("background",defaultcolor);

    }
}

function getListOfTechnicalNeeds(bruker) {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfConcertesByFestival',
        data: {fid: current_fid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
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


function search() { //search funksjon for bookingansvarlig
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
            for (i in l) {
              let tableRow = $("<tr></tr>");
              let obj = [searchType, l[i].id];
              let tableElementNavn = $("<td></td>").text(l[i].navn).addClass("bookingnavnsok").val(obj);
              tableRow.append(tableElementNavn);
              table.append(tableRow);
              $("#resultlist").append(table);
            }} else {
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

// Henter informasjon om band eller konsert
function getSearchInfo(searchtype, id) {
  let bandInfo = $("<div></div>").addClass("bandInfo");
  $("#informationlist").empty();

  if (searchtype === 'band' | searchtype === 'scene') {
    $.ajax({ url: '/database.php?method=getBandInfo',
        data: {bid: id},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            let bandOverskrift = $("<h3></h3>").text(l[0][0].navn);

            // Lager HTML-kode til bandinformasjon
            let bandInformation = $("<div></div>").addClass("nokkelinfo");
            let bandImage = $('<img class="bandImage"/>').attr('src', l[0][0].bilde_url.replace("\/", "/"));
            let bio = $("<span></span><br>").text("Bio: " + l[0][0].bio);
            let popularitet = $("<span></span><br>").text("Popularitet: " +l[0][0].popularitet);
            let sjanger = $("<span></span><br><br>").text("Sjanger: " + l[0][0].sjanger);
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
              let konsertOverskrift = $("<h3></h3>").text(l[0].knavn);
              let konsertInfo = $("<div></div>").addClass("keyConcertInfo");
              let konsertDato = $("<span></span><br>").text("Gjennomført dato: " + l[0].dato);
              let konsertStartTid = $("<span></span><br>").text("Konserten Startet: " + l[0].start_tid);
              let konsertSluttTid = $("<span></span><br>").text("Konserten avsluttet: " + l[0].slutt_tid);
              let konsertBand = $("<span></span><br>").text("Spilt av: " + l[0].bnavn);
              let konsertSjanger = $("<span></span><br>").text("Sjanger: " + l[0].sjanger);
              let konsertScene = $("<span></span><br>").text("Spilt på scene: " + l[0].navn);
              let konsertDetaljerOverskrift = $("<h4></h4>").text("Detaljer");
              let konsertDetaljer = $("<div></div>").addClass("concertDetails");
              let konsertTilskuere = $("<span></span><br>").text("Antall tilskuere: " + l[0].tilskuere);
              let konsertMaks = $("<span></span><br>").text("Maksimalt antall plasser på scene: " + l[0].maks_plasser);
              let konsertLedigePlasser = $("<span></span><br>").text("Antall ledige plasser under konsert: " + (l[0].maks_plasser - l[0].tilskuere));
              let konsertInntekt = $("<span></span><br>").text("Inntekter fra billettsalg: " + (l[0].billettpris * l[0].tilskuere));
              let konsertOverskudd = $("<span></span><br>").text("Økonomisk gevinst: " + ((l[0].billettpris * l[0].tilskuere) - l[0].kostnad));
              let konsertKostnad = $("<span></span><br>").text("Kostnad for band: " + l[0].kostnad);
              let konsertPris = $("<span></span><br>").text("Billettpris: " + l[0].billettpris);
              konsertDetaljer.append(konsertDetaljerOverskrift, konsertMaks, konsertTilskuere, konsertLedigePlasser, konsertKostnad, konsertPris, konsertInntekt, konsertOverskudd);
              konsertInfo.append(konsertBand, konsertSjanger, konsertDato, konsertStartTid, konsertSluttTid, konsertScene);
              $("#informationlist").append(konsertOverskrift, konsertInfo, konsertDetaljer);
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


function getListOfBandsAndScenes(){
  let l = [];

  $.ajax({ url: '/database.php?method=getListOfBandsAndScenes',
      data: {},
      type: 'post',
      success: function(output) {
          l = safeJsonParse(output); //gjør en try-catch sjekk.
          for (i in l[0]){
            let bandOption = $("<option></option>").text(l[0][i].navn).attr('value', l[0][i].bid);
            $("#bandSelect").append(bandOption);
          }
          for (i in l[1]){
            let sceneOption = $("<option></option>").text(l[1][i].navn).attr('value', l[1][i].sid);
            $("#sceneSelect").append(sceneOption);
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

function sendOffer(dato, starttid, sluttid, beløp, scene, band, bruker){
  console.log(dato, starttid, sluttid, beløp, scene, band, bruker.id);

  $.ajax({ url: '/database.php?method=insertOffer',
      data: {dato: dato, start_tid: starttid, slutt_tid: sluttid, pris: beløp, sid: scene, bid: band, sender_uid: bruker.id},
      type: 'post',
      success: function(output) {
        alert("Tilbudet er sendt.");
        resetOfferData();
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

function resetOfferData(){
  $("#tilbudDato").val('');
  $("#tilbudStarttid").val('');
  $("#tilbudSluttid").val('');
  $("#tilbudBeløp").val('');
}
