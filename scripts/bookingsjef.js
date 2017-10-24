
var current_fid = 1;

function getListOfScenesForBookingSjef(bruker) {

    l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: bruker.name, usertype: bruker.type},
        type: 'post',
        success: function(output) {
            console.log(output);
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            let container = $("<div></div>").addClass("scenelistforBS");
            $('#listofscenesforBS').append(container);

            for (i in l) {
                let scenediv = $("<ul></ul>").addClass("scene"+l[i].sid);
                $('.scenelistforBS').append(scenediv);
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

            let scenePoint = $("<li></li>").addClass("scenePointforBS");
            let concerts = BSbuildListOfConcerts(bruker,l,scene.sid);
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

function BSbuildListOfConcerts(bruker,list) {
    let listContainer = $("<ul></ul>").addClass("concertlist");
    for (i in list) {
        let listPoint = $("<li></li>");
        let concertInfo = $("<div></div>").addClass("button_text").text(' ' + list[i].navn +' | ' + list[i].dato +  ' | ' + list[i].start_tid + " - " + list[i].slutt_tid);
        let concertButton = $("<button></button>").addClass("concert_button").text("Mer info");
        listPoint.append(concertInfo, concertButton, BSgetConcertInfo(bruker, list[i]));
        listContainer.append(listPoint);
    }
    return listContainer;
}

function BSgetConcertInfo(bruker, concert ) {

    // Vi bygger et HTML-element
    let container = $("<div></div>").text(" ").addClass("concertInfo").attr('id', 'cid' + concert.kid);

    let concertReportDiv = $("<div></div>").addClass("EcReport");
    let cost_report = $("<h3></h3>").text("Økonomisk rapport:");
    concertReportDiv.append(cost_report);
    BSbuildConcertReport(concert.kid, concert.navn, concertReportDiv);
    container.append(concertReportDiv);

    container.hide();
    return container;
}

function BSbuildConcertReport(kid, sname, container){

  $.ajax({ url: '/database.php?method=getConcertReport',
      data: {cid : kid , fid:current_fid},
      type: 'post',
      success: function(output) {

          l = safeJsonParse(output); //gjør en try-catch sjekk.
          console.log(l);
          // Vi bygger et HTML-element
          let listContainer = $("<div></div>").addClass("concertReportContainer");
          listContainer.append('<br>');
          for (i in l) {
              let tittel = $("<span></span>").text('Tittel: ').css('font-weight', 'bold');
              let kostnad = $("<span></span><br>").text('Kostnad: ' + l[i].kostnad);
              let billettpris = $("<span></span><br>").text('billettpris: ' + l[i].billettpris );
              let tilskuere = $("<span></span>").text('Tilskuere: ' + l[i].tilskuere);
              listContainer.append(tittel, kostnad, billettpris, tilskuere, '<br>');
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
