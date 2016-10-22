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
    public partial class ExchangeCard : AuthBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            switch (ActionName)
            {
                case "getExchangeCard":
                    GetExchangeCard();
                    break;
                case "getDetails":
                    GetDetails();
                    break;
                case "getBase":
                    GetBase();
                    break;
                case "getTransferCard":
                    GetTransferCard();
                    break;
                case "getTransferCardDetails":
                    GetTransferCardDetails();
                    break;
                case "getBaseForm":
                    GetBaseForm();
                    break;
            }
        }
        /// <summary>
        /// 转卡基础信息
        /// </summary>
        private void GetBaseForm()
        {
            string cardNo = Request["CardNo"].ToString();
            Hashtable parms = new Hashtable();
            parms.Add("@cardNo", cardNo);
            string sql = @"select h.TargetCardType ,c.Title as CustomerTitle,c.MemoInfo as CustomerMemoInfo,b.MemoInfo,a.Title,a.Tel 
                            from dbo.hTransferCard h,iCustomer c,iDept a,iCard b
                            where h.TargetCustomerID=c.ID and c.DeptID=a.id  
                            and b.CustomerID=c.ID and h.TargetCardNo=@cardNo";
            DataTable dt = new DataTable();
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql, parms);
            }
            if (dt != null && dt.Rows.Count > 0)
            {
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                Response.Write(html);
                Response.End();
            }
        }
        /// <summary>
        /// 转卡明细
        /// </summary>
        private void GetTransferCardDetails()
        {
            string hTransferID = Request["Id"].ToString();
            string ID = hTransferID.TrimEnd(',');
            DataTable dt = new DataTable();
            string sql = @"select h.BillDate,a.Title,(h.TransferMoney+h.Price) as TranMoney,h.SrcCardNo,h.SrcCardType,h.TargetCardNo,h.TargetCardType from hTransferCard h,IDept a
                            where a.Id=h.DeptID and a.IsDeleted=0 and h.IsDeleted=0 and h.ID in (" + ID + ")";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql);
            }
            if (dt != null && dt.Rows.Count > 0)
            {
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                Response.Write(html);
                Response.End();
            }
        }
        /// <summary>
        /// 
        /// 根据时间查询转卡信息
        /// </summary>
        private void GetTransferCard()
        {
            string whereSql = "";
            string beginDate = Request["BeginDate"].ToString();
            string endDate = Request["EndDate"].ToString();
            Hashtable parms = new Hashtable();
            parms.Add("@BeginDate", beginDate);
            parms.Add("@EndDate", endDate);
            if (beginDate != "")
            {
                whereSql += " and BillDate>@BeginDate";
            }
            if (endDate != "")
            {
                whereSql += " and BillDate<@EndDate";
            }
            DataTable dt = new DataTable();
            DataTable dtResult = new DataTable();
            dtResult.Columns.Add("ID");
            dtResult.Columns.Add("TargetCardNo");
            dtResult.Columns.Add("DeptTitle");
            dtResult.Columns.Add("DeptID");
            dtResult.Columns.Add("BillDate");
            dtResult.Columns.Add("TransferMoney");
            dtResult.Columns.Add("TargetCardBalance");
            dtResult.Columns.Add("CardCount");

            string sql = @"select h.*,a.Title from dbo.hTransferCard h,idept a where h.DeptID=a.id " + whereSql;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {

                dt = db.ExecuteQuery(sql, parms);

            }
            if (dt != null && dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    DataRow row = dtResult.NewRow();
                    string TargetCardNo = dt.Rows[i]["TargetCardNo"].ToString();
                    int num = 0;
                    for (int j = 0; j < dt.Rows.Count; j++)
                    {
                        if (TargetCardNo == dt.Rows[j]["SrcCardNo"].ToString())
                        {
                            num = 1;
                        }
                    }
                    if (num == 0)
                    {
                        row["ID"] = "";
                        row["DeptID"] = dt.Rows[i]["DeptID"].ToString();
                        row["DeptTitle"] = dt.Rows[i]["Title"].ToString();
                        row["BillDate"] = Convert.ToDateTime(dt.Rows[i]["BillDate"]).ToString("yyyy-MM-dd");
                        row["CardCount"] = "0";
                        row["TransferMoney"] = "0";
                        row["TargetCardBalance"] = Convert.ToDecimal(dt.Rows[i]["TargetCardBalance"]).ToString("F2");
                        row["TargetCardNo"] = dt.Rows[i]["TargetCardNo"].ToString();
                        dtResult.Rows.Add(row);
                    }

                }

                //
                foreach (DataRow row in dtResult.Rows)
                {
                    ProcessCount(dt, row, null);
                }
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);
                Response.Write(html);
                Response.End();
            }
        }
        /// <summary>
        /// 递归循环转卡次数和转卡金额
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="resultRow"></param>
        /// <param name="srcRow"></param>
        private void ProcessCount(DataTable dt, DataRow resultRow, DataRow srcRow)
        {
            DataRow[] rows = null;
            if (srcRow == null)
            {
                rows = dt.Select("TargetCardNo ='" + resultRow["TargetCardNo"] + "'");
            }
            else
            {
                rows = dt.Select("TargetCardNo ='" + srcRow["SrcCardNo"] + "'");

            }
            foreach (DataRow row in rows)
            {
                resultRow["CardCount"] = Convert.ToInt32(resultRow["CardCount"]) + 1;
                //
                resultRow["ID"] = resultRow["ID"].ToString() + row["ID"].ToString() + ",";
                resultRow["TransferMoney"] = (Convert.ToDecimal(resultRow["TransferMoney"]) + Convert.ToDecimal(row["TransferMoney"]) + Convert.ToDecimal(row["Price"])).ToString("F2");
                ProcessCount(dt, resultRow, row);
            }
        }

        /// <summary>
        /// 查询转卡日报表的基础信息
        /// </summary>
        private void GetBase()
        {
            DataTable dt = new DataTable();
            Hashtable parms = new Hashtable();
            string Id = Request["ID"].ToString();
            string BillDate = Request["billDate"].ToString();
            parms.Add("@ID", Id);
            parms.Add("@BillDate", BillDate);
            string sql = "select a.Tel,b.BillDate,a.Title from hTransferCard b,Idept a where  b.DeptID=a.ID and b.DeptID=@ID and convert(char(10),b.BillDate,102)=@BillDate";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql, parms);
            }
            if (dt.Rows.Count > 0 && dt != null)
            {
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                Response.Write(html);
                Response.End();
            }
        }
        /// <summary>
        /// 查询明细
        /// </summary>
        private void GetDetails()
        {
            string Type = Request["Type"].ToString();
            string Id = Request["ID"].ToString();
            string BillDate = Request["billDate"].ToString();
            string TypeID = Request["TypeID"].ToString();
            string Time=Request["Time"].ToString();
            if (Time != "")
            {
                Time = Convert.ToDateTime(Request["Time"]).ToString("yyyy-MM-dd");
            }
            string sql = "";
            DataTable dt = new DataTable();
            Hashtable parms = new Hashtable();
            parms.Add("@ID", Id);
            parms.Add("@TypeID", TypeID);
            parms.Add("@Time", Time);
            parms.Add("@BillDate", BillDate);
            if (Type == "")
            {
                sql = @"select h.BillDate,0.00 as Price,(h.TransferMoney+h.Price) as TransferMoney,h.VerifyCode,h.SrcCardNo,a.Title,h.SrcCustomerName,a.MemoInfo,h.TargetCardNo,a.Title as CardTypeTitle,h.TargetCardBalance,b.Title as CustomerName,a.MemoInfo as TargetCardMemoInfo
                           from hTransferCard h,iCardType a,iCustomer b
                           where h.SrcCardTypeID=a.Id and  h.TargetCustomerID=b.Id and h.TargetCardTypeID=a.id and h.DeptID=@ID
                           and a.IsDeleted=0 and b.IsDeleted=0 and h.IsDeleted=0 and convert(char(10),h.BillDate,102)=@BillDate";
            }
            else
            {
                sql = @"select h.BillDate,0.00 as Price,(h.TransferMoney+h.Price) as TransferMoney,h.VerifyCode,h.SrcCardNo,a.Title,h.SrcCustomerName,a.MemoInfo,h.TargetCardNo,a.Title as CardTypeTitle,h.TargetCardBalance,b.Title as CustomerName,a.MemoInfo as TargetCardMemoInfo
                           from hTransferCard h,iCardType a,iCustomer b
                           where h.SrcCardTypeID=a.Id and  h.TargetCustomerID=b.Id and h.TargetCardTypeID=a.id and h.DeptID=@TypeID
                           and a.IsDeleted=0 and b.IsDeleted=0 and h.IsDeleted=0 and replace(CONVERT(char(10),h.BillDate,111),'/','-')=@Time";
                if (Type == "2")
                {
                    sql += " and h.VerifyCode is not null and h.VerifyCode !=''";
                }
                else if (Type == "3")
                {
                    sql += " and (h.VerifyCode is null or h.VerifyCode ='')";
                }
            }
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql, parms);
            }
            if (dt.Rows.Count > 0 && dt != null)
            {
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                Response.Write(html);
                Response.End();
            }
            else
            {
                base.ReturnResultJson("false", "未查到积分信息！");
                return;
            }
        }
        /// <summary>
        /// 根据条件查询hTransferCard表
        /// </summary>
        private void GetExchangeCard()
        {
            string beginDate = Request["BeginDate"].ToString();
            string endDate = Request["EndDate"].ToString();
            string ideptID = Request["deptNo"].ToString();
            Hashtable parms = new Hashtable();
            parms.Add("@beginDate", beginDate);
            parms.Add("@endDate", endDate);
            string whereSql = "";
            if (ideptID != "")
            {
                whereSql += "and h.DeptID in(" + ideptID + ")";
            }
            if (beginDate != "")
            {
                whereSql += " and h.BillDate>@beginDate";
            }
            if (endDate != "")
            {
                whereSql += " and h.BillDate<@endDate";
            }
            string sql = @"select convert(char(10),h.BillDate,102) as BillDate,h.DeptID,Count(*) as Count,a.Title,sum(h.TransferMoney+h.Price) as TransferMoney from hTransferCard h,IDept a where a.ID=h.DeptID 
                    " + whereSql + "  group by convert(char(10),h.BillDate,102),a.Title,h.DeptID";
            DataTable dt = new DataTable();
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql, parms);
            }
            if (dt.Rows.Count > 0 && dt != null)
            {
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                Response.Write(html);
                Response.End();
            }
            else
            {
                base.ReturnResultJson("false", "未查到积分信息！");
                return;
            }
        }
    }
}