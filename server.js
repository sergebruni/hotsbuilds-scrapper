var express = require('express');
var scrapy  = require('node-scrapy');
var moment  = require('moment');
var _       = require('lodash');
var fs      = require('fs');
var app     = express();
var CronJob = require('cron').CronJob;
var path = require('path');
 
var PORT = process.env.PORT || 8000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/hotsbuilds', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/hotsbuilds.json'));
});
app.get('/favicon', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/img/favicon.png'));
});
app.get('/card', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/img/card.png'));
});

app.listen(PORT, function (){
  console.log('Scraping server running on ' + PORT);
});

var jsonbuilds = { last_updated: '', builds: {}};

var characterJson = ["Abathur", "Anub'arak", "Artanis", "Arthas", "Azmodan", "Brightwing", "Chen", "Cho", "Chromie", "Dehaka", "Diablo", "E.T.C.", "Falstad", "Gall", "Gazlowe", "Greymane", "Illidan", "Jaina", "Johanna", "Kael'thas", "Kerrigan", "Kharazim", "Leoric", "Li Li", "Li-Ming", "Lt. Morales", "Lunara", "Malfurion", "Medivh", "Muradin", "Murky", "Nazeebo", "Nova", "Raynor", "Rehgar", "Rexxar", "Sgt. Hammer", "Sonya", "Stitches", "Sylvanas", "Tassadar", "The Butcher", "The Lost Vikings", "Thrall", "Tracer", "Tychus", "Tyrael", "Tyrande", "Uther", "Valla", "Xul", "Zagara", "Zeratul"];

jsonbuilds.last_updated = moment().format('MMMM Do YYYY, h:mm a');

var job = new CronJob({
  cronTime: '0 30 14 * * 1-5',
  onTick: function() {
    /*
     * Runs every Wednesday
     * at 06:00:00 AM. 
     */
    console.log('Cron Job Started ', moment().format('LLL'))

    _.forEach(characterJson, function (value, key)  {
      
      var url = 'http://www.hotslogs.com/Sitewide/HeroDetails?Hero=' + value
      var model = 
          {
            build1: { 
              rate: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00__0 td.sorting_1'  },
              lv01: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent01', get: 'title' },
              lv04: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent04', get: 'title' },
              lv07: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent07', get: 'title' },
              lv10: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent10', get: 'title' },
              lv13: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent13', get: 'title' },
              lv16: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent16', get: 'title' },
              lv20: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent20', get: 'title' }
            },
            build2: { 
              rate: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00__1 td.sorting_1'  },
              lv01: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent01', get: 'title' },
              lv04: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent04', get: 'title' },
              lv07: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent07', get: 'title' },
              lv10: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent10', get: 'title' },
              lv13: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent13', get: 'title' },
              lv16: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent16', get: 'title' },
              lv20: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent20', get: 'title' }
            },
            build3: { 
              rate: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00__2 td.sorting_1'  },
              lv01: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl08_imgTalent01', get: 'title' },
              lv04: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl08_imgTalent04', get: 'title' },
              lv07: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl08_imgTalent07', get: 'title' },
              lv10: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl08_imgTalent10', get: 'title' },
              lv13: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl08_imgTalent13', get: 'title' },
              lv16: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl08_imgTalent16', get: 'title' },
              lv20: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl08_imgTalent20', get: 'title' }
            }
          }

      scrapy.scrape(url, model, function(err, data) {
          if (err) return console.error(err)

          jsonbuilds.builds[value] = data

          console.log(Object.size(jsonbuilds.builds), characterJson.length, data.build1.rate);

          if (Object.size(jsonbuilds.builds) === characterJson.length){
          
            fs.writeFile('public/hotsbuilds.json', JSON.stringify(jsonbuilds, null, 4), function(err){
              console.log('File successfully written!');
            })

          }
      });
    })

  },
  start: false,
  runOnInit: true,
  timeZone: 'America/Caracas'
});

job.start();

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

exports = module.exports = app;