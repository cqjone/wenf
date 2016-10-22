using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;

namespace BeautyPointWeb.Apis
{
    public partial class SearDPId : AuthBasePage
    {
        private BllApi.SearDPIdApi mybll = new BllApi.SearDPIdApi();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                switch (ActionName)
                { 
                    case "searDPId":
                        searDPId();
                        break;
                }
            }
        }

        /// <summary>
        /// 通过门店名称查询 数据
        /// </summary>
        private void searDPId()
        {
            string msg = string.Empty;
            try
            {
                string DeptName = Request["deptName"];
                string DeptStatus = Request["DeptStatus"];
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                Hashtable prams = new Hashtable();
                prams.Add("@DeptName", DeptName);

                if (!string.IsNullOrEmpty(DeptStatus))
                {
                    int deptStatus = Convert.ToInt32(DeptStatus) - 1;
                    if (deptStatus > -1)
                    {
                        prams.Add("@DeptStatus", deptStatus);
                    }
                    else
                    {
                        DeptStatus = string.Empty;
                    }
                }
                
                DataTable dt = mybll.searDPId(prams, start, limit);
                int count = mybll.getTotalCountByParam(prams);
                msg = "{totalCount:" + count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                msg = ex.Message;
            }
            Response.Write(msg);
            Response.End();
        }
    }
}