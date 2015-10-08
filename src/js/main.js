var googleSheets = function (opts){
  var self = this;
  this.upcoming = function(cb){
    $.get(self.jsonurl(), function(data){
      cb(self.parse(data).filter(function(x){
        return x.status.toLowerCase() == "on";
      }));
    });
  };

  this.parse = function(data){
    var fields = opts.fields;
    var slugs = opts.slugs;
    return data.feed.entry
    .map(function(item){
      var scrubed_data = {};
      fields.forEach(function(field){
        scrubed_data[field] = item['gsx$' + field]['$t'];
      });
      return scrubed_data;
    })
    .map(function(item){
      var date = moment(item.date + " " + item.time);
      item.datetime = date;
      item.date = date.format("MMM Do YYYY");
      item.time = date.format("h:mm A");
      return item;
    })
    .map(function(item){
      var slug = '';
      slugs.forEach(function(s){
        slug += ' ' + item[s];
      });
      item.slug = slug.replace(/[^\w\s-]/g, "").trim().toLowerCase().replace(/[-\s]+/g, "-");
      return item;
    });
  };
  this.jsonurl = function(){
    return 'https://spreadsheets.google.com/feeds/list/' + opts.key + '/' + opts.sheet_number + '/public/values?alt=json';
  };
  return this;
};

$(document).ready(function(){

  //style changes on scroll
  $(document).on('scroll', function (e) {
    var scroll = $(document).scrollTop();

    var alpha = function (rate, max) {
      var speed = scroll / rate;
      return speed >= max ? max : speed;
    };

    var light = function (rate, min, max) {
      var light_weight = (alpha(rate, 1) * 100) + min;
      var light = light_weight >= max ? max + "%" : ~~light_weight + "%";
      return light;
    }

    //navbar style
    $('.navbar').css({
      "background-color": "hsla(256, 46%, 11%, " + alpha(350, 1) + ")",
      "box-shadow": "0 2px 8px -1px hsla(256, 46%, 11%, " + alpha(300, 1) + ")"
    });

    //navbar links style
    $('.navbar a').css({
      "color": "hsla(208, 13%, " + light(100, 44, 90) + ", 1)"
    });

  });

  //smooth scroll to element on click
  $('a[href^="#"]').on('click',function (e) {
  	    e.preventDefault();

  	    var target = this.hash;
  	    var $target = $(target);

  	    $('html, body').stop().animate({
  	        'scrollTop': $target.offset().top
  	    }, 500, 'swing', function () {
  	        window.location.hash = target;
  	    });
  });

});
