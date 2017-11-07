/*

Javascript-funksjonalitet for tekniker

*/

// Lager liste over konserter teknikeren skal jobbe med
function getListOfConcertes(bruker) {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfConcertsForTechs',
        data: {username: bruker.name, usertype: bruker.type, userid: bruker.id, fid:current_fid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            let scenePoint = $("<li></li>").addClass("scenePoint");
            let concerts = buildListOfConcerts(bruker,l);
            scenePoint.append(concerts);
            $('#listofconcerts').append(scenePoint);
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
