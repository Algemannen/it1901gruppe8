function pr_bandListe(festivalid){
    $.ajax({ url: '/database.php?method=getListofBandsByFestival',
    data: {fid:festivalid},
    type: 'post',
    success: function(output) {
        console.log(output);
        injectList('bandliste',safeJsonParse(output), function(html_id, element) {

            let container = $("<span></span>").text(element.navn).val(element.bid);

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