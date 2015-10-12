/* Global variables declarations */
var thetime = new Date();
var cigartime = 0;
var init_flag = false;
var animtime = 0;
var max_animtime = 9000;
var cigar_timer = null;
var old_time = 0;
var audioobj = null;

/* Code start */
function getContent() {
  if (!init_flag) {
    init_flag = true;
    countdown();
    $('.dialarea').css({'visibility': 'visible'});
  }
}

function getTime() {
  var cur_time = Math.round(new Date() * 1 / 1000);
  var time = cur_time + cigartime + (60 * 60 * 3);

  /*
   * [0] - Seconds
   * [1] - Minutes
   * [2] - Hours
   */
  var basetime = [60, 60, 24];
  var array = [];

  array[0] = time % basetime[0]; /* This should be minutes */
  time -= array[0];

  var buff = 1;
  for (var ii = 1; ii <= 3; ii++) {
    buff *= basetime[ii - 1];
    var tmp = time / buff;
    tmp = tmp % basetime[ii - 1];
    array[ii] = tmp;
    time -= array[ii] * buff;
  }

  return array;
}

function draw() {

  var time = getTime();

  for (var ii = 0; ii < 4; ii++) {
    var num2 = Math.floor(time[ii] / 10);
    var num1 = time[ii] % 10;
    var days2 = Math.floor(thetime.getDate() / 10);
    var days1 = Math.floor(thetime.getDate() % 10);
    var second = {'w': 100, 'h': 100};
    var nums = {'w': 35, 'h': 25};
    var numl = {'w': 45, 'h': 30};

    switch (ii) {
      case 0:
        var w = -900 + (second.w * num1);
        var h = -500 + (second.h * num2);
        $('.clock').css('background-position', w + 'px ' + h + 'px');
        $('.sec2').css('background-position', (-nums.w * num2) + 'px 0px');
        $('.sec1').css('background-position', (-nums.w * num1) + 'px 0px');
        break;
      case 1:
        $('.min2').css('background-position', (-numl.w * num2) + 'px 0px');
        $('.min1').css('background-position', (-numl.w * num1) + 'px 0px');
        break;
      case 2:
        $('.hour2').css('background-position', (-numl.w * num2) + 'px 0px');
        $('.hour1').css('background-position', (-numl.w * num1) + 'px 0px');
        break;
      case 3:
        $('.day2').css('background-position', (-numl.w * days2) + 'px 0px');
        $('.day1').css('background-position', (-numl.w * days1) + 'px 0px');
        break;
    }
  }
}

function counter() {
  draw();
  getContent();
}

function countdown() {
  setInterval(counter, 1000);
}

/* Clock start */
getContent();

/* Calculate cigartime */
function getCigartime() {

  if (old_time === 0) old_time = new Date() * 1;

  var now_time = new Date() * 1;

  animtime += now_time - old_time;
  old_time = now_time;

  var per = -Math.cos(8 * Math.PI / 8 * animtime / max_animtime) / 2 + 0.5;
  if (1 < per) per = 1;

  cigartime = Math.floor(per * 5000);
  draw();
  cigar_timer = setTimeout(getCigartime, 1);
}

/* Phantom cigar functionality */
function onHover() {
  $('#cigar').attr('src', 'img/phantomcigar_a.jpg');

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

function offHover() {
  $('#cigar').attr('src', 'img/phantomcigar.jpg');
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

  old_time = 0;
  animtime = 0;
  getCigartime();

  $('.phantomcigar').pulse({opacity: 0}, {duration : 100, pulses : 5});
  setTimeout(function() {$('.phantomcigar').css({'display': 'none'});}, 500);

  setTimeout(function() {
    cigartime = 0;

    if (cigar_timer !== null) {
      clearTimeout(cigar_timer);
      cigar_timer = null;
    }

    countdown();

    $('.dial').css({'display': 'none'});
    $('.dialbg').css({'display': 'block'});

    setTimeout(function() {
      $('.dial').css({'display': 'block'});
      $('.dialbg').css({'display': 'none'});
    }, 2000);

    setTimeout(function() {$('.phantomcigar').css({'display': 'block'});}, 5000);

  }, max_animtime);
});