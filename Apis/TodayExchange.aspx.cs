using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using BllApi;

public partial class Apis_TodayyExchange : AuthBasePage
{
    TodayExchangeApi tExcApi = new TodayExchangeApi();
    protected void Page_Load(object sender, EventArgs e)
    {
        switch(ActionName){
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case"GetDataByToday":
                GetDataByToday();
                break;
        }
    }
    //当日兑换产品
    private void GetDataByToday()
    {
        string idNo = Request["idNo"];
        string mobile = Request["mobileNo"];
        string todayDate = Request["todayDate"];

        //BllApi.PointExchangeApis exchange = new BllApi.PointExchangeApis();
        DataTable dt = tExcApi.GetTodayExchange(idNo, mobile, todayDate);
        if (dt != null && dt.Rows.Count > 0)
        {
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

            Response.Write(html);
            Response.End();
        }
        else
        {
            base.ReturnResultJson("false", "无该账户兑换信息！");
            return;
        }
    }
}