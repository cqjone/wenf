using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using DbCommon;
using DbCommon.Acl;

public partial class Apis_AuthLogin : BasePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(ActionName))
        {
            switch (ActionName)
            {
                case "frontLogin":
                    FrontLogin();
                    break;
                case "frontLoginNew":
                    FrontLoginNew();
                    break;
                case "csfrontLogin":
                    FrontLoginCS();
                    break;
                case "customerLogin":
                    CustomerLogin();
                    break;
                case "managerLogin":
                    ManagerLogin();
                    break;
                case "getUserMenu":
                    GetUserMenu();
                    break;
                case "keepOnline":
                    KeepOnline();
                    break;
                case "getCurrentUser":
                    GetCurrentUser();
                    break;
                case "PadLogin":
                    PadLogin();
                    break;
                default:
                    base.ReturnResultJson("false", "没有该API");
                    break;
            }
        }
    }


    /// <summary>
    /// 获取当前用户信息给js
    /// </summary>
    private void GetCurrentUser()
    {
        if (CurrentUser != null)
        {
            DataTable dt = new DataTable();
            string deptName = "";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery("Select Title from iDept where ID = " +CurrentUser.DeptID);
                deptName = dt.Rows[0]["Title"].ToString();

            }
            CurrentUser.DeptName = deptName;
            Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(CurrentUser));
            Response.End();
            return;
        }
        base.ReturnResultJson("false","没有用户!");
    }

    /// <summary>
    /// 定期执行，保持session在线
    /// 该api应该js定时执行
    /// </summary>
    private void KeepOnline()
    {
        string sid = Request["sid"];
        if (!string.IsNullOrEmpty(sid))
        {
            //Console.WriteLine(sid);
            DbCommon.SessionMgr sessionMgr = new DbCommon.SessionMgr();
            sessionMgr.UpdateSessionModifyDate(sid);
        }
    }

    private void FrontLoginNew()
    {
        string empdID = Request["empID"] == null ? "" : Request["empID"].ToString();
        string deptID = Request["deptID"] == null ? "" : Request["deptID"].ToString();

        if(string.IsNullOrEmpty(empdID) || string.IsNullOrEmpty(deptID))
        {
            base.ReturnResultJson("false", "非法登录！");
            return;
        }
        DbCommon.UserInfo userInfo = new DbCommon.UserInfo();
        userInfo.UserType = 1;//前台
        userInfo.DeptID = Convert.ToInt32(deptID);
        userInfo.Id = Convert.ToInt32(empdID);

        FrontLoginNew flogin = new FrontLoginNew();
        string sid = "";
        if(flogin.DoLogin(userInfo))
        {
            SessionMgr sessionMgr = new SessionMgr();
            sid = sessionMgr.CreateSession(userInfo);
        }
        if(!string.IsNullOrEmpty(sid))
        {
            if (!string.IsNullOrEmpty(sid))
            {
                Response.Redirect("../BasePages/index.htm?sid=" + sid);
                //base.ReturnResultJson("true", sid);
            }
            else
            {
               // Response.Redirect("../BasePages/login_front.html?deptID=" + deptID + "&loginName=" + loginName);
                //base.ReturnResultJson("false", "用户名或密码错误！");
            }
        }
        else
        {
            base.ReturnResultJson("false", "用户名或密码错误！");
        }
    }

    private void FrontLogin()
    {
        string loginName = Request["loginName"] == null ? "" : Request["loginName"].ToString();
        string passWord = Request["PassWord"] == null ? "" : Request["PassWord"].ToString();
        string deptID = Request["deptID"] == null ? "" : Request["deptID"].ToString();

        if (!string.IsNullOrEmpty(loginName) && !string.IsNullOrEmpty(passWord) && !string.IsNullOrEmpty(deptID))
        {
            DbCommon.UserInfo userInfo = new DbCommon.UserInfo();
            DbCommon.Acl.Authentication auth = new DbCommon.Acl.Authentication();
            userInfo.UserType = 1;//前台
            userInfo.LoginName = loginName;
            userInfo.Password = passWord;
            userInfo.DeptID = int.Parse(deptID);
            string sid = auth.DoLogin(userInfo);
            if (!string.IsNullOrEmpty(sid))
            {
                //Response.Redirect("../BasePages/index.htm?sid=" + sid);
                base.ReturnResultJson("true", sid);
            }
            else
            {
                base.ReturnResultJson("false", "用户名或密码错误！");
            }
        }
        else
        {
            base.ReturnResultJson("false", "请输入用户名或密码！");
        }
    }

    /// <summary>
    /// 前台cs程序登录
    /// </summary>
    private void FrontLoginCS()
    {
        string loginName = Request["loginName"] == null ? "" : Request["loginName"].ToString();
        string passWord = Request["PassWord"] == null ? "" : Request["PassWord"].ToString();
        string deptID = Request["deptID"] == null ? "" : Request["deptID"].ToString();

        if (!string.IsNullOrEmpty(loginName) && !string.IsNullOrEmpty(passWord) && !string.IsNullOrEmpty(deptID))
        {
            DbCommon.UserInfo userInfo = new DbCommon.UserInfo();
            DbCommon.Acl.Authentication auth = new DbCommon.Acl.Authentication();
            userInfo.UserType = 1;//前台
            userInfo.LoginName = loginName;
            userInfo.Password = passWord;
            userInfo.DeptID = int.Parse(deptID);
            string sid = auth.DoLogin(userInfo);
            if (!string.IsNullOrEmpty(sid))
            {
                Response.Redirect("../BasePages/index.htm?sid=" + sid);
                //base.ReturnResultJson("true", sid);
            }
            else
            {
                Response.Redirect("../BasePages/login_front.html?deptID="+deptID +"&loginName=" + loginName);
                //base.ReturnResultJson("false", "用户名或密码错误！");
            }
        }
        else
        {
            base.ReturnResultJson("false", "请输入用户名或密码！");
        }
    }

    /*
    private void CustomerLogin()
    {
        string idNo = Request["idNo"] == null ? "" : Request["idNo"].ToString();
        string mobileNo = Request["mobileNo"] == null ? "" : Request["mobileNo"].ToString();
        string passWord = Request["PassWord"] == null ? "" : Request["PassWord"].ToString();
        DbCommon.UserInfo userInfo = new DbCommon.UserInfo();
        if (!string.IsNullOrEmpty(idNo) || !string.IsNullOrEmpty(mobileNo) && !string.IsNullOrEmpty(passWord))
        {
            DbCommon.Acl.Authentication auth = new DbCommon.Acl.Authentication();
            userInfo.UserType = 2;//网页登陆
            userInfo.IdCardNo = idNo;
            userInfo.MobileNo = mobileNo;
            userInfo.Password = passWord;
            string sid = auth.DoLogin(userInfo);
            if (!string.IsNullOrEmpty(sid))
            {
                userInfo.Sid = sid;
                Session["CurrentUser"] = userInfo;//网页用户保存到session中
                base.ReturnResultJson("true", sid);
            }
            else
            {
                base.ReturnResultJson("false", "用户名或密码错误！");
            }
        }
        else
        {
            base.ReturnResultJson("false", "请输入用户名或密码！");
        }
    }*/
    
    private void CustomerLogin()
    {
        string idno = Request.Form["idno"];

        string passWord = Request.Form["PassWord"];
        string backUrl = Request.Form["backUrl"];
        DbCommon.UserInfo userInfo = new DbCommon.UserInfo();
        if (!string.IsNullOrEmpty(idno) && !string.IsNullOrEmpty(passWord))
        {
            DbCommon.Acl.Authentication auth = new DbCommon.Acl.Authentication();
            userInfo.UserType = 2;//网页登陆
            userInfo.IdCardNo = idno;
            userInfo.MobileNo = idno;
            userInfo.Password = passWord;
            string sid = auth.DoLogin(userInfo);
            if (!string.IsNullOrEmpty(sid))
            {
                userInfo.Sid = sid;
                Session["CurrentUser"] = userInfo;//网页用户保存到session中
                //base.ReturnResultJson("true", sid);
                if (!string.IsNullOrEmpty(backUrl) && !"undefined".Equals(backUrl))
                {
                    Response.Redirect("../Web/" + backUrl, true);
                }
                else
                {
                    Response.Redirect("../Web/Index.aspx?sid=" + sid, true);
                }
            }
            else
            {
                string message = "false";
                Response.Redirect("../Web/login.html?message=" + message, true);
            }
        }
        else
        {
            Response.Redirect("../Web/login.html", false);
        }
    }


    private void ManagerLogin()
    {
        string loginName = Request["loginName"] == null ? "" : Request["loginName"].ToString();
        string passWord = Request["PassWord"] == null ? "" : Request["PassWord"].ToString();

        if (!string.IsNullOrEmpty(loginName) && !string.IsNullOrEmpty(passWord))
        {
            DbCommon.UserInfo userInfo = new DbCommon.UserInfo();
            DbCommon.Acl.Authentication auth = new DbCommon.Acl.Authentication();
            userInfo.UserType = 0;//后台登陆
            userInfo.LoginName = loginName;
            userInfo.Password = passWord;
            string sid = auth.DoLogin(userInfo);
            if (!string.IsNullOrEmpty(sid))
            {
                base.ReturnResultJson("true", sid);
            }
            else
            {
                base.ReturnResultJson("false", "用户名或密码错误！");
            }
        }
        else
        {
            base.ReturnResultJson("false", "请输入用户名或密码！");
        }
    }

    private void GetUserMenu()
    {
        DbCommon.Acl.Authentication auth = new DbCommon.Acl.Authentication();
        List<DbCommon.Modals.MenuItem> list = auth.GetUserMenu(CurrentSession.UserID.ToString());
        if (list != null && list.Count > 0)
        {
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(list);
            Response.Write(jsonStr);
        }
        Response.End();
    }

    private void PadLogin()
    {
        string result = "";
        string loginName = Request["loginName"] == null ? "" : Request["loginName"].ToString();
        string passWord = Request["PassWord"] == null ? "" : Request["PassWord"].ToString();

        try
        {
            if (!string.IsNullOrEmpty(loginName) && !string.IsNullOrEmpty(passWord))
            {
                DbCommon.UserInfo userInfo = new DbCommon.UserInfo();
                DbCommon.Acl.Authentication auth = new DbCommon.Acl.Authentication();
                userInfo.UserType = 0;//后台登陆
                userInfo.LoginName = loginName;
                userInfo.Password = passWord;
                string sid = auth.DoLogin(userInfo);
                DbUtil utl = new DbUtil();
                if (!string.IsNullOrEmpty(sid))
                {
                    string sql = string.Format(@"select b.url from aPointGroupMenu a,iPointMenuItem b
                                          where a.IsDeleted=0 and a.MenuId=b.Id and a.GroupId={0} and 
                                            (b.URL='../Pages/BackEnd/PersonMgr.html'
                                            or b.URL='../Pages/BackEnd/DeptYJ.htm')", userInfo.GroupID);
                    DataTable dtUrl = utl.ExecuteQuery(sql);
                    if (dtUrl.Rows.Count == 2)
                    {
                        result = string.Format("{{\"success\":true,\"msg\":\"../Pages/BackEnd/DeptYJ.htm\",\"sid\":\"{0}\"}}", sid);
                    }
                    else if (dtUrl.Rows.Count == 1)
                    {
                        result = string.Format("{{\"success\":true,\"msg\":\"{0}\",\"sid\":\"{1}\"}}", dtUrl.Rows[0][0], sid);
                    }
                    else
                    {
                        result = "{\"success\":false,\"msg\":\"您没有权限！\"}";
                    }
                }
                else
                {
                    result = "{\"success\":false,\"msg\":\"用户名或密码错误！\"}";
                }
            }
            else
            {
                result = "{\"success\":false,\"msg\":\"请输入用户名或密码！\"}";
            }
            #region
//            if (!string.IsNullOrEmpty(loginName) && !string.IsNullOrEmpty(passWord))
//            {
//                string sql = string.Format("select GroupId from aUser where IsDeleted=0 and UserName='{0}'and Password='{1}'", loginName, passWord);
//                DbUtil utl = new DbUtil();
//                object GroupId=utl.ExecuteScalar(sql);
//                if(GroupId!=null)
//                {
//                    sql = string.Format(@"select b.Id from aPointGroupMenu a,iPointMenuItem b
//                                          where a.IsDeleted=0 and a.MenuId=b.Id and a.GroupId={0} and b.URL='../Pages/BackEnd/PersonMgr.html'", GroupId);
//                    object count = utl.ExecuteScalar(sql);
//                    if (count != null)
//                    {
//                        sql = string.Format("select Url from iPointMenuItem where isdeleted=0 and id={0}",count);
//                        string url = (string)utl.ExecuteScalar(sql);
//                        string sid=Guid.NewGuid().ToString().Replace("-", "");
//                        result = string.Format("{{\"success\":true,\"msg\":\"{0}\",\"sid\":\"{1}\"}}", url, sid);
//                    }
//                    else
//                    {
//                        result = "{\"success\":false,\"msg\":\"您没有权限！\"}";
//                    }
//                }
//                else
//                {
//                    result = "{\"success\":false,\"msg\":\"用户名或密码错误！\"}";
//                }
               
//                utl.DbConnection.Close();
//            }
//            else
//            {
//                result = "{\"success\":false,\"msg\":\"请输入用户名或密码！\"}";
//            }
            #endregion
        }
        catch (Exception ex)
        {
            result = ex.Message;
        }

        Response.Write(result);
        Response.End();
    }
}