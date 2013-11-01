module.exports = exports = function (kabam) {

  kabam.app.get('/', function(req, res) {
    if (req.user) {
      console.log(req.session);
      return res.render('index', {
        user: req.user
      });
    } else {
      req.session.user = null;
      req.user = null;
      return res.render('login');
    }
  });

  kabam.app.get('/users', function(req, res) {
    kabam.model.User.find(function(err, users) {
      res.send(users.map(function(u) {
        return u.username;
      }).sort());
    });
  });

  kabam.app.get('/home', function(req, res) {
    response.render('angular/index', { layout: false });
  });
};
