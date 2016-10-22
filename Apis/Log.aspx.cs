using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using DbCommon;

public partial class Apis_Log : AuthBasePage
{
    Log log = new Log();
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
        }
    }
    /// <summary>
    /// 根据时间，查询日志
    /// </summary>
    private void GetData()
    {
        String fieldName = "LogDate";
        if (!string.IsNullOrEmpty(Request["sort"])) {
            fieldName = Request["sort"];
        }
        String sortType = "DESC";
        if (!string.IsNullOrEmpty(Request["dir"])) {
            sortType = Request["dir"];
        }
        //String sortType = Request["dir"];

        int start =Convert.ToInt32(Request["start"]);

        string BeginDate = Convert.ToDateTime(Request["BeginDate"]).ToString("yyyy-MM-dd");
        string EndDate = Convert.ToDateTime(Request["EndDate"]).ToString("yyyy-MM-dd");
        string LogType = Request["LogType"];

        DataTable dt = log.GetLogData(BeginDate, EndDate, LogType, start, fieldName, sortType);
        int count = log.GetCount(BeginDate, EndDate, LogType);

         pageDataJson("true","查询成功!",dt,count);
        //html += "totalCount" + count;
        
    }
}