jQuery(function($) {

  $.fn.accessLevelMenu = function() {
    this.each(function() {
      var $this = $(this);
      $(this).find("ul a").click(function(e) {
        e.preventDefault();

        var access = $(this).attr("value");
        $this.find("span.selected").text(access);
        $this.attr("access", access.toLowerCase());
      });
    });
  };

  $.fn.topUserMenu = function(options) {
    this.each(function() {
      var $this = $(this);
      $(this).find("ul a").click(function(e) {
        e.preventDefault();

        var opt = $(this).attr("value");
        options[opt]();
      });
    });
  };

  function ajaxError(e, res, req) {
    //callback();
    if(res.status === 403) {
      alert("You're not allowed to do this!");
      if("GET" === req.type.toUpperCase()) {
        location.href = "/";
      }
    }
  }

  $(document).ajaxError(ajaxError);

  function capitaliseFirst(string) {
    if(!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var currentOrg = null;
  var currentCourse = null;

  // AddMember component to interact with
  // Add Member modal form
  var AddMember = new (function() {
    var _this = this;

    this.save = function() {
      var group_id = _this.selectedGroup;
      var group_type = _this.selectedGroupType;
      var data = {
        member_id: _this.selectedMember,
        access: _this.selectedAccess
      };

      var url = "/api/"+group_type+"s/"+group_id+"/members";

      if(data.member_id && data.access) {
        $.post(url, data, function(res) {
          _this.clear();
          $(".modal").modal("hide");
          reloadAccordingly();
        });
      }
    };

    this.clear = function() {
      _this.selectedGroup = null;
      _this.selectedGroupType = null;
      _this.selectedMember = null;
      _this.selectedAccess = null;
    };

    this.clear();

    $(document).ajaxError(function() {
      $("#addOrgMemberModal, #addCourseMemberModal").modal("hide");
    });

    $("#addOrgMemberModal, #addCourseMemberModal").each(function() {
      var $modal = $(this);

      $modal.find(".access-menu ul a").click(function(e) {
        e.preventDefault();

        var access = $(this).attr("value");
        $modal.find(".access-menu span.selected").text(access);
        _this.selectedAccess = access.toLowerCase();
      });

      // Typeahead for autocomplete
      $modal.find(".search-username").typeahead({
        name: "Search",
        remote: "/users/autocomplete?q=%QUERY",
        limit: 12
      });

      // When an option is selected
      $modal.find(".search-username").on("typeahead:selected", function(e, a) {
        _this.selectedMember = a.tokens.shift();
      });

      $modal.find(".save-member").click(function(e) {
        e.preventDefault();
        _this.save();
      });
    });

    listen("show-org", function(e, id) {
      _this.selectedGroup = id;
      _this.selectedGroupType = "organization";
    });

    listen("show-course", function(e, org_id, course_id) {
      _this.selectedGroup = course_id;
      _this.selectedGroupType = "course";
    });
  })();

  // Control for "Add Section" modal
  var AddSection = (function() {
    var $modal = $("#addSectionModal");
    // Date pickers for "Add Section" modal
    var datepickerOpts = {
      autoclose: true,
      orientation: "top",
      format: "yyyy/mm/dd"
    };
    $modal
      .find("form [name=start_date]").datepicker(datepickerOpts)
        .end()
      .find("form [name=end_date]").datepicker(datepickerOpts);

    function getDate(dateString) {
      if(!dateString) return;
      var date = new Date();
      dateString.split("/").forEach(function(d, i) {
        d = parseInt(d);
        switch(i) {
          case 0:
            date.setFullYear(d);
            break;
          case 1:
            date.setMonth(d-1);
            break;
          case 2:
            date.setDate(d);
            break;
        }
      });
      return date;
    }

    $(document).ajaxError(function() {
      $("#addSectionModal").modal("hide");
    });

    // Save button
    $modal.find("#save-section").click(function(e) {
      e.preventDefault();
      $(this).blur();

      var start_date, end_date;
      try {
        start_date = getDate($modal.find("form [name=start_date]").val()),
        end_date = getDate($modal.find("form [name=end_date]").val())
      } catch(e) {
        alert("Invalid dates, please check and try again");
        return;
      }

      var section = {
        name: $modal.find("form [name=name]").val(),
        parent_id: currentCourse._id,
        start_date: start_date,
        end_date: end_date
      };

      (function validate() {
        if(start_date.getTime() > end_date.getTime()) {
          alert("Start Date greater than End Date");
          return false;
        }

        if(!section.parent_id) {
          alert("A section needs to belong to a Course");
          return false;
        }

        if(!section.name) {
          alert("Please name this section");
          return false;
        }

        return true;
      })() &&
      $.post("/api/sections", section, function() {
        getCourse(null, currentCourse._id);
        $("#addSectionModal").modal("hide");
      });
    });

  })();

  var Section = (function() {
    var _this = this;
    var $modal = $("#showSectionModal");
    var $table = $modal.find("table");
    var selectedMember, section_id;

    // Typeahead for autocomplete
    $modal.find(".search-username").typeahead({
      name: "Search",
      remote: "/users/autocomplete?q=%QUERY",
      limit: 12
    });

    $modal.find(".add-student .access-menu").accessLevelMenu();

    $modal.find(".search-username").css({ top: "49px !important" });

    $modal.find(".search-username").on("typeahead:selected", function(e, a) {
      selectedMember = a.tokens.shift();
    });

    this.show = function(id) {
      section_id = id;
      $.get("/api/sections/"+section_id, function(s) {
        var title = currentCourse.data.name+" - "+s.data.name
        $modal.find("h4.modal-title").text(title);
        $modal.modal("show");

        var $table = $modal.find("table");
        var $rowLayout = $table.find("tr.layout");
        $table.find("tr:not(.header,.layout)").remove();
        s.members.forEach(function(m) {
          var $row = $rowLayout.clone();
          $row.removeClass("layout");
          $row.find(".name").text(m.username);
          var role = capitaliseFirst(m.roles.shift());
          $row.find(".access-menu .selected").text(role);
          $table.append($row);
        });
        
        $table.removeClass("hide");

      });
    };

    $modal.find("#add-section-member").click(function(e) {
      e.preventDefault();

      var member = {
        member_id: selectedMember,
        access: $modal.find(".add-student .access-menu").attr("access")
      };

      (function validate() {
        if(!member.member_id) {
          alert("You must select an user");
          return false;
        }
        if(!member.access) {
          alert("You must select an access level");
          return false;
        }
        return true;
      })() &&
      $.post("/api/sections/"+section_id+"/members", member, function(data) {
        getCourse(currentOrg._id, currentCourse._id);
        _this.show(section_id);
      });
    });

    return this;
  })();

  function emit(msg, params) {
    $(document).trigger(msg, params);
  }

  function listen(msg, callback) {
    $(document).on(msg, callback)
  }

  function renderOrgsList(data) {
    var $panel = $("#orgs-list");
    $panel.find(".list-group-item:not(.layout)").remove();

    data.forEach(function(org) { 
      var $item = $panel.find(".list-group-item.layout").clone();
      $item.removeClass("layout");
      $item.find("h5 a")
        .text(org.name)
        .attr("href", "#/organizations/"+org._id);
      $item.find(".list-group-item-text").text(org.description||"");
      $panel.find(".list-group").append($item);
    });
  }

  function getOrgs() {
    // List organizations
    $.get("/api/organizations", function(data) {
      renderOrgsList(data);
    });
  }

  function getOrg(id, callback) {
    $.get("/api/organizations/"+id, function(data) {
      currentOrg = data;
      renderOrg(data);
      callback && callback();
    });
  }

  function renderOrg(data) {
    var group = data.data;
    var members = data.members;

    var $panel = $("#show-org");
    $panel.find("h4 .title").text(group.name);

    var $table = $panel.find("#org-members table");
    var $rowLayout = $table.find("tr.layout");
    $table.find("tr:not(.header,.layout)").remove();
    members.forEach(function(m) {
      var $row = $rowLayout.clone();
      $row.removeClass("layout");
      $row.find(".name").text(m.username);
      var role = capitaliseFirst(m.roles.shift());
      $row.find(".access-menu .selected").text(role);
      $row.find("input[type=checkbox]").attr("_id", m._id);
      $table.append($row);
    });
    
    $table.removeClass("hide");


    $("#addOrgMemberModal, #addOrgCourseModal")
      .find("form [name=org]").val(group.name);

    // Delete members
    $("#org-members").find("input[type=checkbox]").change(function() {
      var checked = $("#org-members").find("input[type=checkbox]:checked").length;
      if(checked > 0)
        $("#org-members .delete-btn").show();
      else
        $("#org-members .delete-btn").hide();
    });

    getCourses(group._id);
  }

  function getCourses(group_id) {
    $.get("/api/organizations/"+group_id+"/courses", function(data) {
      renderCourseList(group_id, data);
    });
  }

  function getCourse(org_id, course_id) {
    if(!currentOrg) {
      return getOrg(org_id, get);
    } else {
      get();
    }

    function get() {
      $.get("/api/courses/"+course_id, function(data) {
        console.log(data);
        currentCourse = data;
        renderCourse(data);
      });
    }
  }

  function renderCourseList(group_id, courses) {
    var $panel = $("#org-courses");
    var $table = $panel.find("table");
    var $rowLayout = $table.find("tr.layout");
    $table.find("tr:not(.header,.layout)").remove();
    courses.forEach(function(c) {
      var $row = $rowLayout.clone();
      $row.removeClass("layout");
      $row.find(".name a")
        .text(c.name)
        .attr("href", "#/organizations/"+group_id+"/courses/"+c._id);
      $table.append($row);
    });
    
    $table.removeClass("hide");
  }

  function renderCourse(data) {
    var course = data.data;
    var members = data.members;

    var $panel = $("#show-course");
    $panel.find("h4 .title").text(course.name);
    $panel.find("h4 a.org")
      .text(currentOrg.data.name)
      .attr("href", "#/organizations/"+currentOrg._id);

    var $table = $panel.find("#course-members table");
    var $rowLayout = $table.find("tr.layout");
    $table.find("tr:not(.header,.layout)").remove();
    members.forEach(function(m) {
      var $row = $rowLayout.clone();
      $row.removeClass("layout");
      $row.find(".name").text(m.username);
      var role = capitaliseFirst(m.roles.shift());
      $row.find(".access-menu .selected").text(role);
      $row.find("input[type=checkbox]").attr("_id", m._id);
      $table.append($row);
    });
    
    $table.removeClass("hide");

    if(data.sections.length) {
      renderSections(data.sections);
    }

    // Delete members
    $("#course-members").find("input[type=checkbox]").change(function() {
      var checked = $("#course-members").find("input[type=checkbox]:checked").length;
      if(checked > 0)
        $("#course-members .delete-btn").show();
      else
        $("#course-members .delete-btn").hide();
    });

    // Populate "Add Section" modal
    $("#addSectionModal")
      .find("form [name=org]").val(currentOrg.data.name)
        .end()
      .find("form [name=course]").val(currentCourse.data.name);
  }

  function renderSections(sections) {
    var $panel = $("#course-sections");
    var $table = $panel.find("table");
    var $rowLayout = $table.find("tr.layout");
    $table.find("tr:not(.header,.layout)").remove();

    sections.forEach(function(s) {
      var start = new Date(s.custom.start_date).toDateString();
      var end = new Date(s.custom.end_date).toDateString();

      var $row = $rowLayout.clone();
      $row.removeClass("layout");
      $row.find(".name a")
        .text(s.name)
        .attr("_id", s._id);
      $row.find(".start").text(start);
      $row.find(".end").text(end);
      $table.append($row);
    });

    $("#course-sections tr:not(.layout)").find(".name a")
    .click(function(e) {
      e.preventDefault();
      Section.show($(this).attr("_id"));
    });

    $table.removeClass("hide");
  }

  // Create Org modal form
  $("#save-org").click(function(e) {
    e.preventDefault();
    $(this).blur();

    var $form = $(this).closest("form");

    var group = {
      name: $form.find("[name=name]").val().trim(),
      description: $form.find("[name=description]").val().trim(),
      group_type: "Organization"
    };

    if(!group.name || !group.description || !group.group_type) {
      alert("Please complete the form");
      return;
    }

    $.post("/api/organizations", group, function(data) {
      $("#createOrgModal").modal("hide");
      getOrgs();
    });
  });

  // Create Course modal form
  $("#save-course").click(function(e) {
    e.preventDefault();
    $(this).blur();

    var $form = $(this).closest("form");

    var course = {
      name: $form.find("[name=name]").val().trim(),
      description: $form.find("[name=description]").val().trim(),
      parent_id: currentOrg._id,
      group_type: "Course"
    };

    if(!course.name || !course.description || !course.group_type) {
      alert("Please complete the form");
      return;
    }

    $.post("/api/courses", course, function(data) {
      $("#addOrgCourseModal").modal("hide");
      getCourses(currentOrg._id);
    });
  });

  // Fix styling
  setTimeout(function() {
    $(".twitter-typeahead").removeAttr("style");
    $(".tt-hint").hide();
  }, 200);

  function hideContentPanels() {
    $("#orgs-list, #show-org, #show-course").hide();
  }

  function showOrgCourses() {
    if(location.hash.match(/courses/)) return;
    location.hash = location.hash+"/courses";
  }
  $("a[href=#org-courses]").on("show.bs.tab", showOrgCourses);

  function showOrgMembers() {
    if(location.hash.match(/courses/)) {
      location.hash = location.hash.replace("/courses", "");
    }
  }
  $("a[href=#org-members]").on("show.bs.tab", showOrgMembers);

  // Top UserMenu
  $(".navbar .access-menu").topUserMenu({
    "logout": function() {
      $.post("/auth/logout", {}, function() {
        location.href = "/";
      });
    }
  });

  // Delete members
  $(".delete-btn.delete-members").click(function(e) {
    e.preventDefault();
    $(this).blur();

    var members = $("input[type=checkbox]:checked").map(function() {
      return $(this).attr("_id");
    }).toArray();
    
    var url = "/api"+location.hash.replace(/#/, "")+"/members";
    $.ajax({
      url: url,
      type: "DELETE",
      data: { members: members },
      success: function(data) {
        $(".delete-btn.delete-members").hide();
        reloadAccordingly();
      }
    });
  });

  function reloadAccordingly() {
    if(location.hash.match("courses")) {
      getCourse(currentOrg._id, currentCourse._id);
      return;
    } else if(location.hash.match("organizations")) {
      getOrg(currentOrg._id);
      return;
    }
  }

  var Router = new (Backbone.Router.extend({

    routes: {
      "": "orgsList",
      "organizations/:id": "showOrg",
      "organizations/:org_id/courses": "showOrgCourses",
      "organizations/:org_id/courses/:course_id": "showCourse"
    },

    orgsList: function() {
      hideContentPanels();
      // Get list of organizations
      getOrgs();
      $("#orgs-list").show();
    },

    showOrgCourses: function(org_id) {
      Router.showOrg(org_id);
      $("a[href=#org-courses]").tab("show");
    },

    showOrg: function(id) {
      hideContentPanels();
      emit("show-org", [id]);
      getOrg(id);
      $("#show-org").show();
    },

    showCourse: function(org_id, course_id) {
      hideContentPanels();
      emit("show-course", [org_id, course_id]);
      getCourse(org_id, course_id);
      $("#show-course").show();
    }

  }))();
  Backbone.history.start();

});

