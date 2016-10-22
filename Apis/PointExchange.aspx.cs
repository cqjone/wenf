using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;

public partial class Apis_PointExchange : AuthBasePage
{
    BllApi.PointExchangeApis exchangeMgr = new BllApi.PointExchangeApis();

    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "PointExchangeMgr":
                PointExchangeMgr();//增加兑换礼品
                break;
             case "checkPassword":
                CheckPassword();//兑换礼品验证密码
                break;
             case "getDataByIdNo":
                GetDataByIdNo();//根据ID获取预约兑换礼品
                break;
             case "getUnexchange":
                GetUnexchange();//获取未兑换礼品信息
                break;
             case "getDeptByID":
                GetDeptByID();//根据deptID得到该部门所有员工名称
                break;
             case "updatebPointExchange":
                UpdatebPointExchange();//更新bPointExchange信息
                break;
             case "checkPwd":
                CheckPwd();//验证密码
                break;
             case "batchExchange":
                BatchExchange();//批量更新bPointExchange信息
                break;
             case "cancelExchange":
                CancelExchange();//批量更新bPointExchange信息
                break;
            case "updateGetType"://更新取货方式
                UpdateGetType();
                break;
            case "getDeptUnExchange":
                GetDeptUnExchange();
                break;
        }
    }

    /// <summary>
    /// 获取本门店 未兑换的礼品
    /// </summary>
    private void GetDeptUnExchange()
    {
        string idNo = Request["idNo"];
        string mobile = Request["mobileNo"];
        DataTable dt = exchangeMgr.GetDeptUnExchange(CurrentUser.DeptID.ToString(),idNo,mobile);
        if (dt != null && dt.Rows.Count > 0)
        {
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

            Response.Write(html);
            Response.End();
        }
        else
        {
            base.ReturnResultJson("false", "查询失败！");
            return;
        }
    }

    /// <summary>
    /// 更新 单据 取货方式
    /// </summary>
    private void UpdateGetType()
    {
        string id = Request["id"];//兑换单据ID
        string getType = Request["getType"];//单据

        int result = exchangeMgr.UpdateGetType(CurrentUser, id, getType);
        if (result > 0)
        {

            base.ReturnResultJson("true", "更新取货方式成功！");
        }
        else
        {

            base.ReturnResultJson("false", "更新取货方式失败！");
        }
    }

    /// <summary>
    /// 提交 一个积分规则
    /// 判断有没有id，如果有id则 update，否则 则insert
    /// </summary>
    private void PointExchangeMgr()
    {
        string id = Request["id"];
        string avilablePoint = Request["AvilablePoint"];
        string pointCount = Request["PointCount"];

        if (!string.IsNullOrEmpty(avilablePoint) && !string.IsNullOrEmpty(pointCount))
        {
            if (decimal.Parse(pointCount) > decimal.Parse(avilablePoint))
            {
                base.ReturnResultJson("false", "您的积分不够兑换该礼品！");
                return;
            }
        }

        DataTable result;
        DataTable dtSource;
        if (string.IsNullOrEmpty(id))
        {
            //insert
            dtSource = MappingDataFromPage("bPointExchange", "0");
            //bool check = exchangeMgr.CheckData(Request["IdNo"], Request["MobileNo"], "0");
            //if (check)
            //{
            //    base.ReturnResultJson("false", "身份证或手机号码已经存在！");
            //    return;
            //}
            //else
            //{
                result = exchangeMgr.Add(CurrentUser, dtSource);
            //}
        }
        else
        {
            //update;
            dtSource = MappingDataFromPage("bPointExchange", id);


            //bool check = exchangeMgr.CheckData(Request["IdNo"], Request["MobileNo"], id);
            //if (check)
            //{
            //    base.ReturnResultJson("false", "身份证或手机号码已经存在！");
            //    return;
            //}
            //else
            //{
                result = exchangeMgr.Update(CurrentUser, dtSource);
            //}
        }
        base.ReturnSubmitResultJson(result);
    }

    /// <summary>
    /// 兑换礼品验证密码
    /// </summary>
    private void CheckPassword()
    {
        string id = Request["ID"];
        string pwd = Request["pwd"];

        if (string.IsNullOrEmpty(id) && string.IsNullOrEmpty(pwd))
        {
            base.ReturnResultJson("false", "未找到记录");
            return;
        }

        int i = exchangeMgr.checkPassword(id, pwd);
        if (i == 0)
        {
            base.ReturnResultJson("true", "验证成功！");
        }
        else
        {
            base.ReturnResultJson("false", "密码错误！");
            return;
        }
    }

    /// <summary>
    /// 根据身份证得到用户ID获取所预约兑换的礼品
    /// </summary>
    private void GetDataByIdNo()
    {
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


        BllApi.PointAccountApis pointApis = new BllApi.PointAccountApis();
        BllApi.Models.PointAccount pointAccount = pointApis.GetDataByIdNo(idNo, mobile, pointAccountId, card);
        if (pointAccount == null)
        {
            base.ReturnResultJson("false", "没有查到积分账户！");
            return;
        }

        //查询所预约兑换的礼品
        BllApi.PointExchangeApis exchange = new BllApi.PointExchangeApis();
        DataTable dt = exchange.GetDataByIdNo(idNo, mobile);
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

        Response.Write(string.Format("{{success:true,msg:{0}}}", html));
        Response.End();
    }

    /// <summary>
    /// 扣减积分
    /// </summary>
    /*
    private void ExchangePoint()
    {
        string id = Request["ID"];
        string pwd = Request["pwd"];

        string deptID = CurrentUser.DeptID.ToString();
        string billID = Request["billID"];
        
        if (string.IsNullOrEmpty(id) && string.IsNullOrEmpty(pwd))
        {
            base.ReturnResultJson("false", "未找到记录");
            return;
        }

        if (string.IsNullOrEmpty(billID) )
        {
            base.ReturnResultJson("false", "没有查到兑换单据！");
            return;
        }
        int i = exchangeMgr.checkPassword(id, pwd);
        if (i == 0)
        {
            //base.ReturnResultJson("true", "验证成功！");
            //BllApi.PointExchangeApis exchange = new BllApi.PointExchangeApis();
            int isOk = exchangeMgr.ExchangePoint(deptID, billID);

            if (isOk > 0)
            {
                base.ReturnResultJson("true", "兑换礼品成功！");
            }
            else
            {
                base.ReturnResultJson("false", "兑换礼品失败！");
                return;
            }
        }
        else
        {
            base.ReturnResultJson("false", "密码错误！");
            return;
        }
    }
    */
   
    /// <summary>
    /// 得到未兑换礼品信息
    /// </summary>
    public void GetUnexchange()
    {
        string idNo = Request["idNo"];
        string mobile = Request["mobileNo"];

       //BllApi.PointExchangeApis exchange = new BllApi.PointExchangeApis();
        DataTable dt = exchangeMgr.GetUnexchange(idNo, mobile);
        if (dt != null && dt.Rows.Count > 0)
        {
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

            Response.Write(html);
            Response.End();
        }
        else
        {
            base.ReturnResultJson("false", "无该账户兑换信息！");
            return;
        }
    }

    /// <summary>
    /// 根据当前登录用户id得到该部门所有员工名字
    /// </summary>
    public void GetDeptByID()
    {
        try
        {
            string deptID = CurrentUser.DeptID.ToString();
            DataTable dt = exchangeMgr.GetDept(deptID);
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            html = "{results:" + dt.Rows.Count.ToString() + ",rows:" + html + "}";

            Response.Write(html);
            Response.End();
        }
        catch (Exception ex) 
        {
            Response.Write(ex.Message);
        }
        
    }

    public void CheckPwd()
    {
        string accountID = Request["AccountID"];
        string pwd = Request["Password"];
        //验证密码
        int i = exchangeMgr.checkPassword(accountID, pwd);
        if (i == 0)
        {
            UpdatebPointExchange();
        }
        else
        {
            base.ReturnResultJson("false", "密码错误！");
            return;
        }
    }

    /// <summary>
    /// 更新bPointExchange信息
    /// </summary>
    public void UpdatebPointExchange()
    {
        Hashtable parms = new Hashtable();
        string eid = Request["EID"];
        string accountID = Request["AccountID"];
        string pwd = Request["Password"];
        string DeductEmpID = Request["DeductEmpID"] == "" ? "0" : Request["DeductEmpID"];
        string Consignee = Request["Consignee"] == null ? "" : Request["Consignee"];
        string Address = Request["Address"] == null ? "" : Request["Address"];
        string ZipCode = Request["ZipCode"] == null ? "" : Request["ZipCode"];
        string TelNo = Request["TelNo"] == null ? "" : Request["TelNo"];
        string LogisticsCmp = Request["LogisticsCmp"] == null ? "" : Request["LogisticsCmp"];
        string LogisticsNo = Request["LogisticsNo"] == null ? "" : Request["LogisticsNo"];

        if (string.IsNullOrEmpty(eid) )
        {
            base.ReturnResultJson("false", "无更新信息！");
            return;
        }

        //验证密码
        //int i = exchangeMgr.checkPassword(accountID, pwd);
        //if (i == 0)
        //{
            //base.ReturnResultJson("true", "验证成功！");
            parms.Add("EID", eid);
           // parms.Add("DeductEmpID", DeductEmpID);
            parms.Add("Consignee", Consignee);
            parms.Add("Address", Address);
            parms.Add("ZipCode", ZipCode);
            parms.Add("TelNo", TelNo);
            parms.Add("LogisticsCmp", LogisticsCmp);
            parms.Add("LogisticsNo", LogisticsNo);

            //判断是否是服务，插入员工提成表
            string empIds = Request["empIDs"];
            string empDeducts = Request["empDeducts"];
            /*if (empIds != null && empDeducts != null)
            {
                string[] ids = empIds.TrimEnd(',').Split(',');
                string[] deducts = empDeducts.TrimEnd(',').Split(',');

                DbCommon.BaseInfo info = new DbCommon.BaseInfo();
                DataTable dt = info.GetDataByID(CurrentUser, "bPointDeductList", "-1");

                DataRow row = null;
                for (int j = 0; j < ids.Length; j++)
                {
                    row = dt.NewRow();
                    row["BillID"] = eid;
                    row["EmpID"] = ids[j].ToString();
                    row["Ratio"] = deducts[j].ToString();
                    dt.Rows.Add(row);
                }

                exchangeMgr.Add(CurrentUser, dt);
            }*/

            int isOk = exchangeMgr.UpdatebPointExchange(CurrentUser, parms,empIds,empDeducts);

            if (isOk > 0)
            {
                string mobile = Request["MobileNo"];
                if (string.IsNullOrEmpty(mobile))
                {
                    mobile = Request["TelNo"];
                }
                if (!string.IsNullOrEmpty(mobile))
                {
                    SMSHelper.BillMsgSend sender = new SMSHelper.BillMsgSend(); 
                    sender.MsgExchange(CurrentUser, mobile, null);
                }
                base.ReturnResultJson("true", "更新兑换信息成功！");
            }
            else
            {
                base.ReturnResultJson("false", "更新兑换信息失败！");
                return;
            }
        //}
        //else
        //{
        //    base.ReturnResultJson("false", "密码错误！");
        //    return;
        //}
    }

    /// <summary>
    /// 批量兑换更新bPointExchange信息
    /// </summary>
    public void BatchExchange()
    {
        Hashtable parms = new Hashtable();
        string[] eid = Request["EID"].Split(',');
        string accountID = Request["AccountID"];
        
        string Consignee = Request["Consignee"] == null ? "" : Request["Consignee"];
        string Address = Request["Address"] == null ? "" : Request["Address"];
        string ZipCode = Request["ZipCode"] == null ? "" : Request["ZipCode"];
        string TelNo = Request["TelNo"] == null ? "" : Request["TelNo"];

        string LogisticsCmp = Request["LogisticsCmp"] == null ? "" : Request["LogisticsCmp"];
        string LogisticsNo = Request["LogisticsNo"] == null ? "" : Request["LogisticsNo"];

        if (eid.Length == 0)
        {
            base.ReturnResultJson("false", "无更新信息！");
            return;
        }

        parms.Add("Consignee", Consignee);
        parms.Add("Address", Address);
        parms.Add("ZipCode", ZipCode);
        parms.Add("TelNo", TelNo);
        parms.Add("LogisticsCmp", LogisticsCmp);
        parms.Add("LogisticsNo", LogisticsNo);

        int isOk = 0;
        for (int i = 0; i < eid.Length; i++)
        {
            //foreach (System.Collections.DictionaryEntry item in parms)
            //{
            //    if ("EID".Equals(item.Key.ToString()))
            //    {
                    parms.Remove("EID");
                    parms.Remove("ModifyID");
                    parms.Remove("ModifyFrom");
                    parms.Remove("deptID");
                //}
            //}
            parms.Add("EID", eid[i].ToString());

            isOk = exchangeMgr.UpdatebPointExchange(CurrentUser, parms, null, null);

            if (isOk > 0)
            {
                isOk++;
            }
            else
            {
                base.ReturnResultJson("false", "更新兑换信息失败！");
                return;
            }
        }
        
        if (isOk > 0)
        {

            base.ReturnResultJson("true", "更新兑换信息成功！");
        }
    }

    /// <summary>
    /// 取消兑换
    /// </summary>
    public void CancelExchange()
    {
        string eid = Request["EID"];
        int isOk = exchangeMgr.CancelExchange(CurrentUser, eid);
        if (isOk > 0)
        {
            //发送短信
            string product = Request["productName"];
            string mobileNo = Request["mobileNo"];
            if (!string.IsNullOrEmpty(mobileNo))
            {
                SMSHelper.BillMsgSend sender = new SMSHelper.BillMsgSend();
                Hashtable pm = new Hashtable();
                pm.Add("Product", product);
                sender.MsgCancelOrder(CurrentUser, mobileNo, pm);
            }
            base.ReturnResultJson("true", "取消兑换成功！");
            
        }
        else
        {
            base.ReturnResultJson("false", "取消兑换失败！");
            return;
        }
    }
}