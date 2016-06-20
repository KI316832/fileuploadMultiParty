var express = require('express');
var body=require('body-parser');
var jsonfile = require('jsonfile');
var multiparty = require('multiparty');
const fs = require('fs');

var app = express();

app.use(body());
app.use(express.static('public'));

app.post('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/getjson', function (req, res) {
  console.log("inside get request");
  var content=fs.readFileSync('./public/json/myTutorials.json');
  res.json(content.toString());
  console.log("Res::"+res);
});

app.post('/add_details', function (req, res) {

  var form=new multiparty.Form();
  form.parse(req,function(err,fields,files){
    console.log("at add_details img upload"+err);
    fs.readFile(files.poster[0].path,function(err,data){
      var newPath=__dirname+"/public/img/"+fields.title[0]+".jpg";
      fs.writeFile(newPath,data,function(err){
        console.log("at add_details img upload error"+err);
      })
    })

    console.log("***********"+fields.title[0]);
    var title = fields.title[0];
    var year = fields.year[0];
    var actors = fields.actors[0];
    var director = fields.director[0];
    var plot = fields.plot[0];
    var language = fields.language[0];
    var country = fields.country[0];
    var released = fields.released[0];
    var imdbRating = fields.imdbRating[0];
    var awards = fields.awards[0];
    var poster = __dirname+"/public/img/"+title+".jpg";


    jsonfile.readFile(__dirname+"/"+"public"+"/"+"json"+"/"+"myTutorials.json", function(err, obj) {


        var newObj={};

            newObj.Title=title;
            newObj.Year=year;
            newObj.Actors=actors;
            newObj.Director=director;
            newObj.Plot=plot;
            newObj.Language=language;
            newObj.Country=country;
            newObj.Released=released;
            newObj.imdbRating=imdbRating;
            newObj.Awards=awards;
            newObj.Poster="/img/"+fields.title[0]+".jpg";;

            obj.push(newObj);

        jsonfile.writeFile(__dirname+"/"+"public"+"/"+"json"+"/"+"myTutorials.json", obj, function(err) {
              if (err) throw err;
              console.log("+++++++++"+err);
                res.redirect( "index.html" );
          });

      })



  })





})


app.post('/update_details', function (req, res) {

  var title = req.body.title;
  var year = req.body.year;
  var actors = req.body.actors;
  var director = req.body.director;
  var plot = req.body.plot;
  var language = req.body.language;
  var country = req.body.country;
  var released = req.body.released;
  var rating = req.body.imdbRating;
  var awards = req.body.awards;
  var poster = req.body.poster;



  jsonfile.readFile(__dirname+"/"+"public"+"/"+"json"+"/"+"myTutorials.json", function(err, obj) {
       var fileObj = obj;

      for(var i=0;i<obj.length;i++){
        if(obj[i].Title===title){
          obj[i].Year=year;
          obj[i].Actors=actors;
          obj[i].Director=director;
          obj[i].Plot=plot;
          obj[i].Language=language;
          obj[i].Country=country;
          obj[i].Released=released;
          obj[i].imdbRating=rating;
          obj[i].Awards=awards;
          obj[i].Poster=poster;



          fileObj[i]=obj[i];
          console.log("fileObj :"+fileObj[i]);
          break;
        }
      }

      jsonfile.writeFile(__dirname+"/"+"public"+"/"+"json"+"/"+"myTutorials.json", fileObj, function(err) {
            if (err) throw err;
            console.log("+++++++++"+err);
        });

    })




  res.redirect( "index.html" );

})



app.post('/deleteMovie', function (req, res) {
  console.log("***************");

  var Title=req.body.titleDelete;
    console.log(req.param('title  :'+Title));
  var fileObj;
  jsonfile.readFile(__dirname+"/"+"public"+"/"+"json"+"/"+"myTutorials.json", function(err, obj) {

       console.log("fileObj"+fileObj);
       for(var i=0;i<obj.length;i++){
         if(obj[i].Title===Title){
           obj.splice(i,1);
           break;
         }
       }


       console.log("oooooooo"+obj);

       jsonfile.writeFile(__dirname+"/"+"public"+"/"+"json"+"/"+"myTutorials.json", obj, function(err) {
             if (err) throw err;
             console.log("+++++++++"+err);
         });

})



  res.redirect( "index.html" );
});

var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
