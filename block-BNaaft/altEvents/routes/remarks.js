var express = require('express');
var router = express.Router();
let Event = require('../models/event');
let Remark = require('../models/remark');

// remark like handler

router.get('/:id/likes/inc', function (req, res, next) {
  let remarksId = req.params.id;

  Remark.findByIdAndUpdate(remarksId, { $inc: { likes: 1 } }, (err, remark) => {
    if (err) return next(err);

    res.redirect('/events/' + remark.eventId);
  });
});

router.get('/:id/likes/dec', function (req, res, next) {
  let remarksId = req.params.id;

  Remark.findByIdAndUpdate(
    remarksId,
    { $inc: { likes: -1 } },
    (err, remark) => {
      if (err) return next(err);

      res.redirect('/events/' + remark.eventId);
    }
  );
});

//remark delete handler

router.get('/:id/delete', (req, res, next) => {
  let remarksId = req.params.id;

  Remark.findByIdAndDelete(remarksId, (err, deletedRemark) => {
    if (err) return next(err);

    Event.findByIdAndUpdate(
      deletedRemark.eventId,
      {
        $pull: { remarks: remarksId },
      },
      (err, event) => {
        if (err) return next(err);

        res.redirect('/events/' + deletedRemark.eventId);
      }
    );
  });
});

//handle remark edit

router.get('/:id/edit', (req, res, next) => {
  let remarksId = req.params.id;
  Remark.findById(remarksId, (err, remark) => {
    res.render('remarkEditForm', { remark });
  });
});

router.post('/:id/edit', (req, res, next) => {
  let remarksId = req.params.id;
  let data = req.body;

  Remark.findByIdAndUpdate(remarksId, data, (err, remark) => {
    let eventId = remark.eventId;
    res.redirect('/events/' + eventId);
  });
});
module.exports = router;