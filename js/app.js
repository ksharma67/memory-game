/*
 * App's JavaScript code
 */

const card_list = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
// Already Present
let started = false;
let open_cards = [];
let moves = 0;
let time_count = 0;
let solved_count = 0;
let timer_ptr;

// initialize stars display
function init_stars(){
    for (let i=0; i<3; i++){
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

// reduce star rate
function reduce_star(){
    let stars = $(".fa-star");
    $(stars[stars.length-1]).toggleClass("fa-star fa-star-o");
}

// init game
function init_game(){
    populate_cards();
    init_stars();
    $(".card").click(cardClick);
}

// things done after DOM is loaded for the first time
$(document).ready(function(){
    init_game();
    $("#restart").click(reset_game);
    ksh.defaultOptions.className = 'ksh-theme-os';
    ksh.dialog.buttons.YES.text = 'Yes!';
    ksh.dialog.buttons.NO.text = 'No';
});

// load animateCss
// taken from https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// get class value from card DOM
function getClassFromCard(card){
    return card[0].firstChild.className;
}

// check open cards when count = 2
function checkopen_cards(){
    if (getClassFromCard(open_cards[0]) === getClassFromCard(open_cards[1])){
        solved_count++;
        open_cards.forEach(function(card){
            card.animateCss('tada', function(){
                card.toggleClass("open show match");
            });
        });
    } else {
        open_cards.forEach(function(card){
            card.animateCss('shake', function(){
                card.toggleClass("open show");
            });
        });
    }
    open_cards = [];
    increment_move();
    if (solved_count === 8){
        end_game();
    }
}

// starts the timer
function start_timer(){
    time_count += 1;
    $("#timer").html(time_count);
    timer_ptr = setTimeout(start_timer, 1000);
}

// increment move count
function increment_move(){
    moves += 1;
    $("#moves").html(moves);
    if (moves === 14 || moves === 20){
        reduce_star();
    }
}

// event handler for when the card is being clicked!
function cardClick(event){
    // check opened or matched card
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1){
        // both should be -1
        return;
    }
    // start game if needed
    if (!started) {
        started = true;
        time_count = 0;
        timer_ptr = setTimeout(start_timer, 1000);
    }
    // cards can be flipped
    if (open_cards.length < 2){
        $(this).toggleClass("open show");
        open_cards.push($(this));
    }
    // check if cards match
    if (open_cards.length === 2){
        checkopen_cards();
    }
}

// create individual card element
function create_card(cardClass){
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

// populate cards in DOM
function populate_cards(){
    shuffle(card_list.concat(card_list)).forEach(create_card);
}

// reset game
function reset_game(){
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    increment_move();
    started = false;
    open_cards = [];
    time_count = 0;
    solved_count = 0;
    clearTimeout(timer_ptr);
    $("#timer").html(0);
    // re-setup game
    init_game();
}

// runs when game has been won
function end_game(){
    // stop timer
    clearTimeout(timer_ptr);
    // show prompt
    let stars = $(".fa-star").length;
    ksh.dialog.confirm({
        message: `Congrats! You just won the game in ${time_count} seconds with ${stars} star rating. Do you want to play ?`,
        callback: function(value){
            if (value){
                reset_game();
            }
        }
    });
}
