($(function() {
	var options = [
		{label: "red", value: "red"},
		{label: "orange", value: "orange"},
		{label: "yellow", value: "yellow"},
		{label: "green", value: "green"},
		{label: "blue", value: "blue"},
		{label: "indigo", value: "indigo"},
		{label: "violet", value: "violet"},
		{label: "infrared", value: "infrared"},
		{label: "ultraviolet", value: "ultraviolet"},
		{label: "black", value: "black"},
      {label: "brown", value: "brown"},
      {label: "brightgreen", value: "bright green"}
	];

	$("textarea").tagmate({
		exprs: {
			"#": Tagmate.HASH_TAG_EXPR,
		},
		sources: {
			"#": function(request, response) {
				// use convenience filter function 
				var filtered = Tagmate.filterOptions(options, request.term);
				response(filtered);
			}
		},
		capture_tag: function(tag) {
			console.log("Got tag: " + tag);
        //$('textarea').val('');
		},
		replace_tag: function(tag, value) {
			console.log("Replaced tag: " + tag + " with: " + value);
        var taglist = $('.tags').html();
        $('.tags').html(taglist + ' <li class="singletag">#'+value+' <a href="#" class="bye">&times;</a></li>');
        //$('textarea').val('');
		},
      menu_container: "div",
      menu_tag: "div",
      menu_option_tag: "div",
	});
  
   $( ".tagmate-menu" ).on( "click", ".tagmate-menu-option", function( event ) {
      //event.preventDefault();
      var value = $( this ).text();
      console.log( value );
      var taglist = $('.tags').html();
      $('.tags').html(taglist + ' <li class="singletag">#'+value+' <a href="#" class="bye">&times;</a></li>');
   });
  
    $(".tags").on("click",".bye", function(){
      var ct = $(this).parent();
      $('.tags').find(ct).remove();
    });
}));


