using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;
using DbCommon;

public partial class Apis_DeptGroup : BasePage
{
    BllApi.PointRuleApis pointRuleMgr = new BllApi.PointRuleApis();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(ActionName))
        {
            switch (ActionName)
            {
                case "getGroup":
                    GetGroup();
                    break;
                case "getiDept":
                    GetDept();
                    break;
                case "getiDeptLimitItemById":
                    GetiDeptLimitItemById();
                    break;
                case "getDeptGroup":
                    GetDeptGroup();
                    break;
                case "addGroup":
                    AddGroup();
                    break;
                case "getDeptLimitItem":
                    GetDeptLimitItem();
                    break;
                case "iDeptLimitGroup":
                    UpdateIdeptGroup();
                    break;
                default:
                    base.ReturnResultJson("false", "没有该API");
                    break;
            }
        }
    }
    /// <summary>
    /// 获取idept表中数据
    /// </summary>
    private void GetDept()
    {
        string id = Request["id"] == null ? "" : Request["id"].ToString();
        string sql = "";
        if (id != "")
        {
            sql = @"select Code,Title,ID from idept where IsDeleted=0 and DeptTypeID=1 and limitGroupId=" + id;
        }
        else
        {
            return;
        }
        DataTable dt = null;
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
    /// 根据iDeptLimitGroup表中id获取iDeptLimitGroup和iDeptLimitItem表中信息
    /// </summary>
    private void GetiDeptLimitItemById()
    {
        string id = Request["id"] == null ? "" : Request["id"].ToString();
        string sql = "";
        if (id != "")
        {
            sql = @"select limit.limitCount,ideptlimit.id,ideptlimit.title,limit.limitType,ideptlimit.memoInfo ,limit.id as limitId
                    from dbo.iDeptLimitGroup as ideptlimit,dbo.iDeptLimitItem as limit,dbo.iGroupLimits as grouplimit 
                    where ideptlimit.id=grouplimit.GroupID and limit.id=grouplimit.LimitID and limit.IsDeleted=0 and ideptlimit.IsDeleted=0 and grouplimit.IsDeleted=0 and ideptlimit.id=" + id;
        }
        else
        {
            return;
        }
        DataTable dt = null;
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
    /// 获取iDeptLimitGroup表中数据
    /// </summary>
    private void GetGroup()
    {
        string id = Request["id"] == null ? "" : Request["id"].ToString();
        string sql = "";
        if (id != "")
        {
            sql = "select * from dbo.iDeptLimitGroup where IsDeleted=0 and id=" + id;
        }
        else
        {
            return;
        }
        DataTable dt = null;
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
    /// 删除限制组
    /// </summary>
    private void UpdateIdeptGroup()
    {
        int res = 0;
        int num = 0;
        int count = 0;
        string id = Request["id"];
        string DeptTitle = Request["DeptTitle"].ToString();
        Hashtable parms = new Hashtable();
        Hashtable parm = new Hashtable();
        int userId = base.CurrentSession.UserID;
        parm.Add("@ModifyID", userId);
        parm.Add("@LimitGroupID", id);
        parms.Add("@id", id);
        parms.Add("@ModifyID", userId);
        string sql = "update  iDeptLimitGroup set ModifyID = @ModifyID, ModifyDate = getdate(), IsDeleted=1 where ID=@id";

        string sqls = "update  idept set ModifyID = @ModifyID, ModifyDate = getdate(), LimitGroupID=0 where LimitGroupID=@LimitGroupID";

        string wheresql = "update iGroupLimits set ModifyID = @ModifyID, ModifyDate = getdate(),IsDeleted=1 where GroupID=@LimitGroupID";
        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
        {
            res = db.ExecuteNoneQuery(sql, parms);
            if (DeptTitle != "")
            {
                num = db.ExecuteNoneQuery(sqls, parm);
            }
            count = db.ExecuteNoneQuery(wheresql, parm);

            if (res > 0 && count > 0)
            {
                db.Commit();
                base.ReturnResultJson("true", "删除成功！");
            }
            else
            {
                base.ReturnResultJson("false", "删除失败！");
                return;
            }

        }


    }
    /// <summary>
    /// 获取iDeptLimitItem表中数据
    /// </summary>
    private void GetDeptLimitItem()
    {
        DataTable dt = null;
        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
        {
            string sql = "select limitCount,id,title,limitType,memoInfo from iDeptLimitItem where IsDeleted=0";
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
    /// 保存限制组信息
    /// </summary>
    private void AddGroup()
    {
        string Title = Request["Title"].ToString();
        string Code = Request["Code"].ToString();
        string MemoInfo = Request["MemoInfo"].ToString();
        string ideptlimitItem = Request["id"].ToString();
        string ideptId = Request["ideptId"].ToString();
        string idept = Request["idept"].ToString();
        string limitId = Request["limitId"].ToString();
        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
        {
            Hashtable parms = new Hashtable();
            string sql = "";
            int userId = base.CurrentSession.UserID;
            parms.Add("@ModifyID", userId);
            parms.Add("@Code", Code);
            parms.Add("@Title", Title);
            parms.Add("@MemoInfo", MemoInfo);
            parms.Add("@CreateID", userId);
            int res = 0;
            if (idept == "")//判断iDeptLimitGroup表中的相关id是否为空,为空insert，不为空update
            {
                Hashtable parm3 = new Hashtable();
                sql = "select count(*) from dbo.iDeptLimitGroup where IsDeleted=0 and Code='" + Code + "'";
                int amount = Convert.ToInt32(db.ExecuteScalar(sql));
                if (amount > 0)
                {
                    base.ReturnResultJson("false", "编号已存在！");
                    return;
                }
                else
                {
                    sql = @"insert into iDeptLimitGroup(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,Code,Title,MemoInfo)
                         values (@CreateID,getdate(),@ModifyID,getdate(),0,@Code,@Title,@MemoInfo)";
                }
            }
            else
            {
                sql = @"update dbo.iDeptLimitGroup set ModifyID = @ModifyID, ModifyDate = getdate(), Code=@Code,Title=@Title,MemoInfo=@MemoInfo where id=" + idept;
            }
            res = db.ExecuteNoneQuery(sql, parms);
            int iGroupId = db.GetLastID();
            if (iGroupId == 0)
            {
                iGroupId = Convert.ToInt32(idept);
            }
            string[] ids = limitId.TrimEnd(',').Split(',');
            string id = ideptId;
            Hashtable parms1 = new Hashtable();
            parms1.Add("@GroupID", iGroupId);
            parms1.Add("@ModifyID", userId);
            parms1.Add("@CreateID", userId);
            int count = 0;



            for (int i = 0; i < ids.Length; i++)
            {
                if (ids[i] != "")
                {
                    int number = 0;
                    if (idept != "")
                    {
                        sql = "select count(*) from iGroupLimits where IsDeleted=0 and GroupID=" + idept + " and LimitID=" + ids[i];
                        number = Convert.ToInt32(db.ExecuteScalar(sql));
                    }
                    if (number <= 0)
                    {
                        sql = "insert into iGroupLimits(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,GroupID,LimitID) values(@CreateID,getdate(),@ModifyID,getdate(),0,@GroupID," + ids[i] + ")";
                        count = db.ExecuteNoneQuery(sql, parms1);
                    }
                    else
                    {
                        sql = "update iGroupLimits set ModifyID=@ModifyID, ModifyDate = getdate(),IsDeleted=0 where GroupID=" + idept + " and LimitID in (" + limitId + ")";
                        int n = db.ExecuteNoneQuery(sql, parms1);
                        sql = "update iGroupLimits set ModifyID=@ModifyID, ModifyDate = getdate(), IsDeleted=1 where GroupID=" + idept + " and LimitID not in (" + limitId + ")";
                        int u = db.ExecuteNoneQuery(sql, parms);
                    }
                }
            }

            Hashtable parms2 = new Hashtable();
            parms2.Add("@LimitGroupID", iGroupId);
            parms2.Add("@ModifyID", userId);
            Hashtable parm1 = new Hashtable();
            parm1.Add("@ModifyID", userId);
            sql = "update idept set LimitGroupID=@LimitGroupID,ModifyID = @ModifyID, ModifyDate = getdate() where id in (" + id + ")";
            int num = db.ExecuteNoneQuery(sql, parms2);
            int ideptUpdateCount = 0;
            if (idept != "")
            {
                string sqls = "update idept set LimitGroupID=0,ModifyID = @ModifyID, ModifyDate = getdate() where id not in (" + id + ") and LimitGroupID=" + idept;
                ideptUpdateCount = db.ExecuteNoneQuery(sqls, parm1);
            }
            if (res > 0 && count > 0)
            {
                db.Commit();
                base.ReturnResultJson("true", "添加限制组成功！");
            }
            if (res > 0 && num > 0)
            {
                db.Commit();
                base.ReturnResultJson("true", "修改限制组成功！");
            }
            else
            {
                base.ReturnResultJson("false", "添加限制组失败！");
                return;
            }
        }
    }
    /// <summary>
    /// 根据输入条件组名称和门店名称查询iDeptLimitGroup表和idept表.
    /// </summary>
    private void GetDeptGroup()
    {
        string deptGroup = Request["iDeptGroup"].ToString();
        string iDeptName = Request["iDeptName"].ToString();
        string sql = "";
        string wheresql = "";
        if (deptGroup != "" && iDeptName != "")
        {
            sql = @"select limitGroup.id,limitGroup.MemoInfo,limitGroup.Title,idept.Title as ideptTitle 
            from iDeptLimitGroup as limitGroup,iDept as idept 
            where limitGroup.isDeleted=0 and idept.isDeleted=0 and idept.LimitGroupID=limitGroup.id 
            and idept.DeptTypeID=1 and limitGroup.Title like '%" + deptGroup + "%'and idept.Title like '%" + iDeptName + "%'order by  limitGroup.Title";
        }
        else if (deptGroup != "")
        {
            sql = @"select limitGroup.id,limitGroup.MemoInfo,limitGroup.Title,idept.Title as ideptTitle 
            from iDeptLimitGroup as limitGroup,iDept as idept 
            where limitGroup.isDeleted=0 and idept.isDeleted=0 and idept.LimitGroupID=limitGroup.id 
            and idept.DeptTypeID=1 and limitGroup.Title like '%" + deptGroup + "%'and idept.Title like '%" + iDeptName + "%'order by  limitGroup.Title";

            wheresql = @"select limitGroup.id,limitGroup.MemoInfo,limitGroup.Title from iDeptLimitGroup as limitGroup
            where not exists(select  iDept.Title as ideptTitle   from iDept where limitGroup.ID=iDept.LimitGroupID)and IsDeleted=0 and limitGroup.Title like '%" + deptGroup + "%'";
        }
        else if (iDeptName != "")
        {
            sql = @"select limitGroup.id,limitGroup.MemoInfo,limitGroup.Title,idept.Title as ideptTitle 
            from iDeptLimitGroup as limitGroup,iDept as idept 
            where limitGroup.isDeleted=0 and idept.isDeleted=0 and idept.LimitGroupID=limitGroup.id 
            and idept.DeptTypeID=1 and limitGroup.Title like '%" + deptGroup + "%'and idept.Title like '%" + iDeptName + "%'order by  limitGroup.Title";
        }
        else
        {
            sql = @"select limitGroup.id,limitGroup.MemoInfo,limitGroup.Title,idept.Title as ideptTitle 
            from iDeptLimitGroup as limitGroup,iDept as idept 
            where limitGroup.isDeleted=0 and idept.isDeleted=0 and idept.LimitGroupID=limitGroup.id 
            and idept.DeptTypeID=1 and limitGroup.Title like '%" + deptGroup + "%'and idept.Title like '%" + iDeptName + "%'order by  limitGroup.Title";
            //}
            wheresql = @"select limitGroup.id,limitGroup.MemoInfo,limitGroup.Title from iDeptLimitGroup as limitGroup
            where not exists(select  iDept.Title as ideptTitle   from iDept where limitGroup.ID=iDept.LimitGroupID)and IsDeleted=0";
        }
        DataTable dtResult = null;
        DataTable dtres = null;
        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
        {
            dtResult = db.ExecuteQuery(sql);
        }
        if (iDeptName == "")
        {
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dtres = db.ExecuteQuery(wheresql);
            }
        }
        if (dtResult != null && dtResult.Rows.Count > 0)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Id");
            dt.Columns.Add("Title");
            dt.Columns.Add("MemoInfo");
            dt.Columns.Add("ideptTitle");
            DataRow row = dt.NewRow();

            for (int i = 0; i < dtResult.Rows.Count; i++)
            {
                DataRow[] rows = dt.Select("Id ='" + dtResult.Rows[i]["id"].ToString() + "'");
                if (rows != null && rows.Length > 0)
                {
                    row = rows[0];
                }
                else
                {
                    row = dt.NewRow();
                }
                if (row["ideptTitle"].ToString() == "")
                {
                    row["ideptTitle"] = row["ideptTitle"] + dtResult.Rows[i]["ideptTitle"].ToString();
                }
                else
                {
                    row["ideptTitle"] = row["ideptTitle"] + "," + dtResult.Rows[i]["ideptTitle"].ToString();
                }
                row["id"] = dtResult.Rows[i]["id"].ToString();
                row["Title"] = dtResult.Rows[i]["Title"].ToString();
                row["MemoInfo"] = dtResult.Rows[i]["MemoInfo"].ToString();
                if (rows == null || rows.Length == 0)
                {
                    dt.Rows.Add(row);
                }

            }
            if (dtres != null && dtres.Rows.Count > 0)
            {
                for (int i = 0; i < dtres.Rows.Count; i++)
                {
                    row = dt.NewRow();
                    row["id"] = dtres.Rows[i]["id"].ToString();
                    row["Title"] = dtres.Rows[i]["Title"].ToString();
                    row["MemoInfo"] = dtres.Rows[i]["MemoInfo"].ToString();
                    dt.Rows.Add(row);
                }
            }
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(html);
            Response.End();
        }
        if (dtResult == null || dtResult.Rows.Count == 0)
        {
            base.ReturnResultJson("false", "未找到记录");
            return;
        }
    }
}