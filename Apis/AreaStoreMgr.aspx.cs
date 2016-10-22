using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BllApi;
using System.Data;
using DbCommon;
using System.Data.SqlClient;
using System.Collections;

namespace BeautyPointWeb.Apis
{
    public partial class AreaStoreMgr : AuthBasePage
    {
        BllApi.DeptApis deptApis = new BllApi.DeptApis();
        BllApi.DeptLimitApis deptLimit = new BllApi.DeptLimitApis();
        protected void Page_Load(object sender, EventArgs e)
        {

            switch (ActionName)
            {
                case "GetShopTitle":
                    GetShop();
                    break;
                case "getDataByParms":
                    GetDataByParms();
                    break;
                case "selectCode":
                    SelectCode();
                    break;
                case "submitStore":
                    SubmitStore();
                    break;
                case "del":
                    del();
                    break;
                case "getStoreMenu":
                    GetStoreMenu();
                    break ;

            }

            
        }
        //获得门店信息
        public void  GetShop()
        {
            
            //string sql = string.Format(@"select * from iDept where ID={0} or Title like '%{1}%'", Code, Title);
            string sql = string.Format(@"select ID as id,Title as text from iDept");
            DataTable dt = GetDataSet(sql);
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
        public void GetDataByParms()
        {
       
            Hashtable parms = new Hashtable();
            string Code = Request["code"];
            string Title = Request["title"];
            string MemoInfo = Request["memoInfo"];
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
//            string sql = string.Format(@"select a.ID,a.MemoInfo,a.Code,a.Title,a.AreaID,b.title as ParentTitle,b.id as ParentID 
//                                  from idept a,iarea b where a.AreaID=b.id and a.IsDeleted=0 {0} {1} {2}", Code, Title, MemoInfo);
            string sql = string.Format(@"select a.ID,a.MemoInfo,a.Code,a.Title,a.AreaID,b.title as ParentTitle,b.id as ParentID 
                                                    from idept a,iarea b where a.IsDeleted=0 and a.AreaID=b.id
                                                    {0} {1} {2}", Code, Title, MemoInfo);
            aUserApis auser = new aUserApis();
            DataTable dt = auser.ExecQuery(sql, parms);
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
        public int AddIntoBase(string sql)
        {
            string connStr = "Data Source=.;database=mongodb;User ID=sa;PassWord=123456;";
            SqlConnection conn = new SqlConnection(connStr);
            SqlCommand cmd = new SqlCommand(sql, conn);
            conn.Open();
            int count = cmd.ExecuteNonQuery();
            return count;
        }

        public static DataTable GetDataSet(string sql)
        {
            DataSet ds = new DataSet();
            string strConn = "Data Source=.;database=mongodb;User ID=sa;PassWord=123456;";
            SqlConnection conn = new SqlConnection(strConn);
            SqlDataAdapter da = new SqlDataAdapter(sql, conn);
            da.Fill(ds);
            return ds.Tables[0];
        }

        //添加查询编号是否存在
        private void SelectCode()
        {
            string cid = Request["cid"];
            string uid = Request["uid"];
            int num = SelectByCode(cid, uid);
            if (num == 0)
            {
                //SubmitDeptLimit();
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
            string sql = "select COUNT(*) from iDept where IsDeleted=0 and Code=@cid";
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
        /// 判断有没有id，如果有id则 update，否则 则insert
        /// </summary>
        private void SubmitStore()
        {
            string id = Request["id"];
            DataTable result;
            DataTable dtSource;
            if (string.IsNullOrEmpty(id) || "0".Equals(id))
            {
                //insert
                dtSource = MappingDataFromPage("iDept", "0");
                result = deptLimit.Add(CurrentUser, dtSource);
            }
            else
            {
                //update;
                dtSource = MappingDataFromPage("iDept", id);
                result = deptLimit.Update(CurrentUser, dtSource);
            }
            base.ReturnSubmitResultJson(result);
        }
        //根据ID删除
        private void del()
        {
            Hashtable parms = new Hashtable();
            string did = Request["did"];
            int uid = base.CurrentSession.UserID;
            int num = updateIsDelete(did, uid);
            if (num > 0)
            {
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
            string sql = "update iDept set IsDeleted=1,ModifyDate=@datetime,ModifyID=@uid where ID=@did";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                num = db.ExecuteNoneQuery(sql, parms);
                db.Commit();
            }
            return num;
        }

        //public void GetStoreMenu()
        //{
        //    string sql = string.Format(@"select * from iDept where IsDeleted =0 order by Code");
        //    DataTable dt = GetDataSet(sql);
        //    string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        //    Response.Write(jsonStr);
        //    Response.End();
        //}

        //获取部门名称
        private void GetStoreMenu()
        {
            DataTable dt = GetInfo();
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr.Replace(":0", ":false"));
            Response.End();
        }
        public DataTable GetInfo()
        {
            DataTable dt = null;
            using (DbUtil db = new DbUtil())
            {
                dt = db.ExecuteQuery(@"select id,Title as text,'false' as leaf from iDept");
            }

            return dt;
        }
    }
}