function addNeedsForTechs(bruker, concert, title, needs) {

    $.ajax({ url: '/database.php?method=addNeedsForTechs',
        data: {username:user.name, usertype:user.type, concertid:concert.kid, title:title, needs:needs},
        type: 'post',
        success: function(output) {
            console.log(output);


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

function injectListOfAllNeeds() {
    $.ajax({ url: '/database.php?method=getListOfConcertesByFestival',
    data: {fid:1},
    type: 'post',
    success: function(output) {
        l = safeJsonParse(output)
        injectList("komplett_liste_over_tekniske_behov",l,function(html_id,element){
            let container = $("<span></span>").text("Tekniske behov for: "+element.navn+" den "+element.dato + " på scene " + element.snavn);
            $("#"+html_id).append(container);
        });


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