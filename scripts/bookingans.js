function getListOfTechnicalNeeds() {
    let l = [];

    $.ajax({ url: '/database.php?method=getListOfConcertesByFestival',
        data: {fid: current_fid},
        type: 'post',
        success: function(output) {
            console.log(output);
            l = safeJsonParse(output); //gjør en try-catch sjekk.
            for (i in l) {
              getTechnicalNeedsByKid(l[i].kid, l[i].navn, l[i].dato, '#tekniskebehov');
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


function search() {
  let l = [];
  var inputText = $("#textinput").val();
  var searchType = $('input[name=type]:checked').val();

  $.ajax({ url: '/database.php?method=search',
      data: {text: inputText, type: searchType},
      type: 'post',
      success: function(output) {
          console.log(output);
          l = safeJsonParse(output); //gjør en try-catch sjekk.
          for (i in l) {
            getTechnicalNeedsByKid(l[i].kid, l[i].navn, l[i].dato, '#tekniskebehov');
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
