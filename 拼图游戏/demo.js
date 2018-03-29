var imgBox = $('.imgBox'),
    btnStart = $('.start'),
    imgOriginArr = [],
    imgRandomArr = [],
    isStart = false,
    imgCell = '';

imgSplit();
gameState();
function imgSplit() {
    var img = '';
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            imgOriginArr.push(i * 3 + j);
            img = $('<div></div>');
            $(img).css({
                'background' : 'url("pic.jpg")',
                'background-position': -j * 100 + 'px' + ' ' + -i * 100 + 'px',
                'left' : j * 100 + 'px',
                'top' : i * 100 + 'px',
            });
            $(img).attr('class','imgCell');
            imgBox.append(img);
        }
    }
    imgCell = $('.imgCell');
}

function gameState(){
    btnStart.on('click',function(){
        if(!isStart){
            $(this).text('复原');
            isStart = true;
            randOrder();
            // console.log(imgRandomArr);
            cellSort(imgRandomArr);
            imgCell.css('cursor','pointer').on('mouseover',function(){
                $(this).addClass('hover');
            }).on('mouseout',function(){
                $(this).removeClass('hover');
            }).on('mousedown',function(e1){
                var cellIndex1 = $(this).index();
                var cellX = e1.pageX - imgCell.eq(cellIndex1).offset().left;
                var cellY = e1.pageY - imgCell.eq(cellIndex1).offset().top;
                $(this).css({
                    'cursor' : 'move',
                });
                $(document).on('mousemove',function(e2){
                    imgCell.eq(cellIndex1).css({
                        'z-index' : '40',
                        'left' : e2.pageX - cellX - imgBox.offset().left + 'px',
                        'top': e2.pageY - cellY - imgBox.offset().top + 'px',
                    });
                });
                $(document).on('mouseup',function(e3){
                    // console.log(1);
                    var cellIndex2 = getCellIndex(e3.pageX, e3.pageY, cellIndex1);
                    console.log(cellIndex1,cellIndex2);
                    if(cellIndex1 == cellIndex2){
                        backToPosition(cellIndex1);
                    }else{
                        changeToPosition(cellIndex1,cellIndex2);
                    }
                    $(document).off('mousemove').off('mouseup');
                })
            })
        }else{
            $(this).text('开始');
            isStart = false;
            imgCell.off('mouseover').off('mousedown').css('cursor','default');
            cellSort(imgOriginArr);
        }
    })
}

function randOrder(){
    var num,
        len = imgOriginArr.length;
    imgRandomArr = [];
    for(var i = 0; i < len; i ++){
        num = Math.floor(Math.random() * len)
        if(jQuery.inArray(num,imgRandomArr) > -1){
            i --;
            continue;
        }else{
            imgRandomArr.push(num);
        }
    }
    console.log(imgRandomArr);
}

function cellSort(arr){
    for(var i = 0; i < arr.length; i ++){
        var index = arr[i];   //实际位置
        imgCell.eq(i).animate({
            'left' : index % 3 * 100 + 'px',
            'top' : Math.floor(index / 3) * 100 + 'px',
        },400);
    }
}

function getCellIndex(x,y,index){
    var positionX = x - imgBox.offset().left;
    var positionY = y - imgBox.offset().top;
    var i = 0,len = imgRandomArr.length;
    if(positionX < 0 || positionX > 300 || positionY < 0 || positionY > 300){
        return index;
    }else{
        var position = Math.floor(positionX / 100) + Math.floor(positionY / 100) * 3;
        // console.log(position);
        // for(; i < imgRandomArr.length; i ++){
        //     if(imgRandomArr[i] == position){
        //         console.log(i);
        //         // return i;
        //         break;
        //     }
        // }
        while(( i < len) && imgRandomArr[i] != position){
            i++;
        }
        return i;
    }
}

function backToPosition(index) {
    imgCell.eq(index).animate({
        'left' : imgRandomArr[index] % 3 * 100 + 'px',
        'top' : Math.floor(imgRandomArr[index] / 3) * 100 + 'px',
    },400,function(){
        $(this).css('z-index','10');
    });
}

function changeToPosition(from,to){
    var fromX = imgRandomArr[from] % 3 * 100,
        fromY = Math.floor(imgRandomArr[from] / 3) * 100,
        toX = imgRandomArr[to] % 3 * 100,
        toY = Math.floor(imgRandomArr[to] / 3) * 100;
    imgCell.eq(from).animate({
        'left' : toX + 'px',
        'top' : toY + 'px',
    },400,function(){
        $(this).css('z-index','10');
    });
    imgCell.eq(to).animate({
        'left' : fromX + 'px',
        'top' : fromY + 'px',
    },400,function(){
        $(this).css('z-index','10');
        var temp = imgRandomArr[from];
        imgRandomArr[from] = imgRandomArr[to];
        imgRandomArr[to] = temp;
        if(check(imgRandomArr,imgOriginArr)){
            success();
        }
    });
}

function check(arr1,arr2){
    if(arr1.toString() == arr2.toString()){
        return true;
    }else{
        return false;
    }
}

function success(){
    alert('You are right');
    btnStart.text('开始');
    imgCell.off('mouseover').off('mousedown').css('cursor','default');
    isStart = false;
}