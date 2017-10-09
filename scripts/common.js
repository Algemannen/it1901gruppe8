// Lager et html-element med informasjon om en konsert
function getConcertInfo(bruker, concert) {

    // Vi bygger et HTML-element
    let container = $("<div></div>").text(" ").addClass("concertInfo").attr('id', 'cid' + concert.kid);
    console.log(concert);
    if (bruker.type===1) {
        getListOfTechnicians(bruker, concert);
    } else if (bruker.type===2) {
        let concertDate = $("<span></span>").text("Dato: " + concert.dato);
        let concertScene = $("<span></span>").text("Scene: " + concert.snavn);
        let start = $("<span></span>").text("Start: " + concert.start_tid);
        let slutt = $("<span></span>").text("Slutt: " + concert.slutt_tid);
        container.append("<br>",concertScene,concertDate,start,slutt);
    }

    container.hide();
    return container;
}

// Lager et html-element med teknikere som hører til en konsert (ARRABGØR)
function getListOfTechnicians(bruker, concert) {

    $.ajax({ url: '/database.php?method=getListOfTechs',
        data: {username: user.name, usertype: user.type, concertid: concert.kid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Vi bygger et HTML-element
            let listContainer = $("<ul></ul>").addClass("technicianlist");
            for (i in l) {
                let listPoint = $("<li></li>").text(l[i].fornavn +' '+ l[i].etternavn);
                listContainer.append(listPoint);
            }

            listContainer.append(listContainer);
            $('#cid'+concert.kid).append("<div><br>Teknikere: </div>",listContainer);


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

//Try catch funksjon for json-parse
function safeJsonParse(output) {
    try{
        l = jQuery.parseJSON(output);
    }
    catch(err){
        console.log(output);
        $("#root").after(output);
    }
    return l;
}

/*
Hvordan bruke denne:

html_id skal være en id eller klasse f.eks #root som listen settes inn i.
list skal være en liste over objekter
formatingunction skal være en funksjon som tar ett objekt fra list og gjør det til html


function injectList(html_id, list, formatingfunction) {
    let listContainer = $(<ul></ul>);
    for (i in list) {
        let listElement = $(<li></li>);
        listElement.append(formatingfunction(list[i]));
        listContainer.append(listElement);
    }

    $(html_id).append(listContainer);
}
*/
