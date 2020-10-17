console.log("Biscoff app is ready")
$(".my-rating-9").starRating({
    initialRating: 3.5,
    disableAfterRate: false,
    onHover: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentIndex);
    },
    onLeave: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentRating);
    }
  });
  $(".my-rating").starRating({
    starSize: 25,
    callback: function(currentRating, $el){
        // make a server call here
    }
});