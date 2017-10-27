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
            let BSscenelist = $("<div></div>").attr('id', 'listofscenes')
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
function buildScenesForCal(bruker){ //Lager scener til bruk av calender siden
    l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: bruker.name, usertype: bruker.type},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            /*let headline = $("<h2></h2>").text('Kalender').addClass('brukeroverskrift');
            let calscenelist = $("<div></div>").attr('id', 'kalender')
            $('#divBS').append(calscenelist);
            let calcontainer = $("<div></div").addClass("calscenes");
            $('#kalender').append(headline, calcontainer);*/
            createListOfConcertDays()



            /*for (i in l) {
                let calscenediv = $("<ul></ul>").addClass("calscene"+l[i].sid);
                $('.calscenes').append(calscenediv);
                let calsceneHead = $("<li></li>").text(l[i].navn);
                let calsceneInfo = $("<li></li>").text("Maks plasser: " + l[i].maks_plasser);

                //let calinfo = buildCalendar();

                $('.calscene'+l[i].sid).append(calsceneHead,calsceneInfo,'calinfo');
            }*/

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

            let dateArray = new Array();
<<<<<<< HEAD
            let currentDate = parseDate(l.startDag);
            let sluttDate = parseDate(l.sluttDag);

            while(currentDate <= sluttDate){
                dateArray.push(new Date(currentDate));
                currentDate = currentDate.addDays(1);
            }

            let headline = $("<h2></h2>").text('Kalender').addClass('brukeroverskrift');
            let calscenelist = $("<div></div>").attr('id', 'kalender')
            $('#divBS').append(calscenelist);
            let calcontainer = $("<div></div").addClass("calscenes");

            for(let i = 0; i < dateArray.length; i++){
                $(calcontainer).append($("<li></li>").text(dateArray[i]).attr('id','dato'+i).addClass('datoliste'));
            }
            $('#kalender').append(headline, calcontainer);
=======
            let startdate = l.startDag;
            console.log(startdate);
            let sluttdate = l.sluttDag;
            console.log(sluttdate);

            let list = [];
            let date = new Date(startdate);
            let e = new Date(sluttdate);
            date.setDate(date.getDate()-1);
            
            while(date < e) {
              list.push(date);
              date = new Date(date.setDate(date.getDate() + 1));
          }
          console.log(list);


>>>>>>> 1e2e05570ac5366184feaffea8a56f7229d7a60b
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

function parseDate(date){ // Hentet fra https://stackoverflow.com/questions/2627650/why-javascript-gettime-is-not-a-function
    var parts = date.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]);
}

Date.prototype.addDays = function(days) { //Hentet fra https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
/*
function buildCalendar(dato){
    l = [];

    $.ajax({ url: '',
        data: {},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.


        },
        error: function(xmlhttprequest, textstatus, message) {
            if(textstatus==="timeout") {
                alert("Timeout feil, kan ikke koble til databasen");
            } else {
                console.log("Error: "+message);
            }
        }
    });
}*/
