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
    public partial class WorkTimesSetting : System.Web.UI.Page
    {
        BllApi.AuditPersonTreatment AuditPerson = new BllApi.AuditPersonTreatment();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string jsons = string.Empty;
                switch (Request["actionName"])
                {

                    case "getdate":
                        jsons = getdate();
                        break;
                    case "getPeriod":
                        jsons = getPeriod();
                        break;
                    case "updateDataWork":
                        updateDataWork();
                        break;


                    default:
                        break;
                }

                Response.Write(jsons);
                Response.End();
            }
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
        /// 修改工作年限
        /// </summary>
        public void updateDataWork()
        {
            string data = Request["Workyrecords"];
            string ModifyID = Request["sid"];
            Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";
            for (int m = 0; m < arr.Count; m++)
            {
                string ID = arr[m]["ID"].ToString();
                int LeveEnumID = IsFlaseNull(GetGrade(arr[m]["级别"].ToString()));
                int WorkTimesYear = IsFlaseNull(arr[m]["工龄年份"].ToString());
                int WorkTimesMonth = IsFlaseNull(arr[m]["工龄月份"].ToString());
                int EntryYear = IsFlaseNull(arr[m]["入职年份"].ToString());
                int EntryMonth = IsFlaseNull(arr[m]["入职月份"].ToString());
                string Remark = arr[m]["备注"].ToString();

                string str = @"update iWorkTimesSetting set ModifyDate = getDate(),ModifyID ='" + ModifyID + "', LeveEnumID='" + LeveEnumID + "',WorkTimesYear='" + WorkTimesYear + "',WorkTimesMonth='" + WorkTimesMonth +
                               "',EntryYear='" + EntryYear + "',EntryMonth='" + EntryMonth +
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
        /// 获取年月份
        /// </summary>
        public string getPeriod()
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
select left(CONVERT(varchar(100), GETDATE(), 23 ),7) as Value,CAST(YEAR(GETDATE()) as nvarchar(4))+'年'+CAST(Month(GETDATE() ) as nvarchar(2))+'月' as Title  from iWorkTimesSetting
 union 
select distinct left(CONVERT(varchar(100), Period, 23 ),7) as Value,CAST(Year as nvarchar(4))+'年'+CAST(Month as nvarchar(2))+'月' as Title  from iWorkTimesSetting
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
        /// 获取工龄设定数据
        /// </summary>
        /// <returns></returns>
        private string getdate()
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
                string VeritySql = "select * from iWorkTimesSetting where IsDelete!=1 and Year=@year and Month=@Month";
                DataTable Veritydt = AuditPerson.GetList(VeritySql, prams, ref count, 1);
                if (Veritydt.Rows.Count == 0)
                {
                    string InsetSql = @"insert into iWorkTimesSetting  SELECT 
       [AreaID]
      ,[RegionID]
      ,[DepID]
      ,[EmployeeCode]
      ,[EmployeeName]
      ,[DutyID]
      ,0
      ,[EntryYear]
      ,[EntryMonth]
      ,[WorkTimesYear]
      ,[WorkTimesMonth]
      ,[CreateID]
      ,[CreateDate]
      ,[ModifyID]
      ,[ModifyDate]
      ,[IsDelete]
      ,Year ( getdate ())
      , month ( getdate())
      ,GETDATE()
      ,[Remark]
  FROM iWorkTimesSetting  where datediff(m,Period,getdate())=1";
                    int ok = AuditPerson.ExecuteNonQuery(InsetSql);

                    string CirculationSql = "select ID from iWorkTimesSetting where IsDelete!=1 and Year=@year and Month=@Month";
                    DataTable IDList = AuditPerson.GetList(CirculationSql, prams, ref count, 1);
                     string UpdateYearWorkTimesSql = "";
                    string UpdateMonthWorkTimesSql ="";

                    for (int i = 0; i < IDList.Rows.Count; i++)
			        {
			UpdateYearWorkTimesSql+= @"update iWorkTimesSetting set WorkTimesYear=WorkTimesYear+(WorkTimesMonth+1) /12 where Year='" + DateTime.Now.Year + "' and Month='" + DateTime.Now.Month +
                 "'and ID  =" + IDList.Rows[i][0] + ";";
            UpdateYearWorkTimesSql+=@"update iWorkTimesSetting set WorkTimesMonth=(WorkTimesMonth+1) %12 where Year='" + DateTime.Now.Year + "' and Month='" + DateTime.Now.Month +
                 "'and ID  =" + IDList.Rows[i][0] + ";";
                         
			        }
                   
                    int updateYear = AuditPerson.ExecuteNonQuery(UpdateYearWorkTimesSql);
                    int updateMonth = AuditPerson.ExecuteNonQuery(UpdateMonthWorkTimesSql);
                }

                //                string sql = @"select ID,Position 职位,
                //                case
                //                when Grade=1 then '实习生' 
                //                when Grade=2 then '初级' 
                //                when Grade=3 then '中级' 
                //                when Grade=4 then '高级' 
                //                when Grade=5 then '普通' 
                //                when Grade=6 then '资深' 
                //                end
                //                级别,
                //                BasicWage 基本工资,
                //                case
                //                when BaseCycle=1 then '每天' 
                //                when BaseCycle=2 then '每月' 
                //                end
                //                基本工资周期,
                //                ManageWage '管理费(每店)',SeniorityPay '工龄工资(每年)',MaxSeniorityPay 工龄工资封顶,DeductWages 扣生活费,Dayoff '休息日(天)', Remark 备注 from iSalaryLevel where IsDelete!=1 and Year=@year and Month=@Month ";


                string sql = @"select a . ID, d .Title 区域, c .Title 大区, c .Title 门店, a .EmployeeCode 工号,
                a. EmployeeName 姓名 , b . Title 职务 ,
                    case
                when a.LeveEnumID=0 then '' 
                when a.LeveEnumID=1 then '实习生' 
                when a.LeveEnumID=2 then '初级' 
                when a.LeveEnumID=3 then '中级' 
                when a.LeveEnumID=4 then '高级' 
                when a.LeveEnumID=5 then '普通' 
                end
                     级别 ,a . EntryYear 入职年份 , a .EntryMonth 入职月份,
                 WorkTimesYear 工龄年份 , WorkTimesMonth 工龄月份 , a . Remark 备注 from
                iWorkTimesSetting a   inner join iDuty b on a . DutyID = b. ID
                inner join iDept c on c. ID =a . DepID
                left join iArea d on d. ID =c . AreaID
               where IsDelete!=1 and Year=@year and Month=@Month order by 大区,区域,门店,工号";
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
    }
}
