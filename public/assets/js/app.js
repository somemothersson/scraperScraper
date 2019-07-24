

$("#scrape").on("click", function() {
  console.log("clicked")
  $.ajax({
    method: "GET",
    url: "/scrape" 
  })
    .then(function(data) {
      // Log the response
      console.log(data);
    });
    
});


// Whenever someone clicks a p tag
$("#savenote").on("click", function() {
  // Empty the notes from the note section
  
  // Save the id from the a tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the save article button
$("#save").on("click", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $("#item").attr("data-id");
console.log(`id = ${thisId}`)
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/save/" + thisId}
   )
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section

    });
  });

  $("#delete").on("click", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $("#item").attr("data-id");
  console.log(`id = ${thisId}`)
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "PUT",
      url: "/unsave/" + thisId}
     )
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
  
      });
    });
  
    $("#note").on("click", function() {
      var thisId = $("#item").attr("data-id");
      console.log(thisId)
//       <div class="modal" tabindex="-1" role="dialog">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title">Modal title</h5>
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//           <span aria-hidden="true">&times;</span>
//         </button>
//       </div>
//       <div class="modal-body">
//         <p>Modal body text goes here.</p>
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-primary">Save changes</button>
//         <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
//       </div>
//     </div>
//   </div>
// </div>
  
      });
    
  