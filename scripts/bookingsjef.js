/*

Javascript-funksjonalitet for bookingsjef-bruker

*/

function bookingsjeffane(index) {
    if (index=="0") {
        $("#listofscenes").show();
        $("#ecorapport_knapp").css("background",selectedcolor);

        $("#prisgenerering").hide();
        $("#manager_tilbud").hide();
        $("#prisgen_knapp").css("background",defaultcolor);
        $("#tilbud_knapp").css("background",defaultcolor);
    }
    else if (index == "1") {
        $("#prisgenerering").show();
        $("#prisgen_knapp").css("background",selectedcolor);

        $("#listofscenes").hide();
        $("#manager_tilbud").hide();
        $("#ecorapport_knapp").css("background",defaultcolor);
        $("#tilbud_knapp").css("background",defaultcolor);
    }
    else if (index == "2") {
        $("#manager_tilbud").show();
        $("#tilbud_knapp").css("background",selectedcolor);

        $(".tilbud_attention").removeClass("tilbud_attention");

        $("#listofscenes").hide();
        $("#prisgenerering").hide();
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
            console.log(output);
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
    console.log(output);
    let container = $("<div></div>").attr('id', 'prisgenerering');
    let overskrift = $("<h2></h2>").text("Prisgenerering");
    container.append(overskrift);
    for (i in l[0]){
      let konsertDiv = $("<div></div>");
      let konsertHeader = $("<h4></h4>").text(l[0][i].knavn);
      let konsertBand = $("<span></span><br>").text("Band: " + l[0][i].bnavn);
      let konsertKostnad = $("<span></span><br>").text("Kostnad for band: " + l[0][i].kostnad);

      let prisForslagByscenen = Math.ceil(l[0][i].kostnad*5 / l[1][0].maks_plasser);
      let prisForslagStorsalen = Math.ceil(l[0][i].kostnad*5 / l[1][1].maks_plasser);
      let prisForslagAmfiet = Math.ceil(l[0][i].kostnad*5 / l[1][2].maks_plasser);
      let konsertPrisByscenen = $("<span></span><br>").text("Prisforslag Byscenen: " + prisForslagByscenen);
      let konsertPrisStorsalen = $("<span></span><br>").text("Prisforslag Storsalen: " + prisForslagStorsalen);
      let konsertPrisAmfiet = $("<span></span><br>").text("Prisforslag Amfiet: " + prisForslagAmfiet);
      konsertDiv.append(konsertHeader, konsertBand, konsertKostnad, konsertPrisByscenen, konsertPrisStorsalen, konsertPrisAmfiet);
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
