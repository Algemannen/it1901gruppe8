// Lager et html-element med informasjon om en konsert
function getConcertInfo(bruker, concert) {

    // Vi bygger et HTML-element
    let container = $("<div></div>").text(" ").addClass("concertInfo").attr('id', 'cid' + concert.kid);
    console.log(concert);
    if (bruker.type===1) {
        let maindiv = $("<div></div>").addClass("behov");
        let tb = $("<h3></h3>").text("Tekniske Behov:");
        maindiv.append(tb);
        getTechnicalNeedsByKid(bruker.id,concert.kid, concert.navn, concert.dato, maindiv);
        getListOfTechnicians(bruker, concert);
        container.append(maindiv);
    } else if (bruker.type===2) {
        let tb = $("<h3></h3>").text("Tekniske Behov:");
        container.append(tb);
        getTechnicalNeedsByKid(bruker.id,concert.kid, concert.navn, concert.dato, '#cid'+concert.kid);
    } else if (bruker.type==5){
        let cost_report = $("<h3></h3>").text("Økonomisk rapport:");
        container.append(cost_report);
        buildConcertReport();

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
            let listContainer = $("<div></div>").addClass("technicianlist");
            listContainer.append("<h3>Teknikere: </h3>");

            for (i in l) {
                let listPoint = $("<span></span><br>").text(l[i].fornavn +' '+ l[i].etternavn);
                listContainer.append(listPoint);
            }

            listContainer.append(listContainer);
            $('#cid'+concert.kid).append(listContainer);


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
det forventes at formateringsunfksjonen skal være på formen:

    function(html_id, element) {
        let container = $("<span></span>");

        ...

        $(html_id).append(container);
    }

Denne funksjonen er async-sikker
*/

function injectList(html_id, list, formatingfunction) {
    let listContainer = $("<ul></ul>");
    let child_id = [];
    for (i = 0; i<list.length; i++) {
        child_id.push(html_id+"_"+i+"_");
        let listElement = $("<li></li>").attr("id",child_id[i]);
        listContainer.append(listElement);
    }

    $("#"+html_id).append(listContainer);

    for (i = 0; i<list.length; i++) {
        formatingfunction(child_id[i],list[i]);
    }
}



// Bygger en korrekt liste av scener
function buildListOfConcerts(bruker,list) {
    let listContainer = $("<ul></ul>").addClass("concertlist");
    for (i in list) {
        let listPoint = $("<li></li>");
        let concertInfo = $("<div></div>").addClass("button_text").text(' ' + list[i].navn +' | ' + list[i].dato +  ' | ' + list[i].start_tid + " - " + list[i].slutt_tid);
        let concertButton = $("<button></button>").addClass("concert_button").text("Mer info");
        listPoint.append(concertInfo, concertButton, getConcertInfo(bruker, list[i]));
        listContainer.append(listPoint);
    }
    return listContainer;
}

// Bygger HTML for tekniske behov
function getTechnicalNeedsByKid(bruker_id,kid, kname, dato, container) {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfTechnicalNeeds',
        data: {concertid: kid},
        type: 'post',
        success: function(output) {
            l = safeJsonParse(output); //gjør en try-catch sjekk.

            // Vi bygger et HTML-element
            let kid = $("<h3></h3").text('Konsert : ' + kname + " - " + dato).addClass("tb_overskrift");
            let listContainer = $("<div></div>").addClass("behov");
            if (l.length === 0) {
              listContainer.append('Ingen tekniske behov meldt enda.')
            }
            listContainer.append('<br>');
            for (i in l) {
                let tittel = $("<span></span>").text('Tittel: ').css('font-weight', 'bold');
                let tittel2 = $("<span></span><br>").text(l[i].tittel);
                let behov2 = $("<span></span><br>").text(l[i].behov);
                let behov = $("<span></span>").text('Beskrivelse: ').css('font-weight', 'bold');
                listContainer.append(tittel, tittel2, behov, behov2)
                if (bruker_id === 3) {
                    let delete_button = $("<button>Slett</button>").addClass("delete_technical_need").val(l[i].tbid);
                    listContainer.append(delete_button);
                }
                listContainer.append('<br>');

            }
            $(container).append(kid,listContainer);

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

function buildConcertReport(bruker){
  $.ajax({ url: '/database.php?method=getConcertReport',
      data: {konsertid: kid},
      type: 'post',
      success: function(output) {
          l = safeJsonParse(output); //gjør en try-catch sjekk.

          // Vi bygger et HTML-element
          let kid = $("<h3></h3").text('Konsert : ' + kname + " - " + dato).addClass("tb_overskrift");
          let listContainer = $("<div></div>").addClass("");
          listContainer.append('<br>');
          for (i in l) {
              let tittel = $("<span></span>").text('Tittel: ').css('font-weight', 'bold');
              let kostnad = $("<span></span><br>").text(l[i].kostnad);
              let billettpris = $("<span></span><br>").text(l[i].billettpris );
              let tilskuere = $("<span></span>").text(l[i].tilskuere).css('font-weight', 'bold');
              listContainer.append(tittel, kostnad, billettpris, tilskuere, '<br>');

          }
          $(container).append(kid,listContainer);

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
