using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BllApi;
using System.Data;
using DbCommon;

public partial class Apis_Dept : AuthBasePage
{
    BllApi.DeptApis deptApis = new BllApi.DeptApis();
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "GetDeptTitle":
                GetDeptTitle();
                break;
            case "GetCardType":
                GetCardType();
                break;
            case "GetDT":
                GetTitle();
                break;
        }
    }

    /// <summary>
    /// 获取卡类型
    /// </summary>
    private void GetCardType()
    {
        DataTable dt = deptApis.GetCardType();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
    }

    /// <summary>
    /// 获取部门，返回给前台tree使用
    /// </summary>
    /// <returns></returns>
    private DataTable GetDeptTitle()
    {
        DataTable dt = deptApis.GetDeptData();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
        return dt;
    }
    
    //获取部门名称
    private void GetTitle()
    {
        DataTable dt = Get();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
    }
    public DataTable Get()
    {
        DataTable dt = null;
        using (DbUtil db = new DbUtil())
        {
            dt = db.ExecuteQuery(@"select id,Title as text,'false' as leaf, 0 as checked from iDept");
        }

        return dt;
    }
}