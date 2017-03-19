/* Global variables declarations */
var cigarTime = 0;
var initFlag = false;
var animTime = 0;
var maxAnimTime = 9000;
var cigarFlag = null;
var oldTime = 0;
var audioobj = null;
var timeUnit = {
    milliseconds: 1000,
    seconds: 60,
    minutes: 60,
    hours: 24
};

/* Code start */
function getContent() {
    if (!initFlag) {
        initFlag = true;
        countdown();
    }
}

function getTime() {
    var theTime = new Date() * 1;

    var cur_time = Math.round(theTime / timeUnit.milliseconds);
    var time = cur_time + cigarTime + (timeUnit.seconds * timeUnit.minutes * 3);

    /*
     * [0] - Seconds
     * [1] - Minutes
     * [2] - Hours
     */
    var basetime = [timeUnit.seconds, timeUnit.minutes, timeUnit.hours];
    var array = [];

    /* First get seconds and put them to array[0] */
    array[0] = time % basetime[0];
    time -= array[0];

    var buff = 1;
    /* Then get minutes and hours and put them to array[1] and [2] */
    for (var i = 1; i <= 2; i++) {
        buff *= basetime[i - 1];
        var tmp = time / buff;
        tmp = tmp % basetime[i];
        array[i] = tmp;
        time -= array[i] * buff;
    }

    /* Output array with 3 elements */
    return array;
}

function draw() {

    var theTime = new Date();

    var time = getTime();

    for (var i = 0; i < 4; i++) {
        var ClockStatus = {
            num2: Math.floor(time[i] / 10),
            num1: time[i] % 10,
            days2: Math.floor(theTime.getDate() / 10),
            days1: Math.floor(theTime.getDate() % 10),
            second: {'w': 100, 'h': 100},
            nums: {'w': 35, 'h': 25},
            numl: {'w': 45, 'h': 30}
        };

        switch (i) {
            case 0:
                var w = -900 + (ClockStatus.second.w * ClockStatus.num1);
                var h = -500 + (ClockStatus.second.h * ClockStatus.num2);
                $('.clock').css('background-position', w + 'px ' + h + 'px');
                $('.sec2').css('background-position', (-ClockStatus.nums.w * ClockStatus.num2) + 'px 0px');
                $('.sec1').css('background-position', (-ClockStatus.nums.w * ClockStatus.num1) + 'px 0px');
                break;
            case 1:
                $('.min2').css('background-position', (-ClockStatus.numl.w * ClockStatus.num2) + 'px 0px');
                $('.min1').css('background-position', (-ClockStatus.numl.w * ClockStatus.num1) + 'px 0px');
                break;
            case 2:
                $('.hour2').css('background-position', (-ClockStatus.numl.w * ClockStatus.num2) + 'px 0px');
                $('.hour1').css('background-position', (-ClockStatus.numl.w * ClockStatus.num1) + 'px 0px');
                break;
            case 3:
                $('.day2').css('background-position', (-ClockStatus.numl.w * ClockStatus.days2) + 'px 0px');
                $('.day1').css('background-position', (-ClockStatus.numl.w * ClockStatus.days1) + 'px 0px');
                break;
        }
    }
}

function counter() {
    draw();
    getContent();
}

function countdown() {
    setInterval(counter, timeUnit.milliseconds);
}

/* Clock start */
getContent();

/* Calculate cigarTime */
function getcigarTime() {

    var theTime = new Date() * 1;

    if (oldTime === 0) {
        oldTime = theTime;
    }

    var now_time = theTime;

    animTime += now_time - oldTime;
    oldTime = now_time;

    var per = -Math.cos(8 * Math.PI / 8 * animTime / maxAnimTime) / 2 + 0.5;
    if (1 < per) per = 1;

    cigarTime = Math.floor(per * 5000);
    draw();
    cigarFlag = setTimeout(getcigarTime, 20);
}

/* Phantom cigar functionality */
function onHover() {
    (function initAudio() {
        var audio5js = new Audio5js({
            ready: function() {
                this.load('sounds/select.mp3');
                this.play();
            }
        });
        audioobj = audio5js;
    })();
}

$('.phantomcigar').click(function() {

    (function initAudio() {
        var audio5js = new Audio5js({
            ready: function() {
                this.load('sounds/cigar.mp3');
                this.play();
            }
        });
        audioobj = audio5js;
    })();

    oldTime = 0;
    animTime = 0;
    getcigarTime();

    $('.phantomcigar').pulse({opacity: 0}, {duration : 100, pulses : 5});
    setTimeout(function() {$('.phantomcigar').css({'display': 'none'});}, 500);

    setTimeout(function() {
        cigarTime = 0;

        if (cigarFlag !== null) {
            clearTimeout(cigarFlag);
            cigarFlag = null;
        }

        countdown();

        $('.dial').css({'display': 'none'});
        $('.dialbg').css({'display': 'block'});

        setTimeout(function() {
            $('.dial').css({'display': 'block'});
            $('.dialbg').css({'display': 'none'});
        }, timeUnit.milliseconds * 2);

        setTimeout(function() {$('.phantomcigar').css({'display': 'block'});}, timeUnit.milliseconds * 5);

    }, maxAnimTime);
});