using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;

namespace BeautyPointWeb.Apis
{
    public partial class RemoteBindCard :AuthBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                switch (ActionName)
                { 
                    case "findEmp":
                        FindEmp();
                        break;
                    case "bindCard":
                        BindCard();
                        break;
                }
            }
        }

        private BllApi.RemoteBindCard mybll = new BllApi.RemoteBindCard();

        /// <summary>
        /// 根据条件查询员工
        /// </summary>
        private void FindEmp()
        {
            try
            {
                string DeptName = Request["DeptName"].Trim();
                string EmpCode = Request["EmpCode"].Trim();
                string EmpName = Request["EmpName"].Trim();
                string EmpIdNo = Request["EmpIdNo"].Trim();
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                
                Hashtable prams = new Hashtable();
                prams.Add("@DeptName",DeptName);
                prams.Add("@EmpCode",EmpCode);
                prams.Add("@EmpName",EmpName);
                prams.Add("@EmpIdNo", EmpIdNo);

                
                string sql = @"select a.ID,a.Code as EmpCode,a.Title as EmpName,a.Mobile,b.Title as DeptName,
								a.IdNo,b.ID as DeptID
								from iEmployee a,iDept b
								where a.DeptID = b.ID
								and a.IsDeleted = 0
								and b.IsDeleted = 0 and a.Code like '%' + @EmpCode + '%' and a.Title like '%' + @EmpName +'%'"
                                + " and a.IdNo like '%' + @EmpIdNo + '%' "
                                + " and b.Title like '%' + @DeptName + '%' ";

                DataTable dt = mybll.GetPageData(sql, "order by DeptName,EmpCode desc", start + 1, limit, prams);
                string result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

                //获取搜索数据总数量
                string sqlGetCount = @"select count(*) from iEmployee a,iDept b
								        where a.DeptID = b.ID
								        and a.IsDeleted = 0
								        and b.IsDeleted = 0 and a.Code like '%' + @EmpCode + '%' and a.Title like '%' + @EmpName +'%'"
                                        + " and a.IdNo like '%' + @EmpIdNo + '%' "
                                        + " and b.Title like '%' + @DeptName + '%' ";
                
                string totalCount = string.Empty;
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    totalCount = utl.ExecuteScalar(sqlGetCount, prams).ToString();
                }

                string msg = "{totalCount:" + totalCount + ",results:" + result + "}";

                Response.Write(msg);
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.Message);
            }
            finally
            {
                Response.End();
            }
        }

        /// <summary>
        /// 绑定卡
        /// </summary>
        private void BindCard()
        {
            string msg = string.Empty;

            string CardNo = Request["CardNo"].Trim();
            string EmpId = Request["EmpId"].Trim();
            string DeptId = Request["DeptId"].Trim();

            Hashtable prams = new Hashtable();
            prams.Add("@CardNo", CardNo);
            prams.Add("@EmpId", EmpId);
            prams.Add("@DeptId", DeptId);
            prams.Add("@UserId", CurrentSession.UserID);

            //判断卡号是否有效
            string sql = "select Id,CardNo,EmpId from iICCardInfo where IsDeleted=0 and CardNo=@CardNo";
            DataTable dt_CardNo = mybll.ExecQuery(sql, prams);
            if (dt_CardNo.Rows.Count == 0)
            {
                msg = "卡号无效，请重新输入！";
                base.ReturnResultJson("false", msg);
            }

            //判断卡是否已经被使用
            //DataTable dt=Remote.Query("select Id,CardNo from iICCardInfo where IsDeleted=0 and EmpId is null and CardNo="+this.txt_iccardno.Text.Trim());
            bool CAdd = false;
            for (int i = 0; i < dt_CardNo.Rows.Count; i++)
            {
                if (dt_CardNo.Rows[i]["EmpId"] == System.DBNull.Value)
                {
                    CAdd = true;
                    break;
                }
            }
            if (!CAdd)
            {
                msg = "该卡号已经被使用，请重新输入！";
                base.ReturnResultJson("false", msg);
            }

            mybll.BindCard(prams);

            msg = "绑定成功！";
            
            base.ReturnResultJson("true", msg);

        }
    }
}