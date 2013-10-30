module.exports = exports = function (kernel) {

  kernel.app.post('/contact-us', function (request, response) {
    var adminList = kernel.model.User.find({root: true}).exec(function(err, admins) {
      var emailObject = {
        subject: 'Message received from Contact Us (target.monimus.com:4000)',
        template: 'contactUs',
        message: {
          name: request.body.name,
          email: request.body.email,
          message: request.body.message
        }
      };
      admins.forEach(function(admin) {
        if (admin) {
          admin.notify('email', emailObject);
        }
      });
      response.json({message: 'Thank you for your message! We\'ll get back at you soon.'});
    });

  });

  // temporary fix for stale xsrf token
  kernel.app.get('/contact-us', function(request, response) {
    response.redirect('/');
  });
};
