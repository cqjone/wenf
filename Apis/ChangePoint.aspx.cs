using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;
using PointCenter;

public partial class Apis_ChangePoint : AuthBasePage
{
    BllApi.DeptApis deptApis = new BllApi.DeptApis();
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            case "getPointRegulation":
                GetPointRegulation();
                break;
            case"updatePwd":
                UpdatePwd();
                break;
            case "submitPoint":
                SubmitPoint();
                break;
            case "getChangPoint":
                GetChangPoint();
                break;
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
        }
    }
   /// <summary>
   /// 修改当前用户密码
   /// </summary>
    private void UpdatePwd()
    {
        bool success = false;
        string msg = string.Empty;

        string Pwd=Request["pwd"].ToString().ToLower();
        string newPwd = Request["newPwd"].ToString().ToLower();
        Hashtable parms = new Hashtable();
        int Id=CurrentUser.Id;
        string sql = "";        
        parms.Add("@ModifyID",Id);
        parms.Add("@PassWord", newPwd);
        parms.Add("@Id",Id);
        sql = "select PassWord from auser where Id=@Id";
        string userId = "";
        using(DbCommon.DbUtil db=new DbCommon.DbUtil()){
            userId = (string)db.ExecuteScalar(sql, parms);
        }
        if (userId != Pwd)
        {
            //base.ReturnResultJson("false", "密码错误！");
            //return;
            success = false;
            msg = "原密码错误！";
        }
        else
        {
            sql = "update auser set ModifyDate=getDate(),ModifyID=@ModifyID,PassWord=@PassWord where ID=@Id";
            int count = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                count = db.ExecuteNoneQuery(sql, parms);
                if (count > 0)
                {
                    db.Commit();
                    success = true;
                    msg = "修改成功！";
                    //base.ReturnResultJson("true", "修改成功！");
                }
                else
                {
                    success = false;
                    msg = "修改失败！";
                    //base.ReturnResultJson("false", "修改失败！");
                    //return;
                }
            }
        }
        Response.Write(string.Format("{{\"success\":\"{0}\",\"msg\":\"{1}\"}}", success, msg));
        Response.End();
    }
    /// <summary>
    /// 根据条件查询积分调整信息
    /// </summary>
    private void GetChangPoint()
    {
        int start = Convert.ToInt32(Request["start"]);
        string idNo = Request["idNo"];
        string mobile = Request["mobileNo"];
        string card = Request["card"];
        string pointAccountId = "0";
        if (string.IsNullOrEmpty(idNo) && string.IsNullOrEmpty(mobile) && string.IsNullOrEmpty(card))
        {
            base.ReturnResultJson("false", "没有查到积分账户！");
            return;
        }

        if (!string.IsNullOrEmpty(card))
        {
            string sql = @"select PointAccountID from iCard, iPointAccountCards 
            where iCard.ID=iPointAccountCards.CardID 
            and iPointAccountCards.IsDeleted=0 and Code=@code";
            Hashtable parmsCode = new Hashtable();
            parmsCode.Add("code", card);
            DataTable dtResult = null;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dtResult = db.ExecuteQuery(sql, parmsCode);
            }
            if (dtResult != null && dtResult.Rows.Count > 0)
            {
                pointAccountId = dtResult.Rows[0][0].ToString();
            }
        }

        string dateBegin = Request["dateBegin"];
        string dateEnd = Request["dateEnd"];
        BllApi.PointAccountApis pointApis = new BllApi.PointAccountApis();
        BllApi.Models.PointAccount pointAccount = pointApis.GetDataByIdNo(idNo, mobile, pointAccountId, card);
        if (pointAccount == null)
        {
            base.ReturnResultJson("false", "没有查到积分账户！");
            return;
        }
        else
        {
            DataTable dt = new DataTable();
            Hashtable parm = new Hashtable();
            parm.Add("@Id", pointAccount.id);
            string sql = @"select top 25 bPointRegulation.id,ipointAccount.CustomerName,ipointAccount.IdNo,ipointAccount.MobileNo,
                            CONVERT(varchar(100), bPointRegulation.BillDate , 23) AS BillDate ,bPointRegulation.Reason,
                            CONVERT(varchar(100), bPointRegulation.ExpiredDate, 23) AS ExpiredDate, 
                            bPointRegulation.PointCount,bPointRegulation.RegulationType,bPointRegulation.MemoInfo from  
                            ipointAccount,bPointRegulation where ipointAccount.id=bPointRegulation.PointAccountID and ipointAccount.IsDeleted=0 
                            and bPointRegulation.IsDeleted=0 and bPointRegulation.PointAccountID=@Id ";
            if (!string.IsNullOrEmpty(dateBegin))
            {
                sql += string.Format(" and bPointRegulation.BillDate >= '{0}'", Convert.ToDateTime(dateBegin).ToString("yyyy-MM-dd 00:00:01"));
            }
            if (!string.IsNullOrEmpty(dateEnd))
            {
                sql += string.Format(" and bPointRegulation.BillDate <= '{0}'", Convert.ToDateTime(dateEnd).ToString("yyyy-MM-dd 23:59:59"));
            }

            sql += "and bPointRegulation.id not in(select top " + start + " id from bPointRegulation where PointAccountID=@Id order by CreateDate desc ) order by bPointRegulation.CreateDate desc";

            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql, parm);
            }
            int count = getCount(pointAccount.id);
            if (dt != null && dt.Rows.Count > 0)
            {
                pageDataJson("true", "查询成功!", dt, count);
            }
            else
            {
                base.ReturnResultJson("false", "没查到数据！");
                return;
            }
        }

    }
    /// <summary>
    /// 分页时需要的总记录数
    /// </summary>
    /// <param name="Id"></param>
    /// <returns></returns>
    private int getCount(string Id)
    {
        Hashtable parms = new Hashtable();
        parms.Add("@Id", Id);
        string sql = @"select count(*) from 
                    ipointAccount a,bPointRegulation b where a.id=b.PointAccountID and a.IsDeleted=0 and b.IsDeleted=0 and b.PointAccountID=@Id";
        int count = 0;
        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
        {
            count = (int)db.ExecuteScalar(sql, parms);
        }
        return count;
    }
    /// <summary>
    /// 保存积分调整信息
    /// </summary>
    private void SubmitPoint()
    {
        int userId = base.CurrentSession.UserID;
        string PointId = Request["ID"].ToString();
        string Id = Request["DeptID"].ToString();
        DateTime Period = DateTime.Now;
        decimal PointCount = Convert.ToDecimal(Request["PointCount"]);
        string ChangeReason = Request["ChangeReason"] == null ? "" : Request["ChangeReason"].ToString();
        string RegulationType = Request["RegulationType"].ToString();
        string MemoInfo = Request["MemoInfo"] == null ? "" : Request["MemoInfo"].ToString();
        decimal ChangePoint = Convert.ToDecimal(Request["Point"]);
        if (RegulationType == "OUT" && ChangePoint < PointCount)
        {
            base.ReturnResultJson("false", "积分不足！");
            return;
        }
        Hashtable parm = new Hashtable();
        parm.Add("@CreateID", userId);
        parm.Add("@ModifyID", userId);
        parm.Add("@PointAccountID", PointId);
        parm.Add("@DeptID", Id);
        parm.Add("@RegulationType", RegulationType);
        parm.Add("@PointCount", PointCount);
        parm.Add("@Reason", ChangeReason);
        parm.Add("@ExpiredDate", Period);
        parm.Add("@MemoInfo", MemoInfo);
        string sql = @"insert into bPointRegulation(CreateDate,CreateID,ModifyDate,ModifyID,
                       IsDeleted,BillDate,PointAccountID,DeptID,RegulationType,PointCount,ExpiredDate,Reason,MemoInfo)
                       values(getdate(),@CreateID,getdate(),@ModifyID,0,getdate(),@PointAccountID,@DeptID,@RegulationType,@PointCount,@ExpiredDate,@Reason,@MemoInfo)";
        int count = 0;
        string billID = "";
        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
        {
            count = db.ExecuteNoneQuery(sql, parm);
            if (count > 0)
            {
                billID = db.GetLastID().ToString();
                PointRegulation regulation = new PointRegulation(db);
                bool INOUT = false;
                if (RegulationType == "IN")
                {
                    INOUT = regulation.PointIncrease(CurrentUser, billID, Id, PointId, PointCount, Period, ChangeReason, MemoInfo);
                }
                else if (RegulationType == "OUT")
                {
                    INOUT = regulation.PointDecrease(CurrentUser, billID, Id, PointId, PointCount, Period, ChangeReason, MemoInfo);
                }
                if (INOUT == true)
                {
                    db.Commit();
                    base.ReturnResultJson("true", "保存成功！");
                }
                else
                {
                    base.ReturnResultJson("false", "保存失败！");
                    return;
                }
            }
            else
            {
                base.ReturnResultJson("false", "保存失败！");
                return;
            }
        }

    }
    /// <summary>
    /// 查询用户信息基础信息，获得PointAccountId
    /// </summary>
    private void GetPointRegulation()
    {
        string idNo = Request["idNo"];
        string mobile = Request["Mobile"];
        string card = Request["CardID"];
        string pointAccountId = "0";

        if (string.IsNullOrEmpty(idNo) && string.IsNullOrEmpty(mobile) && string.IsNullOrEmpty(card))
        {
            base.ReturnResultJson("false", "没有查到积分账户！");
            return;
        }

        if (!string.IsNullOrEmpty(card))
        {
            string sql = @"select PointAccountID from iCard, iPointAccountCards 
            where iCard.ID=iPointAccountCards.CardID 
            and iPointAccountCards.IsDeleted=0 and Code=@code";
            Hashtable parmsCode = new Hashtable();
            parmsCode.Add("code", card);
            DataTable dtResult = null;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dtResult = db.ExecuteQuery(sql, parmsCode);
            }
            if (dtResult != null && dtResult.Rows.Count > 0)
            {
                pointAccountId = dtResult.Rows[0][0].ToString();
            }
        }

        string dateBegin = Request["dateBegin"];
        string dateEnd = Request["dateEnd"];
        BllApi.PointAccountApis pointApis = new BllApi.PointAccountApis();
        BllApi.Models.PointAccount pointAccount = pointApis.GetDataByIdNo(idNo, mobile, pointAccountId, card);
        if (pointAccount == null)
        {
            base.ReturnResultJson("false", "没有查到积分账户！");
            return;
        }
        else
        {
            DataTable dt = new DataTable();
            Hashtable parms = new Hashtable();
            parms.Add("@Id", pointAccount.id);
            string sql = @"select b.Id,b.IdNo,b.MobileNo,b.CustomerName from iPointAccount b where b.Id=@Id";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {                
                dt = db.ExecuteQuery(sql, parms);
                dt.Columns.Add("PointCount");
            }
            if (dt != null && dt.Rows.Count > 0)
            {
                dt.Rows[0]["PointCount"] = pointAccount.avilablePoint.ToString("F2");
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                Response.Write(html);
                Response.End();
            }
        }
    }
}