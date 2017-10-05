function getListOfTechnicalNeeds(kid) {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfTechnicalNeeds',
        data: {concertid: kid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Vi bygger et HTML-element
            let kid = $("<h2></h2").text('Konsert :' + l[0].kid);
            let listContainer = $("<ul></ul>").addClass("behov");
            for (i in l) {
                let tittel = $("<li></li>").text('Tittel :');
                let tittel2 = $("<ul><li></li></ul>").text(l[i].tittel);
                let behov2 = $("<ul><li></li></ul>").text(l[i].behov);
                let behov = $("<li></li>").text('Beskrivelse :');
                listContainer.append(tittel, tittel2, behov, behov2, '<hr>');
            }
            $('#tekniskebehov').append(kid,listContainer);

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

// Lager et html-element med konserter
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
