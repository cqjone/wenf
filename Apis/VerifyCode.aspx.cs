using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using BllApi.VerifyCode;
using System.Collections;

public partial class Apis_VerifyCode : AuthBasePage
{
    BllApi.VerifyCodeApis verifyCodeApis = new BllApi.VerifyCodeApis();
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "submitVerifyCode":
                SubmitVerifyCode();
                break;
            case "getVerifyCodeByParms":
                GetVerifyCodeByParms();
                break;
            case "updateVerifyByCode":
                UpdateVerifyByCode();
                break;
            case "getDataByParms":
                GetDataByParms();
                break;
            case "getDept":
                GetDept();
                break;
            case "getDid":
                GetDid();
                break;
            case "getLoginCode":
                GetLoginCode();
                break;
            case "getLoginDataByParms":
                GetLoginDataByParms();
                break;
            case "updateLoginVerifyByCode":
                updateLoginVerify();
                break;
            case "GetVCode":
                //hVerifyCode_Search
                Search_GetVCode();
                break;
            case "UpdateVCode":
                //hVerifyCode_Update
                UpdateVCode();
                break;
            case "GetDeptNamelist":
                //hVerifyCode_Update
                GetDeptNameList();
                break;
        }
    }

    private void updateLoginVerify()
    {
        string codeid = Request["CodeID"];
        string mobile = Request["MobileNo"];
        string code = Request["Code"];
        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
        {
            db.ExecuteNoneQuery("update iLoginVCode set MobileNo='" + mobile + "' where id="+codeid);

            db.Commit();
        }
        //发短信//发送短信
        Hashtable info = new Hashtable();
        info["VerifyCode"] = code;//TODO:这里修改成 页面传过来的验证码
        SMSHelper.BillMsgSend bms = new SMSHelper.BillMsgSend();
        bms.SendVerifyCode(CurrentUser, mobile, info);
        base.ReturnResultJson("true", "发送验证码成功");

       // ReturnResultJson("true", "提交成功！");
    }

    /// <summary>
    /// 获取登录认证码
    /// </summary>
    private void GetLoginCode()
    {
        string cardNo = Request["CardNo"];

        string code = VCodeGenerater.GetLoginCode(cardNo);

        if (!string.IsNullOrEmpty(code))
        {
            //成功以后 获取 收银员信息
            DataTable dt = null;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(@"select a.CardNo, b.ID as EmpID, b.Title as EmpName,b.Mobile,c.Title as DeptName 
                                                                from iICCardInfo a ,iEmployee b,iDept c
                                                                where a.EmpID = b.ID
                                                                and a.Status = 1
                                                                and b.DeptID=c.ID
                                                                and a.IsDeleted = 0
                                                                and b.IsDeleted=0
                                                                and c.IsDeleted=0  and a.CardNo='" + cardNo + "'");
            }
            if (dt != null && dt.Rows.Count > 0)
            {
                string codeid = "0";
                //插入数据库
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    db.ExecuteNoneQuery(@"insert into iLoginVCode (CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,CardNo,VCode,MobileNo)
                                            values (" + CurrentSession.UserID + ",getdate(),"+CurrentSession.UserID+",getdate(),0,'"+cardNo+"'"
                                                      +",'" + code+"','')");

                    codeid = db.ExecuteScalar("select @@IDENTITY as ID").ToString();
                    db.Commit();
                }

                string returnmsg = "{{success:{0},msg:\"{1}\",empname:\"{2}\",deptname:\"{3}\",mobileno:\"{4}\",codeid:{5}}}";

                Response.Write(string.Format(returnmsg,"true",code,dt.Rows[0]["EmpName"].ToString(),
                    dt.Rows[0]["DeptName"].ToString(),dt.Rows[0]["Mobile"].ToString(),codeid));
                Response.End();
            }
            return;
        }
        ReturnResultJson("false","获取认证码失败！");
    }

    //查询门店是否存在
    private void GetDid()
    {
        string did = Request["did"];
        Hashtable parms = new Hashtable();
        string sql = "";
        if (!string.IsNullOrEmpty(did))
        {
            parms.Add("@did", did);
            sql += "and id=@did";
        }
        DataTable dt = verifyCodeApis.GetDept(sql, parms);
        if (dt != null && dt.Rows.Count > 0)
        {
            base.ReturnResultJson("true", "该门店存在");
        }
        else
        {
            base.ReturnResultJson("false", "该门店不存在");
            return;
        }
    }
    //查询所有店铺id和名称
    private void GetDept()
    {
        Hashtable parms = new Hashtable();
        string sql = "";
        string dName = Request["dName"];
        if (!string.IsNullOrEmpty(dName)) {
            parms.Add("@dName", dName);
            sql += "and Title like '%'+@dName+'%'";
        }
        DataTable dt = verifyCodeApis.GetDept(sql,parms);
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(html);
        Response.End();

    }

    //查询卡余额列表中的店铺名称
    private void GetDeptNameList()
    {
        Hashtable parms = new Hashtable();
        string sql = "";
        string type = "1";
        string dName = Request["dName"];
         if (!string.IsNullOrEmpty(Request["type"]))
        {
            type = Request["type"];
        }
        string deptType = type == "1" ? "文峰" : "个体";
        parms.Add("@DeptType", deptType);
        sql += " and DeptType =@DeptType";
        if (!string.IsNullOrEmpty(dName))
        {
            parms.Add("@dName", dName);
            sql += " and DeptName like '%'+@dName+'%'";
        }

        DataTable dt = verifyCodeApis.GetDeptNameList(sql, parms);
        string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(html);
        Response.End();

    }
    //根据条件查询条件
    private void GetDataByParms()
    {
        string deptName = Request["deptName"];
        string mobileNo = Request["mobileNo"];
        int start = Convert.ToInt32(Request["start"]);

        String fieldName = "CreateDate";
        if (!string.IsNullOrEmpty(Request["sort"]))
        {
            fieldName = Request["sort"];
        }
        String sortType = "DESC";
        if (!string.IsNullOrEmpty(Request["dir"]))
        {
            sortType = Request["dir"];
        }

        Hashtable parms = new Hashtable();
        string sql = @"select top 15 v.ID,CONVERT(varchar(100),v.CreateDate, 23) AS CreateDate ,v.Code,v.DeptID,v.MemoInfo,
                        v.MobileNo,v.Status,v.TransferAmount,v.Cash,v.SrcCardNo,v.DstCardNo,v.Code,d.Title
                        from iVerifyCode as v inner join iDept as d on v.DeptID=d.id where 1=1 ";
        if (!string.IsNullOrEmpty(deptName))
        {
            parms.Add("@deptName", deptName);
            sql += @" and d.Title like '%'+@deptName+ '%' and DeptTypeID=1 ";
        }
        if (!string.IsNullOrEmpty(mobileNo))
        {
            parms.Add("@mobileNo", mobileNo);
            sql += " and v.MobileNo=@mobileNo ";
        }
        if (fieldName != "Title")
        {
            sql += "and v.id not in(select top " + start + " ID from iVerifyCode order by " + fieldName + " " + sortType + ") order by v." + fieldName + " " + sortType + "";
        }
        else
        {
            sql += "and v.id not in(select top " + start + " ID from iVerifyCode order by CreateDate " + sortType + ") order by d." + fieldName + " " + sortType + "";
        }
        DataTable dt = verifyCodeApis.GetDataByParms(sql, parms);
        int count = verifyCodeApis.GetCount(deptName, mobileNo);

        pageDataJson("true", "查询成功!", dt, count);
    }

    private void GetLoginDataByParms()
    {
        string cardNo = Request["CardNo"];
        string empName = Request["EmpName"];
        int start = Convert.ToInt32(Request["start"]);

        String fieldName = "CreateDate";
        if (!string.IsNullOrEmpty(Request["sort"]))
        {
            fieldName = Request["sort"];
        }
        String sortType = "DESC";
        if (!string.IsNullOrEmpty(Request["dir"]))
        {
            sortType = Request["dir"];
        }

        Hashtable parms = new Hashtable();
        string sql = @"select a.CardNo, CONVERT(varchar(100),a.CreateDate, 23) AS CreateDate,a.MobileNo, a.VCode,b.Title as EmpName,c.Title as DeptName
                                    from iLoginVCode a,iEmployee b,iDept c,iICCardInfo d
                                    where a.CardNo=d.CardNo
                                    and d.IsDeleted=0
                                    and d.Status=1
                                    and d.EmpID=b.ID
                                    and b.DeptID=c.ID
                                    and b.IsDeleted=0
                                    and c.IsDeleted=0
                                    and d.IsDeleted=0 ";
        if (!string.IsNullOrEmpty(cardNo))
        {
            parms.Add("@cardno", cardNo);
            sql += @" and a.CardNo like '%'+@cardno+ '%'   ";
        }
        if (!string.IsNullOrEmpty(empName))
        {
            parms.Add("@empname", empName);
            sql += " and b.Title like '%' + @empname + '%' ";
        }
        //获取中总记录数
        DbCommon.DbUtil db = new DbCommon.DbUtil();

        DataTable dtcount = verifyCodeApis.GetDataByParms("Select count(*) from (" + sql + ") as aa", parms);
        int count = Convert.ToInt32(dtcount.Rows[0][0].ToString());
        if (fieldName != "DeptName" && fieldName !="EmpName")
        {
            sql += " and a.id not in(select top " + start + " ID from iLoginVCode order by " + fieldName + " " + sortType + ") order by a." + fieldName + " " + sortType + "";
        }
        else if(fieldName == "DeptName")
        {
            sql += " and c.id not in(select top " + start + " ID from iDept order by  Title " + sortType + ") order by c.Title " + sortType + "";
        }
        else if (fieldName == "EmpName")
        {
            sql += " and b.id not in(select top " + start + " ID from iEmployee order by  Title " + sortType + ") order by b.Title " + sortType + "";
        }
     
        DataTable dt = verifyCodeApis.GetDataByParms(sql, parms);
       // int count = verifyCodeApis.GetCount(deptName, mobileNo);

        pageDataJson("true", "查询成功!", dt, count);
    }

    //根据验证码修改
    private void UpdateVerifyByCode()
    {
        string code = Request["ucode"];
        string mobile = Request["umobile"];
        string memoInfo = Request["umemoInfo"];
        string datetime = DateTime.Now.ToString();
        int uid = base.CurrentSession.UserID;
        Hashtable parms = new Hashtable();
        parms.Add("@uid",uid);
        parms.Add("@datetime", datetime);
        string sql = "update iVerifyCode set ModifyID=@uid, ModifyDate=@datetime";
        
        if (!string.IsNullOrEmpty(mobile))
        {
            parms.Add("@mobile", mobile);
            sql += " , MobileNo=@mobile";
        }
        if (!string.IsNullOrEmpty(memoInfo))
        {
            parms.Add("@memoInfo", memoInfo);
            sql += ",MemoInfo=@memoInfo";

        }
        else {
            sql += ",MemoInfo=''";
        }
        if (!string.IsNullOrEmpty(code))
        {
            parms.Add("@code", code);
        }
        sql += " where Code=@code";

        int num = verifyCodeApis.UpdateVerifyByCode(sql,parms);
        if (num > 0)
        {
            //发送短信
            Hashtable info = new Hashtable();
            info["VerifyCode"] = code;//TODO:这里修改成 页面传过来的验证码
            SMSHelper.BillMsgSend bms = new SMSHelper.BillMsgSend();
            bms.SendVerifyCode(CurrentUser, mobile, info);
            base.ReturnResultJson("true", "发送验证码成功");
        }
        else
        {
            base.ReturnResultJson("false", "发送验证码失败!");
        }
    }
    /// <summary>
    /// insert
    /// </summary>
    private void SubmitVerifyCode()
    {
        string id = Request["id"];
        DataTable result=new DataTable();
        DataTable dtSource;
        if (string.IsNullOrEmpty(id) || "0".Equals(id))
        {
            //insert
            dtSource = MappingDataFromPage("iVerifyCode", "0");
            result = verifyCodeApis.Add(CurrentUser, dtSource);
        }
        base.ReturnSubmitResultJson(result);
    }

    //根据门店ID和限制金额获取验证码
    private void GetVerifyCodeByParms()
    {
        VCodeGenerater vCodeGenerater = new VCodeGenerater();

        string deptID = Request["DeptID"].ToString();
        string srcCardNo = Request["SrcCardNo"].ToString();
        string dstCardNo = Request["DstCardNo"].ToString();
        string tmoney = Request["TransferAmount"].ToString();
        string cash = Request["Cash"].ToString();
        srcCardNo = OrderSrcCardNo(srcCardNo);

        Console.WriteLine(srcCardNo);
        Hashtable tdata = new Hashtable();
        tdata["deptID"] = deptID;
        tdata["srcCardNo"] = srcCardNo;
        tdata["dstCardNo"] = dstCardNo;
        tdata["transferAmount"] = tmoney;
        tdata["cash"] = cash;

        string verifyCode = vCodeGenerater.GetVCode(tdata);
        Response.Write(string.Format("{{success:true,msg:'{0}'}}", verifyCode));
        Response.End();
    }
    /// <summary>
    /// 顺序排列卡号
    /// </summary>
    /// <param name="cardno"></param>
    /// <returns></returns>
    private string OrderSrcCardNo(string cardno)
    {
        string str = "";

        string[] cardnos = cardno.Split(',');
        if (cardnos.Length > 1)
        {
            //排序
            long tmp = 0;
            for (int i = 0; i < cardnos.Length-1; i++)
            {
                for (int j = 1; j < cardnos.Length; j++)
                {
                    if (Convert.ToInt64(cardnos[i]) >
                        Convert.ToInt64(cardnos[j]))
                    {
                        tmp = Convert.ToInt64(cardnos[i]);
                        cardnos[i] = cardnos[j];
                        cardnos[j] = tmp.ToString();
                    }
                }
            }
            str = cardnos[0];
            for (int i = 1; i < cardnos.Length; i++)
            {
                str += "," + cardnos[i];
            }
        }
        else
        {
            str = cardno;
        }
        return str;
    }

    //获得验证码信息
    private void Search_GetVCode()
    {
        string result = string.Empty;
        try
        {
            string sql = @"select a.Id,a.DeptId,a.CreateDate as CreateTime,b.Title as DeptName,a.SrcCardNo as FromCard,
                                a.DstCardno as ToCard,a.LimitItems,a.TransferAmount as TransferMoney,a.Cash,a.VerifyCode from hVerifyCode a,iDept b
                                where a.IsDeleted=0 and a.DeptId=b.Id and a.DeptId=@DeptId";
            Hashtable parms = new Hashtable();
            parms.Add("@DeptId", Request["DeptId"]);
            int start = int.Parse(Request["start"]);
            int limit = int.Parse(Request["limit"]);
            DataTable dt = verifyCodeApis.GetPageData(sql, "order by ID desc", start + 1, limit, parms);
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        }
        catch (Exception ex)
        {
            result = ex.Message;
        }
        Response.Write(result);
        Response.End();
    }

    //更新验证码请求信息
    private void UpdateVCode()
    {
        string result = string.Empty;
        try
        {
            string code = Request["Code"];//验证码
            string TransferAmount = Request["TransferAmount"];//验证码转卡金额
            string Cash = Request["Cash"]; //验证码充值金额
            string hid = Request["HId"];

            Hashtable prams = new Hashtable();
            prams.Add("@VCode", code);
            prams.Add("@TransferAmount", TransferAmount);
            prams.Add("@Cash", Cash);
            prams.Add("@Id",hid);

            string sql = string.Format(@"update hVerifyCode set ModifyDate=getdate(),ModifyId={0},
                                         VerifyCode=@VCode,TransferAmount=@TransferAmount,Cash=@Cash
                                        where IsDeleted=0 and Id=@Id", CurrentUser.Id);
            result=verifyCodeApis.UpdateVCode(sql,prams);
        }
        catch (Exception ex)
        {
            result = "{success:false,msg:\""+ex.Message+"\"}";
        }
        Response.Write(result);
        Response.End();
    }
}