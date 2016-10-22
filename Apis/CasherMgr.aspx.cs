using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BllApi;
using System.Data;

public partial class Apis_CasherMgr : AuthBasePage
{
    BllApi.CasherApis casherApis = new BllApi.CasherApis();
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "GetCasherKey":
                GetCasherKey();
                break;
            case "GetDuty":
                GetDuty();
                break;
            case "GetDutyID":
                GetDutyID();
                break;
            case "SetDutyID":
                SetDutyID();
                break;
            case "DelDutyID":
                DelDutyID();
                break;
        }
    }

    /// <summary>
    /// 获取卡类型
    /// </summary>
    private void GetCasherKey()
    {
        DataTable dt = casherApis.GetCasherKey();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        jsonStr = "{results:" + dt.Rows.Count.ToString() + ",rows:" + jsonStr + "}";
        Response.Write(jsonStr);
        Response.End();
    }

    /// <summary>
    /// 获取职位，返回给前台tree使用
    /// </summary>
    /// <returns></returns>
    private DataTable GetDuty()
    {
        DataTable dt = casherApis.GetDuty();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        //jsonStr = "{results:" + dt.Rows.Count.ToString() + ",rows:" + jsonStr + "}";
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
        return dt;
    }

    private void GetDutyID()
    {
        DataTable dt = casherApis.GetDutyID();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr);
        Response.End();
    }

    private void SetDutyID()
    {
        string id = Request["DutyID"];
        int isOk = casherApis.SetDutyID(CurrentUser, id);
        if (isOk > 0)
        {
            base.ReturnResultJson("true", "添加职位成功！");
        }
        else
        {
            base.ReturnResultJson("false", "添加职位失败！");
        }
    }

    private void DelDutyID()
    {
        string id = Request["DelID"];
        int isOk = casherApis.DelDutyID(CurrentUser, id);
        if (isOk > 0)
        {
            base.ReturnResultJson("true", "删除职位成功！");
        }
        else
        {
            base.ReturnResultJson("false", "删除职位失败！");
        }
    }
       
}