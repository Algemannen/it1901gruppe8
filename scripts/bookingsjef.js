function getConcertReport(bruker){

    let l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
    data: {username:bruker.navn, usertype:bruker.type, sceneid: scene.sid, fid:current_fid},
    type: 'post',
    success: function(output) {
      l = safeJsonParse(output);
      let sceneList = $("<li></li>").addClass("sceneList");
      let concerts = buildListOfConcerts(bruker,l);
      let sceneHead = $("<li></li>").text(scene.navn);

      scenePoint.append(concerts);

      $('booksjefDIV').append(sceneHead,sceneList);
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
