function bookingsjeffane(index) {  //Visning og skjuling av divs for å vise korrekt info for fanesystemet
    if (index=="0") { //Viser den økonomiske rapporten
        $("#listofscenes").show();
        $("#ecorapport_knapp").css("background",selectedcolor);

        $("#prisgenerering").hide();
        $("#manager_tilbud").hide();
        $("#kalender").hide();
        $("#kalender_knapp").css("background",defaultcolor);
        $("#prisgen_knapp").css("background",defaultcolor);
        $("#tilbud_knapp").css("background",defaultcolor);
    }
    else if (index == "1") { // Viser prisgenereringen
        $("#prisgenerering").show();
        $("#prisgen_knapp").css("background",selectedcolor);

        $("#listofscenes").hide();
        $("#manager_tilbud").hide();
        $("#kalender").hide();
        $("#kalender_knapp").css("background",defaultcolor);
        $("#ecorapport_knapp").css("background",defaultcolor);
        $("#tilbud_knapp").css("background",defaultcolor);
    }
    else if (index == "2") { //Viser tilbud mottat fra Booking Ansvarlig
        $("#manager_tilbud").show();
        $("#tilbud_knapp").css("background",selectedcolor);

        $("#listofscenes").hide();
        $("#prisgenerering").hide();
        $("#kalender").hide();
        $("#kalender_knapp").css("background",defaultcolor);
        $("#ecorapport_knapp").css("background",defaultcolor);
        $("#prisgen_knapp").css("background",defaultcolor);
    }
    else if (index == "3") { //Viser kalender for ledige tidspunkt for konserter.
        $("#kalender").show();
        $("#kalender_knapp").css("background",selectedcolor);

        $("#listofscenes").hide();
        $("#prisgenerering").hide();
        $("#manager_tilbud").hide();
        $("#tilbud_knapp").css("background", defaultcolor);
        $("#ecorapport_knapp").css("background",defaultcolor);
        $("#prisgen_knapp").css("background",defaultcolor);
    }
}

function getListOfScenesForBookingSjef(bruker) { //Starter oppbygging av hele den økonomiske rapporten. Henter scenelistene.

    l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: bruker.name, usertype: bruker.type},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            let overskrift = $("<h2></h2>").text('Økonomisk rapport').addClass('brukeroverskrift');
            let BSscenelist = $("<div></div>").attr('id', 'listofscenes').addClass('listofscenesForCalender')
            $('#divBS').append(BSscenelist);
            let container = $("<div></div>").addClass("scenelist");
            $('#listofscenes').append(overskrift, container);

            for (i in l) {
                let scenediv = $("<ul></ul>").addClass("scene"+l[i].sid);
                $('.scenelist').append(scenediv);
                getListOfConcertesBySceneForBookingSjef(bruker,l[i])
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
function getListOfConcertesBySceneForBookingSjef(bruker, scene) { //Bygger scenene til den økonomiske rapporten
    $.ajax({ url: '/database.php?method=getListOfConcertsByScene',
        data: {username: bruker.name, usertype: bruker.type, sceneid: scene.sid, fid:current_fid},
        type: 'post',
        success: function(output) {

            let l = safeJsonParse(output); //gjør en try-catch sjekk.

            let scenePoint = $("<li></li>").addClass("scenePoint");
            let concerts = buildListOfConcerts(bruker,l,scene.sid); //Bygger konsertene. Common.js funksjon.
            let sceneHead = $("<li></li>").text(scene.navn);
            let sceneInfo = $("<li></li>").text("Maks plasser: " + scene.maks_plasser);

            scenePoint.append(concerts);

            $('.scene'+scene.sid).append(sceneHead,sceneInfo,scenePoint);

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

function BSbuildConcertReport(kid, sname, container){ //Setter inn inforasjon i økonomisk rapport til bookingsjef

  $.ajax({ url: '/database.php?method=getConcertReport',
      data: {cid : kid , fid:current_fid},
      type: 'post',
      success: function(output) {

          l = safeJsonParse(output); //gjør en try-catch sjekk.
          // Vi bygger et HTML-element
          let listContainer = $("<div></div>").addClass("concertReportContainer");
          listContainer.append('<br>');
          for (i in l) {

              let kostnad = $("<span></span><br>").text('Kostnad: ' + l[i].kostnad);
              let billettpris = $("<span></span><br>").text('Billettpris: ' + l[i].billettpris );
              let EcResult = $("<span></span><br>").text('Økonomisk resultat: ' + ((l[i].billettpris * l[i].tilskuere) - l[i].kostnad));
              let inntekt = $("<span></span><br>").text('Inntekt: ' + l[i].billettpris * l[i].tilskuere)
              if(!(l[i].billettpris)){
                billettpris =  $("<span></span><br>").text('Billettpris: Utilgjengelig');
                EcResult = $("<span></span><br>").text('Økonomisk resultat: Utilgjengelig');
                inntekt = $("<span></span><br>").text('Inntekt: Utilgjengelig');
              }
              let tilskuere = $("<span></span><br>").text('Tilskuere: ' + l[i].tilskuere);
              if(!(l[i].tilskuere)){
                tilskuere = $("<span></span><br>").text('Tilskuere: Utilgjengelig');
                EcResult = $("<span></span><br>").text('Økonomisk resultat: Utilgjengelig');
                inntekt = $("<span></span><br>").text('Inntekt: Utilgjengelig');
              }
              listContainer.append(kostnad, billettpris, tilskuere, inntekt,  EcResult, '<br>');
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


function concertPricing(){ //Setter opp prisgenereringsiden til bookingansvarlig
  let l = [];

  $.ajax({ url: '/database.php?method=getConcertPricingInfo',
  data: {},
  type: 'post',
  success: function(output) {
    l = safeJsonParse(output);
    let container = $("<div></div>").attr('id', 'prisgenerering');
    let overskrift = $("<h2></h2>").text("Prisgenerering");
    container.append(overskrift);
    for (i in l){
      let konsertDiv = $("<div></div>");
      let konsertHeader = $("<h4></h4>").text(l[i].knavn);
      let konsertBand = $("<span></span><br>").text("Band: " + l[i].bnavn);
      let konsertKostnad = $("<span></span><br>").text("Kostnad for band: " + l[i].kostnad);
      let konsertScene = $("<span></span><br>").text("Scene: " + l[i].navn);
      let konsertPlasser = $("<span></span><br>").text("Maksplasser på scene: " + l[i].maks_plasser);
      let prisForslag = Math.ceil(l[i].kostnad*5 / l[i].maks_plasser);
      let konsertPris = $("<span></span><br>").text("Prisforslag: " + prisForslag);
      konsertDiv.append(konsertHeader, konsertBand, konsertKostnad, konsertScene, konsertPlasser, konsertPris);
      container.append(konsertDiv);
    }
    $("#divBS").append(container);
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

function createListOfConcertDays(){ //Bygger en liste for dager i konserten.

    $.ajax({ url: '/database.php?method=getListOfConcertDays',
        data: {fid: current_fid},
        type: 'post',
        success: function(output) {
            let l = safeJsonParse(output);
            console.log(l);

            let startdate = l.startDag;
            let sluttdate = l.sluttDag;


            let dateArray = [];
            let date = new Date(startdate);
            let e = new Date(sluttdate);
            date.setDate(date.getDate()-1);

            while(date < e) {
              dateArray.push(date);
              date = new Date(date.setDate(date.getDate() + 1));
            }


            let headline = $("<h2></h2>").text('Kalender').addClass('brukeroverskrift');
            let calscenelist = $("<div></div>").attr('id', 'kalender')
            $('#divBS').append(calscenelist);
            let calcontainer = $("<div></div").addClass("calscenes")

            for(let i = 0; i < dateArray.length; i++){
                let concertButton = $("<button></button>").addClass("concert_button").addClass("calenderButton").text("Mer info");
                let calenderText = dateArray[i].toString();
                let calenderText2 = calenderText.substr(0,16);
                let calenderID = dateArray[i].yyyymmdd();
                let mainCalenderHeadline = $('<div></div>');
                let headlineStatus = $('<div></div>').text("Denne datoen er ledig").attr('id', 'Status' + calenderID).addClass('headlineStatus');
                let calenderHeadline = $('<div></div>').text(calenderText2).addClass('calenderHeadline');
                mainCalenderHeadline.append(calenderHeadline, headlineStatus);
                let standardTextForCalender = $('<p></p>').text("Denne datoen er ledig").attr('id','Standard'+calenderID);
                let temp = $('<div></div>').attr('id',calenderID).addClass('datoliste').addClass('concertInfo').css('display', 'none');
                let calenderItemsDiv = $('<div></div>').addClass('calenderItemsDiv');
                temp.append(standardTextForCalender);
                calenderItemsDiv.append(mainCalenderHeadline, concertButton, temp);
                $(calcontainer).append(calenderItemsDiv);
            }
            getConcertsForCalender();
            getOffersForCalender();
            $('#kalender').append(headline, calcontainer);


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

Date.prototype.yyyymmdd = function() {  //Hentet fra https://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

function getConcertsForCalender(){
    let l = [];

    $.ajax({ url: '/database.php?method=getConcertsForCalender',
        data: {},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output);
            for(i in l){
                let element = document.getElementById(new Date(l[i].dato).yyyymmdd());
                if(element){
                    let standardID = '#Standard' +new Date(l[i].dato).yyyymmdd() ;
                    $(standardID).css('display','none');
                    let statusID = '#Status' +new Date(l[i].dato).yyyymmdd() ;
                    $(statusID).css('display','none')
                    let concertCalenderDiv = $('<div></div>').addClass('CalenderDiv').css('border', '1px solid #565656').css('width', '95%').css('background-color', 'rgba(86,86,86,0.3)');
                    let concertCalenderName = $('<p></p>').text('Bekreftet konsert | ' + l[i].navn + ' | ' + l[i].knavn);
                    let concertCalenderTime = $('<p></p>').text(l[i].start_tid + ' - ' + l[i].slutt_tid );
                    let concertCalenderSjanger = $('<p></p>').text(l[i].sjanger);
                    let concertCalenderScene = $('<p></p>').text(l[i].snavn);
                    let concertCalenderEconomics = $('<p></p>').text('Kostnad: ' + l[i].kostnad + ' | Tilskuere: ' + l[i].tilskuere + ' | Billettpris: ' + l[i].billettpris);
                    if(!(l[i].billettpris)){
                        concertCalenderEconomics = $('<p></p>').text('Kostnad: ' + l[i].kostnad + ' | Tilskuere: ' + l[i].tilskuere + ' | Billettpris: Ikke tilgjengelig');
                    }
                    if(!(l[i].kostnad)){
                        concertCalenderEconomics = $('<p></p>').text('Kostnad: Ikke tilgjengelig' + ' | Tilskuere: ' + l[i].tilskuere + ' | Billettpris: ' + l[i].billettpris);
                    }
                    if(!(l[i].tilskuere)){
                        concertCalenderEconomics = $('<p></p>').text('Kostnad: ' + l[i].kostnad + ' | Tilskuere: Ikke tilgjengelig'  + ' | Billettpris: ' + l[i].billettpris);
                    }
                    if(!(l[i].billettpris) && !(l[i].kostnad)){
                        concertCalenderEconomics = $('<p></p>').text('Kostnad: Ikke tilgjengelig' + ' | Tilskuere: ' + l[i].tilskuere + ' | Billettpris: Ikke tilgjengelig');
                    }
                    if(!(l[i].billettpris) && !(l[i].tilskuere)){
                        concertCalenderEconomics = $('<p></p>').text('Kostnad: ' + l[i].kostnad + ' | Tilskuere: Ikke tilgjengelig' + ' | Billettpris: Ikke tilgjengelig');
                    }
                    if(!(l[i].tilskuere) && !(l[i].kostnad)){
                        concertCalenderEconomics = $('<p></p>').text('Kostnad: Ikke tilgjengelig' + ' | Tilskuere: Ikke tilgjengelig' + ' | Billettpris: ' + l[i].billettpris);
                    }
                    if(!(l[i].tilskuere) && !(l[i].kostnad) && !(l[i].billettpris)){
                        concertCalenderEconomics = $('<p></p>').text('Kostnad: Ikke tilgjengelig' + ' | Tilskuere: Ikke tilgjengelig' + ' | Billettpris: Ikke tilgjengelig');
                    }


                    $(concertCalenderDiv).append(concertCalenderName, concertCalenderScene,concertCalenderTime, concertCalenderSjanger, concertCalenderEconomics);
                    let dateID = '#' +new Date(l[i].dato).yyyymmdd() ;
                    $(dateID).append(concertCalenderDiv);
                }
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

function getOffersForCalender() {
    let l = [];

    $.ajax({ url: '/database.php?method=getOffersForCalender',
        data: {},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output);
            console.log(l);
            for(i in l){
                let element = document.getElementById(new Date(l[i].dato).yyyymmdd());
                if(element){
                    let offerCalenderStatusMessage;

                    switch(l[i].status){
                        case 0:
                            offerCalenderStatusMessage = $('<p></p>').text('Tilbud | ' + l[i].navn + ' | Sendt fra Bookingansvarlig').css('border', '1px solid #FFFF00').css('width', '95%').css('background-color', 'rgba(255,255,0,0.15');
                            break;
                        case 1:
                            offerCalenderStatusMessage = $('<p></p>').text('Tilbud |' + l[i].navn + ' | Venter på svar fra manager').css('border', '1px solid #FFFF00').css('width', '95%').css('background-color', 'rgba(255,255,0,0.15');
                            break;
                        case 2:
                            offerCalenderStatusMessage = $('<p></p>').text('Tilbud | ' +l[i].navn + ' | Godkjent av manager').css('border', '1px solid #21b000').css('width', '95%').css('background-color', 'rgba(33,176,0,0.15)');
                            break;
                    }
                    let standardID = '#Standard' +new Date(l[i].dato).yyyymmdd() ;
                    $(standardID).css('display','none');
                    let statusID = '#Status' +new Date(l[i].dato).yyyymmdd() ;
                    $(statusID).css('display','none');
                    let offerCalenderDiv = $('<div></div>').addClass('CalenderDiv').addClass('concertInfo');
                    let offerCalenderTime = $('<p></p>').text(l[i].start_tid + ' - ' + l[i].slutt_tid );
                    let offerCalenderScene = $('<p></p>').text(l[i].snavn);
                    $(offerCalenderStatusMessage).append(offerCalenderScene,offerCalenderTime);
                    $(offerCalenderDiv).append(offerCalenderStatusMessage);
                    let dateID = '#' +new Date(l[i].dato).yyyymmdd() ;
                    $(dateID).append(offerCalenderDiv);
                }
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
