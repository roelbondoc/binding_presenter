var renders = {
  'tab_view' : function(target, data, presenter) {
    target.append($('<h3>Tabs:</h3>'));
    $.each(data[presenter.binds_to], function(i,tab_data) {
      var a = $('<a href="#">'+getData(presenter.binding.text,tab_data)+' #'+getData(presenter.binding.selector,tab_data)+'</a>');
      a.bind('click', function(elm) {
        $('.page').hide();
        $('#'+getData(presenter.binding.selector,tab_data)).show();
      });
      target.append(a);
      target.append('<br/>');
    });
  },
  'event_list_view' : function(target, data, presenter) {
    target.append($('<h3>Events:</h3>'));
    $.each(data.lists[presenter.binds_to], function(i,list_data) {
      var list_container = $('<div id='+getData(presenter.binding.id,list_data)+' class="page" style="border:1px solid black;display:none;"></div>');
      list_container.append($('<p>Timestamp:'+getData(presenter.binding.id,list_data)+'</p>'));
      $.each(list_data.data, function(i, event_data) {
        $.each(event_data.teams, function(i, team_data) {
          var team_binding = presenter.binding.team_binding
          list_container.append($('<h4>'+getData(team_binding.name,team_data)+' '+getData(team_binding.score,team_data)+'</h4>'));
        });
        list_container.append($('<div>Clock: '+getData(presenter.binding.clock,event_data)+'</div>'));
      });
      target.append(list_container);
    });
    $('div', target).first().show();
  }
};

var getData = function(attribute, data) {
  var keys = attribute.split('.');
  $.each(keys, function(i,key) {
    data = data[key];
  });
  return data;
};

$(function() {
  var n = new Date().getTime();
  $.getJSON('data/events.json?n='+n, function(data) {
    $.get('presenters/events.yml?n='+n, function(yaml) {
      var presenter = YAML.eval(yaml);
      var container = $('<ul></ul>');

      $.each(presenter.layout, function(i,view) {
        var view_container = $('<li></li>');
        var view_meta = presenter.views[view];
        renders[view_meta.type](view_container, data, view_meta);
        container.append(view_container);
      });

      $('#content').append(container);
    });
  });
});
