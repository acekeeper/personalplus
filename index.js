var express = require("express");
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');              // mongoose for mongodb
var morgan = require('morgan');                  // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var app = express();


mongoose.connect('mongodb://localhost/test');

app.use('/', express.static(__dirname + "/app/"));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));   // parse application/vnd.api+json as json
app.use(methodOverride());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/app/index.dev.html");
});

// ===================  Define Models  =================== //
// Interview model
var Interview = mongoose.model('Interview', {
    candidate: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    comment: {type: String, required: true},
    done: {type: Boolean, required: true}
});

// Candidate model
var Candidate = mongoose.model('Candidate', {
    name: {type: String, required: true},
    city: {type: String, required: false},
    phone: {type: String, required: false},
    email: {type: String, required: false},
    birthday: {type: String, required: false},
    position: {type: String, required: true},
    salary: {type: String, required: false},
    photo: {type: String, required: false},
    education: {type: Object, required: false},
    workExp: {type: Object, required: false},
    skills: {type: Object, required: false},
    additional: {type: Object, required: false}
});

// ===================  Candidate API =================== //

// create candidate and send back all todos after creation
app.post('/api/candidate', function (req, res) {
    var candidate = req.body.candidate;
    Candidate.create({
        name: candidate.name,
        city: candidate.city,
        phone: candidate.phone,
        email: candidate.email,
        birthday: candidate.birthday,
        position: candidate.position,
        salary: candidate.salary,
        photo: candidate.photo,
        education: candidate.education,
        workExp: candidate.workExp,
        skills: candidate.skills,
        additional: candidate.additional

    }, function (err) {
        if (err)
            res.send(err);
    });
    // get all candidates after create
    Candidate.find(function (err, candidates) {
        if (err)
            res.send(err);
        res.json(candidates);
    });
});

// get all candidates
app.get('/api/candidates', function (req, res) {
    Candidate.find(function (err, candidates) {
        if (err)
            res.send(err);
        res.json(candidates);
    });
});

// update candidate by id
app.put('/api/candidate/:_id', function (req, res) {

    Candidate.update({_id: req.params._id}, req.body.candidate, function (err, status) {
        if (err)
            res.send(err);
        res.send(status);
    });

});


// delete candidate by id
app.delete('/api/candidate/:_id', function (req, res) {
    console.log(req.params._id);
    Candidate.remove({
        _id: req.params._id
    }, function (err, status) {
        if (err)
            res.send(err);

        // get and return all the candidates after you create another
        Candidate.find(function (err, candidates) {
            if (err)
                res.send(err);
            res.json(candidates);
        });
    });
});

// ===================  Interview API =================== //

// create interview and send back all interview after creation
app.post('/api/interview', function (req, res) {
    var interview = req.body.interview;
    Interview.create({
        candidate: interview.candidate,
        date: interview.date,
        time: interview.time,
        comment: interview.comment,
        done: interview.done
    }, function (err) {
        if (err)
            res.send(err);
    });
    // get all interviews after create
    Interview.find(function (err, interviews) {
        if (err)
            res.send(err);
        res.json(interviews);
    });
});

// get all interviews
app.get('/api/interviews', function (req, res) {
    Interview.find(function (err, interviews) {
        if (err)
            res.send(err);
        res.json(interviews);
    });
});

// update interview by id
app.put('/api/interview/:_id', function (req, res) {

    Interview.update({_id: req.params._id}, req.body.interview, function (err, status) {
        if (err)
            res.send(err);
        res.send(status);
    });

});

// delete interview by id
app.delete('/api/interview/:_id', function (req, res) {
    console.log(req.params._id);
    Interview.remove({
        _id: req.params._id
    }, function (err, status) {
        if (err)
            res.send(err);

        // get and return all the interviews after you create another
        Interview.find(function (err, interviews) {
            if (err)
                res.send(err);
            res.json(interviews);
        });
    });
});

// ===================  Import API =================== //

app.get('/api/getExternalCV', function (req, res) {
    var cv_id = req.param('id');
    var url = 'http://www.work.ua/resumes/' + cv_id;
    var r = request(url, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body);
            var $body = $('body');
            var $name = $body.find('h1').first();
            var $position = $name.next().children('span').children('b');
            var $salary = $name.next().children('span');
            var $photo = $body.find('#cphoto').attr('src');
            var $birthday = $body.find('.shortInfo').children('dl').children('dd').first();
            var $city = $birthday.next().next();
            var $contacts = $body.find('noindex');
            console.log($($contacts[4]).children().first());
            var info_blocks = [];
            var $info_blocks = $body.find('h2');
            $info_blocks.each(function (i, item) {
                var subtitles = [];
                var $subtitles = $(item).nextAll('h3');
                $subtitles.each(function (i, subitem) {
                    subtitles[i] = {'title': $(subitem).text(), 'content': $(subitem).next('p').text()}
                });
                info_blocks[i] = {'title': $(item).children('span').text(), 'subtitles': subtitles}
            });

            var json = {
                'name': $name.text(),
                'position': $position.text(),
                'salary': $salary.text().replace(/\D+/g, ''),
                'photo': $photo,
                'birthday': $birthday.text(),
                'city': $city.text(),
                'info': info_blocks
            };
            JSON.stringify(json, null, 4);
            res.send(json)
        }
        console.log(r);
    });
});


app.listen(3001, function () {
    console.log("Rock on!")
});

exports = module.exports = app;