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
    public partial class UpdateLoginType : AuthBasePage
    {
        BllApi.UpdateLoginType mybll = new BllApi.UpdateLoginType();
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            { 
                case "Search":
                    result = Search();
                    break;
                case "Update":
                    result = Update();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        private string Search()
        {
            string result = string.Empty;

            string LoginType=Request["LoginType"];
            string DeptCode = Request["DeptCode"];
            string DeptName = Request["DeptName"];
            string DeptStatus = Request["DeptStatus"];
            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]);

            Hashtable parms = new Hashtable();
            
            parms.Add("@DeptCode",DeptCode);
            parms.Add("@DeptName",DeptName);

            DeptCode = string.IsNullOrEmpty(DeptCode) ? "" : " and Code like '%'+@DeptCode+'%'";
            DeptName = string.IsNullOrEmpty(DeptName) ? "" : " and Title like '%'+@DeptName+'%'";

            string sql = string.Format(@"select Id as DeptId,Code as DeptCode,Title as DeptName,LoginType from iDept
                                        where IsDeleted=0 and depttypeid=1 {0} {1}", DeptCode, DeptName);
            string sqlWhere = string.Empty;

            if (!string.IsNullOrEmpty(LoginType.ToString()))
            {
                int loginType = Convert.ToInt32(LoginType)-1;
                if (loginType != -1)
                {
                    parms.Add("@LoginType", loginType);
                    sqlWhere = " and LoginType=@LoginType";
                }
            }
            if (!string.IsNullOrEmpty(DeptStatus))
            {
                int deptStatus = Convert.ToInt32(DeptStatus) - 1;
                if (deptStatus > -1)
                {
                    sqlWhere += " and DeptStatus = @DeptStatus";
                    parms.Add("@DeptStatus", deptStatus);
                }
            }

            try
            {
                DataTable dt = mybll.GetPageData(sql + sqlWhere, "order by DeptId desc", start + 1, limit, parms);
                sql = string.Format(@"select count(Id) from iDept where IsDeleted=0 and depttypeid=1 {0} {1} " + sqlWhere, DeptCode, DeptName);
                int totalCount = Convert.ToInt32(mybll.ExecScalar(sql, parms));
                result = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }

            return result;
        }

        private string Update()
        {
            string result = string.Empty;

            string LoginType = Request["LoginType"];
            string DeptId = Request["DeptId"];

            try
            {
                result=mybll.Update(DeptId, LoginType, CurrentUser.Id);
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\""+ex.Message+"\"}";
            }

            return result;
        }
    }
}