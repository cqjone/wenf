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
    public partial class ICTimeDelay : AuthBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                switch (ActionName)
                { 
                    case "timeDelay":
                        TimeDelay();
                        break;
                }
            }
        }

        /// <summary>
        /// 延期
        /// </summary>
        private void TimeDelay()
        {
            string msg = string.Empty;
            try
            {
                bool goon = true;//判断是否继续执行操作
                string CardNo = Request["CardNo"];
                
                Hashtable prams = new Hashtable();
                prams.Add("@CardNo", CardNo);
                
                DataTable dt = new DataTable();
                DbCommon.DbUtil utl = new DbCommon.DbUtil();

                //判断IC卡是否需要延期
                string sql = "select Id,EmpId,Status,ActionType from iICCardInfo where IsDeleted=0 and EmpId is not null and CardNo = @CardNo";
                dt = utl.ExecuteQuery(sql, prams);
                if (dt.Rows.Count == 0)
                {
                    msg = "卡号不存在...";
                    goon = false;
                }
                if (goon)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        if (dt.Rows[0]["ActionType"].ToString() == "2" && dt.Rows[0]["Status"].ToString() == "1")
                        {
                            msg = "卡尚未写入，无需延期！";
                            goon = false;
                        }
                    }
                }
                if (goon)
                {
                    //更改IC卡有效期
                    sql = string.Format("update iICCardInfo set ModifyDate=getdate(),ModifyId={0},ActionType=1 where IsDeleted=0 and EmpId is not null and Status=1 and  CardNo=@CardNo", CurrentSession.UserID);
                    utl.ExecuteNoneQuery(sql, prams);
                    utl.Commit();
                    msg = "操作完成...";

                    //操作完成释放数据库链接
                    utl.Dispose();
                }
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false",ex.Message+"  ----  "+ex.StackTrace);
            }

            base.ReturnResultJson("true",msg);
        }
    }
}