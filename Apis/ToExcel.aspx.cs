using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BllApi.Report;
using System.Collections;
using System.Data;

/// <summary>
/// 导出Excel
/// </summary>
public partial class Apis_ToExcel : AuthBasePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "rPointCostToExcle":
                rPointCostToExcle();
                break;
            case "rPointUseToExcle":
                rPointUseToExcle();
                break;
        }
    }
    //积分成本分摊报表
    private void rPointCostToExcle()
    {
        string beginDate = Convert.ToDateTime(Request["begindate"]).ToString("yyyy-MM-dd");
        string endDate = Convert.ToDateTime(Request["enddate"]).ToString("yyyy-MM-dd");

        Hashtable parms = new Hashtable();
        parms.Add("BeginDate", beginDate);
        parms.Add("EndDate", endDate);

        rPointCost pointCost = new rPointCost();
        DataTable dt = pointCost.DoReport();

        ToExcel exceler = new ToExcel();
        string result = exceler.rPointCostToExcle(dt,beginDate,endDate);
        if (string.IsNullOrEmpty(result))
        {
            base.ReturnResultJson("false", "导出失败！");
        }
        else
        {
            base.ReturnResultJson("true", result);
        }
    }
    //积分使用情况报表
    private void rPointUseToExcle()
    {
        string BeginTime = Request["begindate"];
        string EndTime = Request["enddate"];

        rPointUse pu = new rPointUse();

        Hashtable parms = new Hashtable();
        pu.parms.Add("BeginDate", BeginTime);
        pu.parms.Add("EndDate", EndTime);
        pu.DoReport();
        DataTable dt = pu.DtResult;

        ToExcel exceler = new ToExcel();

        string BeginDate = Convert.ToDateTime(Request["begindate"]).ToString("yyyy-MM-dd");
        string EndDate = Convert.ToDateTime(Request["enddate"]).ToString("yyyy-MM-dd");
        string result = exceler.rPointUseToExcle(dt, BeginDate, EndDate);
        if (string.IsNullOrEmpty(result))
        {
            base.ReturnResultJson("false", "导出失败！");
        }
        else
        {
            base.ReturnResultJson("true", result);
        }
    }
}