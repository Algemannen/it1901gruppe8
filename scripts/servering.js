/*

Javascript-funksjonalitet for serveringsansvarlig

*/


// getListOfScenesS

function setupServering(bruker) {

    l = [];

    $.ajax({ url: '/database.php?method=getListOfScenes',
        data: {username: bruker.name, usertype: bruker.type},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            let container = $("<div></div>").addClass("scenelist");
            $('#listofscenes').append(container);

            for (i in l) {
                let scenediv = $("<ul></ul>").addClass("scene"+l[i].sid);
                $('.scenelist').append(scenediv);
                getListOfConcertesBySceneS(bruker,l[i])
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
function getListOfConcertesBySceneS(bruker, scene) {
    $.ajax({ url: '/database.php?method=serveringInfo',
        data: {username: bruker.name, usertype: bruker.type, sceneid: scene.sid, fid:current_fid},
        type: 'post',
        success: function(output) {

            let l = safeJsonParse(output); //gjør en try-catch sjekk.

            let scenePoint = $("<li></li>").addClass("scenePoint");
            let concerts = buildListOfConcertsS(l,scene);
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

function buildListOfConcertsS(list,scene) {
    let listContainer = $("<ul></ul>").addClass("concertlist");
    for (i in list) {
        let listPoint = $("<li></li>");
        let concertInfo = $("<p></p>").text(' ' + list[i].knavn +' | ' +
            list[i].dato +  ' | ' + list[i].start_tid + " - " + list[i].slutt_tid);
        let sjangerServ = $("<p></p>").text('Sjanger: ' + list[i].sjanger).css("margin", 0);
        let forventetPub = $("<p></p>").text('Forventet publikum: ' + list[i].tilskuere).css("margin", 0)
         if(!(list[i].tilskuere)){
                    forventetPub =  $("<span></span><br>").text('Forventet publikum: Ikke beregnet');
                }
        listPoint.append(concertInfo);
        listPoint.append(sjangerServ);
        listPoint.append(forventetPub);

        let p = calculatePurchase(scene.maks_plasser);
        for (let key in p) {
            listPoint.append($("<p></p>").text(key + ": " + p[key]).css("margin", 0));
        }
        listContainer.append(listPoint);
    }
    return listContainer;
}


function calculatePurchase(seats) {
    let sodarate = 0.1;
    let beerrate = 0.7;

    let retval = {
        "Anbefalt antall brus": seats*sodarate,
        "Anbefalt antall øl": seats*beerrate
    };
    return retval;
}
