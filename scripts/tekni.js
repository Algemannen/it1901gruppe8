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
                let tittel = $("<li></li>").text('Tittel :' + l[i].tittel);
                let behov = $("<li></li>").text('Beskrivelse :' + l[i].behov);
                listContainer.append(tittel,behov, '<hr>');
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
