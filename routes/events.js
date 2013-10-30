module.exports = exports = function(kabam) {

  var lookup = kabam.mw.lookup;
  var authorize = kabam.mw.authorize;
  var withPermissions = kabam.mw.withPermissions;

  function createEvent(req, res, next) {
    var data = {
      name: req.body.name,
      owner: req.session.user._id,
      group_id: req.group._id,
      start: req.body.start,
      end: req.body.end,
      _permissions: req.body._permissions
    };

    var event = new kabam.model.Event(data);
    event.save(function(err, o) {
      res.send(o);
    });
  }
  
  kabam.app.get("/events", authorize(["view"]), function(req, res) {
  });
 
  kabam.app.get(
    "/events/:id", 
    lookup("Event"), 
    authorize(["view"]), 
    function(req, res) {
    }
  );
 
  kabam.app.post(
    "/events",
    authorize(["create"]), 
    createEvent
  );
 
  kabam.app.put("/events/:id", lookup, authorize(["view"]), function(req, res) {
  });
 
  kabam.app.del("/events/:id", lookup, authorize(["delete"]), function(req, res) {
  });

};