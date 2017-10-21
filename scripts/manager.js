var manager_kid;
var manager_uid;

function managerfane(index) {
    if (index=="0") {
        $("#booking_behov_fane").show();
        $("#booking_behov_knapp").css("background",selectedcolor);

        $("#booking_tilbud_fane").hide();
        $("#booking_tilbud_knapp").css("background",defaultcolor);
    }
    else if (index == "1") {
        $("#booking_tilbud_fane").show();
        $("#booking_tilbud_knapp").css("background",selectedcolor);

        $("#booking_behov_fane").hide();
        $("#booking_behov_knapp").css("background",defaultcolor);
    }

}

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
    $.ajax({ url: '/database.php?method=getListOfConcertesByFestivalAndId',
    data: {fid:1, uid:manager_uid},
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
            getTechnicalNeedsByKid(manager_uid,element.kid, element.navn, element.dato, "#"+html_id);
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

function deleteTechinalNeed(tbid) {
    $.ajax({ url: '/database.php?method=deleteTechnicalNeed',
    data: {tbid:tbid},
    type: 'post',
    success: function(output) {
            console.log("Database delete entry: "+tbid);
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

function registerConcertNeed(kid,title,desc) {
    if(title.length == 0 || desc.length ==0 ) {
        alert("Både tittel of beskrivelse må fylles inn");
        return;
    }
    
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

function injectOffers(bruker) {
    $.ajax({ url: '/database.php?method=getOffers',
    data: {uid:bruker.id},
    type: 'post',
    success: function(output) {
        l = safeJsonParse(output)
        injectList("manager_tilbud",l,function(html_id,element){
            let dato = $("<span></span>").text("Dato: "+element.dato);
            let start_tid = $("<span></span>").text("Start: "+element.start_tid);
            let slutt_tid = $("<span></span>").text("Slutt: "+element.slutt_tid);
            let pris = $("<span></span>").text("Pris: "+element.pris);
            let status = $("<span></span>").text("Status: "+element.status);
            let scene_navn = $("<span></span>").text("Scene: "+element.scene_navn);
            let band_navn = $("<span></span>").text("Band: "+element.band_navn);
            let sender_navn = $("<span></span>").text("Sender: "+element.sender_fornavn +" "+element.sender_etternavn);

            $("#"+html_id).append(dato, start_tid, slutt_tid, pris, status, scene_navn, band_navn, sender_navn);
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