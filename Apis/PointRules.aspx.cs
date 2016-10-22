using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;

public partial class Apis_PointRules : AuthBasePage
{
    BllApi.PointRuleApis pointRuleMgr = new BllApi.PointRuleApis();

    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "submitRule":
                SubmitRule();
                break;
            case "getData"://查询数据
                getData();
                break;
            case "getDataById"://查询数据
                GetDataById();
                break;
            case "getPointHistory"://查询用户积分流水
                getPointHistory();
                break;
            case "getRulesByIdNo"://查询用户积分可兑换礼品
                GetRulesByIdNo();
                break;
            case "getTarget"://获取兑换目标
                GetTargetData();
                break;
            case "getActivityRules"://获取积分规则
                GetActivityRules();
                break;
        }
    }

    //获取积分规则
    private void GetActivityRules()
    {
        BllApi.PointRuleApis rulApi = new BllApi.PointRuleApis();

        DataTable dt = new DataTable();

        dt = rulApi.GetActivityRules();

        base.ReturnGetDataJson("true", "查询成功", dt);
    }

    /// <summary>
    /// 获取兑换目标
    /// </summary>
    private void GetTargetData()
    {
        string id = Request["id"];
        if (string.IsNullOrEmpty(id) && string.IsNullOrEmpty(id))
        {
            base.ReturnResultJson("false", "非法查询！");
            return;
        }
        BllApi.PointRuleApis rulApi = new BllApi.PointRuleApis();

        DataTable dt = new DataTable();
        //1:服务
        if ("1".Equals(id))
        {
            dt = rulApi.GetServiceData();
        }
        else if ("2".Equals(id))
        {//2、产品
            dt = rulApi.GetProductData();
        }
        else if ("3".Equals(id))
        { 
            //3、商品
            dt = rulApi.GetGoodsData();
        }

        base.ReturnGetDataJson("true", "查询成功", dt);
    }

    /// <summary>
    /// 查询用户积分可兑换礼品
    /// </summary>
    private void GetRulesByIdNo()
    {
        string idNo = Request["idNo"];
        string mobileNo = Request["mobileNo"];
        string card = Request["card"];
        string pointAccountId = "0";

        if (string.IsNullOrEmpty(idNo) && string.IsNullOrEmpty(mobileNo) && string.IsNullOrEmpty(card))
        {
            base.ReturnResultJson("false", "未找到可兑换礼品！");
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

        DataTable dt = pointRuleMgr.GetRulesByIdNo(idNo, mobileNo,pointAccountId,card);
        
        if (dt == null)
        {
            base.ReturnResultJson("false", "没有该积分帐户！");
            return;
        }
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(html);
        Response.End();
    }

    /// <summary>
    /// 根据ID获取记录
    /// </summary>
    private void GetDataById()
    {
        string id = Request["id"];
        if (string.IsNullOrEmpty(id))
        {
            base.ReturnResultJson("false","未提供单据ID");
            return;
        }

        DataTable dt = pointRuleMgr.GetDataById(CurrentUser, id);
        if (dt == null || dt.Rows.Count == 0)
        {
            base.ReturnResultJson("false", "未找到记录");
            return;
        }
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(html);
        Response.End();
    }

    /// <summary>
    /// 根据条件查询数据
    /// </summary>
    private void getData()
    {
        string targetType = Request["ExchangeTargetType"];
        string wheresql = "";
        Hashtable parms = new Hashtable();
        if (!string.IsNullOrEmpty(targetType) && !"0".Equals(targetType))
        {
            wheresql += " and ExcTargetType =@ExcTargetType";// and ExcTargetType <> 1";
            parms.Add("ExcTargetType",targetType);
        }
        string validDateBegin = Request["ValidDateBegin"];
        if (!string.IsNullOrEmpty(validDateBegin))
        {
            wheresql += " and ValidDateBegin >= @ValidDateBegin";
            parms.Add("ValidDateBegin", Convert.ToDateTime(validDateBegin).ToString("yyyy-MM-dd 00:00:01"));
        } 
        
        string validDateEnd = Request["ValidDateEnd"];
        if (!string.IsNullOrEmpty(validDateEnd))
        {
            wheresql += " and ValidDateEnd <= @ValidDateEnd";
            parms.Add("ValidDateEnd", Convert.ToDateTime(validDateEnd).ToString("yyyy-MM-dd 23:59:59"));
        }

        DataTable dt = pointRuleMgr.GetData(CurrentUser, wheresql, parms);

        base.ReturnGetDataJson("true", "查询成功", dt);
    }

    /// <summary>
    /// 提交 一条规则
    /// 判断有没有id，如果有id则 update，否则 则insert
    /// </summary>
    private void SubmitRule()
    {
        string id = Request["id"];
        DataTable result;
        DataTable dtSource;
        if (string.IsNullOrEmpty(id) || "0".Equals(id))
        {
            //insert
            dtSource = MappingDataFromPage("iPointRules", "0");
            result = pointRuleMgr.Add(CurrentUser, dtSource);
        }
        else
        {
            //update;
            dtSource = MappingDataFromPage("iPointRules", id);
            result = pointRuleMgr.Update(CurrentUser, dtSource);
        }
        base.ReturnSubmitResultJson(result);
    }

    /// <summary>
    /// 查询账户积分流水
    /// </summary>
    private void getPointHistory()
    {
        string idNo = Request["idNo"];
        string mobile = Request["mobileNo"];
        string card = Request["card"];
        string pointAccountId = "0";

        if (string.IsNullOrEmpty(idNo) && string.IsNullOrEmpty(mobile) && string.IsNullOrEmpty(card))
        { 
            base.ReturnResultJson("false","没有查到积分账户！");
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
        BllApi.Models.PointAccount pointAccount = pointApis.GetDataByIdNo(idNo,mobile,pointAccountId,card);
        if (pointAccount == null)
        {
            base.ReturnResultJson("false", "没有查到积分账户！");
            return;
        }

        //查询积分流水
        BllApi.PointReportApi report = new BllApi.PointReportApi();
        DataTable dt = report.SearchPointHistory(pointAccount.id, dateBegin, dateEnd);
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

        Response.Write(string.Format("{{success:true,msg:{0}}}",html));
        Response.End();
    }
}