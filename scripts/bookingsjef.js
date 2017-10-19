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
