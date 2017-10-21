
let defaultcolor = 'rgba(255,255,255,0.4)'
let selectedcolor = 'rgba(0,0,0,0.4)'

function bookingfane(index) {
    if (index=="0") {
        $("#tekniskebehov").show();
        $("#tekniskebehov_knapp").css("background",selectedcolor);

        $("#sok").hide();
        $("#sok_knapp").css("background",defaultcolor);
    }
    else if (index == "1") {
        $("#sok").show();
        $("#sok_knapp").css("background",selectedcolor);

        $("#tekniskebehov").hide();
        $("#tekniskebehov_knapp").css("background",defaultcolor);
    }

}

function getListOfTechnicalNeeds(bruker) {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfConcertesByFestival',
        data: {fid: current_fid},
        type: 'post',
        success: function(output) {
            console.log(output);
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            for (i in l) {
              getTechnicalNeedsByKid(bruker.id,l[i].kid, l[i].navn, l[i].dato, '#tekniskebehov');
            }
        },
        error: function(xmlhttprequest, textstatus, message) {
            if(textstatus==="timeout") {
                alert("Timeout feil, kan ikke koble til databasen");
            } else {
                console.log("Error: "+message);
            }
        }
    })};


function search() { //search funksjon for bookingansvarlig
  let l = [];
  let inputText = $("#textinput").val();
  let searchType = $('input[name=type]:checked').val();
  $("#resultlist").empty();

  $.ajax({ url: '/database.php?method=search',
      data: {text: inputText, type: searchType, fid: current_fid},
      type: 'post',
      success: function(output) {
          l = safeJsonParse(output); //gjør en try-catch sjekk.
          if (l.length > 0) {
            let table = $("<table></table>");
            for (i in l) {
              let tableRow = $("<tr></tr>");
              let obj = [searchType, l[i].id];
              let tableElementNavn = $("<td></td>").text(l[i].navn).addClass("bookingnavnsok").val(obj);
              tableRow.append(tableElementNavn);
              table.append(tableRow);
              $("#resultlist").append(table);
            }} else {
              $("#resultlist").append("Ingen resultater.");
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
