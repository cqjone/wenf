using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

namespace BeautyPointWeb.Apis
{
    public partial class NegBill : AuthBasePage
    {
        BllApi.NegBill mybll = new BllApi.NegBill();

        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch(ActionName)
            {
                case "Search":
                    result = Search();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        private string Search()
        {
            string result = string.Empty;

            string dtBegin = Request["dtBegin"];
            string dtEnd = Request["dtEnd"];
            string DeptId = Request["DeptId"];
            string BillType = Request["BillType"];

            if (BillType.Equals("全部") || string.IsNullOrEmpty(BillType))
            {
                BillType = "";
            }

            string sql = string.Format("exec sp_NegBill '{0}','{1}',{2},'{3}'",dtBegin,dtEnd,DeptId,BillType);

            //int start = Convert.ToInt32(Request["start"]);
            //int limit = Convert.ToInt32(Request["limit"]);

            try
            {
                //DataTable dt = mybll.GetPageData(sql, "order by id desc", start + 1, limit);
                DataTable dt = mybll.ExecQuery(sql);
                int count = dt.Rows.Count;
                result = "{totalCount:" + count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"");
                result = "{success:false,msg:'" + result + "'}";
            }
            

            return result;
        }
    }
}