  /* Global variables declarations */
var todaydate = new Date();
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
  var basetimes = [60, 60, 24];
  var int_time = new Date() * 1;
  var cur_time = Math.round(int_time / 1000);
  var time = cur_time + cigartime + (60 * 60 * 3);

  /* DANGER: Dark magic here! */
  if (time <= 0) time = 0;

  var rets = [];

  rets[0] = time % basetimes[0];
  if (rets[0] <= 0) rets[0] = 0;

  time -= rets[0];

  var buff = 1;
  for (var ii = 1; ii <= 3; ii++) {
    buff *= basetimes[ii - 1];

    var tmp = time / buff;
    if (basetimes[ii]) {
      tmp = tmp % basetimes[ii];
    }

    if (tmp <= 0) tmp = 0;

    rets[ii] = tmp;
    time -= rets[ii] * buff;
  }

  return rets;
  /* Dark magic end */
}

function draw() {

  var time = getTime();

  for (var ii = 0; ii < 4; ii++) {
    var num2 = Math.floor(time[ii] / 10);
    var num1 = time[ii] % 10;
    var days_hi = Math.floor(todaydate.getDate() / 10);
    var days_lo = Math.floor(todaydate.getDate() % 10);
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
        $('.day2').css('background-position', (-numl.w * days_hi) + 'px 0px');
        $('.day1').css('background-position', (-numl.w * days_lo) + 'px 0px');
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

  var interval = 1;

  if (old_time === 0) old_time = new Date() * 1;

  var now_time = new Date() * 1;

  animtime += now_time - old_time;
  old_time = now_time;

  var per = -Math.cos(8 * Math.PI / 8 * animtime / max_animtime) / 2 + 0.5;
  if (1 < per) per = 1;

  cigartime = Math.floor(per * 5000);
  draw();
  cigar_timer = setTimeout(getCigartime, interval);
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