var working = false;
$(".login").on("submit", function(e) {
  if (working) return;
  working = true;
  var $this = $(this),
    $state = $this.find("button > .state");
  $this.addClass("loading");
  $state.html("Authenticating");
  var email = $("#username").val();
  var password = $("#key").val();
 
  var url= "/"+ $("#types").val() + "login"
  alert("url")
 
if($("#types").val()=="Select Type"){
  alert("Please select a type")
  window.location="/main"
}
else{
  $.ajax({
    type: "POST",
    url: url,
    data: { email: email, password: password },
    dataType: "json",
    success: req => {
      if (req.success == true) {
        $this.addClass("ok");
        $state.html("Welcome back!");

        setTimeout(() => {

          window.location = "/main";
        }, 3000);
      } else {
        //alert("Please enter proper username and password")
           $this.addClass("undone");
        $state.html("Invalid user");
      }
    }
  }).done(function() {
    console.log("http request succeeded");
  });
}});




