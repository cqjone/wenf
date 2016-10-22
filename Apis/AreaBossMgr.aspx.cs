using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using BllApi;
using System.Data;
using DbCommon;

namespace BeautyPointWeb.Apis
{
    public partial class AreaBossMgr : AuthBasePage
    {
        //假定区域经理的id 是238，销售经理的id 是239
        public static string ManagerDutyID = "238";
        public static string SalManagerDutyID = "239";
        BllApi.DeptLimitApis deptLimit = new BllApi.DeptLimitApis();
        protected void Page_Load(object sender, EventArgs e)
        {
            switch (ActionName)
            {
                case "getArea":
                    GetArea();
                    break;
                case "getDataByParms":
                    GetDataByParms();
                    break;
                case "delBoss":
                    DelBoss();
                    break;
                case "submitBoss":
                    SubmitBoss();
                    break;
                case "getManagerInfo":
                    GetManagerInfo();
                    break;
                case "delStore":
                    DelStore();
                    break;
                case "getMarketingInfo":
                    GetMarketingInfo();
                    break;
                case "getDepMenu":
                    GetDepMenu();
                    break;
                case "getManagerGp":
                    GetManagerGp();
                    break;
                case "getMkGp":
                    GetMkGp();
                    break;

            }
        }
        /// <summary>
        /// 根据查询条件查询信息
        /// </summary>
        private void GetDataByParms()
        {
            Hashtable parms = new Hashtable();
            string Code = Request["code"];
            string Name = Request["name"];
            string parentTitle = Request["parentTitle"];
            if (!string.IsNullOrEmpty(Code))
            {
                parms.Add("@Code", Code);
                Code = "and e.Code like '%'+@Code+'%'";
            }
            if (!string.IsNullOrEmpty(Name))
            {
                parms.Add("@Name", Name);
                Name = "and e.Title like '%'+@Name+'%'";
            }
            if (!string.IsNullOrEmpty(parentTitle))
            {
                if (parentTitle == "全部")
                {
                    parentTitle = "";
                }
                parms.Add("@parentTitle", parentTitle);
                parentTitle = "and a.Title like '%'+@parentTitle+'%'";
            }
            string sql = string.Format(@"select m.ID,e.Title as Name,e.Code,a.Title as ParentTitle,d.Title as DutyID,
                          a.id as AreaID from iEmployee e,iarea a,iDuty d,iAreaMgr m where m.DutyID=d.ID and m.AreaID = a.ID 
                          and m.EmpID= e.ID and m.isdeleted=0 and e.isdeleted=0 and a.isdeleted=0 and e.state<>'离职' and 
                          d.isdeleted=0 {0} {1} {2} order by a.code ", Code, Name, parentTitle);
            aUserApis auser = new aUserApis();
            DataTable dt = auser.ExecQuery(sql, parms);
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
        /// <summary>
        /// 获取区域信息
        /// </summary>
        private void GetArea()
        {
            string sql = string.Format(@"select a.ID,a.MemoInfo,a.Code,a.Title,b.title as ParentTitle,b.id as ParentID 
                                    from iarea a left join iarea b on a.parentid=b.id where a.IsDeleted=0 and b.IsDeleted=0");
            DataTable dt = AreaStoreMgr.GetDataSet(sql);
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
        /// <summary>
        /// 根据ID删除区域经理信息
        /// </summary>
        private void DelBoss()
        {
            Hashtable parms = new Hashtable();
            string did = Request["did"];
            int uid = base.CurrentSession.UserID;
            int num = UpdateIsDelete(did, uid);
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
        public int UpdateIsDelete(string did, int uid)
        {
            int num = 0;
            string datetime = DateTime.Now.ToString();//当前时间
            Hashtable parms = new Hashtable();
            parms.Add("@did", did);
            parms.Add("@datetime", datetime);
            parms.Add("@uid", uid);
            string sql = "update iAreaMgr set IsDeleted=1,ModifyDate=@datetime,ModifyID=@uid where ID=@did";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                num = db.ExecuteNoneQuery(sql, parms);
                db.Commit();
            }
            return num;
        }
        /// <summary>
        /// 提交 一条规则
        /// 
        /// </summary>
        private void SubmitBoss()
        {
            aUserApis auser = new aUserApis();
            string AreaID = Request["AreaID"];
            string[] ManagerIDOld = Request["ManagerID"].Split(',');
            string[] MarketingIDOld = Request["MarketingID"].Split(',');
            string[] ManagerID = Request["ManagerID"].Trim(',').Split(',');
            if (ManagerIDOld.Length >1)
            {
                string strMgrID = Request["ManagerID"].Trim(',');
                strMgrID = strMgrID.Replace("'", "''");

                string SqlSelect = string.Format(@"select EmpID from iareamgr where EmpID in
                                  (" + strMgrID + ") and dutyid={0} and AreaID={1} and isdeleted=0", ManagerDutyID, AreaID);

                string sameID = "";
                List<string> list = new List<string>();
                DataTable dt = auser.ExecQuery(SqlSelect);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    sameID = dt.Rows[i]["EmpID"].ToString();
                    list.Add(sameID);
                }
                
                string[] StrDataBase = list.ToArray();
                ManagerID = GetNewManagerID( ManagerIDOld, StrDataBase);
               
            }
            string[] MarketingID = Request["MarketingID"].Trim(',').Split(',');
            if (MarketingIDOld.Length > 1)
            {
                string strMkID = Request["MarketingID"].Trim(',');
                strMkID = strMkID.Replace("'", "''");
                string SqlCom = string.Format(@"select EmpID from iareamgr where EmpID in 
                                (" + strMkID + ") and dutyid={0} and AreaID={1} and isdeleted=0", SalManagerDutyID, AreaID);
                string comID = "";
                List<string> listCom = new List<string>();
                DataTable dtCom = auser.ExecQuery(SqlCom);
                for (int i = 0; i < dtCom.Rows.Count; i++)
                {
                    comID = dtCom.Rows[i]["EmpID"].ToString();
                    listCom.Add(comID);
                }
               
                string[] Comp = listCom.ToArray();
                MarketingID = GetNewManagerID( MarketingIDOld, Comp);
                
            }
            InsertAreaMgr(AreaID, ManagerID, MarketingID);
            base.ReturnResultJson("true", "操作成功");

        }
        /// <summary>
        /// 两个数组比较，取得不重复的值
        /// </summary>
        /// <param name="array1"></param>
        /// <param name="array2"></param>
        /// <returns></returns>
        public static string[] GetNewManagerID(string[] oldIDs, string[] newIDs)
        {
            List<string> equal = new List<string>();
            equal = oldIDs.ToList();
            foreach (string i in oldIDs)
            {
                foreach (string j in newIDs)
                {
                    if (i == j)
                    {
                        equal.Remove(i);
                    }
                   
                }
            }
            return equal.ToArray();
        }
        /// <summary>
        /// 添加区域经理信息
        /// </summary>
        /// <param name="AreaID"></param>
        /// <param name="ManagerID"></param>
        /// <param name="MarketingID"></param>
        public void InsertAreaMgr(string AreaID, string[] ManagerID, string[] MarketingID)
        {
            DateTime time = DateTime.Now;
            Hashtable ht = new Hashtable();
            string sql = "";
            string sqlMk = "";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                for (int i = 0; i < ManagerID.Length-1; i++)
                {
                    sql = string.Format(@"insert into iAreaMgr(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,AreaID,DutyID,EmpID)
                                       values(" + CurrentSession.UserID + ",getdate()," + CurrentSession.UserID + 
                                      ",getdate(),0,'" + AreaID + "','" + ManagerDutyID + "','"+ManagerID[i]+"')");

                    int numManager = db.ExecuteNoneQuery(sql,ht);

                }
                for (int i = 0; i < MarketingID.Length-1; i++)
                {
                    sqlMk = string.Format(@"insert into iAreaMgr(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,AreaID,DutyID,EmpID)
                                     values(" + CurrentSession.UserID + ",getdate()," + CurrentSession.UserID + ",getdate(),0,'" + 
                                     AreaID + "','" + SalManagerDutyID + "','"+MarketingID[i]+"')");

                    int numMarketing = db.ExecuteNoneQuery(sqlMk,ht);

                } 
                db.Commit();
            }  
        }
        
        /// <summary>
        /// 获取经理信息
        /// </summary>
        public void GetManagerInfo()
        {
            string AreaID = Request["AreaID"];
            Hashtable ht = new Hashtable();
            ht.Add("@ID", AreaID);
            DataTable dt = new DataTable();
            string sql = string.Format(@"select e.ID,e.Title,e.Code from iduty d,iemployee e,iareamgr a where
                                        d.IsDeleted=0 and e.IsDeleted=0 and a.IsDeleted=0 and e.ID=a.empid and a.dutyid=d.id 
                                        and e.state<>'离职' and d.id={0} and a.areaid=@ID order by e.code",ManagerDutyID);
            DataTable dtResult = null;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dtResult = db.ExecuteQuery(sql,ht);
            }

            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);
            Response.Write(html);
            Response.End();
        }
        /// <summary>
        /// 获取销售经理信息
        /// </summary>
        public void GetMarketingInfo()
        {
            string AreaID = Request["AreaID"];
            Hashtable ht = new Hashtable();
            ht.Add("@ID", AreaID);
            DataTable dt = new DataTable();
            string sql = string.Format(@"select e.ID,e.Title,e.Code from iduty d,iemployee e,iareamgr a where
                                        d.IsDeleted=0 and e.IsDeleted=0 and a.IsDeleted=0 and e.ID=a.empid and a.dutyid=d.id 
                                        and e.state<>'离职' and d.id={0} and a.areaid=@ID order by e.code",SalManagerDutyID);
            DataTable dtResult = null;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dtResult = db.ExecuteQuery(sql,ht);
            }
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);
            Response.Write(html);
            Response.End();
        }
      
        /// <summary>
        /// 删除区域经理信息
        /// </summary>
        public void DelStore()
        {
            int uid = base.CurrentSession.UserID;
            string EmpID = Request["delID"];
            string Dutyid = Request["dutyid"];
            string AreaID = Request ["AreaID"];
            Hashtable ht = new Hashtable();
            DataTable dt = new DataTable();
            ht.Add("@EmpID", EmpID);
            ht.Add("@uid", uid);
     
            string sql = string.Format(@"update iareaMgr set ModifyID=@uid ,ModifyDate=getdate(), isdeleted=1 
                                         where empid=@EmpID and AreaID={0} and DutyID={1}" ,AreaID,Dutyid);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql, ht);            
                db.Commit();
            }
        }
        /// <summary>
        /// 获取人员姓名列表
        /// </summary>
        private void GetDepMenu()
        {
            string code = Request["code"];
            string title = Request["title"];
            //页面传递固定的参数id 使得人员信息（树形）加载时为空
            string id = Request["id"];
            DataTable dt = Get(code,title,id);
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr.Replace(":0", ":false"));
            Response.End();
        }
        /// <summary>
        /// 根据参数获取相应的人员信息
        /// </summary>
        /// <param name="code"></param>
        /// <param name="title"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public DataTable Get(string code,string title,string id)
        {
            DataTable dt = null;
            Hashtable ht = new Hashtable();
            if (!string.IsNullOrEmpty(code))
            {
                ht.Add("@code", code);
                code = "and Code like '%'+@code+'%'";
            }
            if (!string.IsNullOrEmpty(title))
            {
                ht.Add("@title", title);
                title = "and Title like '%'+@title+'%'";
            }
            if (!string.IsNullOrEmpty(id))
            {
                ht.Add("@id", id);
                id = "and id =0"; 
            }
            string sql = string.Format(@"select code,id,Code+'   '+Title as text,Title,'false' as leaf, 0 as checked from 
                         iemployee where iemployee.IsDeleted=0 and state<>'离职' {0} {1} {2} order by code", code, title,id);
          
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql, ht);
            }
            return dt;
        }
        /// <summary>
        /// 根据参数获取经理人员信息
        /// </summary>
        public void GetManagerGp()
        {
            string code = Request ["code"];
            string title = Request ["title"];
            Hashtable ht = new Hashtable();
            if (!string.IsNullOrEmpty(code))
            {
                ht.Add("@code", code);
                code = "and e.code like '%'+@code+'%'";
            }
            if (!string.IsNullOrEmpty(title))
            {
                ht.Add("@title", title);
                title = "and e.title like '%'+@title+'%'";
            }
            DataTable dt = new DataTable();
            string sql = string.Format(@"select e.code as Code,e.id as ID,e.title as Title,e.Mobile as Mobile,d.title 
                                as Duty,p.title as Dept from iemployee e,iduty d,idept p where e.IsDeleted=0 and 
                                d.IsDeleted=0 and p.IsDeleted=0 and e.dutyid=d.id and e.deptid=p.id and e.state<>'离职' 
                                and d.ID={0} {1} {2} order by e.code",ManagerDutyID , code, title);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql,ht);
            }
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
        /// <summary>
        /// 根据参数获取区域销售经理信息
        /// </summary>
        public void GetMkGp()
        {
            string code = Request ["code"];
            string title = Request ["title"];
            Hashtable ht = new Hashtable();
            if (!string.IsNullOrEmpty(code))
            {
                ht.Add("@code", code);
                code = "and e.code like '%'+@code+'%'";
            }
            if (!string.IsNullOrEmpty(title))
            {
                ht.Add("@title", title);
                title = "and e.title like '%'+@title+'%'";
            }
            DataTable dt = new DataTable();
            string sql = string.Format(@"select e.code as Code,e.id as ID,e.title as Title,e.Mobile as Mobile,d.title 
                                as Duty,p.title as Dept from iemployee e,iduty d,idept p where e.IsDeleted=0 and 
                                d.IsDeleted=0 and p.IsDeleted=0 and e.dutyid=d.id and e.deptid=p.id and e.state<>'离职' 
                                and d.ID={0} {1} {2} order by e.code",SalManagerDutyID, code, title);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql,ht);
            }
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
    }
}