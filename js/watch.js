var todaydate = new Date();

var cigartime = 0;
var reverse_flag = false;
var reloadnum = 30;
var nowcount = 0;
var tid = null;
var init_flag = false;
var getdate_flag = true;

var second = {
  'w': 100,
  'h': 100
};
var nums = {
  'w': 35,
  'h': 25
};
var numl = {
  'w': 45,
  'h': 30
};

function get_content() {

  if (getdate_flag) {
    getdate_flag = false;

    nowcount = 0;

    if (!init_flag) {
      init_flag = true;
      countdown();
      $('.timerarea').css({'visibility': 'visible'});
    }
  }
}

var basetimes = [60, 60, 24];

function getshowtimes() {
  var int_time = new Date() * 1;
  var cur_time = Math.round(int_time / 1000);
  var showtime = cur_time + cigartime + (60 * 60 * 3);

  if (showtime <= 0) showtime = 0;

  var rets = [];

  rets[0] = showtime % basetimes[0];
  if (rets[0] <= 0) rets[0] = 0;

  showtime -= rets[0];

  var buff = 1;
  for (var ii = 1; ii <= 3; ii++) {
    buff *= basetimes[ii - 1];

    var tmp = showtime / buff;
    if (basetimes[ii]) {
      tmp = tmp % basetimes[ii];
    }

    if (tmp <= 0) tmp = 0;

    rets[ii] = tmp;
    showtime -= rets[ii] * buff;
  }

  return rets;
}

var drawer = function() {

  var showtimes = getshowtimes();

  for (var ii = 0; ii < 4; ii++) {
    var num2 = Math.floor(showtimes[ii] / 10);
    var num1 = showtimes[ii] % 10;
    var days_hi = Math.floor(todaydate.getDate() / 10);
    var days_lo = Math.floor(todaydate.getDate() % 10);

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
};

var downer = function() {

  drawer();

  if (reloadnum == nowcount) {
    if (!reverse_flag) {
      getdate_flag = true;
      get_content();
    }
  } else if (todaydate < 0 && cigartime <= 0) {
    init_flag = false;
    getdate_flag = true;
  }
  nowcount++;
};

var countdown = function() {
  if (tid === null) {
    tid = setInterval(downer, 1000);
  }
};

get_content();

var animtime = 0;
var max_animtime = 9000;

var variable_interval = 1;
var variable_timer_id = null;
var old_time = 0;

var variable_cd = function() {

  if (old_time === 0) old_time = new Date() * 1;

  var now_time = new Date() * 1;

  animtime += now_time - old_time;
  old_time = now_time;

  var per = -Math.cos(8 * Math.PI / 8 * animtime / max_animtime) / 2 + 0.5;
  if (1 < per) per = 1;

  cigartime = Math.floor(per * 5000);
  drawer();
  variable_timer_id = setTimeout(variable_cd, variable_interval);
};

function onHover() {
  $('#cigar').attr('src', 'img/phantomcigar_a.jpg');

  var file = 'sounds/select.mp3';

  (function initAudio() {
    var audio5js = new Audio5js({
      ready: function() {
        this.load(file);
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

  if (!reverse_flag) {
    var file = 'sounds/cigar.mp3';

    (function initAudio() {
      var audio5js = new Audio5js({
        ready: function() {
          this.load(file);
          this.play();
        }
      });
      audioobj = audio5js;
    })();

    reverse_flag = true;

    old_time = 0;
    animtime = 0;
    variable_cd();

    $('.phantomcigar').pulse({opacity: 0}, {duration : 100, pulses : 5});
    setTimeout(function() {$('.phantomcigar').css({'display': 'none'});}, 500);

    setTimeout(function() {

      cigartime = 0;

      if (variable_timer_id !== null) {
        clearTimeout(variable_timer_id);
        variable_timer_id = null;
      }

      reverse_flag = false;
      getdate_flag = true;
      get_content();
      countdown();

      $('.timer').css({'display': 'none'});
      $('.timerbg').css({'display': 'block'});

      setTimeout(function() {
        $('.timer').css({'display': 'block'});
        $('.timerbg').css({'display': 'none'});
      }, 2000);

      setTimeout(function() {$('.phantomcigar').css({'display': 'block'});}, 5000);

    }, max_animtime);
  }
});