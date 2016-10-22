using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;

public partial class Apis_PointAccount : AuthBasePage
{
    BllApi.PointAccountApis pointAccountMgr = new BllApi.PointAccountApis();

    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "AddPointAccount":
                AddPointAccount();
                break;
            case "UpdatePassword":
                UpdatePassword();
                break;
            case "getData":
                GetData();
                break;
            case "getCurrentData":
                GetCurrentData();//获取当天的信息用来修改资料
                break;
            case "selectAccountByMobileNo":
                SelectAccountByMobileNo();//根据手机号查询数据
                break;
            case "getDataById"://查询数据
                GetDataById();
                break;
            case "getCardInfo"://查询积分账户绑定卡信息
                GetCardInfo();
                break;
            case "addCard"://绑定卡
                AddCard();
                break;
            case "removeCard"://解除卡
                RemoveCard();
                break;
            case "getPoint"://得到账户积分信息
                GetPoint();
                break;
            case "getDataByIdNo"://得到账户积分信息
                GetDataByIdNo();
                break;
        }
    }

    private void SelectAccountByMobileNo()
    {
        string idNo = Request["idNo"];
        string mobileNo = Request["mobileNo"];
        string whereSql = null;
        if (idNo != "")
        {
            whereSql = "and idNo=@idNo and mobileNo=@mobileNo";
        }
        else {
            whereSql = " and mobileNo=@mobileNo";
        }
        Hashtable parms = new Hashtable();
        parms.Add("idNo",idNo);
        parms.Add("mobileNo",mobileNo);
        DataTable dt = pointAccountMgr.GetData(CurrentUser, whereSql, parms);
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
    /// 根据身份证或者手机或者卡号 获取记录
    /// </summary>
    private void GetDataByIdNo()
    {
        string idNo = Request["idNo"];
        string mobileNo = Request["mobileNo"];
        string card = Request["card"];
        string pointAccountId = "0";

        if (string.IsNullOrEmpty(idNo) && string.IsNullOrEmpty(mobileNo) && string.IsNullOrEmpty(card))
        {
            base.ReturnResultJson("false", "未找到记录");
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

        BllApi.Models.PointAccount pa = pointAccountMgr.GetDataByIdNo(idNo, mobileNo, pointAccountId, card);
        if (pa == null)
        {
            base.ReturnResultJson("false", "未找到记录");
            return;
        }
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(pa);
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
            base.ReturnResultJson("false", "未提供单据ID");
            return;
        }

        DataTable dt = pointAccountMgr.GetDataById(CurrentUser, id);
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
    /// 根据用户ID得到绑定会员卡信息
    /// </summary>
    private void GetCardInfo()
    {
        string id = Request["id"];
        if (string.IsNullOrEmpty(id))
        {
            base.ReturnResultJson("false", "未提供单据ID");
            return;
        }

        DataTable dt = pointAccountMgr.GetCardInfo(id);
        //if (dt == null || dt.Rows.Count == 0)
        //{
        //    base.ReturnResultJson("false", "未找到记录");
        //    return;
        //}
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(html);
        Response.End();
    }

    /// <summary>
    /// 添加会员卡
    /// </summary>
    private void AddCard()
    {
        string id = Request["id"];
        string code = Request["Code"];
        string password = Request["Password"];

        if (string.IsNullOrEmpty(id) && string.IsNullOrEmpty(code) && string.IsNullOrEmpty(password))
        {
            base.ReturnResultJson("false", "未找到此卡");
            return;
        }
        
        int flag = pointAccountMgr.AddCard(code, password, id);
        if (flag == 0)
        {
            base.ReturnResultJson("true", "添加会员卡成功！");
        }
        else if(flag == 1)
        {
            base.ReturnResultJson("false", "无该会员卡！");
            return;
        }
        else if (flag == 2)
        {
            base.ReturnResultJson("false", "会员卡密码错误！");
            return;
        }
        else if (flag == 3)
        {
            base.ReturnResultJson("false", "会员卡绑定卡失败！请稍后再试！");
            return;
        }
        else if (flag == 4)
        {
            base.ReturnResultJson("false", "此会员卡已绑定账户！请选择其他卡绑定！");
            return;
        }
    }

    /// <summary>
    /// 解除会员卡
    /// </summary>
    private void RemoveCard()
    {
        string id = Request["id"];
        string code = Request["Code"];
        string password = Request["Password"];

        if (string.IsNullOrEmpty(id) && string.IsNullOrEmpty(code) && string.IsNullOrEmpty(password))
        {
            base.ReturnResultJson("false", "未找到此卡");
            return;
        }

        int flag = pointAccountMgr.RemoveCard(code, password, id);
        if (flag == 0)
        {
            base.ReturnResultJson("true", "解除会员卡成功！");
        }
        else if (flag == 1)
        {
            base.ReturnResultJson("false", "会员卡密码错误！");
            return;
        }
        else if (flag == 2)
        {
            base.ReturnResultJson("false", "解除会员卡失败！请稍后再试！");
            return;
        }
    }

    /// <summary>
    /// 获取账户积分信息
    /// </summary>
    private void GetPoint()
    {
        string id = Request["id"];

        if (string.IsNullOrEmpty(id))
        {
            base.ReturnResultJson("false", "未提供单据ID");
            return;
        }

        DataTable dt = pointAccountMgr.GetPoint(id);
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
    /// 提交 一个积分规则
    /// 判断有没有id，如果有id则 update，否则 则insert
    /// </summary>
    private void AddPointAccount()
    {
        string id = Request["id"];
        DataTable result;
        DataTable dtSource;
        if (string.IsNullOrEmpty(id))
        {
            //insert
            dtSource = MappingDataFromPage("iPointAccount", "0");
            bool check = pointAccountMgr.CheckData(Request["idNo"],Request["MobileNo"], "0");
            string birthday = Request["Birthday"].ToString();
            if(birthday.Length<6)
            {
                DateTime newBirthday = pointAccountMgr.ChangeBirthday(birthday);
                birthday = newBirthday.ToShortDateString();
                dtSource.Rows[0]["Birthday"] = birthday;
            }
            
            if (check)
            {
                base.ReturnResultJson("false", "手机号码或身份证号码已经存在！");
                return;
            }
            else
            {
                result = pointAccountMgr.Add(CurrentUser, dtSource);
            }

            if (result != null)
            {
                if (Convert.ToInt32(result.Rows[0]["ErrorCode"].ToString()) == 0)
                { 
                    //TODO:开户成功，发送短信
                    //判断是否录入了手机号码
                    string mobileNo = Request["MobileNo"];
                    if (!string.IsNullOrEmpty(mobileNo))
                    {
                        SMSHelper.BillMsgSend sender = new SMSHelper.BillMsgSend();
                        sender.MsgAddAccount(CurrentUser, mobileNo, null);
                    }
                }
            }
        }
        else
        {
            //update;
            dtSource = MappingDataFromPage("iPointAccount", id);
            bool check = pointAccountMgr.CheckData(Request["idNo"],Request["MobileNo"], id);
            if (check)
            {
                base.ReturnResultJson("false", "手机号码或身份证号码已经存在！");
                return;
            }
            else
            {
                //保存到积分账户日志表中
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    Hashtable parms = new Hashtable();
                    parms.Add("id", id);
                    db.ExecuteNoneQuery(@"insert into hpointAccount (id,CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,
                                            CreateFrom,ModifyFrom,AgreementNo,CustomerName,IdNo,Birthday,MobileNo,Address,
                                            ZipCode,Email,Contact,Password,MemoInfo,DeptID) 
                                            select id,CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,CreateFrom,ModifyFrom,
                                            AgreementNo,CustomerName,IdNo,Birthday,MobileNo,Address,ZipCode,Email,Contact,
                                            Password,MemoInfo,DeptID from ipointAccount where id=@id", parms);
                    db.Commit();
                }
                result = pointAccountMgr.Update(CurrentUser, dtSource);
            }

        }
        base.ReturnSubmitResultJson(result);
    }
    
    /// <summary>
    /// 修改积分账户密码
    /// </summary>
    public void UpdatePassword()
    {
        string id = Request["ID"];
        string newPwd = Request["newPwd"];
        int res = pointAccountMgr.UpdatePassword(CurrentUser, id, newPwd);
        if (res != 0)
        {
            ReturnResultJson("true", "密码修改成功！");
        }
        else
        {
            ReturnResultJson("false", "密码修改失败！");
        }
    }

    /// <summary>
    /// 条件查询
    /// </summary>
    public void GetData()
    {
        string pointAccountId="0";
        string idNo = Request["idNo"];
        string mobileNo = Request["mobileNo"];
        string customerName = Request["customerName"];
        string email = Request["email"];
        //根据卡号查询
        string iCodeId = Request["iCardId"];
        string Sql = "select * from iPointAccount where 1=1 and IsDeleted=0 ";
        string whereSql = "";
        Hashtable parms = new Hashtable();
        parms.Add("customerName", customerName);
        parms.Add("idNo",idNo);
        parms.Add("mobileNo", mobileNo);
        parms.Add("email",email);
        //分页参数
        int start = Convert.ToInt32(Request["start"]);
        int limit = Convert.ToInt32(Request["limit"]);

        if (!string.IsNullOrEmpty(iCodeId))
        {
            string sql = @"select PointAccountID from iCard, iPointAccountCards 
            where iCard.ID=iPointAccountCards.CardID 
            and iPointAccountCards.IsDeleted=0 and Code=@code";
            Hashtable parmsCode=new Hashtable();
            parmsCode.Add("code",iCodeId);
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
       whereSql = @"and CustomerName like '%' + @customerName + '%' and IdNo like '%' + @idNo + '%' 
                        and MobileNo like '%' + @mobileNo + '%' and Email like '%' + 
                        @email + '%'";
       if (!string.IsNullOrEmpty(iCodeId))
       {
           parms.Add("pointAccountId", pointAccountId);
           whereSql += " and id=@pointAccountId";
       }
        //DataTable dt = pointAccountMgr.GetData(CurrentUser, whereSql, parms);
       DataTable dt = pointAccountMgr.GetPageData(Sql+whereSql, "order by id", start + 1, limit, parms);
        if (dt == null||dt.Rows.Count==0) 
        {
            base.ReturnResultJson("false", "未找到记录");
            return;
        }
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        //string results = dt.Rows.Count.ToString();
        object totalCount = 0;
        using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
        {
            totalCount=utl.ExecuteScalar("select Count(Id) from iPointAccount where 1=1 and IsDeleted=0 " + whereSql, parms);
        }
        html = "{results:" + totalCount + ",rows:" + html + "}";

        Response.Write(html);
        Response.End();

    }

    /// <summary>
    /// 查询当天的客户资料用来修改
    /// </summary>
    public void GetCurrentData()
    {
        string pointAccountId = "0";
        string idNo = Request["idNo"];
        string mobileNo = Request["mobileNo"];
        string customerName = Request["customerName"];
        string email = Request["email"];
        //根据卡号查询
        string iCodeId = Request["iCardId"];
        string whereSql = "";
        Hashtable parms = new Hashtable();
        parms.Add("customerName", customerName);
        parms.Add("idNo", idNo);
        parms.Add("mobileNo", mobileNo);
        parms.Add("email", email);

        if (!string.IsNullOrEmpty(iCodeId))
        {
            string sql = @"select PointAccountID from iCard, iPointAccountCards 
            where iCard.ID=iPointAccountCards.CardID 
            and iPointAccountCards.IsDeleted=0 and Code=@code";
            Hashtable parmsCode = new Hashtable();
            parmsCode.Add("code", iCodeId);
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
        whereSql = @"and CustomerName like '%' + @customerName + '%' and IdNo like '%' + @idNo + '%' 
                        and MobileNo like '%' + @mobileNo + '%' and Email like '%' + 
                        @email + '%'";
        if (!string.IsNullOrEmpty(iCodeId))
        {
            parms.Add("pointAccountId", pointAccountId);
            whereSql += " and id=@pointAccountId";
        }
        //加上当天的条件
        whereSql += string.Format(" and (CreateDate >='{0}' and CreateDate<='{1}')",
            DateTime.Now.ToString("yyyy-MM-dd") + " 0:00:01",
            DateTime.Now.ToString("yyyy-MM-dd") + " 23:59:59");

        //加上 deptID限制
        whereSql += " and DeptID = " + CurrentUser.DeptID;

        DataTable dt = pointAccountMgr.GetData(CurrentUser, whereSql, parms);
        if (dt == null || dt.Rows.Count == 0)
        {
            base.ReturnResultJson("false", "未找到记录");
            return;
        }
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

        html = "{results:" + dt.Rows.Count.ToString() + ",rows:" + html + "}";

        Response.Write(html);
        Response.End();

    }
}