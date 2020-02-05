$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  
  //-----------------------------------------------------------------
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");

        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  //----------------------------------------------------------------
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    });
       
  
 
