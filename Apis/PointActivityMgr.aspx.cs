using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;

public partial class Apis_PointActivityMgr : AuthBasePage
{
    BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();

    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "GetPointActivity"://获取所有规则活动名称
                GetPointActivity();
                break;
            case "GetPointActivityList"://获取每个规则活动明细
                GetPointActivityList();
                break;
            case "GetRegional"://获取区域信息
                GetRegional();
                break;
            case "GetRegionalData"://获取每条规则的区域信息
                GetRegionalData();
                break;
            case "GetDept"://获取部门信息
                GetDept();
                break;
            case "GetDeptIDData"://获取每条规则的部门信息
                GetDeptIDData();
                break;
            case "GetService"://获取服务信息
                GetService();
                break;
            case "GetServiceIDData"://获取每条规则的服务信息
                GetServiceIDData();
                break;
            case "GetProduct"://获取产品信息
                GetProduct();
                break;
            case "GetProductIDData"://获取每条规则的产品信息
                GetProductIDData();
                break;
            case "GetCard"://设置卡类型信息
                GetCard();
                break;
            case "GetSellCardData"://获取卡类型信息
                GetSellCardData();
                break;
            case "GetRechargeCardData"://获取卡类型信息
                GetRechargeCardData();
                break;
            case "InsertActivityList"://添加修改规则
                InsertActivityList();
                break;
            case "AddActivity"://添加积分活动
                AddActivity();
                break;
            case "UpdateActivityTitle"://修改活动规则名称
                AddActivity();
                break;
            case "DeleteActivity"://删除活动规则名称
                DeleteActivity();
                break;
            case "DeleteActivityList"://删除活动规则List
                DeleteActivityList();
                break;
        }
    }

    /// <summary>
    /// 所有规则活动信息
    /// </summary>
    /// <returns></returns>
    public void GetPointActivity()
    {
        string activityName = Request["activityName"];
        DataTable dt = pam.getPointActivity(activityName);
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
    /// 所有规则活动信息明细
    /// </summary>
    /// <returns></returns>
    public void GetPointActivityList()
    {
        string activityID = Request["ID"];

        if (string.IsNullOrEmpty(activityID))
        {
            base.ReturnResultJson("false", "未找到记录");
            return;
        }

        DataTable dt = pam.getPointActivityList(activityID);

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
    /// 区域信息
    /// </summary>
    /// <returns></returns>
    public DataTable GetRegional()
    {
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getRegional();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
        return dt;
    }

    /// <summary>
    /// 获取每条规则的区域信息
    /// </summary>
    public void GetRegionalData()
    {
        string ListID = Request["ListID"];
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getRegionalData(ListID);
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr);
        Response.End();
    }

    /// <summary>
    /// 店铺信息
    /// </summary>
    /// <returns></returns>
    public DataTable GetDept()
    {
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getDept();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
        return dt;
    }

    /// <summary>
    /// 获取每条规则的店铺信息
    /// </summary>
    public void GetDeptIDData()
    {
        string ListID = Request["ListID"];
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getDeptIDData(ListID);
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr);
        Response.End();
    }

    /// <summary>
    /// 服务信息
    /// </summary>
    /// <returns></returns>
    public DataTable GetService()
    {
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getService();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
        return dt;
    }

    /// <summary>
    /// 获取每条规则的服务信息
    /// </summary>
    public void GetServiceIDData()
    {
        string ListID = Request["ListID"];
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getServiceIDData(ListID);
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr);
        Response.End();
    }

    /// <summary>
    /// 产品信息
    /// </summary>
    /// <returns></returns>
    public DataTable GetProduct()
    {
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getProduct();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
        return dt;
    }

    /// <summary>
    /// 获取每条规则的产品信息
    /// </summary>
    public void GetProductIDData()
    {
        string ListID = Request["ListID"];
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getProductIDData(ListID);
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr);
        Response.End();
    }

    /// <summary>
    /// 卡类型信息
    /// </summary>
    /// <returns></returns>
    public DataTable GetCard()
    {
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getCard();
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr.Replace(":0", ":false"));
        Response.End();
        return dt;
    }

    /// <summary>
    /// 获取每条规则的售卡类型信息
    /// </summary>
    public void GetSellCardData()
    {
        string ListID = Request["ListID"];
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getSellCardData(ListID);
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr);
        Response.End();
    }

    /// <summary>
    /// 获取每条规则的充值卡类型信息
    /// </summary>
    public void GetRechargeCardData()
    {
        string ListID = Request["ListID"];
        BllApi.PointActivityMgrApis pam = new BllApi.PointActivityMgrApis();
        DataTable dt = pam.getRechargeCardData(ListID);
        string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        Response.Write(jsonStr);
        Response.End();
    }

    /// <summary>
    /// 添加积分规则
    /// </summary>
    public void InsertActivityList()
    {
        string id = Request["ListID"];
        DataTable result;
        DataTable dtSource;
        if (string.IsNullOrEmpty(id))
        {
            //insert
            dtSource = MappingDataFromPage("iPointActivityList", "0");
            result = pam.Add(CurrentUser, dtSource);
        } 
        else
        {
            //update;
            dtSource = MappingDataFromPage("iPointActivityList", id);
            result = pam.Update(CurrentUser, dtSource);
        }
        base.ReturnSubmitResultJson(result);
    }

    /// <summary>
    /// 添加活动
    /// </summary>
    public void AddActivity()
    {
        string Title = Request["ActivityName"];
        string ActivityID = pam.AddActivity(CurrentUser, Title);
        if (!"".Equals(ActivityID))
        {
            base.ReturnResultJson("true", ActivityID);
        }
        else
        {
            base.ReturnResultJson("false", "添加积分活动失败！");
        }
    }

    /// <summary>
    /// 修改活动规则名称
    /// </summary>
    public void UpdateActivityTitle()
    {
        string Title = Request["ActivityName"];
        string ActivityID = Request["ActivityID"];
        int isOk = pam.UpdateActivityTitle(CurrentUser, Title,ActivityID);
        if (isOk>0)
        {
            base.ReturnResultJson("true", "修改活动规则名称成功！");
        }
        else
        {
            base.ReturnResultJson("false", "修改活动规则名称失败！");
        }
    }

    /// <summary>
    /// 删除活动名称
    /// </summary>
    public void DeleteActivity()
    {
        string ActivityID = Request["ActivityID"];
        int isOk = pam.DeleteActivity(CurrentUser, ActivityID);
        if (isOk > 0)
        {
            base.ReturnResultJson("true", "删除活动规则成功！");
        }
        else
        {
            base.ReturnResultJson("false", "删除活动规则失败！");
        }
    }

    /// <summary>
    /// 删除活动规则List
    /// </summary>
    public void DeleteActivityList()
    {
        string ListID = Request["ListID"];
        int isOk = pam.DeleteActivityList(CurrentUser, ListID);
        if (isOk > 0)
        {
            base.ReturnResultJson("true", "删除活动规则明细成功！");
        }
        else
        {
            base.ReturnResultJson("false", "删除活动规则明细失败！");
        }
    }
}