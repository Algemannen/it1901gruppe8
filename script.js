// Global variables
var usertype = 0;
var username = "NONAME";
var options = "";
var userid = 0;
var listofconcerts = [];
var listoftechnicians = [];

// Functions to run after DOM is ready
$(document).ready(function(){
    // Initialization
    options = parseUrl(window.location.href);
        if (/debug/i.test(options)) {
            $(".debug").show();
        }
    redraw();

    // Database queries

    function getListOfTechnicians(concertID) {
        // TODO database-call: (userid,concertID)
        let l = ["Jens", "Nils", "Truls"];
        let str = "<ul class='technicianlist'>";
        for (i in l) {
            str+= "<li>"+l[i]+"</li>";
        }
        str+="</ul>";
        console.log(str);
        return str;
    }

    function getListOfConcertes() {
        // TODO: database-call: (userid)
        let l = []
        if (usertype == 1) {
            l = ["Konsert 1", "Konsert 2", "Konsert 3", "Konsert 4", "Konsert 5"];
        } else if (usertype == 2) {
            l = ["Konsert 1", "Konsert 2"];
        }
        // Get from database
        let concertID = 0;
        let str = "<ul class='concertlist'>";
        for (i in l) {
            str+= "<li><span>"+l[i]+"</span><button class='concert_button' id='"+concertID+"'>Mer info</button>"+"</li>";
        }
        str+="</ul>";
        console.log(str);
        return str;
    }

    function getConcertInfo(concertID) {
        // TODO: database-call(userid, concertID)
        let str ="<div>";
        str += "informasjon om konsert med ID:"+concertID;
        if (usertype == 1) {
            str += "<br> Teknikere: "
            str+=getListOfTechnicians(concertID);
        }
        str += "</div>";
        console.log(str);
        return str;
    }
    

    // FUNCTIONS

    // Calls ajax when page should change content
    function redraw() {
        switch(usertype) {
            case 0:
                $.ajax({url: "no_user.html",dataType: 'html', success: function(result){
                    $("#root").html(result);
                }});
                break;
            case 1:
                $.ajax({url: "arrang.html",dataType: 'html', success: function(result){
                        $("#root").html(result);
                }});
                break;
            case 2:
                $.ajax({url: "tekni.html",dataType: 'html', success: function(result){
                    $("#root").html(result);
                }});
                break;
            default:
                $("#root").html("<p>Error: invalid usertype "+usertype+"</p>");
        }
        console.log("Pagestate:"+usertype);
    }

    // Returns the url of the web-page
    function parseUrl( url ) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    } 

    // Captures logon information from input fields and should call database
    function logon() {
        username = $("#username_field").val();
        console.log("Username "+username);
        // Debug: random usertype
        if (username.charAt(0) == 'a') {
            usertype = 1;
        } else if (username.charAt(0) == 'b') {
            usertype = 2;
        }
        redraw();
    }

    // Logs out by reloading page
    function logout() {
        console.log("Logout");
        location.reload();
    }

    // EVENTS

    // Debug buttons
    $(".debug_button").click(function() {
        usertype = parseInt(this.id);
        redraw();
    });

    // Capture 'enter'-key from username-field
    $('body').on('keyup', "#username_field", function (e) {
        if (e.keyCode === 13) {
           logon();
        }
    });

    // Capture 'ener'-key from password-field
    $('body').on('keyup', "#password_field", function (e) {
        if (e.keyCode === 13) {
           logon();
        }
    });

    // Hook up login-button
    $('body').on('click', ".login_button", function () {
        logon();
    });

    // Hook up logout-button
    $('body').on('click', ".logout_button", function () {
        logout();
    });

    // Hook up more info on concert-button
    $('body').on('click', ".concert_button", function () {
        let concertID = parseInt(this.id);
        console.log("Get concert info");
        $(this).after(getConcertInfo(concertID));
        $(this).css("display","none");
    });

    // Correctly inject content into elements after ajax is complete
    $(document).ajaxComplete(function() {
        $('#username').html(username);
        $('#listofconcerts').html(getListOfConcertes());
    });

    

});