using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using DbCommon;
using BllApi;

namespace BeautyPointWeb.Apis
{
    public partial class AreaMgr : AuthBasePage
    {
        BllApi.DeptLimitApis deptLimit = new BllApi.DeptLimitApis();
        public static string AreaID;
        protected void Page_Load(object sender, EventArgs e)
        {
            switch(ActionName)
            {
                default:
                    base.ReturnResultJson("false", "没有该API");
                    break;
                case "GetInfo":
                    GetInfo();
                    break;
                case "selectCode":
                    SelectCode();
                    break;
                case "submitArea":
                    SubmitArea();
                break;
                case "del":
                    Del();
                    break;
                case "getAreaMenu":
                    GetAreaMenu();
                    break;
                case "getDepInfo":
                    GetDepInfo();
                    break;
                case "getDepMenu":
                    GetDepMenu();
                    break;
                case "delStore":
                    DelStore();
                    break;
               
            }
        }
        /// <summary>
        /// 添加查询编号是否存在
        /// </summary>
        private void SelectCode()
        {
            string cid = Request["cid"];
            string uid = Request["uid"];
            string id = Request["id"];
            int num = SelectByCode(cid, uid);
            if (num == 0)
            {
                base.ReturnResultJson("true", "没有此编号！");
            }
            else
            {
                base.ReturnResultJson("false", "此编号已存在！");
            }
        }
        /// <summary>
        /// 查询编号是否存在
        /// </summary>
        /// <param name="cid"></param>
        /// <returns></returns>
        public int SelectByCode(string cid, string uid)
        {
            int num = 0;
            Hashtable parms = new Hashtable();
            parms.Add("@cid", cid);
            string sql = "select COUNT(*) from iArea where IsDeleted=0 and Code=@cid";
            if (!string.IsNullOrEmpty(uid))
            {
                sql += " and id!=@uid";
                parms.Add("@uid", uid);
            }
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                num = (int)db.ExecuteScalar(sql, parms);
            }
            return num;
        }
        /// <summary>
        /// 提交 一条规则
        /// 判断编号是否存在，判断有标记InOrUp的值，如果有则 update，否则 则insert
        /// </summary>
        private void SubmitArea()
        {
            string cid = Request["cid"];
            string uid = Request["uid"];
            string InOrUp = Request["InOrUp"];
            if (string.IsNullOrEmpty(InOrUp))
            {
                uid = "0";
            }
            int num = SelectByCode(cid, uid);
            if (num == 0)
            {
                string[] ids = Request["ids"].Split(',');
                DataTable result;
                DataTable dtSource;
                if (string.IsNullOrEmpty(InOrUp) || "0".Equals(InOrUp))
                {
                    //insert
                    dtSource = MappingDataFromPage("iArea", "0");
                    result = deptLimit.Add(CurrentUser, dtSource, ids);

                }
                else
                {
                    //update;
                    dtSource = MappingDataFromPage("iArea", InOrUp);
                    result = deptLimit.Update(CurrentUser, dtSource, ids);
                   
                }
                base.ReturnResultJson("true", "操作成功！");
            }
            else
            {
                base.ReturnResultJson("false", "此编号已存在！");
            }
        }
        /// <summary>
        /// 根据ID删除区域信息
        /// </summary>
        private void Del()
        {
            string did = Request["did"];
            int uid = base.CurrentSession.UserID;
            string datetime = DateTime.Now.ToString();
            int num = updateIsDelete(did, uid);
            if (num > 0)
            {
                Hashtable parms = new Hashtable();
                parms.Add("@did", did);
                parms.Add("@datetime", datetime);
                parms.Add("@uid", uid);
                string sql = "update iArea set IsDeleted=1,ModifyDate=@datetime,ModifyID=@uid where ParentID=@did";
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    num = db.ExecuteNoneQuery(sql, parms);
                    db.Commit();
                }
               
                 base.ReturnResultJson("true", "删除成功");

            }
            else
            {
                base.ReturnResultJson("false", "删除失败");
            }
        }

        /// <summary>
        /// 修改IsDelete=1
        /// </summary>
        /// <param name="did"></param>
        public int updateIsDelete(string did, int uid)
        {
            int num = 0;
            string datetime = DateTime.Now.ToString();//当前时间
            Hashtable parms = new Hashtable();
            parms.Add("@did", did);
            parms.Add("@datetime", datetime);
            parms.Add("@uid", uid);
            string sql = "update iArea set IsDeleted=1,ModifyDate=@datetime,ModifyID=@uid where ID=@did";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                num = db.ExecuteNoneQuery(sql, parms);
                db.Commit();
            }
            return num;
        }
        /// <summary>
        /// 根据查询条件获取所需信息
        /// </summary>
        private void GetInfo()
        {
            Hashtable parms = new Hashtable();
            string Code = Request ["code"];
            string Title = Request["title"];
            string MemoInfo = Request ["memoInfo"];
            if (!string.IsNullOrEmpty(Code))
            {
                parms.Add("@Code", Code);
                Code = "and a.Code like '%'+@Code+'%'";        
            }
            if (!string.IsNullOrEmpty(Title))
            {         
                parms.Add("@Title", Title);
                Title = "and a.Title like '%'+@Title+'%'";
            }
            if (!string.IsNullOrEmpty(MemoInfo))
            {                
                parms.Add("@MemoInfo", MemoInfo);
                MemoInfo = "and a.MemoInfo like '%'+@MemoInfo+'%'";
            }
            string sql = string.Format(@"select a.ID,a.MemoInfo,a.Code,a.Title,b.title as ParentTitle,b.id as ParentID 
                            from iarea a left join iarea b on a.parentid=b.id where a.IsDeleted=0 and b.IsDeleted=0 {0} {1} {2}"
                , Code,Title ,MemoInfo);
            aUserApis auser = new aUserApis();
            DataTable dt = auser . ExecQuery(sql, parms);
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
        /// <summary>
        /// 获取区域树形信息
        /// </summary>
        private void GetAreaMenu()
        {
            DbCommon.Acl.Authentication auth = new DbCommon.Acl.Authentication();
            List<DbCommon.Modals.AreaMenu> list = GetAreaMenu(CurrentSession.UserID.ToString());
            if (list != null && list.Count > 0)
            {
                string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(list);
                Response.Write(jsonStr);
            }
            Response.End();
        }

        List<DbCommon.Modals.AreaMenu> list = new List<DbCommon.Modals.AreaMenu>();
        List<DbCommon.Modals.AreaMenu> menuList = new List<DbCommon.Modals.AreaMenu>();
        /// <summary>
        /// 获取区域信息（多层）
        /// </summary>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public List<DbCommon.Modals.AreaMenu> GetAreaMenu(string UserID)
        {
            //查数据库
            string sql = @"select ID, Code,Title,ParentID from iArea where IsDeleted=0 order by Code";           
            Hashtable parms = new Hashtable();
            parms.Add("userID", UserID);
            using (DbUtil db = new DbUtil())
            {
                DataTable dt = db.ExecuteQuery(sql, parms);
                Hashtable menu = new Hashtable();
                DbCommon.Modals.AreaMenu menuCate;
                if (dt != null && dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        menuCate = new DbCommon.Modals.AreaMenu();
                        menuCate.id = dt.Rows[i]["ID"].ToString();
                        menuCate.text = dt.Rows[i]["Title"].ToString();
                        menuCate.leaf = false;
                        menuCate.ParentID = Convert.ToInt32(dt.Rows[i]["ParentID"].ToString());
                        menuCate.Code = dt.Rows[i]["Code"].ToString();
                        list.Add(menuCate);                    
                    }
                    for (int i = 0; i < list.Count; i++)
                    {
                        ProcessArea(list[i],dt);
                    }
                    for (int i = 0; i < list.Count; i++)
                    {
                        if (list[i].ParentID == 0)
                        {
                            menuList.Add(list[i]);
                        }
                    }
                }
                menuList.Sort();
                return menuList;
            }
        }
        /// <summary>
        /// 获取区域信息中“父与子”的结构
        /// </summary>
        /// <param name="item"></param>
        /// <param name="dt"></param>
        public void ProcessArea(DbCommon.Modals.AreaMenu item, DataTable dt)
        {
            DataRow[] rows = dt.Select("ParentID=" + item.id);
            if (item.children == null)
            {
                item.children = new List<DbCommon.Modals.AreaMenu>();
            }
            foreach (DataRow tmp in rows)
            {
                DbCommon.Modals.AreaMenu mi = new DbCommon.Modals.AreaMenu(tmp["ID"].ToString(), tmp["Title"].ToString(),
                     true);
                item.children.Add(mi);
                item.leaf = false;
            }
            if (item.children == null || item.children.Count == 0)
            {
                return;
            }
            foreach (DbCommon.Modals.AreaMenu am in item.children)
            {
                ProcessArea(am, dt);
            }
        }
    
        /// <summary>
        /// 获取部门信息
        /// </summary>
        private void GetDepInfo()
        {
            string AreaID = Request ["AreaID"];
            DataTable dt=new DataTable ();
            if (!string.IsNullOrEmpty(AreaID))
            {
                 dt = GetPoint(AreaID);

            }          
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
        /// 获取部门
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public DataTable GetPoint(string AreaID)
        {
            Hashtable parms = new Hashtable();
            parms.Add("@AreaID", AreaID);
            string sql = string.Format(@"select ID,Title,Code from idept where idept.IsDeleted=0 and AreaID=@AreaID");   
            DataTable dtResult = null;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dtResult = db.ExecuteQuery(sql, parms);
            }
            return dtResult;
        }
        /// <summary>
        /// 获取人员姓名列表
        /// </summary>
        private void GetDepMenu()
        {
            DataTable dt = Get();
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr.Replace(":0", ":false"));
            Response.End();
        }
        /// <summary>
        /// 获取人员姓名列表
        /// </summary>
        public DataTable Get()
        {
            DataTable dt = null;
            Hashtable parms = new Hashtable();
            string code = Request["code"];
            string title = Request["title"];
            string id = Request["id"];
            string sql = "";

            if (!string.IsNullOrEmpty(code))
            {
                parms.Add("@code", code);
                code = "and Code like '%'+@Code+'%'";
            }
            if (!string.IsNullOrEmpty(title))
            {
                parms.Add("@title", title);
                title = "and title like '%'+@Title+'%'";
            }
            if (!string.IsNullOrEmpty(id))
            {
                parms.Add("@id", id);
                id = "and id =0";
            }
            if (string.IsNullOrEmpty(title) && string.IsNullOrEmpty(code))
            {
                sql = string.Format(@"select code,id,Code+'   '+Title as text,Title,'false' as leaf, 0 as 
                           checked from idept where idept.IsDeleted=0 and depttypeid=1 {0}", id);
            }
            else
            {
                sql = string.Format(@"select code,id,Code+'   '+Title as text,Title,'false' as leaf, 0 as checked from
                           idept where idept.IsDeleted=0  and depttypeid=1 {0} {1}", code, title);
            }
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql, parms);
            }
          
            return dt;
        }
        /// <summary>
        /// 删除区域下门店信息
        /// </summary>
        public void DelStore()
        {
            string del = Request["delID"];
            int uid = base.CurrentSession.UserID;
            Hashtable ht = new Hashtable();
            int num = 0;
            ht.Add("@del",del);
            ht.Add("@uid",uid);
            string sql = string.Format(@"update iDept set AreaID=null,ModifyDate=GETDATE(),ModifyID=@uid where ID=@del");
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                num = db.ExecuteNoneQuery(sql, ht);
                db.Commit(); 
            }
        }
       
    }
}