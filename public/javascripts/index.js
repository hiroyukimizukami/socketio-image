(function () {
     var socket = io.connect('http://localhost');

     socket.on('notify', function (data) {
                   console.log(data);
                   $('#image001').attr('src', data.url);

               });

     var onSubmit = function (e) {
         var input = $('#input_image001').get(0);
         var file = input.files[0];
         var name = file.name;

         var reader = new FileReader();
         reader.onloadend = function (e) {
             var data = e.target.result;

             if (!data) {
                 return ;
             }

             socket.emit('upload', { name : name, data : data});
         };

         reader.readAsDataURL(file);
     };

     $('#submit001').click(onSubmit);
})();