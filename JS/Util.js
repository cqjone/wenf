/**
 *	功能：通过截取url，模拟取得get参数
 */
function getParameter(p){
	var url=window.location.toString();
	var str="{0:0}";
	
	if(url.indexOf("?")!=-1){ //判断有没有参数
		str = "";
		var ary=url.split("?")[1].split("&");
		//alert(ary)
		for(var i=0; i < ary.length;i++){
		  str+= ary[i].split("=")[0]+":"; //参数名称
		  str+= "\"" + ary[i].split("=")[1]+"\","; //参数值 
		}
		str = "{" + str.substring(0,str.length-1) + "}";
	}
	eval("Pram=" + str)
	return eval("Pram." + p);
}

/**
*   功能：json 日期字符串转换成日期对象
*
*/
function ConvertJSONDateToJSDateObject(JSONDateString) { 
    try{
        var date = new Date(parseInt(JSONDateString.replace("/Date(", "").replace(")/", ""), 10)); 
        return date; 
    }catch(e){
        return JSONDateString;
    }
}

/**
*   功能：json 日期字符串转换成日期对象
*   FOR TEXTFIELD
*/
function ConvertJSONDateToJSDateObjectTextField(JSONDateString) {
    try {
        var date = new Date(parseInt(JSONDateString.replace("/Date(", "").replace(")/", ""), 10));
        return DateToString(date);
    } catch (e) {
        return JSONDateString;
    }
}

function ConvertJSONDateToJSDateObject_DateTime(JSONDateString) {
    try {
        date = new Date(parseInt(JSONDateString.replace("/Date(", "").replace(")/", ""), 10));
        return date.format('Y-m-d H:i:s');
    } catch (e) {
        return e;
    }
}
function ConvertJSONDateToJSDateObject_DateTime1(JSONDateString) {
    try {
        date = new Date(parseInt(JSONDateString.replace("/Date(", "").replace(")/", ""), 10));
        return date.format('Y-m-d-H-i-s');
    } catch (e) {
        return e;
    }
}

/**
*  将日期转换成 年-月-日格式的字符串
*
*/
function DateToString(date){
    try{
            var yyyy = date.getFullYear().toString();
            var month = date.getMonth() + 1; //月份需+1运算
            var MM = month.toString().length == 1 ? "0" + month.toString() : month.toString();
            var dd = date.getDate().toString().length == 1 ? "0" + date.getDate().toString() : date.getDate().toString();
           
            return yyyy+"-"+MM+"-"+dd;
        }catch(e){
            return null;
    }
   // return date.format("Y-m-d H:i:s");
    }
    /*
//日期加上 add方法
Date.prototype.add=function(part,value){
    switch(part) {
        case "y":
            this.setFullYear(this.getFullYear() + value);
            break;
        case "m":
            this.setMonth(this.getMonth() + value);
            break;
        case "d":
            this.setDate(this.getDate() + value);
            break;
        default:
            break;
    }
    return this;
}*/


/*
*  根据身份证号码获取 年龄
*/
function getAgeByIdNO(idno){
    if (idno.length != 15 && idno.length != 18) {
        return 0;
    }

    var bd = getBirthdayByIdNo(idno);
    if(bd == null){
        return 0;
    }
    var now = new Date();
    return now.getFullYear() - bd.getFullYear();
}

/*
*   根据身份证号码 获取生日
*/
function getBirthdayByIdNo(idno){
    if (idno.length != 15 && idno.length != 18) {
        return null;
    }
    var y;
    var m;
    var d;

    if(idno.length == 15){
        y = "19" + idno.substr(6,2);
        m = idno.substr(8,2);
        d = idno.substr(10,2);        
    }else{
        y = idno.substr(6,4);
        m = idno.substr(10,2);
        d = idno.substr(12,2);
    }
    return new Date(y,m-1,d);
}


