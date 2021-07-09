var express = require('express');
var Event = require('../models/event');
var Remark = require('../models/remark');
let _ = require('lodash');
let url = require('url');
let qs = require('querystring');
var router = express.Router();


/* GET event listing. */
router.get('/', function (req, res, next) {
  Event.find({}, (err, events) => {
    if (err) return next(err);
    //arr for array of categories

    let arr = events.map((ele) => {
      return ele.event_category;
    });
    arr = _.flattenDeep(arr);
    arr = _.uniq(arr);
    // arrLocations for array of locations

    let arrLocations = events.map((ele) => {
      return ele.location.trim();
    });
    arrLocations = _.flattenDeep(arrLocations);
    arrLocations = _.uniq(arrLocations);

    res.render('eventList', { events, arr, arrLocations });
  });
});

//creating new event

router.get('/new', (req, res, next) => {
  res.render('eventCreateForm');
});

router.post('/new', (req, res, next) => {
  let data = req.body;
  let arr = data.category.split(',').map((ele) => {
    return ele.trim();
  });
  data.event_category = arr;
  Event.create(data, (err, event) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});

//details event

router.get('/:id', (req, res, next) => {
  let eventId = req.params.id;
  Event.findById(eventId)
    .populate('remarks')
    .exec((err, event) => {
      if (err) return next(err);
      res.render('eventDetails', { event });
    });
});

//edit event
router.get('/:id/edit', (req, res, next) => {
  let eventId = req.params.id;

  Event.findById(eventId, (err, event) => {
    if (err) return next(err);

    res.render('eventEditForm', { event });
  });
});

router.post('/:id/edit', (req, res, next) => {
  let eventId = req.params.id;
  let data = req.body;
  let arr = data.category.split(',').map((ele) => {
    return ele.trim();
  });
  data.event_category = arr;

  Event.findByIdAndUpdate(eventId, data, (err, event) => {
    if (err) return next(err);

    res.redirect('/events/');
  });
});

//delete event

router.get('/:id/delete', (req, res, next) => {
  let eventId = req.params.id;

  Event.findByIdAndDelete(eventId, (err, deleted) => {
    if (err) return next(err);

    res.redirect('/events');
  });
});

//event like handler

router.get('/:id/like/inc', (req, res, next) => {
  let eventId = req.params.id;

  Event.findByIdAndUpdate(eventId, { $inc: { likes: 1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + eventId);
  });
});

router.get('/:id/like/dec', (req, res, next) => {
  let eventId = req.params.id;

  Event.findByIdAndUpdate(eventId, { $inc: { likes: -1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + eventId);
  });
});

//remark create

router.post('/:id/remarks/new', (req, res, next) => {
  let eventId = req.params.id;
  let data = req.body;
  data.eventId = eventId;
  Remark.create(data, (err, remark) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      eventId,
      { $push: { remarks: remark.id } },
      (err, event) => {
        if (err) return next(err);
        res.redirect('/events/' + eventId);
      }
    );
  });
});

//sorting by tags

router.get('/sort/tags', (req, res, next) => {
  console.log(req.query);
  let parsedUrl = url.parse(req.url);
  let queryObj = qs.parse(parsedUrl.query);
  console.log(queryObj.name);

  Event.find({ event_category: queryObj.name }, (err, events) => {
    if (err) return next(err);
    Event.find({}, (err, dummy) => {
      if (err) return next(err);

      //arr for array of categories

      let arr = dummy.map((ele) => {
        return ele.event_category;
      });
      arr = _.flattenDeep(arr);
      arr = _.uniq(arr);

      // arrLocations for array of locations

      let arrLocations = dummy.map((ele) => {
        return ele.location.trim();
      });
      arrLocations = _.flattenDeep(arrLocations);
      arrLocations = _.uniq(arrLocations);

      res.render('eventList', { events, arr, arrLocations });
    });
  });
});

//sorting by locations

router.get('/sort/location', (req, res, next) => {
  let parsedUrl = url.parse(req.url);
  let queryObj = qs.parse(parsedUrl.query);
  console.log(queryObj.name);

  Event.find({ location: queryObj.name }, (err, events) => {
    if (err) return next(err);
    Event.find({}, (err, dummy) => {
      if (err) return next(err);

      //arr for array of categories

      let arr = dummy.map((ele) => {
        return ele.event_category;
      });
      arr = _.flattenDeep(arr);
      arr = _.uniq(arr);

      // arrLocations for array of locations

      let arrLocations = dummy.map((ele) => {
        return ele.location.trim();
      });
      arrLocations = _.flattenDeep(arrLocations);
      arrLocations = _.uniq(arrLocations);

      res.render('eventList', { events, arr, arrLocations });
    });
  });
});

//sorting by date

router.get('/sort/date/:type', (req, res, next) => {
  let type = req.params.type;

  //for sorting in accending order
  if (type === 'acc') {
    Event.find({})
      .sort({ start_date: 1 })
      .exec((err, events) => {
        if (err) return next(err);

        Event.find({}, (err, dummy) => {
          if (err) return next(err);

          //arr for array of categories

          let arr = dummy.map((ele) => {
            return ele.event_category;
          });
          arr = _.flattenDeep(arr);
          arr = _.uniq(arr);

          // arrLocations for array of locations

          let arrLocations = dummy.map((ele) => {
            return ele.location.trim();
          });
          arrLocations = _.flattenDeep(arrLocations);
          arrLocations = _.uniq(arrLocations);

          res.render('eventList', { events, arr, arrLocations });
        });
      });
  } else if (type === 'dec') {
    //for sorting in secending order
    Event.find({})
      .sort({ start_date: -1 })
      .exec((err, events) => {
        if (err) return next(err);

        Event.find({}, (err, dummy) => {
          if (err) return next(err);

          //arr for array of categories

          let arr = dummy.map((ele) => {
            return ele.event_category;
          });
          arr = _.flattenDeep(arr);
          arr = _.uniq(arr);

          // arrLocations for array of locations

          let arrLocations = dummy.map((ele) => {
            return ele.location.trim();
          });
          arrLocations = _.flattenDeep(arrLocations);
          arrLocations = _.uniq(arrLocations);

          res.render('eventList', { events, arr, arrLocations });
        });
      });
  } else {
    next();
  }
});

module.exports = router;
