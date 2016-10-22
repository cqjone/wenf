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
    public partial class DeptStatusMgr : AuthBasePage
    {
        private BllApi.DeptStatusMgr mybll = new BllApi.DeptStatusMgr();
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            { 
                case "Search":
                    result = Search();
                    break;
                case "Update":
                    Update();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        /// <summary>
        /// 查询门店
        /// </summary>
        /// <returns></returns>
        private string Search()
        {
            string result = string.Empty;

            string DeptStatus = Request["DeptStatus"];
            string DeptCode = Request["DeptCode"];
            string DeptName = Request["DeptName"];
            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]);

            Hashtable parms = new Hashtable();
            
            parms.Add("@DeptCode",DeptCode);
            parms.Add("@DeptName",DeptName);

            DeptCode = string.IsNullOrEmpty(DeptCode) ? "" : " and Code like '%' + @DeptCode + '%'";
            DeptName = string.IsNullOrEmpty(DeptName) ? "" : " and Title like '%' + @DeptName + '%'";

            string sql = string.Format(@"select Id as DeptId,Code as DeptCode,Title as DeptName,DeptStatus from iDept
                                        where IsDeleted=0 and depttypeid=1 {0} {1} ", DeptCode, DeptName);
            string sql1 = string.Empty;

            if (!string.IsNullOrEmpty(DeptStatus))
            {
                int deptStatus = Convert.ToInt32(DeptStatus) - 1;
                if (deptStatus > -1)
                {
                    parms.Add("@DeptStatus", deptStatus);
                    sql1 = " and DeptStatus=@DeptStatus";
                }
            }

            try
            {
                DataTable dt = mybll.GetPageData(sql + sql1, "order by DeptCode,DeptName desc", start + 1, limit, parms);
                sql = string.Format(@"select count(Id) from iDept where IsDeleted=0 and depttypeid=1 {0} {1} " + sql1, DeptCode, DeptName);
                int totalCount = Convert.ToInt32(mybll.ExecScalar(sql, parms));
                result = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }

            return result;
        }

        /// <summary>
        /// 更新门店状态
        /// </summary>
        private void Update()
        {
            string result = string.Empty;

            string DeptStatus = Request["DeptStatus"];
            string DeptId = Request["DeptId"];

            try
            {
                Hashtable prams = new Hashtable();
                prams.Add("@DeptId",DeptId);
                prams.Add("@DeptStatus",DeptStatus);

                result = mybll.Update(prams, CurrentSession.UserID);
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.ToString());
            }

            base.ReturnResultJson("true",result);
        }
    }
}