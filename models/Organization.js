exports.name = "Organization";

exports.init = function(kabam) {
  var GroupFactory = kabam.groups.GroupFactory;

  var Organization = GroupFactory("Organization", {
    roles: ["admin", "manager", "guest"],
    children: ["Course"],
    permissions: {
      "create": ["manager"],
      "edit": ["manager"],
      "participate": ["manager"],
      "view": ["manager", "guest"],
      "delete": []
    }
  });

  return Organization;
};