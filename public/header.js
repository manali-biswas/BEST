$(function(){
$(".h").each(function(){
    if($(this).prop("href") == window.location.href){
        var s=$(this).parents('.nav-item');
        s.addClass("active");
    }
});
});