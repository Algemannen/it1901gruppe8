
let defaultcolor = 'rgba(255,255,255,0.4)'
let selectedcolor = 'rgba(0,0,0,0.4)'
function tekniskebehov() {
    document.getElementsByClassName('brukeroverskrift')[0].innerHTML = "Tekniske behov";
    document.getElementById("tekniskebehov_knapp").style.background=selectedcolor;
    document.getElementById("sok_knapp").style.background=defaultcolor;

    document.getElementById('tekniskebehov').style.display  = 'initial';
    document.getElementById('sok').style.display  = 'none';
}

function sok() {
    document.getElementsByClassName('brukeroverskrift')[0].innerHTML = "Søk";
    document.getElementById("tekniskebehov_knapp").style.background=defaultcolor;
    document.getElementById("sok_knapp").style.background=selectedcolor;

    document.getElementById('tekniskebehov').style.display  = 'none';
    document.getElementById('sok').style.display  = 'initial';
}

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
  let inputText = $("#textinput").val();
  let searchType = $('input[name=type]:checked').val();

  $.ajax({ url: '/database.php?method=search',
      data: {text: inputText, type: searchType, fid: current_fid},
      type: 'post',
      success: function(output) {
        if(searchType == 'konsert'){
          console.log(output);
          l = safeJsonParse(output); //gjør en try-catch sjekk.
          for (i in l) {
            let konsertNavn = $("<span></span><br>").text(l[i].dato);
          }
        }
        if(searchType == 'band'){
          console.log(output);
          l = safeJsonParse(output); //gjør en try-catch sjekk.
          for (i in l) {
            getTechnicalNeedsByKid(l[i].kid, l[i].navn, l[i].dato, '#tekniskebehov');
          }
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


function getOldBandByGenre() { //Ikke fullført
  let l = [];
  genre = $('#sokeside').val();

  $.ajax({url: '/database.php?method=getOldBandByGenre',
    data: {fid: current_fid, sjanger:genre},
    type: 'post',
    success: function(output) {
      l = safeJsonParse(output);
      console.log(l);
    },
    error: function(xmlhttprequest, textstatus, message) {
        if(textstatus==="timeout") {
            alert("Timeout feil, kan ikke koble til databasen");
        } else {
            console.log("Error: "+message);
        }
    }
  })
}

function getBandInfoForBookingA() { //Ikke fullført
  let l = [];
  let BandNavn = $('#sokeside').val()

  $.ajax({url: '/database.php?method=getBandInfoForBookingA',
    data: {Band_Navn:BandNavn},
    type: 'post',
    success: function(output) {
      console.log(output);
      l = safeJsonParse(output);
    },
    error: function(xmlhttprequest, textstatus, message) {
        if(textstatus==="timeout") {
            alert("Timeout feil, kan ikke koble til databasen");
        } else {
            console.log("Error: "+message);
        }
    }
  })
}

function getBandInfoForBookingA() { //Ikke fullført
  let l = [];
  let sok = $('#sokeside').val()

  $.ajax({url: '/database.php?method=getBandInfoForBookingA',
    data: {Band_Navn:BandNavn},
    type: 'post',
    success: function(output) {
      console.log(output);
      l = safeJsonParse(output);
    },
    error: function(xmlhttprequest, textstatus, message) {
        if(textstatus==="timeout") {
            alert("Timeout feil, kan ikke koble til databasen");
        } else {
            console.log("Error: "+message);
        }
    }
  })
}
