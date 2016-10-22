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
    public partial class AuditPersonTreatment : System.Web.UI.Page
    {
        BllApi.AuditPersonTreatment AuditPerson = new BllApi.AuditPersonTreatment();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string json = string.Empty;

                switch (Request["actionName"])
                {
                    case "getDate":
                        json = GetDate();
                        break;
                    case "GetAttendanceList":
                        json = GetAttendanceList();
                        break;
                    case "GetBaseList":
                        json = GetBaseList();
                        break;
                    case "GetSubsidyList":
                        json = GetSubsidyList();
                        break;
                    case "GetBonusList":
                        json = GetBonusList();
                        break;
                    case "updateDataAttendance":
                        updateDataAttendance();
                        break;
                    case "updateData":
                        UpdateData();
                        break;
                    case "updateDataSubsidy":
                        UpdateDataSubsidy();
                        break;
                    case "updateDataBonus":
                        UpdateDataBonus();
                        break;
                    case "updateDataSubsidyRemark":
                        UpdateDataSubsidyRemark();
                        break;
                    case "updateDataBonusRemark":
                        UpdateDataBonusRemark();
                        break;
                    default:

                        break;
                }

                Response.Write(json);
                Response.End();
            }
        }



        /// <summary>
        /// 获取年月份
        /// </summary>
        public string GetDate()
        {
            string result = string.Empty;
            try
            {
                DataTable tb = new DataTable();
                tb.Columns.Add("Value");
                tb.Columns.Add("Title");

                Hashtable prams = new Hashtable();
                int count = 0;
                string sql = @"select * from (
select left(CONVERT(varchar(100), GETDATE(), 23 ),7) as Value,CAST(YEAR(GETDATE()) as nvarchar(4))+'年'+CAST(Month(GETDATE() ) as nvarchar(2))+'月' as Title  from iSubsidyLevel
 union 
select distinct left(CONVERT(varchar(100), Period, 23 ),7) as Value,CAST(Year as nvarchar(4))+'年'+CAST(Month as nvarchar(2))+'月' as Title  from iSubsidyLevel
) a order by a.Value desc ";
                DataTable dt = AuditPerson.GetList(sql, prams, ref count, 2);
                foreach (DataRow rw in dt.Rows)
                {
                    DataRow dr = tb.NewRow();
                    dr["Title"] = rw["Title"];
                    dr["Value"] = rw["Value"];
                    tb.Rows.Add(dr);
                }
                result = Newtonsoft.Json.JsonConvert.SerializeObject(tb);
            }
            catch (Exception ex)
            {

            }
            return result;
        }

        /// <summary>
        /// 获取前台级别汉字变换int
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public string GetGrade(string str)
        {
            string strDate = string.Empty;
            if (str == "实习生")
                strDate = "1";
            if (str == "初级")
                strDate = "2";
            if (str == "中级")
                strDate = "3";
            if (str == "高级")
                strDate = "4";
            if (str == "普通")
                strDate = "5";
            return strDate;
        }

        /// <summary>
        /// 获取前台周期汉字变换int
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public string GetBaseCycle(string str)
        {
            string strDate = string.Empty;
            if (str == "每天")
                strDate = "1";
            if (str == "每月")
                strDate = "2";
            return strDate;
        }

        /// <summary>
        /// 判断是否为空
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public int IsFlaseNull(string str)
        {
            if (!string.IsNullOrEmpty(str))
            {
                return int.Parse(str);
            }
            else
            {
                return 0;
            }
        }


        /// <summary>
        /// 保存考勤标准
        /// </summary>
        public void updateDataAttendance()
        {
            string data = Request["Attendancerecords"];
            string ModifyID = Request["sid"];
            //Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string[] strList =data.Split(',');
            string sql = "";
            //for (int m = 0; m < arr.Count; m++)
            //{
            //    string ID = arr[m]["ID"].ToString();
            //    int WorkDays = IsFlaseNull(arr[m]["标准工作日"].ToString());
            //    int LocalMoveDays = IsFlaseNull(arr[m]["本市搬家日"].ToString());
            //    int OtherMoveDays = IsFlaseNull(arr[m]["跨市搬家日"].ToString());

            string WorkDays = string.IsNullOrEmpty(strList[1]) ? null : strList[1];
            string LocalMoveDays = string.IsNullOrEmpty(strList[2]) ? null : strList[2];
            string OtherMoveDays = string.IsNullOrEmpty(strList[3]) ? null : strList[3];
            string str = @"update iAttendanceLevel set ModifyDate = getDate(),ModifyID ='" +  ModifyID + "',WorkDays ='" + strList[1] +
                "',LocalMoveDays='" + strList[2] +
                "',OtherMoveDays='" + strList[3] +
                            "' where id  =" + int.Parse(strList[0]) + ";";
            sql += str;
            //}
            int ok = AuditPerson.ExecuteNonQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }

        #region 已废除功能，暂不用
        
     

        /// <summary>
        /// 保存补贴标准备注
        /// </summary>
        public void UpdateDataSubsidyRemark()
        {
            string data = Request["UpdateSubsidyarray"];
            string ModifyID = Request["sid"];
            //Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";

            int ID = int.Parse(data.Split('[')[1].Split(']')[0].Split(',')[0].Split('"')[0]);
            string Remark = data.Split('[')[1].Split(']')[0].Split(',')[1].Split('"')[1];
            string str = @"update iSubsidyLevel set ModifyDate = getDate(),ModifyID ='" + ModifyID + "', Remark='" + Remark +
                            "' where id  =" + ID + ";";
            sql += str;
            int ok = AuditPerson.ExecuteNonQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }

        /// <summary>
        /// 保存奖金标准备注
        /// </summary>
        public void UpdateDataBonusRemark()
        {
            string data = Request["UpdateBonusarray"];

            string ModifyID = Request["sid"];
            //Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";
            int ID = int.Parse(data.Split('[')[1].Split(']')[0].Split(',')[0].Split('"')[0]);
            string Remark = data.Split('[')[1].Split(']')[0].Split(',')[1].Split('"')[1];

            string str = @"update iBonusLevel set ModifyDate = getDate(),ModifyID ='" + ModifyID + "', Remark='" + Remark +
                            "' where id  =" + ID + ";";
            sql += str;

            int ok = AuditPerson.ExecuteNonQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }


        #endregion

        #region 更新数据

        /// <summary>
        /// 保存工资标准数据
        /// </summary>
        public void UpdateData()
        {
            string data = Request["records"];
            string ModifyID = Request["sid"];
            Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";
            for (int m = 0; m < arr.Count; m++)
            {

                string ID = arr[m]["ID"].ToString();
                string Position = arr[m]["职位"].ToString();
                int Grade = IsFlaseNull(GetGrade(arr[m]["级别"].ToString()));
                int BasicWage = IsFlaseNull(arr[m]["基本工资"].ToString());
                int BaseCycle = IsFlaseNull(GetBaseCycle(arr[m]["基本工资周期"].ToString()));
                int ManageWage = IsFlaseNull(arr[m]["管理费(每店)"].ToString());
                int SeniorityPay = IsFlaseNull(arr[m]["工龄工资(每年)"].ToString());
                int MaxSeniorityPay = IsFlaseNull(arr[m]["工龄工资封顶"].ToString());
                int DeductWages = IsFlaseNull(arr[m]["扣生活费"].ToString());
                int Dayoff = IsFlaseNull(arr[m]["休息日(天)"].ToString());
                string Remark = arr[m]["备注"].ToString();


                string str = @"update iSalaryLevel set ModifyDate = getDate(),ModifyID ='" + ModifyID + "', Position='" + Position + "',Grade='" + Grade + "',BasicWage='" + BasicWage +
                               "',BaseCycle='" + BaseCycle + "',ManageWage='" + ManageWage + "',SeniorityPay='" + SeniorityPay + "',MaxSeniorityPay='" + MaxSeniorityPay +
                               "',DeductWages='" + DeductWages +
                               "',Dayoff='" + Dayoff +
                                 "',Remark='" + Remark +
                                "' where id  =" + ID + ";";
                sql += str;

            }
            int ok = AuditPerson.ExecuteNonQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }

        /// <summary>
        /// 保存补贴标准数据
        /// </summary>
        public void UpdateDataSubsidy()
        {
            string data = Request["Subsidyrecords"];
            string ModifyID = Request["sid"];
            Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";
            for (int m = 0; m < arr.Count; m++)
            {
                string ID = arr[m]["ID"].ToString();
                int SubsidyMoney = IsFlaseNull(arr[m]["补贴金额(元/天)"].ToString());
                string Remark = arr[m]["备注"].ToString();
                string str = @"update iSubsidyLevel set ModifyDate = getDate(),ModifyID ='" + ModifyID + "', SubsidyMoney='" + SubsidyMoney +
                             "',Remark='" + Remark +
                                "' where id  =" + ID + ";";
                sql += str;
            }
            int ok = AuditPerson.ExecuteNonQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }

        /// <summary>
        /// 保存奖金标准数据
        /// </summary>
        public void UpdateDataBonus()
        {
            string data = Request["Bonusrecords"];
            string ModifyID = Request["sid"];
            Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";
            for (int m = 0; m < arr.Count; m++)
            {


                string ID = arr[m]["ID"].ToString();
                int StartIndex = IsFlaseNull(arr[m]["StartIndex"].ToString());
                int EndIndex = IsFlaseNull(arr[m]["EndIndex"].ToString());
                int BonusIndex = IsFlaseNull(arr[m]["BonusIndex"].ToString());
                string Remark = arr[m]["备注"].ToString();
                string str = @"update iBonusLevel set ModifyDate = getDate(),ModifyID ='" + ModifyID + "', StartIndex='" + StartIndex + "',EndIndex='" + EndIndex + "',BonusIndex='" + BonusIndex +
                               "',Remark='" + Remark +
                               "' where id  =" + ID + ";";
                sql += str;
            }
            int ok = AuditPerson.ExecuteNonQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }

        #endregion



        #region 获取上月数据，并复制本月没有数据的上月数据
        
      

        /// <summary>
        /// 获取工资标准--GetList最后一个参数为分页做判断公用一个方法
        /// </summary>
        /// <returns></returns>
        private string GetBaseList()
        {
            string result = string.Empty;
            try
            {
                int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
                int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);

                int count = 0;

                Hashtable prams = new Hashtable();
                prams.Add("year", year);
                prams.Add("Month", month);

                //验证是否存在当月数据，不存在自动添加上月数据
                string VeritySql = "select * from iSalaryLevel where IsDelete!=1 and Year=@year and Month=@Month";
                DataTable Veritydt = AuditPerson.GetList(VeritySql, prams, ref count, 1);
                if (Veritydt.Rows.Count == 0)
                {
                    string InsetSql = @"insert into iSalaryLevel select [Position]
           ,[Grade]
           ,[BasicWage]
           ,[BaseCycle]
           ,[ManageWage]
           ,[SeniorityPay]
           ,[MaxSeniorityPay]
           ,[DeductWages]
           ,[Dayoff]
           ,[CreateID]
           ,[CreateDate]
           ,[ModifyID]
           ,[ModifyDate]
           ,[IsDelete]
           ,[Remark]
           ,GETDATE()
             ,Year ( getdate ())
      , month ( getdate()) from iSalaryLevel where datediff(m,Period,getdate())=1";
                    int ok = AuditPerson.ExecuteNonQuery(InsetSql);

                }

                string sql = @"select ID,Position 职位,
                case
                when Grade=1 then '实习生' 
                when Grade=2 then '初级' 
                when Grade=3 then '中级' 
                when Grade=4 then '高级' 
                when Grade=5 then '普通' 
                end
                级别,
                BasicWage 基本工资,
                case
                when BaseCycle=1 then '每天' 
                when BaseCycle=2 then '每月' 
                end
                基本工资周期,
                ManageWage '管理费(每店)',SeniorityPay '工龄工资(每年)',MaxSeniorityPay 工龄工资封顶,DeductWages 扣生活费,Dayoff '休息日(天)', Remark 备注 from iSalaryLevel where IsDelete!=1 and Year=@year and Month=@Month ";


                DataTable dt = AuditPerson.GetList(sql, prams, ref count, 1);
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
        /// 获取补贴标准
        /// </summary>
        /// <returns></returns>
        private string GetSubsidyList()
        {
            string result = string.Empty;
            try
            {
                int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
                int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
                Hashtable prams = new Hashtable();
                prams.Add("year", year);
                prams.Add("Month", month);
                int count = 0;

                string VeritySql = "select * from iSubsidyLevel where IsDelete!=1 and Year=@year and Month=@Month";
                DataTable Veritydt = AuditPerson.GetList(VeritySql, prams, ref count, 2);
                if (Veritydt.Rows.Count == 0)
                {
                    string InsetSql = @"insert into iSubsidyLevel select [SubsidyType]
           ,[SubsidyMoney]
           ,[CreateID]
           ,[CreateDate]
           ,[ModifyID]
           ,[ModifyDate]
           ,[IsDelete]
           ,[Remark]
           ,GETDATE()
             ,Year ( getdate ())
      , month ( getdate()) from iSubsidyLevel where datediff(m,Period,getdate())=1";
                    int ok = AuditPerson.ExecuteNonQuery(InsetSql);
                }

                string sql = "select ID,SubsidyType 补贴类型,SubsidyMoney '补贴金额(元/天)',Remark 备注 from iSubsidyLevel where IsDelete!=1 and Year=@year and Month=@Month";

                DataTable dt = AuditPerson.GetList(sql, prams, ref count, 2);
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
        /// 获取奖金标准
        /// </summary>
        /// <returns></returns>
        private string GetBonusList()
        {
            string result = string.Empty;
            try
            {
                int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
                int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
                Hashtable prams = new Hashtable();
                prams.Add("year", year);
                prams.Add("Month", month);
                int count = 0;

                string VeritySql = "select * from iBonusLevel where IsDelete!=1 and Year=@year and Month=@Month";
                DataTable Veritydt = AuditPerson.GetList(VeritySql, prams, ref count, 2);
                if (Veritydt.Rows.Count == 0)
                {
                    string InsetSql = @"insert into iBonusLevel select [StartIndex]
           ,[EndIndex]
           ,[BonusIndex]
           ,[CreateID]
           ,[CreateDate]
           ,[ModifyID]
           ,[ModifyDate]
           ,[IsDelete]
           ,[Remark]
           ,GETDATE()
            ,Year ( getdate ())
      , month ( getdate()) from iBonusLevel where datediff(m,Period,getdate())=1";
                    int ok = AuditPerson.ExecuteNonQuery(InsetSql);
                }




                string sql = "select ID,StartIndex,EndIndex, BonusIndex,Remark 备注 from iBonusLevel where IsDelete!=1 and Year=@year and Month=@Month ";

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
        /// 获取考勤标准
        /// </summary>
        /// <returns></returns>
        private string GetAttendanceList()
        {
            string result = string.Empty;
            try
            {
                string data = Request["array"];
                string[] strList = data.Split(',');

                int year = int.Parse(strList[0]);
                int month = int.Parse(strList[1]);
                Hashtable prams = new Hashtable();
                prams.Add("year", year);
                prams.Add("Month", month);
                int count = 0;

                string VeritySql = "select * from iAttendanceLevel where IsDelete!=1 and Year=@year and Month=@Month";
                DataTable Veritydt = AuditPerson.GetList(VeritySql, prams, ref count, 2);
                if (Veritydt.Rows.Count == 0)
                {
                    string InsetSql = @"declare @NatureDays int set @NatureDays =  (select DATEDIFF(dd,getdate(),DATEADD(mm, 1, getdate())))
        insert into iAttendanceLevel SELECT 
		@NatureDays
      ,[WorkDays] 
      ,[LocalMoveDays] 
      ,[OtherMoveDays] 
      ,[CreateID]
      ,[CreateDate]
      ,[ModifyID]
      ,[ModifyDate]
      ,[IsDelete]
      ,GETDATE()
       ,Year ( getdate ())
      , month ( getdate())
       from iAttendanceLevel where datediff(m,Period,getdate())=1";
                    int ok = AuditPerson.ExecuteNonQuery(InsetSql);
                }
                string sql = @"SELECT  ID
      ,[NatureDays] 月份自然日
      ,[WorkDays] 标准工作日
      ,[LocalMoveDays] 本市搬家日
      ,[OtherMoveDays] 跨市搬家日
        FROM [iAttendanceLevel]
    where IsDelete!=1 and Year=@year and Month=@Month ";
                DataTable dt = AuditPerson.GetList(sql, prams, ref count, 3);
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    result += dt.Rows[0][i] + ",";
                }
                //result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                //result = "{totalCount:" + count + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
        #endregion

    }
}
