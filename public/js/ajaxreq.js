

 $('#regform').on('submit',makeRequest);
      function makeRequest(e){
        e.preventDefault();
        $.ajax({
          url:'/formData',
          type : 'POST',
          success: function(data){
            if(data.message){
              $('div').html(data.message);
            } else {
              $('div').html('Sorry, an error occured');
            }
          },
          error: function(){
            $('div').html('Sorry, an error occurred');
          }
      });
    }

    //For image post 
    $("submitAadhar").click(function(ev) {
      var form = $("#aadharCard");
      
      $.ajax({
          type: "POST",
          url: '/aadhar' ,
          data: form.serialize(),
          success: function(data) {
              
              // Ajax call completed successfully
              alert("Form Submited Successfully");
          },
          error: function(data) {
                
              // Some error in ajax call
              alert("some Error");
          }
      });
  });
