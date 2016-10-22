using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BllApi.Report;
using System.Collections;
using System.Data;

public partial class Apis_PointUse : AuthBasePage
{
    rPointUse pu = new rPointUse();
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "GetData":
                GetData();
                break;
            case "GetPointCost":
                GetPointCost();//积分成本分摊报表
                break;
            case "":
                break;
        }
    }

    /// <summary>
    /// 查询积分成本分摊报表
    /// </summary>
    private void GetPointCost()
    {
        string beginDate = Request["begindate"];// Convert.ToDateTime(Request["begindate"]).ToString("yyyy-MM-dd");
        string endDate = Request["enddate"];// Convert.ToDateTime(Request["enddate"]).ToString("yyyy-MM-dd");

        if (beginDate == "")
        {
            beginDate = DateTime.Now.ToString("yyyy-MM-dd");
        }
        else
        {
            beginDate = Convert.ToDateTime(Request["begindate"]).ToString("yyyy-MM-dd");
        }
        if (endDate == "")
        {
            endDate = DateTime.Now.ToString("yyyy-MM-dd");
        }
        else
        {
            endDate = Convert.ToDateTime(Request["enddate"]).ToString("yyyy-MM-dd");
        }
        Hashtable parms = new Hashtable();
        parms.Add("BeginDate",beginDate);
        parms.Add("EndDate",endDate);

        rPointCost pointCost = new rPointCost();
        pointCost.parms = parms;

        DataTable dt = pointCost.DoReport();


        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(html);
        Response.End();
    }

    /// <summary>
    /// 根据条件查询报表
    /// </summary>
    private void GetData()
    {
        string BeginTime = Request["BeginTime"];
        string EndTime=Request["EndTime"];
        string DeptID = Request["MenDian"];

        //string whereSql = "";
        Hashtable parms = new Hashtable();
        pu.parms.Add("BeginDate", BeginTime);
        pu.parms.Add("EndDate", EndTime);
        if (!string.IsNullOrEmpty(DeptID))
        {
            pu.parms.Add("DeptID", DeptID);
        }
        pu.DoReport();
        DataTable dt =pu.DtResult;
        //base.ReturnGetDataJson("true", "查询成功", dt);
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(html);
        Response.End();
    }
}