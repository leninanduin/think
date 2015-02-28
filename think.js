//shared functions
var curr_event, triggered_event, target;
var continued = false;

function displayModal() {
    $('#think_overlay').show();
    $('#think_content').show();
}

function continuePost(){
    console.log(curr_event);

    $('#think_overlay').hide();
    $('#think_content').hide();

    switch (curr_event){
        case 'REDDIT':
        case 'TW':
        case 'FB':
            continued = true;
            console.log(target);
            $(target).trigger('click');
            continued = false;
        break;
    }
}

function analyseMessage(text) {
    var ocurrences = 0;
    for(var w in dictionary){
        if ( text.search(dictionary[w]) > -1 ){
            ocurrences++;
        }
    }

    if(ocurrences > 0) {
        $("#user_message").html('"'+text+'"');
        displayModal();
    } else {
        continuePost();
    }
    return false;
}

$(document).on('click', '#btn_continue', function(){
    continuePost();
});

$(document).on('click', '#btn_cancel', function(){
    $('#think_overlay').hide();
    $('#think_content').hide();
});

function crateModal() {
    var modal = '<div id="think_overlay"></div><div id="think_content"><h1><i class="fa fa-frown-o"></i><br>Creemos que tu mensaje podria ofender a alguién, antes de enviarlo tomate un segundo para revisarlo: </h1><p id="user_message"></p><p>¿Es algo que dirias en persona?</p><p class="think-info-quote"> <i class="fa fa-info-circle"></i>Considera las consecuencias que esto puede traer.</p> <span id="btn_cancel" class="think_btn"><i class="fa fa-thumbs-o-up"></i> editar mensaje </span><span id="btn_continue" class="think_btn"><i class="fa fa-thumbs-o-down"></i> publicar mensaje </span>  </div>';

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
// fb message window
// TODO: this doesnt work :(
$(document).on('click', 'button.uiOverlayButton[type="submit"]', function(e){
    console.log('fb message');
    console.log(continued);
    if (!continued) {
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        target = $(this);
        var i = $(this).index('button.uiOverlayButton[type="submit"]');
        console.log(i);
        var t = $('textarea[name="message_body"]').eq(i)[0].value;
        console.log(t);

        curr_event = 'FB';
        analyseMessage(t);
    }
});

// TODO: this doesnt work :(
// FB comments box
$(document).on('submit', 'form.commentable_item', function(e){
    console.log("coments box")
    console.log(e);
    if (!continued) {
        e.preventDefault();
        target = $(this);
        curr_event = 'FB';

        analyseMessage($(this).find('.UFIAddCommentInput').text());
    }
});

// twitter main box
$('form.tweet-form').find('button.tweet-btn').click(function(e){
    console.log('tweet');
    console.log(continued);
    if (!continued) {
        var i = $(this).index('button.tweet-btn');
        console.log($('div.tweet-box').eq(i));

        var t = $('div.tweet-box').eq(i)[0].innerText;
        console.log(t);

        e.preventDefault(); e.stopPropagation();e.stopImmediatePropagation();
        target = $(this);
        curr_event = 'TW';

        analyseMessage(t);
    }
});

// redit comments box
$('form.usertext').find('button[type="submit"]').click(function(e){
    console.log('reddit');
    if (!continued) {
        e.preventDefault(); e.stopPropagation();e.stopImmediatePropagation();
        target = $(this);
        var i = $(this).index('button[type="submit"]');
        var t = $('form.usertext').eq(2).serializeArray();
        curr_event = 'REDDIT';
        for (var i in t){
            if (t[i].name == 'text' ){
                console.log(t[i].value)
                analyseMessage(t[i].value);
            }
        }
    }
});

// disqus reply box
// TODO: doesnt work, it´s an iframe
$(function(){
    $('form.reply').find('button').click(function(e){
        console.log('disqus');
        console.log(continued);
        if (!continued) {
            e.preventDefault(); e.stopPropagation();e.stopImmediatePropagation();
            var t = $(this).parent('form.reply').find('div.textarea').text();
            console.log(t)
            target = $(this);
            curr_event = 'DISQUS';
            // analyseMessage(t);
        }
    });
});


