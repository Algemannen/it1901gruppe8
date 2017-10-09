function getListOfTechnicalNeeds() {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfConcertesByFestival',
        data: {fid: current_fid},
        type: 'post',
        success: function(output) {
            console.log(output);
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            for (i in l) {
              getTechnicalNeedsByKid(l[i].kid, l[i].navn, l[i].dato);
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

function getTechnicalNeedsByKid(kid, kname, dato) {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfTechnicalNeeds',
        data: {concertid: kid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Vi bygger et HTML-element
            let kid = $("<h3></h3").text('Konsert : ' + kname + " - " + dato);
            let listContainer = $("<ul></ul>").addClass("behov");
            if (l.length === 0) {
              listContainer.append('Ingen tekniske behov meldt enda.')
            }
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
