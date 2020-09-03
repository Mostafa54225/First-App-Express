$(function() {
    $('.delete-article').on('click', function() {
        const id = $(this).attr('data-id');
        let result = confirm('Are You Sure?');
            if(result){
                $.ajax({
                    type: "DELETE",
                    url: "/articles/"+id,
                    success: function (response) {
                        window.location.href='/articles'
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
    })
}) 