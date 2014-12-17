$('#connectButton').click(function(e) {
  e.preventDefault();

  $(this).attr("disabled", "disabled");
  $('input').attr("disabled", "disabled");
  
  $('form>h3').text("Establishing connection...");

  var credentials = {};
  var address = $('#server-address').val();
  var port = $('#server-port').val();
  var database = $('#database-name').val();
  var user = $('#user').val();
  var password = $('#password').val();

  if(address !== "") credentials.address = address;
  if(port !== "") credentials.port = port;
  if(database !== "") credentials.database = database;
  if(user !== "") credentials.user = user;
  if(password !== "") credentials.password = password;

  setTimeout(function() {
    $
      .ajax({
        url: '/login',
        type: 'POST',
        data: JSON.stringify(credentials),
        contentType : 'application/json',
        dataType: 'json'
      })
      .done(handleConnectionResult);
      // TODO handle errors
  }, 200);
});

function handleConnectionResult(result) {
  console.log("handled");
  if(result.error) {
    $('#connectButton').removeAttr("disabled");
    $('input').removeAttr("disabled");
    $('form>h3').text("Log in");
  } else {
    $('form>h3').text("Success!");
    setTimeout(function() {
      window.location.replace('/');
    }, 200);
  }
}
