using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using Newtonsoft.Json;

namespace BeautyPointWeb.Apis
{
    public partial class GTTTPeriods : System.Web.UI.Page
    {
        BllApi.AuditPersonTreatment AuditPerson = new BllApi.AuditPersonTreatment();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string json = string.Empty;

                switch (Request["actionName"])
                {
                    case "getSelectDate":
                        json = getSelectDate();
                        break;
                    case "insertDate":
                         insertDate();
                        break;
                    case "insertAlone":
                        json = insertAlone();
                        break;
                    case "getdate":
                        json = getdate();
                        break;
                    case "delGTTTPeriodsDate":
                        json = delGTTTPeriodsDate();
                        break;
                        
                    default:
                        break;
                }

                Response.Write(json);
                Response.End();
            }
        }

        public string insertAlone()
        {
            int count = 0;
            Hashtable pramss = new Hashtable();

            string result = "";
            string EmpID = Request["EmpId"];
            string periods = Request["periods"];
            pramss.Add("EmpID", EmpID);
            pramss.Add("periods", periods);
            string Virity = "select ID from bGTTTPeriods where IsDeleted !=1 and EmployeeID=@EmpID and NearPeriods=@periods ";

            DataTable verityok = AuditPerson.GetList(Virity, pramss, ref count, 3); 

            if (verityok.Rows.Count != 0)
            {
                result = "此期数已经存在此员工";
            }
            else
            {


                Hashtable prams = new Hashtable();
                prams.Add("EmpID", EmpID);
                string sql = @"select a . ID, d.ID 区域ID, c.ID 门店ID,a.ID 人员ID,a.Code 工号,
                a.Title 姓名 , b . Title 职务 ,b.ID 职务ID 
                   from
                iEmployee a  
                inner  join iDuty b on a . DutyID = b. ID
                inner join iDept c on c.ID =a.DeptID
                inner join iArea d on d.ID=c.AreaID
                where a.IsDeleted!=1 and a.ID=@EmpID";
                DataTable dt = AuditPerson.GetList(sql, prams, ref count, 3);
                if (dt.Rows.Count != 0)
                {

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        string insersql = @"INSERT INTO bGTTTPeriods
           ([AreaID]
           ,[DepID]
           ,[EmployeeID]
            ,EmployeeCode
           ,[EmployeeName]
           ,[DutyID]
           ,[NearPeriods]
           ,[CreateID]
           ,[CreateDate]
           ,[ModifyID]
           ,[ModifyDate]
           ,[IsDeleted])
     VALUES
           ('" + dt.Rows[i]["区域ID"] + "','" + dt.Rows[i]["门店ID"] + "','" + dt.Rows[i]["人员ID"] + "','" + dt.Rows[i]["工号"] + "','" + dt.Rows[i]["姓名"] + "','" + dt.Rows[i]["职务ID"] + "','" + periods + "',null,'" + DateTime.Now + "',null,null,0)";

                        int ok = AuditPerson.ExecuteNonQuery(insersql);
               
                    }
                }
                else
                {
                    result = "不符合添加培训要求或者此期数已经存在此员工" ;
                }
            }
            return result;
        }


        /// <summary>
        /// 保存弹出框传回来的值！
        /// </summary>
        public void insertDate()
        {
            string data = Request["UpdateGTTT"];
            string ModifyID = Request["sid"];
            string periods = Request["periods"];
            Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";

            for (int i = 0; i < arr.ToArray().Count(); i++)
            {
                string[] str = arr.ToArray()[i].ToString().Split(',');
             sql+= @"INSERT INTO bGTTTPeriods
           ([AreaID]
           ,[DepID]
           ,[EmployeeID]
            ,EmployeeCode
           ,[EmployeeName]
           ,[DutyID]
           ,[NearPeriods]
           ,[CreateID]
           ,[CreateDate]
           ,[ModifyID]
           ,[ModifyDate]
           ,[IsDeleted])
     VALUES
           ('" + str[0] + "','" + str[1] + "','" + str[2] + "','" + str[3] + "','" + str[4] + "','" + str[5] + "','" + periods + "',null,'" + DateTime.Now + "',null,null,0);";
            }
            int ok = AuditPerson.ExecuteNonQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }
        /// <summary>
        /// 删除数据
        /// </summary>
        public string delGTTTPeriodsDate()
        {
            int ID = Convert.ToInt16(Request["id"]);
            string sql = "update bGTTTPeriods set IsDeleted=1 where ID=" + ID;
            AuditPerson.ExecuteNonQuery(sql);
            return getdate();
        }
        /// <summary>
        /// 查询数据
        /// </summary>
        /// <returns></returns>
        public string getdate()
        {
            string result = string.Empty;
            try
            {
                string periodsNum = Request["periods"];
                string EmpID = Request["EmpID"];
                int count = 0;
                Hashtable prams = new Hashtable();
                prams.Add("periods", periodsNum);
                string sql = @"select a . ID,d.Title 区域 , c.Title 门店, a.EmployeeCode 工号, a.EmployeeName 姓名, b.Title 职务, a.NearPeriods 最近期数 from
                bGTTTPeriods a   
                inner join iDuty b on b. ID= a.DutyID 
             left  join iDept c on c.ID=a.DepID
            left  join iArea d on d. ID =a.AreaID
               where a.IsDeleted!=1 and NearPeriods=@periods";
                if (!string.IsNullOrEmpty(EmpID))
                {
                    sql += " and c.EmployeeID=" + EmpID;
                }
                DataTable dt = AuditPerson.GetList(sql, prams, ref count, 3);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{totalCount:" + count + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
        /// <summary>
        /// 根据门店的索引查询数据
        /// </summary>
        /// <returns></returns>
        public string getSelectDate()
        {
            string result = string.Empty;
            try
            {
                int count = 0;
                Hashtable prams = new Hashtable();
                int ID = string.IsNullOrEmpty(Request["queryID"]) ? 0 : Convert.ToInt16(Request["queryID"]);
                int periods = string.IsNullOrEmpty(Request["periods"]) ? 0 : Convert.ToInt16(Request["periods"]);
                prams.Add("ID", ID);
                prams.Add("periods", periods);
                string sql = @" select a . ID, d.ID 区域ID, c.ID 门店ID,a.ID 人员ID,a.Code 工号,
                a.Title 姓名 , b . Title 职务 ,b.ID 职务ID 
                   from
                iEmployee a  
                inner  join iDuty b on a . DutyID = b. ID
                inner join iDept c on c.ID =a.DeptID
                inner join iArea d on d.ID=c.AreaID
                where a.IsDeleted!=1
                and  c.ID=@ID and a.ID not in (select EmployeeID from bGTTTPeriods WHERE  NearPeriods=@periods)";
                DataTable dt = AuditPerson.GetList(sql, prams, ref count, 3);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{totalCount:" + count + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
    }
}
