var express = require('express');
var scrapy  = require('node-scrapy');
var moment  = require('moment');
var _       = require('lodash');
var fs      = require('fs');
var app     = express();

app.listen('8085')

console.log('Scraping server running on 8085');

var jsonbuilds = {builds: {}, last_updated: ''};

var characterJson = ["Abathur", "Anub'arak", "Artanis", "Arthas", "Azmodan", "Brightwing", "Chen", "Cho", "Chromie", "Dehaka", "Diablo", "E.T.C.", "Falstad", "Gall", "Gazlowe", "Greymane", "Illidan", "Jaina", "Johanna", "Kael'thas", "Kerrigan", "Kharazim", "Leoric", "Li Li", "Li-Ming", "Lt. Morales", "Lunara", "Malfurion", "Medivh", "Muradin", "Murky", "Nazeebo", "Nova", "Raynor", "Rehgar", "Rexxar", "Sgt. Hammer", "Sonya", "Stitches", "Sylvanas", "Tassadar", "The Butcher", "The Lost Vikings", "Thrall", "Tracer", "Tychus", "Tyrael", "Tyrande", "Uther", "Valla", "Xul", "Zagara", "Zeratul"];

jsonbuilds.last_updated = moment().format('MMMM Do YYYY');

_.forEach(characterJson, function (value, key)  {

  var url = 'http://www.hotslogs.com/Sitewide/HeroDetails?Hero=' + value

  var model = 
    {
      build1: { 
        lv01: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent01', get: 'title' },
        lv04: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent04', get: 'title' },
        lv07: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent07', get: 'title' },
        lv10: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent10', get: 'title' },
        lv13: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent13', get: 'title' },
        lv16: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent16', get: 'title' },
        lv20: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl04_imgTalent20', get: 'title' }
      },
      build2: { 
        lv01: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent01', get: 'title' },
        lv04: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent04', get: 'title' },
        lv07: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent07', get: 'title' },
        lv10: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent10', get: 'title' },
        lv13: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent13', get: 'title' },
        lv16: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent16', get: 'title' },
        lv20: { selector: '#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00_ctl06_imgTalent20', get: 'title' }
      }
    }
  
  scrapy.scrape(url, model, function(err, data) {
      if (err) return console.error(err)

      jsonbuilds.builds[value] = data

      console.log(Object.size(jsonbuilds.builds), characterJson.length);

      if (Object.size(jsonbuilds.builds) === characterJson.length){
      
        fs.writeFile('hotsbuilds.json', JSON.stringify(jsonbuilds, null, 4), function(err){
          console.log('File successfully written! - Check your project directory for the hotsbuilds.json file');
        })

      }
  });
  

})

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


exports = module.exports = app;