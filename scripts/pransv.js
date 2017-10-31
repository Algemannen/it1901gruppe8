function pr_bandListe(festivalid){
    $.ajax({ url: '/database.php?method=getListofBandsAndConcertes',
    data: {fid:festivalid},
    type: 'post',
    success: function(output) {
        let l = safeJsonParse(output);
        console.log(output);
        let bandHeader = $("<h3></h3>").text('Bookede band');
        $("#bandliste").append(bandHeader);

        injectList('bandliste',l[0], function(html_id, element) {
            let container = $("<span></span>").text(element.navn).addClass('bandListElement').val(element.bid);
            $('#bandliste').append(container);
        });

        let konsertHeader = $("<h3></h3>").text('Konserter');
        $("#bandliste").append(konsertHeader);

        injectList('bandliste',l[1], function(html_id, element) {
            let container = $("<span></span>").text(element.knavn).addClass('bandListElement').val(element.kid);
            $('#bandliste').append(container);
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
