exports.name = "Course";

exports.initFunction = function(kabam) {
  var GroupFactory = kabam.groups.GroupFactory;

  var Course = GroupFactory("Course", {
    roles: ["instructor", "assistant", "student", "guest"],
    fields: ["instructor"],
    parent: "Organization",
    permissions: {
      "edit": ["instructor", "assistant"],
      "participate": ["instructor", "assistant", "student"],
      "view": ["instructor", "assistant", "student", "guest"],
      "delete": []
    }
  });

  return Course;
};