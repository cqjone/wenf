using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;
using DbCommon;
using BllApi;


namespace BeautyPointWeb.Apis
{
    public partial class TrainMgr : AuthBasePage
    {
        protected BllApi.aboutEmp aEmp = new BllApi.aboutEmp();
        BllApi.DeptLimitApis deptLimit = new BllApi.DeptLimitApis();
        protected void Page_Load(object sender, EventArgs e)
        {
            switch (ActionName)
            {
                case "getDept":
                    GetDept();
                    break;
                case "getDataByParms":
                    GetDataByParms();
                    break;
                case "submitTrain":
                    SubmitTrain();
                    break;
                case "delTrain":
                    DelTrain();
                    break;
                case "getTrainMenu":
                    GetTrainMenu();
                    break;
                case "getTrainInfo":
                    GetTrainInfo();
                    break;
                case "delStore":
                    DelTrainEmp();
                    break;
            }
           
        }
        /// <summary>
        /// 人员部门信息
        /// </summary>
        /// <returns></returns>
        public void GetDept()
        {
            DataTable dt = new DataTable();
            string sql = string.Format(@"select Id as myId,Title as displayText 
                                                                   from iDept where IsDeleted=0 and depttypeid=1");
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql);
            }
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
        /// <summary>
        /// 通过查询条件查找信息
        /// </summary>
        public void GetDataByParms()
        {
            string TrainDate = Convert.ToDateTime(Request["trainDate"]).ToString("yyyy-MM-dd") + " 0:00:00";
            string TrainDateEnd = Convert.ToDateTime(Request["trainDateEnd"]).ToString("yyyy-MM-dd") + " 23:59:59";
            string Term = Request["term"];
            Hashtable parms = new Hashtable();
           
            if (!string.IsNullOrEmpty(Term))
            {
                parms.Add("@Term", Term);
                Term = "and Term like '%'+@Term+'%'";
            }

            if (!string.IsNullOrEmpty(TrainDate) && !string.IsNullOrEmpty(TrainDateEnd))
            {
                parms.Add("@TrainDate", TrainDate);
                parms.Add("@TrainDateEnd", TrainDateEnd);
                TrainDate = "and TrainDate >= @TrainDate and TrainDate<=@TrainDateEnd";
            }

            string sql = string.Format(@"select * from btrain where isDeleted=0 {0} {1} order by TrainDate desc", Term, TrainDate);
            Response.Write ( Newtonsoft.Json.JsonConvert.SerializeObject(aEmp.ExecQuery(sql, parms)));
            Response.End();
        }
        /// <summary>
        /// 查询编号是否存在
        /// </summary>
        /// <param name="cid"></param>
        /// <returns></returns>
        public int SelectByCode(string term, string uid)
        {
            int num = 0;
            Hashtable parms = new Hashtable();
            parms.Add("@term", term);
            string sql = "select COUNT(*) from bTrain where IsDeleted=0 and Term=@term";
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
        private void SubmitTrain()
        {
            string id = Request["InOrUp"];
            string[] ids = Request["ids"].Trim(',').Split(',');
            //string strID = Request["ids"].Trim(',');
            string term = Request["Term"];
            string trainDate = Request ["TrainDate"];
            string memoInfo = Request ["MemoInfo"];
            string cid = Request["cid"];
            string uid = Request["uid"];
            int num = SelectByCode(cid, uid);
            if (num == 0)
            {
                if (string.IsNullOrEmpty(id) || "0".Equals(id))
                {
                    Insert(term, trainDate, memoInfo, ids);
                    base.ReturnResultJson("true", "操作成功");
                }
                else
                {
                    Update(id, term, trainDate, memoInfo, ids);
                    base.ReturnResultJson("true", "操作成功");
                }
            }
            else
            {
                base.ReturnResultJson("false", "该期数已经存在！");
            }
        }
        /// <summary>
        /// 添加培训记录
        /// </summary>
        /// <param name="term"></param>
        /// <param name="date"></param>
        /// <param name="Info"></param>
        /// <param name="ids"></param>
        public void Insert(string term, string date, string Info, string[] ids)
        {
            DateTime time = DateTime.Now;
            DateTime trainDate = Convert.ToDateTime(date);
            Hashtable ht = new Hashtable();
            ht.Add("@term",term);
            DataTable dt = new DataTable();
            DataTable ID = new DataTable();
            string sql = "";
            int LastID = 0;
            string DepSql = "";
            string id="";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"insert into btrain(CreateId,CreateDate,ModifyId,ModifyDate,IsDeleted,Term,TrainDate,MemoInfo) 
                                    values(" + CurrentSession.UserID + ",getdate()," + CurrentSession.UserID +
                                    ",getdate(),0,'" + term + "','" + trainDate + "','" + Info + "')");
                int num = db.ExecuteNoneQuery(sql);
                id= "select @@identity as lastID";            
                if (num > 0)
                {
                    ID = db.ExecuteQuery(id);
                    //获取最后添加记录的ID
                    LastID = Convert.ToInt32(ID.Rows[0]["lastID"]);
                    for (int i = 0; i < ids.Length ; i++)
                    {
                        DepSql = string.Format(@"insert into btrainlist(CreateId,CreateDate,ModifyId,ModifyDate,IsDeleted,TrainID,EmpId)
                                              values(" + CurrentSession.UserID + ",getdate()," + CurrentSession.UserID +
                                              ",getdate(),0,'"+LastID+"','"+ids[i]+"')");
                        int numd = db.ExecuteNoneQuery(DepSql);
                    }
                }
                db.Commit();
               
            }
            if (ids.Length > 0 && ids[0]!="")
            {
                UpdateEmpTerm(ids);
            }
           
        }
        /// <summary>
        /// 修改培训记录
        /// </summary>
        /// <param name="tID"></param>
        /// <param name="term"></param>
        /// <param name="date"></param>
        /// <param name="Info"></param>
        /// <param name="ids"></param>
        public void Update(string tID,string term, string date, string Info, string[] ids)
        {
            int uid = base.CurrentSession.UserID;
            aUserApis auser = new aUserApis();
            DateTime time = DateTime.Now;
            DateTime trainDate = Convert.ToDateTime(date);
            Hashtable ht = new Hashtable();
            ht.Add("@uid", uid);
            ht.Add("@time", time);
            ht.Add("@term", term);
            ht.Add("@trainDate", trainDate);
            ht.Add("@Info", Info);
            ht.Add("@tID", tID);
            DataTable dt = new DataTable();          
            string sql = "";        
            string DepSql = "";
            string sqlSelect = string.Format(@"select empid from btrainlist where isdeleted=0 and trainid=@tID");
            List<string> listCom = new List<string>();
            string comID = "";
            DataTable dtCom = auser.ExecQuery(sqlSelect,ht);
            for (int i = 0; i < dtCom.Rows.Count; i++)
            {
                comID = dtCom.Rows[i]["EmpID"].ToString();
                listCom.Add(comID);
            }
            string[] Comp = listCom.ToArray();
            string[] InsertID = GetNewID(ids, Comp);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"update btrain set ModifyId=@uid,ModifyDate=@time,Term=@term,TrainDate=@trainDate,
                                                    MemoInfo=@Info where ID=@tID");
                int numB = db.ExecuteNoneQuery(sql,ht);
                if (numB > 0)
                {
                    for (int i = 0; i < InsertID.Length; i++)
                    {
                        DepSql = string.Format(@"insert into btrainlist(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,TrainID,EmpID)
                                              values(" + CurrentSession.UserID + ",getdate()," + CurrentSession.UserID +
                                              ",getdate(),0,'" + tID + "','" + InsertID[i] + "')");
                        int numd = db.ExecuteNoneQuery(DepSql);
                    }
                }
                db.Commit();
            }
            if (ids.Length > 0 && ids[0]!="")
            {
                UpdateEmpTerm(ids);
            }
        }
        /// <summary>
        /// 两个数组比较，取得不重复的值
        /// </summary>
        /// <param name="array1"></param>
        /// <param name="array2"></param>
        /// <returns></returns>
        public static string[] GetNewID(string[] oldIDs, string[] newIDs)
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
        /// 删除培训记录
        /// </summary>
        private void DelTrain()
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
            string sql = "update btrain set IsDeleted=1,ModifyDate=@datetime,ModifyID=@uid where ID=@did";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                num = db.ExecuteNoneQuery(sql, parms);
                db.Commit();
            }
            return num;
        }
        /// <summary>
        /// 获取员工信息
        /// </summary>
        /// <returns></returns>
        public void GetTrainMenu()
        {
            string code = Request["code"];
            string name = Request["name"];
            string deptid = Request["deptid"];
            DataTable dt = null;
            string sql = "";
            Hashtable ht = new Hashtable();
            if (!string.IsNullOrEmpty(code))
            {
                ht.Add("@code", code);
                code = "and e.code like '%'+@code+'%'";
            }
            if (!string.IsNullOrEmpty(name))
            {
                ht.Add("@name", name);
                name = "and e.title like '%'+@name+'%'";
            }
            if (!string.IsNullOrEmpty(deptid))
            {
                ht.Add("@deptid", deptid);
                deptid = "and e.deptid like '%'+@deptid+'%'";
            }
         
            using (DbUtil db = new DbUtil())
            {
                sql = string.Format(@"select e.code as Code,e.id as ID,e.title as Title,e.Mobile as Mobile,d.title as Duty,
                        p.title as Dept from iemployee e,iduty d,idept p where e.IsDeleted=0 and d.IsDeleted=0 and p.IsDeleted=0 
                        and e.dutyid=d.id and e.deptid=p.id and e.state<>'离职' {0} {1} {2} order by e.code", code, name, deptid);
                dt = db.ExecuteQuery(sql,ht);
            }
            string jsonStr = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(jsonStr);
            Response.End();
        }
        /// <summary>
        /// 获取员工信息
        /// </summary>
        public void GetTrainInfo()
        {
            string trainID = Request["trainID"];
            DataTable dt = new DataTable();
            if (!string.IsNullOrEmpty(trainID))
            {
                dt = GetEmp(trainID);

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
        /// 获取培训人员信息
        /// </summary>
        public DataTable GetEmp(string trainID)
        {
            Hashtable ht = new Hashtable();
            ht.Add("@trainID", trainID);
            string sql = string.Format(@"select e.ID, e.Code,e.Title from btrainlist l,btrain t,iemployee e where l.trainid=t.id and 
                                        l.empid=e.id and e.isdeleted=0 and l.isdeleted=0 and t.isdeleted=0 and t.id=@trainID");
            DataTable dtResult = null;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dtResult = db.ExecuteQuery(sql,ht);
            }
            return dtResult;
        }
        /// <summary>
        /// 删除人员培训记录
        /// </summary>
        public void DelTrainEmp()
        {
            string ID = Request ["id"];
            int modifyid = CurrentSession.UserID;
            string empID = Request["delID"].Trim(',');
            string[] ids = Request["delID"].Trim(',').Split(',');
            string upTrainlist = "";
            Hashtable ht = new Hashtable();
            ht.Add("@ID",ID);
            ht.Add("@modifyid", modifyid);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                upTrainlist = string.Format(@"update btrainlist set isdeleted=1,modifydate=getdate(),modifyid=@modifyid
                                            where trainid=@ID and empid in ("+empID+")");
                int count = db.ExecuteNoneQuery(upTrainlist, ht);
                db.Commit();
            }
            if (ids.Length > 0 && ids[0] != "")
            {
                UpdateEmpTerm(ids);
            }
        }
        /// <summary>
        /// 修改员工表中的term
        /// </summary>
        /// <param name="empIDs"></param>
        /// <returns></returns>
        private void UpdateEmpTerm(string[] empIDs)
        {
            Hashtable par = new Hashtable();
            int uid = CurrentSession.UserID;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                for (int i = 0; i < empIDs.Length; i++)
                {
                    string sqlSelect = string.Format(@"select top 1 t.term from btrain t,btrainlist l,iemployee e where t.isdeleted=0
                                                        and l.isdeleted=0 and e.isdeleted=0 and l.trainid=t.id and l.empid=e.id 
                                                        and l.empid={0} order by t.trainDate desc", empIDs[i]);
                    string termOld = "";
                    int count = db.ExecuteQuery(sqlSelect).Rows.Count;
                    if (db.ExecuteQuery(sqlSelect).Rows.Count >= 1)
                    {
                        termOld = db.ExecuteQuery(sqlSelect).Rows[0]["term"].ToString();
                    }
                    if (par.ContainsKey("@termOld"))
                    {
                        par["@termOld"] = termOld;
                    }
                    else
                    {
                        par.Add("@termOld", termOld);
                    }
                  
                    string sqlUp = string.Format(@"update iemployee set term=@termOld,modifydate=getdate(),modifyid={0} where id={1}",uid, empIDs[i]);
                    int num = db.ExecuteNoneQuery(sqlUp, par);
                }
                db.Commit();
            }
        }
    }
}