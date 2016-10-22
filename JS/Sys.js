//提供系统变量、系统方法
var Sys = function (){

}
try{
Sys.sid = getParameter("sid").replace("#","");
}catch(e){}

//TODO:定时请求服务器刷新 最后通讯时间