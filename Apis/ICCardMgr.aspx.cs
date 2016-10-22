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
    public partial class ICCardMgr : AuthBasePage
    {
        private BllApi.BaseApi basebll = new BllApi.BaseApi();
        protected void Page_Load(object sender, EventArgs e)
        {
            switch (ActionName)
            { 
                case "findCard":
                    FindCard();
                    break;
                case "updateStatus":
                    UpdateStatus();
                    break;
            }
        }

       

        /// <summary>
        /// 查询
        /// </summary>
        private void FindCard()
        {
            string msg = string.Empty; ;
            try
            {
                #region 查询条件、参数设置
                string EmpCode = Request["EmpCode"];
                string EmpIdNo = Request["EmpIdNo"];
                string EmpName = Request["EmpName"];
                string EmpStatus = Request["EmpStatus"];
                string DeptId = Request["DeptId"];
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);

                string sqlWhere = string.Empty;
                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(EmpCode))
                {
                    sqlWhere += " and b.Code like '%' + @EmpCode + '%'";
                    prams.Add("@EmpCode", EmpCode);
                }
                if (!string.IsNullOrEmpty(EmpIdNo))
                {
                    sqlWhere += " and b.IdNo like '%' + @EmpIdNo + '%'";
                    prams.Add("@EmpIdNo", EmpIdNo);
                }
                if (!string.IsNullOrEmpty(EmpName))
                {
                    sqlWhere += " and b.Title like '%' + @EmpName + '%'";
                    prams.Add("@EmpName", EmpName);
                }
                if (!string.IsNullOrEmpty(DeptId))
                {
                    sqlWhere += " and a.Id = @DeptId";
                    prams.Add("@DeptId", DeptId);
                }
                if (!string.IsNullOrEmpty(EmpStatus) && EmpStatus != "0")
                {
                    sqlWhere += " and c.Status = @EmpStatus";
                    prams.Add("@EmpStatus", EmpStatus);
                }
                else
                {
                    sqlWhere += " and c.Status in (1,-1)";
                }
                #endregion

                string sql = @"select a.Title as DeptName,b.Code as EmpCode,b.Mobile as Mobile,b.Title as EmpName,
                                b.IdNo as EmpIDNO,c.CardSn as SN,c.CardNo as CardNo,c.Status
								from iDept as a,iEmployee as b,iICCardInfo as c Where a.IsDeleted=0 and b.IsDeleted = 0 and c.IsDeleted = 0 and a.ID=b.DeptId and c.EmpId=b.id";

                DataTable dt = basebll.GetPageData(sql + sqlWhere, "order by DeptName", start + 1, limit, prams);

                int totalCount = 0;
                sql = "";

                msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) +"}";
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.Message + ex.StackTrace);
            }
            Response.Write(msg);
            Response.End();
        }

        /// <summary>
        /// 更改IC卡状态
        /// </summary>
        private void UpdateStatus()
        {
            string success = "false";
            string msg = string.Empty;
            try
            {
                string status = Request["status"];
                string cardSn=Request["cardSn"];
                Hashtable prams = new Hashtable();
                prams.Add("@status", status);
                prams.Add("@cardSn", cardSn);
                string sql = string.Format("update iICCardInfo set Status=@status,ModifyDate=getdate(),ModifyId={0} where IsDeleted=0 and CardSn=@cardSn",CurrentSession.UserID);
                
                if (status == "1") //激活卡
                {
                    StartICCard(sql, prams, ref msg, ref success);
                }
                else if (status == "-1")//停用卡
                {
                    StopICCard(sql, prams,ref msg,ref success);
                }
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.Message + ex.StackTrace);
            }
            base.ReturnResultJson(success, msg);
        }

        /// <summary>
        /// 激活卡
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="prams"></param>
        /// <param name="msg"></param>
        /// <param name="success"></param>
        private void StartICCard(string sql, Hashtable prams, ref string msg, ref string success)
        {
            string sqlGetStatus = "select status from iiccardinfo where isdeleted = 0 and cardsn = @cardSn";
            using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
            {
                object objStatus = utl.ExecuteScalar(sqlGetStatus, prams);
                string status = objStatus == null ? "" : objStatus.ToString();
                if (status.Equals("1")) //已经激活
                {
                    msg = "该卡已经激活";
                }
                else if (status.Equals("-1")) //已经停用
                {
                    int index = utl.ExecuteNoneQuery(sql, prams);
                    if (index > 0)
                    {
                        msg = "操作完成...";
                        success = "true";
                        utl.Commit();
                    }
                    else
                    {
                        msg = "操作失败...";
                    }
                }
            }
        }

        /// <summary>
        /// 停用卡
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="prams"></param>
        /// <param name="msg"></param>
        /// <param name="success"></param>
        private void StopICCard(string sql, Hashtable prams,ref string msg,ref string success)
        {
            string sqlGetStatus = "select status from iiccardinfo where isdeleted = 0 and cardsn = @cardSn";
            using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
            {
                object objStatus = utl.ExecuteScalar(sqlGetStatus, prams);
                string status = objStatus == null ? "" : objStatus.ToString();
                if (status.Equals("-1")) //已经停用
                {
                    msg = "该卡已经停用";
                }
                else if (status.Equals("1")) //已经激活
                {
                    int index = utl.ExecuteNoneQuery(sql, prams);
                    if (index > 0)
                    {
                        msg = "操作完成...";
                        success = "true";
                        utl.Commit();
                    }
                    else
                    {
                        msg = "操作失败...";
                    }
                }
            }
        }
    }
}