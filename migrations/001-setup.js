/**
 * Setup dummy users. This setup only works if the kabam_dev is not created yet,
 * so we need to drop the kabam_dev database first, before we run kabam-migrate.
 *
 * TODO it might be great if we can let this setup also drop the kabam_dev
 *      database instead of do it manually.
 */
var kabamMigrate = require('kabam-plugin-migrate'),
  async = require('async');
kabamMigrate.initMongoose();

exports.up = function(next) {

  async.parallel([
    function(callback) {
      kabamMigrate.model.User.create({
        email: 'admin@monimus.com',
        username: 'kabamadmin',
        root: true,
        emailVerified: true,
        profileComplete: true
      }, function(err, admin) {
        if (err) {
          callback(err);
          return;
        }
        admin.setPassword('kabamadmin', callback);
      });
    },
    function(callback) {
      kabamMigrate.model.User.create({
        email: 'user1@monimus.com',
        username: 'user1',
        root: false,
        emailVerified: true,
        profileComplete: true
      }, function(err, user) {
        if (err) {
          callback(err);
          return;
        }
        user.setPassword('user1', callback);
      });
    },
    function(callback) {
      kabamMigrate.model.User.create({
        email: 'user2@monimus.com',
        username: 'user2',
        root: false,
        emailVerified: true,
        profileComplete: true
      }, function(err, user) {
        if (err) {
          callback(err);
          return;
        }
        user.setPassword('user2', callback);
      });
    },
    function(callback) {
      kabamMigrate.model.User.create({
        email: 'caller1@monimus.com',
        username: 'caller1',
        root: true,
        emailVerified: true,
        profileComplete: true
      }, function(err, user) {
        if (err) {
          callback(err);
          return;
        }
        user.setPassword('caller1', callback);
      });
    },
    function(callback) {
      kabamMigrate.model.User.create({
        email: 'caller2@monimus.com',
        username: 'caller2',
        root: true,
        emailVerified: true,
        profileComplete: true
      }, function(err, user) {
        if (err) {
          callback(err);
          return;
        }
        user.setPassword('caller2', callback);
      });
    },
    function(callback) {
      kabamMigrate.model.Group.create({
        name: 'Main Site',
        uri: '/',
        tier: 0,
        descriptionPublic: 'Main Group',
        descriptionForMembers: 'Main Group'
      }, function(err, group) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, group);
      });
    }
  ], function(err, results) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Users kabamadmin, caller1, caller2, user1 and user2 added');
    console.log('World group added');
    next();
  });

};

exports.down = function(next) {
  async.parallel([
    function(callback) {
      kabamMigrate.model.User.findOneAndRemove({
        username: 'kabamadmin'
      }, undefined, callback);
    },
    function(callback) {
      kabamMigrate.model.User.findOneAndRemove({
        username: 'user1'
      }, undefined, callback);
    },
    function(callback) {
      kabamMigrate.model.User.findOneAndRemove({
        username: 'user2'
      }, undefined, callback);
    },
    function(callback) {
      kabamMigrate.model.User.findOneAndRemove({
        username: 'caller1'
      }, undefined, callback);
    },
    function(callback) {
      kabamMigrate.model.User.findOneAndRemove({
        username: 'caller2'
      }, undefined, callback);
    },
    function(callback) {
      kabamMigrate.model.Group.findOneAndRemove({
        name: 'Main Site'
      }, undefined, callback);
    }
  ], function(err, results) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('initial user and group removed');
    next();
  });
};
