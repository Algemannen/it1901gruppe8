var manager_kid;

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
            let is_checked_string = "";
            if (element.kid === manager_kid) {
                is_checked_string = "checked";
            }
            let checkbox = $("<input "+is_checked_string+"/>").attr("id","checkbox_"+html_id).attr("type","radio").attr("name","concert_check").attr("value",element.kid).addClass("manager_radio");
            $("#"+html_id).append(checkbox);
            getTechnicalNeedsByKid(element.kid, element.navn, element.dato, "#"+html_id);
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

function registerConcertNeed(kid,title,desc) {

    $.ajax({ url: '/database.php?method=insertTechnicalNeeds',
    data: {concertid:kid, behov:desc, tittel:title},
    type: 'post',
    success: function(output) {
            console.log("Database insert: "+kid+", "+title+", "+desc);
            $("#komplett_liste_over_tekniske_behov").empty();
            injectListOfAllNeeds();

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