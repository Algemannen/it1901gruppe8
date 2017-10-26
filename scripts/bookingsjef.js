function bookingsjeffane(index) {
    if (index=="0") {
        $("#listofscenes").show();
        $("#ecorapport_knapp").css("background",selectedcolor);

        $("#prisgenerering").hide();
        $("#manager_tilbud").hide();
        $("#kalender").hide();
        $("#kalender_knapp").css("background",defaultcolor);
        $("#prisgen_knapp").css("background",defaultcolor);
        $("#tilbud_knapp").css("background",defaultcolor);
    }
    else if (index == "1") {
        $("#prisgenerering").show();
        $("#prisgen_knapp").css("background",selectedcolor);

        $("#listofscenes").hide();
        $("#manager_tilbud").hide();
        $("#kalender").hide();
        $("#kalender_knapp").css("background",defaultcolor);
        $("#ecorapport_knapp").css("background",defaultcolor);
        $("#tilbud_knapp").css("background",defaultcolor);
    }
    else if (index == "2") {
        $("#manager_tilbud").show();
        $("#tilbud_knapp").css("background",selectedcolor);

        $("#listofscenes").hide();
        $("#prisgenerering").hide();
        $("#kalender").hide();
        $("#kalender_knapp").css("background",defaultcolor);
        $("#ecorapport_knapp").css("background",defaultcolor);
        $("#prisgen_knapp").css("background",defaultcolor);
    }
    else if (index == "3") {
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

function getListOfScenesForBookingSjef(bruker) {

    l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: bruker.name, usertype: bruker.type},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            let overskrift = $("<h2></h2>").text('Scener').addClass('brukeroverskrift');
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
function getListOfConcertesBySceneForBookingSjef(bruker, scene) {
    $.ajax({ url: '/database.php?method=getListOfConcertsByScene',
        data: {username: bruker.name, usertype: bruker.type, sceneid: scene.sid, fid:current_fid},
        type: 'post',
        success: function(output) {

            let l = safeJsonParse(output); //gjør en try-catch sjekk.

            let scenePoint = $("<li></li>").addClass("scenePoint");
            let concerts = buildListOfConcerts(bruker,l,scene.sid);
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

function BSbuildConcertReport(kid, sname, container){

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


function concertPricing(){
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
function buildScenesForCal(bruker){
    l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: bruker.name, usertype: bruker.type},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            let headline = $("<h2></h2>").text('Scener').addClass('brukeroverskrift');
            let calscenelist = $("<div></div>").attr('id', 'kalender')
            $('#divBS').append(calscenelist);
            let calcontainer = $("<div></div").addClass("calscenes");

            let datefield = $("<p></p>").text("Dato: ");
            let dateinput = $("<input>").attr('id', "datepicker");
            $("datepicker").datepicker();
            datefield.append(dateinput);
            calcontainer.append(datefield);
            $('#kalender').append(headline, calcontainer);
            


            for (i in l) {
                let calscenediv = $("<ul></ul>").addClass("calscene"+l[i].sid);
                $('.calscenes').append(calscenediv);
                let calsceneHead = $("<li></li>").text(l[i].navn);
                let calsceneInfo = $("<li></li>").text("Maks plasser: " + l[i].maks_plasser);

                //let calinfo = buildCalendar();

                $('.calscene'+l[i].sid).append(calsceneHead,calsceneInfo,'calinfo');
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
function buildCalendar(sett noe input greier){
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
