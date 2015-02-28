//shared functions
var curr_event, triggered_event, target;
var continued = false;
function analyseMessage(text) {
    var ocurrences = 0;
    for(var w in dictionary){
        if ( text.search(dictionary[w]) > -1 ){
            ocurrences++;
        }
    }

    if(ocurrences > 0){
        $("#user_message").html('"'+text+'"');
        displayModal();
    }
    return false;
}

function evalLinkJs(link) {
    // Eat it, Crockford. :)
    eval(link.replace(/^javascript:/g, ""));
}

function displayModal() {
    $('#think_overlay').show();
    $('#think_content').show();
}

$(document).on('click', '#btn_continue', function(){
    console.log(curr_event);

    $('#think_overlay').hide();
    $('#think_content').hide();

    switch (curr_event){
        case 'FB':
            continued = true;
            console.log(target);
            $(target).trigger('click');
        break;
    }
});

function crateModal() {
    var modal = '<div id="think_overlay"></div><div id="think_content"><h1>:( <br> Creemos que tu mensaje podria ofender a alguién, antes de enviarlo tomate un segundo para revisarlo: </h1><p id="user_message"></p><p>¿Es algo que dirias en persona?</p><p>Considera las consecuencias que esto puede traer.</p><span id="btn_continue"> >> continuar </span> </div>';

    $('body')
    .append('<link rel="stylesheet" type="text/css" href="'+chrome.extension.getURL('think.css')+'">')
    .append(modal);
    console.log('think modal crated');
}
crateModal();

// suport for FB
// FB status box
$('form[action*="updatestatus"]').find('button[type="submit"]').click(function(e){
    if (!continued) {
        e.preventDefault();
        target = $(this);
        curr_event = 'FB';

        analyseMessage($('[name="xhpc_message"]').val());
    }
});

