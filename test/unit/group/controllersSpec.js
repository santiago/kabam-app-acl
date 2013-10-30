var should = chai.should();

describe('Group Controllers', function() {
  var Group;

  beforeEach(function() {
    angular.mock.module('Group');
    Group = angular.module('Group');
  });

  it('should have a GroupListController', function() {
    var GroupListCtrl;
    GroupListCtrl = Group.controller('GroupListCtrl');
    should.exist(GroupListCtrl);
  });

});
