using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using BllApi;
using System.Collections;

namespace BeautyPointWeb.Apis
{
    public partial class AuthMgr : AuthBasePage
    {
        private AuthMgrApi qx = new AuthMgrApi();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string result = string.Empty;
                switch (ActionName)
                {
                    case "searchiMenuCateTitle":
                        result = GetiMenuCateTitle();
                        break;
                    case "searchiMenuCate":
                        result = GetiMenuCate_iPointMenuItem();
                        break;
                    case "GetiMenuCate":
                        result = GetiMenuCate();
                        break;
                    case "searchiPointMenuItemByCateId":
                        result = GetiPointMenuItemByCateId();
                        break;
                    case "ShowiMenuCateById":
                        result = ShowiMenuCateById();
                        break;
                    case "iMenuCateEdit":
                        result = iMenuCateEdit();
                        break;
                    case "AddiMenuCate":
                        result = AddiMenuCate();
                        break;
                    case "ShowiPointMenuItemById":
                        result = ShowiPointMenuItemById();
                        break;
                    case "ShowiPointMenuItem":
                        result = ShowiPointMenuItem();
                        break;
                    case "AddiPointMenuItem":
                        result = AddiPointMenuItem();
                        break;
                    case "iPointMenuItemEidt":
                        result = iPointMenuItemEidt();
                        break;
                    case "Del":
                        result = Del();
                        break;
                }
                Response.Write(result);
                Response.End();
            }
        }

        //获得iMenuCate和iPointMenuItem的信息
        private string GetiMenuCate_iPointMenuItem()
        {
            string result = string.Empty;
            try
            {
                string CateId = Request["CateId"];
                if (CateId !=null && CateId != "0" && Convert.ToInt32(CateId).GetType().Name=="Int32")
                {
                    CateId = string.Format("and a.Id={0}", CateId);
                }
                else {
                    CateId = "";
                }
                string sql = string.Format(@"select a.Id as CateId,b.Id as iPointMenuItemId,a.Code as iMenuCateCode,a.Title as iMenuCateTitle,
                                                                        b.Code as iPointMenuItemCode,b.Title as iPointMenuItemTitle,b.URL as iPointMenuItemUrl 
                                                                        from iMenuCate a,iPointMenuItem b 
                                                                        where a.ID=b.CateId  {0} and a.IsDeleted=0 and b.IsDeleted=0
                                                                        order by b.id ", CateId);
                DataTable dt = qx.GetBySql(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{results:" + result + "}";
            }
            catch (Exception ex)
            {
                throw new ApplicationException(ex.Message);
            }
            return result;
        }

        //获得所有iMenuCate的信息
        private string GetiMenuCate()
        {
            string result = string.Empty;
            try
            {
                string sql = "select Id,Code,Title,MemoInfo from iMenuCate where IsDeleted=0";
                DataTable dt = qx.GetBySql(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{results:" + result + "}";
            }
            catch (Exception ex)
            {
                throw new ApplicationException(ex.Message);
            }
            return result;
        }

        //获得大类的Title
        private string GetiMenuCateTitle()
        {
            string result = string.Empty;
            try
            {
                DataTable dt = qx.GetBySql(@"select ID,Title from iMenuCate where  IsDeleted=0
                                                                            union select 0 as ID,'全部' as Title");
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    result += string.Format("[{0},'{1}']", dt.Rows[i]["id"], dt.Rows[i]["title"]);
                    if (i < dt.Rows.Count - 1)
                    {
                        result += ",";
                    }
                }
                result = "[" + result + "]";
            }
            catch (Exception ex)
            {
                result = ex.Message.ToString();
            }
            return result;
        }

        //通过CateId获得大类
        private string ShowiMenuCateById()
        {
            string result = string.Empty;
            try
            {
                string CateId = Request["CateID"];
                string sql = string.Format("select Id,Code,Title,MemoInfo from iMenuCate where Id={0} and IsDeleted=0", CateId);
                DataTable dt = qx.GetBySql(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException(ex.Message.ToString());
            }
        }

        //修改选定的iMenuCate信息
        private string iMenuCateEdit()
        {
            string CateId = Request["Id"];
            string Code = Request["Code"];
            string Title = Request["Title"];
            string MemoInfo = Request["MemoInfo"];

            return qx.iMenuCateEdit(Code,Title,MemoInfo,CateId,CurrentUser.Id);
        }

        //添加新的iMenuCate信息
        private string AddiMenuCate()
        {
            string Title = Request["Title"];
            string Code = Request["Code"];
            string MemoInfo = Request["MemoInfo"];
            
            return qx.AddiMenuCate(Code,Title,MemoInfo,CurrentUser.Id);
        }

        //删除iMenuCate、iPointMenuItem
        private string Del()
        {
            if (Request["dotype"] == null || Request["dotype"].Length == 0)
            {
                return "{failure:true,msg:'Url 参数 dotype 无效！'}";
            }
            else
            {
                string dotype = Request["dotype"];
                string CateId = Request["CateId"];
                string iPointMenuItemId = Request["iPointMenuItemId"];
                return qx.Del(dotype, CateId, iPointMenuItemId,CurrentUser.Id);
            }
        }

        //获得权限大类下所属的小类(iPointMenuItem 中的数据,通过CateId)
        private string GetiPointMenuItemByCateId()
        {
            string result = string.Empty;
            try
            {
                string CateId = Request["CateId"];
                string sql = string.Format("select Id,Title from iPointMenuItem where CateId={0} and IsDeleted=0", CateId);
                DataTable dt = qx.GetBySql(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw new ApplicationException(ex.Message.ToString());
            }
            return "{result:" + result + "}";
        }

        //通过Id显示 iPointMenuItem
        private string ShowiPointMenuItemById()
        {
            string result = string.Empty;
            try
            {
                string id = Request["Id"];
                string sql = string.Format("select Title,Url,MemoInfo,ShowType from iPointMenuItem where Id={0}", id);
                DataTable dt = qx.GetBySql(sql);
                result = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = "{failure:true,msg:'" + ex.Message + "'}";
            }
            return result;
        }

        //新增一个 iPointMenuItem
        private string AddiPointMenuItem()
        {
            string Title = Request["Title"];
            string Code = Request["Code"];
            string Url = Request["Url"];
            string MemoInfo = Request["MemoInfo"];
            string ShowType = Request["ShowType"];

            return qx.AddiPointMenuItem(Code, Title, Url, MemoInfo, ShowType, CurrentUser.Id);
        }

        //修改iPointMenuItem信息
        private string iPointMenuItemEidt()
        {
            string type = Request["type"];
            string Ids = string.Empty;
            if (Request["Ids"] != null) {
                Ids = Request["Ids"];
            }
            string CateId = Request["CateId"];

            string Title = Request["Title"];
            string iPointMenuItemId = Request["iPointMenuItemId"];
            string Code = Request["Code"];

            string Url = Request["Url"];
            string MemoInfo = Request["MemoInfo"];
            string ShowType = Request["ShowType"];

            if (Request["type"] != null)
            {
                return qx.iPointMenuItemEidt(CurrentUser.Id,type, Ids, CateId, Code, Title, Url, ShowType, MemoInfo, iPointMenuItemId);
            }
            return "{failure:true,msg:'没有任何操作'}";
        }

        //显示iPointMenuItem
        private string ShowiPointMenuItem()
        {
            string result = string.Empty;
            try
            {
                if (Request["type"] != null)
                {
                    string type = Request["type"];
                    string sql = "";
                    if (type.Equals("IniMenuCate"))
                    {
                        sql = string.Format("select Id,CateId,Code,Title,Url from iPointMenuItem where IsDeleted=0");
                    }
                    else if (type.Equals("IniPointMenuItem"))
                    {
                        sql = string.Format("select Id,Code,Title,Url,ShowType,MemoInfo from iPointMenuItem where IsDeleted=0");
                        if (Request["iPointMenuItemId"] != null)
                        {
                            string iPointMenuItemId = Request["iPointMenuItemId"];
                            sql += string.Format(" and Id={0}", iPointMenuItemId);
                        }
                    }
                    DataTable dt = qx.GetBySql(sql);
                    result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                    result = "{results:" + result + "}";
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException(ex.Message);
            }
            return result;
        }
    }
}