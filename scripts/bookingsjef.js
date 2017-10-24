
var current_fid = 1;

function getListOfScenesForBookingSjef(bruker) {

    l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: bruker.name, usertype: bruker.type},
        type: 'post',
        success: function(output) {
            console.log(output);
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            let container = $("<div></div>").addClass("scenelist");
            $('#listofscenes').append(container);

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


function concertPricing(){
  let l = [];

  $.ajax({ url: '/database.php?method=getConcertPricingInfo',
  data: {},
  type: 'post',
  success: function(output) {
    l = safeJsonParse(output);
    console.log(output);
    let container = $("<div></div>");
    let overskrift = $("<h3></h3>").text("Prisgenerering");
    for (i in l){
      let konsertDiv = $("<div></div>");
      let konsertHeader = $("<h4></h4>").text(l[0].knavn);
      let konsertBand = $("<span></span><br>").text("Band: " + l[0].bnavn);
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
