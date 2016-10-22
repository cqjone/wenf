using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections;

namespace BeautyPointWeb.Apis
{
    public partial class iDeptWarning : BasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            switch (ActionName)
            {
                case "getDepWarning":
                    GetDepWarning();
                    break;
                case "delWarning":
                    DelWarning();
                    break;
                case "SubmitWarning":
                    SubmitWarning();
                    break;
                case "delManyWarning":
                    DelManyWarning();
                    break;
                case "getWarningPeople":
                    GetWarningPeople();
                    break;
                case "getPeople":
                    GetPeople();
                    break;
                case "getDept":
                    GetDept();
                    break;
                case "delPeoples":
                    DelPeoples();
                    break;
                case "AddPeople":
                    AddPeople();
                    break;
                case "getPeopleInfo":
                    GetPeopleInfo();
                    break;
                case "getDeptInfo":
                    GetDeptInfo();
                    break;
                case "delWarningPeople":
                    DelWarningPeople();
                    break;
                case "delDept":
                    DelDept();
                    break;
                case "getWarningFormInfo":
                    GetWarningFormInfo();
                    break;
            }
        }
        /// <summary>
        /// 获取门店到期提醒信息
        /// </summary>
        private void GetDepWarning()
        {
            string sql = "";
            string result = string.Empty;
            DataTable dt = new DataTable();
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"select ID,Title as WarningTitle,DateBegin as StartTime,dateend as EndTime,
                                    case isenabled
                                    when 0 then '是'
                                    when 1 then '否'
                                    end as Action,AllDept,MemoInfo from iDeptReminders
                                     where isdeleted=0 
                                    order by createdate desc");
                dt = db.ExecuteQuery(sql);
            }
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(result);
            Response.End();
        }
        /// <summary>
        /// 在操作中删除选中的记录
        /// </summary>
        private void DelWarning()
        {
            string id = Request["delID"];
            Hashtable ht = new Hashtable();
            ht.Add("@id", id);
            ht.Add("@modifyid", CurrentSession.UserID);
            string sql = "";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"update iDeptReminders set isdeleted=1,modifyid=@modifyid,modifydate=getdate() where id=@id");
                int num = db.ExecuteNoneQuery(sql, ht);
                if (num > 0)
                {
                    //删除对应的提醒人信息
                    sql = string.Format(@"update iRemindPerson set isdeleted=1,modifyid=@modifyid,modifydate=getdate() 
                                          where remindid=@id");
                    int pnum = db.ExecuteNoneQuery(sql, ht);
                    //删除对应的门店信息
                    sql = string.Format(@"update iRemindDept set isdeleted=1,modifyid=@modifyid,modifydate=getdate() 
                                          where remindid=@id");
                    int dnum = db.ExecuteNoneQuery(sql, ht);
                    db.Commit();
                    base.ReturnResultJson("true","删除成功！");
                }
                base.ReturnResultJson("false", "删除失败！");
            }
        }
        /// <summary>
        /// 根据标记判读是添加提醒还是修改提醒，并执行相应的函数
        /// </summary>
        private void SubmitWarning()
        {
            string sql = "";
            string title = Request["Title"];
            string InOrUp = Request["InOrUp"];
            DateTime StartTime = Convert.ToDateTime(Request["StartTime"]);
            DateTime EndTime = Convert.ToDateTime(Request["EndTime"]);
            string MemoInfo = Request["MemoInfo"];
            string WarningPeople = Request["PeoplesID"].Trim(',');
            string[] peopleID = WarningPeople.Split(',');
            string Dept = Request["DeptsID"].Trim(',');
            string[] deptID = Dept.Split(',');
            string AllDept = Request["AllDept"];
            string Action = "";
            if (!string.IsNullOrEmpty(Request["Action"]))
            {
                Action = "0";
            }
            else
            {
                Action = "1";
            }
            if (AllDept == "true")
            {
                AllDept = "0";
            }
            else
            {
                AllDept = "1";
            }
            if (string.IsNullOrEmpty(InOrUp))
            {
                //添加
                InsertWarningInfo(title, StartTime, EndTime, Action, MemoInfo, AllDept);
            }
            else
            {
                //修改
                UpdateWarningInfo(title, StartTime, EndTime, Action, MemoInfo, AllDept);
            }
        }
        /// <summary>
        /// 添加提醒信息
        /// </summary>
        /// <returns></returns>
        private void InsertWarningInfo(string title, DateTime StartTime, DateTime EndTime, string Action, string MemoInfo, string AllDept)
        {
            string sql = "";
            Hashtable ht = new Hashtable();
            ht.Add("@title", title);
            ht.Add("@StartTime", StartTime);
            ht.Add("@EndTime", EndTime);
            ht.Add("@Action", Action);
            ht.Add("@MemoInfo", MemoInfo);
            ht.Add("@AllDept", AllDept);
            ht.Add("@uid", CurrentSession.UserID);
            string WarningPeople = Request["PeoplesID"].Trim(',');
            string[] peopleID = WarningPeople.Split(',');
            string Dept = Request["DeptID"].Trim(',');
            string[] deptID = Dept.Split(',');
            int count = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                int dcount = 0;
                sql = string.Format(@"insert into iDeptReminders(createid,createdate,modifyid,modifydate,isdeleted,
                      title,datebegin,dateend,isenabled,memoinfo,Alldept) values(@uid,getdate(),@uid,getdate(),0,@title,
                        @StartTime,@EndTime,@Action,@MemoInfo,@AllDept)");
                count = db.ExecuteNoneQuery(sql, ht);
                string sqlLastId = "select @@identity as id";
                DataTable ID = db.ExecuteQuery(sqlLastId);
                int remind = Convert.ToInt32(ID.Rows[0]["id"]);
                ht.Add("@remindid", remind);
                if (count > 0)
                {
                    int pCount = 0;
                    if (!string.IsNullOrEmpty(WarningPeople))
                    {
                        for (int i = 0; i < peopleID.Length; i++)
                        {
                            //添加提醒人信息
                            sql = string.Format(@"insert into iRemindPerson(Createid,createdate,modifydate,modifyid,isdeleted,
                                            remindid,personid) values(@uid,getdate(),getdate(),@uid,0,@remindid,'" + peopleID[i] + "')");
                            pCount = db.ExecuteNoneQuery(sql, ht);
                        }
                    }
                    if (!string.IsNullOrEmpty(Dept))
                    {
                        for (int j = 0; j < deptID.Length; j++)
                        {
                            sql = string.Format(@"insert into iRemindDept(Createid,createdate,modifydate,modifyid,isdeleted,
                                            deptid,remindid) values(@uid,getdate(),getdate(),@uid,0,'" + deptID[j] + "',@remindid)");
                            dcount = db.ExecuteNoneQuery(sql, ht);
                        }
                    }
                }
                db.Commit();
                base.ReturnResultJson("true", "添加成功！");
            }
            base.ReturnResultJson("false", "添加失败！");
        }
        /// <summary>
        /// 两个数组比较，取得不重复的值
        /// </summary>
        /// <param name="array1"></param>
        /// <param name="array2"></param>
        /// <returns></returns>
        public static string[] GetNewID(string[] newIDs, string[] oldIDs)
        {
            List<string> equal = new List<string>();
            equal = newIDs.ToList();
            foreach (string i in newIDs)
            {
                foreach (string j in oldIDs)
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
        /// 修改提醒信息
        /// </summary>
        /// <returns></returns>
        private void UpdateWarningInfo(string title, DateTime StartTime, DateTime EndTime, string Action, string MemoInfo, string AllDept)
        {
            string sql = "";
            Hashtable ht = new Hashtable();
            string id = Request["InOrUp"];
            ht.Add("@title", title);
            ht.Add("@StartTime", StartTime);
            ht.Add("@EndTime", EndTime);
            ht.Add("@Action", Action);
            ht.Add("@MemoInfo", MemoInfo);
            ht.Add("@AllDept", AllDept);
            ht.Add("@id", id);
            ht.Add("@uid", CurrentSession.UserID);
            string WarningPeople = Request["PersonID"].Trim(',');
            string[] peopleID = WarningPeople.Split(',');
            string Dept = Request["DeptID"].Trim(',');
            string[] deptID = Dept.Split(',');
            int count = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"update iDeptReminders set modifyid=@uid,modifydate=getdate(),title=@title,
                                    datebegin=@StartTime,dateend=@EndTime,isenabled=@Action,memoinfo=@MemoInfo,
                                    Alldept=@AllDept where id=@id");
                int dpnum = db.ExecuteNoneQuery(sql, ht);
                if (!string.IsNullOrEmpty(WarningPeople))
                {
                    int pCount = 0;
                    string WpeopleID = Request["PersonID"].Trim(',').Replace("'", "''");
                    string SqlCom = string.Format(@"select personid from iRemindPerson where isdeleted=0 and 
                                                    remindid=@id and personid in (" + WpeopleID + ")");
                    string comID = "";
                    List<string> listCom = new List<string>();
                    DataTable dtCom = db.ExecuteQuery(SqlCom, ht);
                    for (int w = 0; w < dtCom.Rows.Count; w++)
                    {
                        comID = dtCom.Rows[w]["personid"].ToString();
                        listCom.Add(comID);
                    }
                    string[] Comp = listCom.ToArray();
                    peopleID = GetNewID(peopleID, Comp);
                    for (int i = 0; i < peopleID.Length; i++)
                    {
                        sql = string.Format(@"insert into iRemindPerson(Createid,createdate,modifydate,modifyid,isdeleted,
                                        remindid,personid) values(@uid,getdate(),getdate(),@uid,0,@id,'" + peopleID[i] + "')");
                        pCount = db.ExecuteNoneQuery(sql, ht);
                    }
                }
                if (!string.IsNullOrEmpty(Dept))
                {
                    string WdeptID = Request["deptID"].Trim(',').Replace("'", "''");
                    string SqlComDept = string.Format(@"select deptid from iRemindDept where isdeleted=0 and 
                                                        remindid=@id and deptid in (" + WdeptID + ")");
                    string DeptcomID = "";
                    List<string> listComDept = new List<string>();
                    DataTable dtComDept = db.ExecuteQuery(SqlComDept, ht);
                    for (int w = 0; w < dtComDept.Rows.Count; w++)
                    {
                        DeptcomID = dtComDept.Rows[w]["deptid"].ToString();
                        listComDept.Add(DeptcomID);
                    }
                    string[] CompDept = listComDept.ToArray();
                    deptID = GetNewID(deptID, CompDept);
                    for (int j = 0; j < deptID.Length; j++)
                    {
                        sql = string.Format(@"insert into iRemindDept(Createid,createdate,modifydate,modifyid,isdeleted,
                                           deptid,remindid) values(@uid,getdate(),getdate(),@uid,0,'" + deptID[j] + "',@id)");
                        count = db.ExecuteNoneQuery(sql, ht);
                    }
                }
                db.Commit();
                base.ReturnResultJson("true", "修改成功！");
            }
            base.ReturnResultJson("false", "修改失败！");
        }
        /// <summary>
        /// 批量删除提醒信息
        /// </summary>
        private void DelManyWarning()
        {
            string sql = "";
            int num = 0;
            string ids = Request["deletedIds"].Trim(',');
            ids = ids.Replace("'", "''");
            Hashtable ht = new Hashtable();
            ht.Add("@uid", CurrentSession.UserID);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"update iDeptReminders set modifyid=@uid,modifydate=getdate(), isdeleted=1 
                                     where id in(" + ids + ")");
                num = db.ExecuteNoneQuery(sql, ht);
                if (num > 0)
                {
                    db.Commit();
                    base.ReturnResultJson("true", "删除成功！");
                }
            }
            base.ReturnResultJson("false", "删除失败！");
        }
        /// <summary>
        /// 获取提醒人信息
        /// </summary>
        private void GetWarningPeople()
        {
            string sql = "";
            string ID = Request["ID"];
            Hashtable ht = new Hashtable();
            string result = string.Empty;
            DataTable dt = new DataTable();
            if (!string.IsNullOrEmpty(ID))
            {
                ht.Add("@ID", ID);
                ID = "and b.remindid=@ID";
            }
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"Select a.ID,b.Remindid, a.name as WarningpeopleTitle,a.Mobile from iPersonInfo a,
                                    iRemindPerson b where a.isdeleted=0 and b.isdeleted=0 
                                    and b.personid=a.id {0} order by b.id ", ID);
                dt = db.ExecuteQuery(sql, ht);
            }
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(result);
            Response.End();
        }
        /// <summary>
        /// 获取相关人信息
        /// </summary>
        private void GetPeople()
        {
            string sql = "";
            string result = string.Empty;
            DataTable dt = new DataTable();
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"select ID, Name as Title,Mobile,MemoInfo from iPersonInfo 
                                     where isdeleted=0 order by createdate desc");
                dt = db.ExecuteQuery(sql);
            }
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            result = "{data:" + result + "}";
            Response.Write(result);
            Response.End();
        }
        /// <summary>
        /// 获取门店信息
        /// </summary>
        private void GetDept()
        {
            string sql = "";
            string ID = Request["ID"];
            Hashtable ht = new Hashtable();
            string result = string.Empty;
            DataTable dt = new DataTable();
            if (!string.IsNullOrEmpty(ID))
            {
                ht.Add("@ID", ID);
                ID = "and a.remindid=@ID";
            }
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"select c.ID,c.Title,a.Remindid,b.LandLord, b.RentBegin,
                                b.RentEnd from iRemindDept a,ideptext b,idept c
                                where b.deptid=c.id and a.deptid=c.id and a.isdeleted=0 
                                and b.isdeleted=0 and c.isdeleted=0  {0} order by a.createdate desc", ID);
                dt = db.ExecuteQuery(sql, ht);
            }
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(result);
            Response.End();
        }
        /// <summary>
        /// 删除相关人信息
        /// </summary>
        private void DelPeoples()
        {
            if (!string.IsNullOrEmpty(Request["delID"]))
            {
                string id = Request["delID"].Trim(',');
                Hashtable ht = new Hashtable();
                ht.Add("@uid", CurrentSession.UserID);
                id = id.Replace("'", "''");
                string sql = "";
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    sql = string.Format(@"update iPersonInfo set modifydate=getdate(),modifyid=@uid,
                                         isdeleted=1 where id in (" + id + ")");
                    int num = db.ExecuteNoneQuery(sql, ht);
                    if (num > 0)
                    {
                        db.Commit();
                        base.ReturnResultJson("true", "删除成功！");
                    }
                    else
                    {
                        base.ReturnResultJson("false", "删除失败！");
                    }
                }
            }
            base.ReturnResultJson("true", "删除成功！");
        }
        /// <summary>
        /// 添加相关人信息
        /// </summary>
        private void AddPeople()
        {
            string upInfo = Request["upInfo"];
            string newInfo = Request["newInfo"];
            string[] upInfo1 = Request["upInfo"].Split('-');
            string[] newInfo1 = Request["newInfo"].Split('-');
            string[] up = upInfo.Split(',');
            string[] insert = newInfo.Split(',');
            string sql = "";
            Hashtable ht = new Hashtable();
            if (!string.IsNullOrEmpty(upInfo))
            {
                //修改
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    int num = 0;
                    for (int i = 0; i < upInfo1.Length - 1; i++)
                    {
                        if (ht.ContainsKey("@uid"))
                        {
                            ht["@uid"] = CurrentSession.UserID;
                        }
                        else
                        {
                            ht.Add("@uid", CurrentSession.UserID);
                        }
                        if (ht.ContainsKey("@id"))
                        {
                            ht["@id"] = upInfo1[i].Split(',')[0];
                        }
                        else
                        {
                            ht.Add("@id", upInfo1[i].Split(',')[0]);
                        }
                        if (ht.ContainsKey("@title"))
                        {
                            ht["@title"] = upInfo1[i].Split(',')[1];
                        }
                        else
                        {
                            ht.Add("@title", upInfo1[i].Split(',')[1]);
                        }
                        if (ht.ContainsKey("@mobile"))
                        {
                            ht["@mobile"] = upInfo1[i].Split(',')[2];
                        }
                        else
                        {
                            ht.Add("@mobile", upInfo1[i].Split(',')[2]);
                        }
                        if (ht.ContainsKey("@memoinfo"))
                        {
                            ht["@memoinfo"] = upInfo1[i].Split(',')[3];
                        }
                        else
                        {
                            ht.Add("@memoinfo", upInfo1[i].Split(',')[3]);
                        }
                        sql = string.Format(@"update iPersonInfo set modifydate=getdate(),modifyid=@uid,name=@title,
                                            mobile=@mobile,memoInfo=@memoInfo where id=@id");
                        num = db.ExecuteNoneQuery(sql, ht);
                    }
                    if (num > 0)
                    {
                        db.Commit();
                        base.ReturnResultJson("true", "修改成功！");
                    }
                }
            }
            else
            {
                //添加
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    int num = 0;
                    for (int i = 0; i < newInfo1.Length - 1; i++)
                    {
                        if (ht.ContainsKey("@uid"))
                        {
                            ht["@uid"] = CurrentSession.UserID;
                        }
                        else
                        {
                            ht.Add("@uid", CurrentSession.UserID);
                        }
                        if (ht.ContainsKey("@name"))
                        {
                            ht["@name"] = newInfo1[i].Split(',')[0];
                        }
                        else
                        {
                            ht.Add("@name", newInfo1[i].Split(',')[0]);
                        }
                        if (ht.ContainsKey("@mobile"))
                        {
                            ht["@mobile"] = newInfo1[i].Split(',')[1];
                        }
                        else
                        {
                            ht.Add("@mobile", newInfo1[i].Split(',')[1]);
                        }
                        if (ht.ContainsKey("@memoinfo"))
                        {
                            ht["@memoinfo"] = newInfo1[i].Split(',')[2];
                        }
                        else
                        {
                            ht.Add("@memoinfo", newInfo1[i].Split(',')[2]);
                        }
                        sql = string.Format(@"insert into iPersonInfo(Createdate,createid,modifydate,modifyid,isdeleted,name,
                                        mobile,memoInfo) values(getdate(),@uid,getdate(),@uid,0,@name,@mobile,@memoinfo)");
                        num = db.ExecuteNoneQuery(sql, ht);
                    }
                    if (num > 0)
                    {
                        db.Commit();
                        base.ReturnResultJson("true", "添加成功！");
                    }
                }
            }
            base.ReturnResultJson("false", "操作失败！");
        }
        /// <summary>
        /// 添加提醒人信息，根据姓名查找
        /// </summary>
        private void GetPeopleInfo()
        {
            string title = Request["title"];
            string sql = "";
            Hashtable ht = new Hashtable();
            DataTable dt = new DataTable();
            if (!string.IsNullOrEmpty(title))
            {
                ht.Add("@title", title);
                title = "and name like '%'+@title+'%' ";
            }
            else
            {
                title = "";
            }
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"select ID, Name as WarningpeopleTitle,Mobile,MemoInfo from iPersonInfo 
                            where isdeleted=0 {0} order by ID", title);
                dt = db.ExecuteQuery(sql, ht);
            }
            string result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(result);
            Response.End();
        }
        /// <summary>
        /// 添加门店信息，查找
        /// </summary>
        private void GetDeptInfo()
        {
            string title = Request["title"];
            string code = Request["code"];
            string sql = "";
            Hashtable ht = new Hashtable();
            DataTable dt = new DataTable();
            if (!string.IsNullOrEmpty(title))
            {
                ht.Add("@title", title);
                title = "and a.Title like '%'+@title+'%' ";
            }
            else
            {
                title = "";
            }
            if (!string.IsNullOrEmpty(code))
            {
                ht.Add("@code", code);
                code = "and a.Code like '%'+@code+'%' ";
            }
            else
            {
                code = "";
            }
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"select a.Code, a.ID,a.Title,b.LandLord,b.RentBegin,b.RentEnd from idept a,
                                    ideptext b where a.isdeleted=0 and b.isdeleted=0
                                    and a.id=b.deptid {0} {1} order by a.code", title, code);
                dt = db.ExecuteQuery(sql, ht);
            }
            string result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(result);
            Response.End();
        }
        /// <summary>
        /// 删除提醒人
        /// </summary>
        private void DelWarningPeople()
        {
            string ids = Request["delID"].Trim(',');
            string remindid = Request["remindid"];
            ids = ids.Replace("'", "''");
            string sql = "";
            int count = 0;
            Hashtable ht = new Hashtable();
            ht.Add("@uid", CurrentSession.UserID);
            ht.Add("@remindid", remindid);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"update iRemindPerson set isdeleted=1,modifydate=getdate(),modifyid=@uid where  
                                    remindid=@remindid and personid in(" + ids + ")");
                count = db.ExecuteNoneQuery(sql, ht);
                if (count > 0)
                {
                    db.Commit();
                    base.ReturnResultJson("true", "删除成功！");
                }
            }
            base.ReturnResultJson("false", "删除失败！");
        }
        /// <summary>
        /// 删除门店
        /// </summary>
        private void DelDept()
        {
            string ids = Request["delID"].Trim(',');
            string remindid = Request["remindid"];
            ids = ids.Replace("'", "''");
            string sql = "";
            int count = 0;
            Hashtable ht = new Hashtable();
            ht.Add("@uid", CurrentSession.UserID);
            ht.Add("@remindid", remindid);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"update iRemindDept set isdeleted=1, modifydate=getdate(),modifyid=@uid where  
                                    remindid=@remindid and deptid in(" + ids + ")");
                count = db.ExecuteNoneQuery(sql, ht);
                if (count > 0)
                {
                    db.Commit();
                    base.ReturnResultJson("true", "删除成功！");
                }
            }
            base.ReturnResultJson("false", "删除失败！");
        }
        /// <summary>
        /// 点击修改弹出门店提醒信息窗口时填充该条记录的信息
        /// </summary>
        private void GetWarningFormInfo()
        { 
            string remindid = Request ["ID"];
            string AllDept=Request["AllDept"];
            Hashtable ht = new Hashtable();
            ht.Add("@remindid",remindid);
            string sql = "";
            DataTable dt = new DataTable();
            string result = "";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                sql = string.Format(@"select ID,Title,datebegin AS StartTime,dateend AS EndTime,
                                    isenabled AS Action,MemoInfo,Alldept from ideptreminders
                                    where isdeleted=0 and ID=@remindid ");
                dt = db.ExecuteQuery(sql, ht);
            }
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(result);
            Response.End();
        }
    }
}