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
    public partial class AuthGroup : AuthBasePage
    {
        private BllApi.AuthGroupApis aga = new BllApi.AuthGroupApis();

        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            {
                case "ShowaGroup":
                    result = ShowaGroup();
                    break;
                case "DelaGroup":
                    result = DelaGroup();
                    break;
                case "ShowMenu":
                    result = ShowMenu();
                    break;
                case "AddAuth":
                    result = AddAuth();
                    break;
                case "GetMenuIds":
                    result = GetMenuIds();
                    break;
                case "AddAuthGroup":
                    result = AddAuthGroup();
                    break;
                case "ShowAuthGroupById":
                    result = ShowAuthGroupById();
                    break;
                case "AuthGroupEdit":
                    result = AuthGroupEdit();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        //修改个别权限
        private string AuthGroupEdit()
        {
            string Id = Request["Id"];
            string Code = Request["Code"];
            string Title = Request["Title"];
            string MemoInfo = Request["MemoInfo"];
            return aga.AuthGroupEdit(Id, Code, Title, MemoInfo,CurrentUser.Id);
        }

        //通过Id获得AuthGroup
        private string ShowAuthGroupById()
        {
            string result = string.Empty;
            try
            {
                string Id = Request["Id"];
                string sql = string.Format("select Id,Code,Title,MemoInfo from aGroup where Id={0}", Id);
                DataTable dt = aga.GetBySql(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //通过查询条件显示aGroup
        private string ShowaGroup()
        {
            string result = string.Empty;
            try
            {
                string Code = (Request["Code"].Replace("'", "''"));
                string Title = (Request["Title"].Replace("'", "''"));

                string sql = string.Format(@"select Id,Code,Title,MemoInfo from aGroup
                                             where Code like '%{0}%' and Title like '%{1}%' and IsDeleted=0", Code, Title);
                if (CurrentSession.GroupId != 4)//判断登录用户的GroupId如果不是系统管理员则不显示管理员帐号
                {
                    sql += " and Id<>4";
                }
                DataTable dt = aga.GetBySql(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{results:" + result + "}";
            }
            catch (Exception ex)
            {
                throw new ApplicationException(ex.Message);
            }
            return result;
        }

        //通过aGroup.Id删除aGroup
        private string DelaGroup()
        {
            string aGroupId = Request["aGroupId"];

            return aga.DelaGroup(aGroupId,CurrentUser.Id); ;
        }

        //打开添加权限窗口时显示的数据
        private string ShowMenu()
        {
            string result = string.Empty;
            try
            {
                string sql = string.Format(@"select b.Id as iPointMenuItemId,a.Code as iMenuCateCode,a.Title as iMenuCateTitle,
                                                                        b.Code as iPointMenuItemCode,b.Title as iPointMenuItemTitle
                                                                        from iMenuCate a,iPointMenuItem b where a.Id=b.CateId and a.IsDeleted=0 and b.IsDeleted=0");
                DataTable dt = aga.GetBySql(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = "{failure:true,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        //添加权限
        private string AddAuth()
        {

            string aGroupId = Request["aGroupId"];
            string[] Ids = new string[] { };

            if ((Request["Ids"]).Length > 0)
            {
                Ids = (Request["Ids"]).Split(',');
            }

            return aga.AddAuth(Ids, aGroupId, CurrentUser.Id);
        }

        //在 aPointGroupMenu 中获得 MenuID
        private string GetMenuIds()
        {
            string result = string.Empty;
            try
            {
                string aGroupId = Request.Form["aGroupId"];
                string sql = string.Format("select MenuID from aPointGroupMenu where GroupId={0} and IsDeleted=0", aGroupId);
                DataTable dt = aga.GetBySql(sql);
                string MenuIds = string.Empty;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    MenuIds += dt.Rows[i]["MenuID"].ToString();
                    if (i < dt.Rows.Count - 1)
                    {
                        MenuIds += ",";
                    }
                }
                result = "{success:true,msg:'" + MenuIds + "'}";
            }
            catch (Exception ex)
            {
                result = "{failure:true,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        //添加新的aGroup
        private string AddAuthGroup()
        {
            string Code = Request["Code"];
            string Title = Request["Title"];
            string MemoInfo = Request["MemoInfo"];
            return aga.AddAuthGroup(Code, Title, MemoInfo, CurrentUser.Id);
        }
    }
}