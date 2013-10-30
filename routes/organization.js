module.exports = exports = function(kabam) {

  // Whatever needs to be done when an error
  // occurs during request lifecycle
  function error(req, res, next) {
    if(!req.error) return res.send(req._data);
    res.send(req.error, 400);
  }

  var Domain = {
    Org: kabam.model.Organization,
    Course: kabam.model.Course,
    Section: kabam.model.Section
  };

  Domain.Org.restify(kabam.app);
  Domain.Course.restify(kabam.app);
  Domain.Section.restify(kabam.app);

  function addMembers(req, res, next) {
    var group_type = req.group_type;
    Domain[group_type].findById(req.params.id, function(err, org) {
      if(err) {
        req.error = err;
        return next();
      }

      if(!org) {
        return res.send(404);
      }

      org.addMember({
        member_id: req.body.member_id,
        access: req.body.access
      }, function() {
        res.send({ ok: 1 });
      });
    });
  };

  function autocompleteUsername(req, res) {
    var regex = new RegExp("^"+req.query.q, 'i');
    var query = User.find({ username: regex }, { "username": 1 })
      .sort({ "username": 1 })
      .limit(20);

    query.exec(function(err, users) {
      if (!err) {
        res.send(
          users.map(function(u) {
            return {
              value: u.toObject().username,
              tokens: [u.toObject()._id]
            }
          })
        );
      } else {
        res.send(500);
      }
    });
  }

  // Autocomplete usernames
  kabam.app.get("/users/autocomplete", autocompleteUsername);
};
