$(function(){
$(".nav-link").each(function(){
    if($(this).prop("href") == window.location.href){
        var s=$(this).parent();
        s.addClass("active");
    }
});
});