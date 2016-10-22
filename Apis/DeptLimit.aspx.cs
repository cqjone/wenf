using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;

public partial class Apis_DeptLimitApi : AuthBasePage
{
    BllApi.DeptLimitApis deptLimit = new BllApi.DeptLimitApis();
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "submitDeptLimit":
                SubmitDeptLimit();
                break;
            case "getDataByParms":
                GetDataByParms();
                break;
            case "delDeptLimit":
                DelDeptLimit();
                break;
            case "selectCode":
                SelectCode();
                break;
        }
    }
    //添加查询编号是否存在
    private void SelectCode()
    {
        string cid = Request["cid"];
        string uid = Request["uid"];
        int num = deptLimit.SelectByCode(cid,uid);
        if (num == 0)
        {
            //SubmitDeptLimit();
            base.ReturnResultJson("true", "没有此编号！");
        }
        else {
            base.ReturnResultJson("false", "此编号已存在！");
        }
    }

    //根据ID删除
    private void DelDeptLimit()
    {
        Hashtable parms = new Hashtable();
        string did =Request["did"];
        int uid = base.CurrentSession.UserID;
        int num = deptLimit.updateIsDelete(did,uid);
       if (num > 0)
       {
           base.ReturnResultJson("true", "删除成功");
       }
       else {
           base.ReturnResultJson("false", "删除失败");
       }
    }
    //根据条件查询iDeptLimitItem
    private void GetDataByParms()
    {
        Hashtable parms = new Hashtable();
        string code = Request["code"];
        string limitType = Request["limitType"];
        string title = Request["title"];
        string wheresql = "";
        if (!string.IsNullOrEmpty(code))
        {
            wheresql += " and Code=@code";
            parms.Add("@code", code);
        }
        if (!string.IsNullOrEmpty(limitType)&& !limitType.Equals("全部"))
        {
            wheresql += " and LimitType=@limitType";
            parms.Add("@limitType", limitType);
        }
        if (!string.IsNullOrEmpty(title))
        {
            wheresql += " and Title=@title";
            parms.Add("@title", title);
        }
        DataTable dt = deptLimit.GetData(CurrentUser, wheresql, parms);
        if (dt != null && dt.Rows.Count > 0)
        {
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

            Response.Write(html);
            Response.End();
        }
        else
        {
            base.ReturnResultJson("false", "无数据!");
            return;
        }
    }
    /// <summary>
    /// 提交 一条规则
    /// 判断有没有id，如果有id则 update，否则 则insert
    /// </summary>
    private void SubmitDeptLimit()
    {
        string id = Request["id"];
        DataTable result;
        DataTable dtSource;
        if (string.IsNullOrEmpty(id) || "0".Equals(id))
        {
            //insert
            dtSource = MappingDataFromPage("iDeptLimitItem", "0");
            result = deptLimit.Add(CurrentUser, dtSource);
        }
        else
        {
            //update;
            dtSource = MappingDataFromPage("iDeptLimitItem", id);
            result = deptLimit.Update(CurrentUser, dtSource);
        }
        base.ReturnSubmitResultJson(result);
    }
}