// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
const history = require('connect-history-api-fallback')

var server = require('http').Server(app);

var io = require('socket.io')(server);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('tz', 'GMT+8');

// allow cross something
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var port = process.env.PORT || 8081;        // set our port

var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/babyproject')

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error!'));

var Baby = require('./models/baby');
var Father = require('./models/father');
var Mother = require('./models/mother');
var Intake = require('./models/intake');
var Output = require('./models/output');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

app.use(express.static(__dirname+'/public'));

//remove this one when testing API only 
//app.use(history());app.use(express.static(__dirname+'/public'));



// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// more routes for our API will happen here

// on routes that end in /babys
// ----------------------------------------------------
router.route('/babies')
    // create a baby (accessed at POST http://localhost:8080/api/babys)
    .post(function(req, res) {
        console.log(mongoose.connection.readyState);
        var baby = new Baby({name: req.body.name});      // create a new instance of the baby model
        baby.save()
        .then(() => res.json("New Baby Added!"))
        .catch((err) => res.send(err));
        console.log(baby.name);
    })

    // get all the babys (accessed at GET http://localhost:8080/api/babys)
    .get(function(req, res) {
        Baby.find(function(err, babies) {
            console.log(babies);
            if (err)
                res.send(err);

            res.json(babies);
        });
    });

router.route('/babies/:baby_id')

    // get the baby with that id (accessed at GET http://localhost:8080/api/babys/:baby_id)
    .get(function(req, res) {
        Baby.findById(req.params.baby_id, function(err, baby) {
            if (err)
                res.send(err);
            res.json(baby);
        });
    })

     // update the baby with this id (accessed at PUT http://localhost:8080/api/babys/:baby_id)
     .put(function(req, res) {

          // use our baby model to find the baby we want
          Baby.findById(req.params.baby_id, function(err, baby) {

              if (err)
                  res.send(err);

              baby.name = req.body.name;  // update the babys info

              // save the baby
              baby.save(function(err) {
                  if (err)
                      res.send(err);

                  res.json({ message: 'Baby updated!' });
              });

          });
      })

      .delete(function(req, res) {
          Baby.remove({
              _id: req.params.baby_id
          }, function(err, baby) {
              if (err)
                  res.send(err);

              res.json({ message: 'Successfully deleted' });
          });
      });


//Baby intakes
router.route('/babies/:baby_id/intake')

    .post(function(req, res) {
        var intake = new Intake({
            baby: req.params.baby_id,
            type: req.body.type,
            breast: req.body.breast
        });
        Baby.findById(req.params.baby_id, function(err, baby) {
            if (err)
                res.send(err);
            intake.save()
            .then(() => res.json("New Intake: "+intake.id+" Added to baby "+baby.name+"!"))
            .catch((err) => res.send(err)); 
        });
    })

    .get(function(req, res){
        Intake.find({baby: req.params.baby_id},function(err, intakes) {
            if (err)
                res.send(err);
            res.json(intakes);
        });
    });

router.route('/intake/:intake_id')
    .get(function(req, res){
        Intake.findById(req.params.intake_id, function(err, intake){
            if(err)
                res.send(err);
            res.json(intake)
        });
    })
    .put(function(req, res){
        Intake.findById(req.params.intake_id, function(err, intake){
            if(err)
                res.send(err);
            res.json({message: 'intake updated!'})
        })
    })
    .delete(function(req, res){
        Intake.remove({
            _id: req.params.intake_id
        }, function(err, intake) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

router.route('/intake/:intake_id/inc')
    .get(function(req, res) {
        Intake.findOneAndUpdate({ _id: req.params.intake_id }, { $inc: { "quantity": 0.5 } }, {new: true },function(err, response) {
            if (err) {
                res.send(err);
            }
            res.json({message: response})
        })
    });

router.route('/intake/:intake_id/dec')
    .get(function(req, res) {
        Intake.findOneAndUpdate({ _id: req.params.intake_id }, { $inc: { "quantity": -0.5 } }, {new: true },function(err, response) {
            if (err) {
                res.send(err);
            }
            res.json({message: response})
        })
    });

router.route('/intake/:intake_id/finish')
    .get(function(req, res) {

        // use our baby model to find the baby we want
        Intake.findById(req.params.intake_id, function(err, intake) 
        {

            if (err)
                res.send(err);

            intake.end_time = Date.now();  // update the babys info

            // save the baby
            intake.save(function(err, intake) {
                if (err)
                    res.send(err);
                res.json({ message: 'Intake '+intake.id+' Ended! Duration is ' + Math.floor((intake.end_time - intake.start_time)/60000) + ' minutes.' });
            });

        });
    });

// routes for baby poo or peeing
router.route('/babies/:baby_id/output')
    .post(function(req, res){
        var output = new Output({
            baby: req.params.baby_id,
            type: req.body.type,
            remarks: req.body.remarks
        });
        Baby.findById(req.params.baby_id, function(err, baby) {
            if (err)
                res.send(err);
            output.save()
            .then(() => res.json("New Output: "+output.id+" Added to baby "+baby.name+"!"))
            .catch((err) => res.send(err)); 
        });
    })

    .get(function(req, res){
        Output.find({baby: req.params.baby_id},function(err, outputs) {
            if (err)
                res.send(err);
            res.json(outputs);
        });
    });

router.route('/output/:output_id')
    .get(function(req, res){
        Output.findById(req.params.output_id, function(err, intake){
            if(err)
                res.send(err);
            res.json(output)
        });
    })
    .put(function(req, res){
        Output.findById(req.params.output_id, function(err, intake){
            if(err)
                res.send(err);
            res.json({message: 'Output updated!'})
        })
    })
    .delete(function(req, res){
        Output.remove({
            _id: req.params.output_id
        }, function(err, output) {
            if (err)
                res.send(err);
            res.json({ message: 'Output Successfully deleted' });
        });
    });

    // START THE SERVER
// =============================================================================
server.listen(port);

io.on('connection', function (socket) {
    console.log('Another user Connected');
    io.emit('notify_connection');
    socket.on('update_intake_table', function (something) {
      io.emit('update_tables');
    });
  });

console.log('Magic happens on port ' + port);