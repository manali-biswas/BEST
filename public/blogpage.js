$(".bt").on("click",function(event){
    var s=$(this).attr('href');
    var s2=$(this).parent();
    var target=$(s);
    var t2=$('.show');
    var t3=$('.show').attr('id');
    var str='#'+t3;
    var t4=$('a[href="'+str+'"]').parent();
    t2.removeClass('show');
    t2.addClass('disable');
    target.addClass('show');
    target.removeClass('disable');
    s2.addClass('active'); 
    t4.removeClass('active');  
});
