function getConcertReport(bruker){

    let l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
    data: {username:bruker.navn, usertype:bruker.type, sceneid: scene.sid, fid:current_fid},
    type: 'post',
    success: function(output) {
      l = safeJsonParse(output);
      let scenePoint = $("<li></li>").addClass("scenePoint");
      let concerts = buildListOfConcerts(bruker,l);
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
