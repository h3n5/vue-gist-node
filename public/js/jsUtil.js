function imgUrl() {
    return "http://localhost:3004/upload_file/"
}
//判断为空方法
function isEmpty(str) {
    if (str == null || str == undefined || str == '') {
        return true;
    }
    return false;
}
//两个浮点数相乘
function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
// 两个浮点数求和
function accAdd(num1,num2){
    var r1,r2,m;
    try{
        r1 = num1.toString().split('.')[1].length;
    }catch(e){
        r1 = 0;
    }
    try{
        r2=num2.toString().split(".")[1].length;
    }catch(e){
        r2=0;
    }
    m=Math.pow(10,Math.max(r1,r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1*m+num2*m)/m;
}

// 两个浮点数相减
function accSub(num1,num2){
    var r1,r2,m;
    try{
        r1 = num1.toString().split('.')[1].length;
    }catch(e){
        r1 = 0;
    }
    try{
        r2=num2.toString().split(".")[1].length;
    }catch(e){
        r2=0;
    }
    m=Math.pow(10,Math.max(r1,r2));
    n=(r1>=r2)?r1:r2;
    return Number((Math.round(num1*m-num2*m)/m).toFixed(n));
}
// 两数相除
function accDiv(num1,num2){
    var t1,t2,r1,r2;
    try{
        t1 = num1.toString().split('.')[1].length;
    }catch(e){
        t1 = 0;
    }
    try{
        t2=num2.toString().split(".")[1].length;
    }catch(e){
        t2=0;
    }
    r1=Number(num1.toString().replace(".",""));
    r2=Number(num2.toString().replace(".",""));
    return (r1/r2)*Math.pow(10,t2-t1);
}
//accAdd accSub mul accDiv +-*/
function ChangeToDFM(du)
{
    var str1 = du.split(".");
    var du1 = str1[0];
    var tp = "0."+str1[1]
    var tp = String(tp*60);		//这里进行了强制类型转换
    var str2 = tp.split(".");
    var fen =str2[0];
    tp = "0."+str2[1];
    tp = mul(Number(tp),60);
    var miao = tp;
    return [du1,fen,miao];
}

function ChangeToDu(d,f,m)
{

    var f = accAdd(Number(f),(accDiv(Number(m),60)));
    var du = accAdd(accDiv(Number(f),60),Number(d));
    return du.toFixed(4)
}