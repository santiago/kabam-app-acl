module.exports = exports = function (kabam) {

  // kabam.app.all("*", function(req, res, next) {
  //   if(!req.session.user) {
  //     kabam.model.User.findOne({ username: "Santiago"},
  //       function(err, user) {
  //         req.session.user = user;
  //         next();
  //       });
  //   }
  //   next();
  // });

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

  kabam.app.get('/home', function(req, res) {
    response.render('angular/index', { layout: false });
  });
};
