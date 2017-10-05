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
