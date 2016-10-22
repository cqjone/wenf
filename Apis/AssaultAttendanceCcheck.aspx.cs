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
    public partial class AssaultAttendanceCcheck : AuthBasePage
    {

        BllApi.AttendanceMgr kqgl = new BllApi.AttendanceMgr();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string json = string.Empty;

                switch (Request["actionName"])
                {
                    case "getAssaultData":
                        json = getAssaultData();
                        break;
                  
                    default:

                        break;
                }

                Response.Write(json);
                Response.End();
            }
        }

        /// <summary>
        /// 获取信息
        /// </summary>
        /// <returns></returns>
        private string getAssaultData()
        {
            string result = string.Empty;
            string mydate = string.Empty;
            if (Request["mydate"] != "")
            {
                mydate = DateTime.Parse(Request["mydate"]).ToString("yyyy-MM-dd");
            }
            int hour =0;
            if (Request["hour"] != "")
            {
                hour =int.Parse( Request["hour"]);
            }
            int minute = 0;
            if (Request["minute"] != "")
            {
                minute = int.Parse(Request["minute"]);
            }
            string depid = string.Empty;
            if (Request["depid"] != "")
            {
                depid = Request["depid"];
            }

            int error = 0;
            if (Request["errorTime"] != "")
            {
                error = int.Parse(Request["errorTime"]);
            }

            //string mydate = "2014-08-05";

            /**
             * 误差
             * */
            //int error = 10;

            //hour = 9;
            //minute = 20;

            DateTime resultTime = DateTime.Parse(mydate+" "+hour+":"+minute);

            string sdatetime = resultTime.AddMinutes(-error).ToString();
           
            string edatetime = resultTime.AddMinutes(+error).ToString();
          



            try
            {
                Hashtable prams = new Hashtable();


//                string sql = @"select ko.突击抽查照片,SUBSTRING ( CONVERT(varchar(100), ko.拍照时间, 24), 0, 6 ) 拍照时间,k.WorkMode 排班, f.Code 工号, f.Title 姓名, f.Age 年龄, f.DeptID 部门ID,
//                                    c.Code 部门编码, c.Title 部门名称, f.Sex 性别, g.Title 职务, f.Mobile 手机,
//                                    SUBSTRING ( CONVERT(varchar(100), min(b.CheckinTime), 24), 0, 6 )上班时间,
//                                    min(CONVERT(varchar(10), b.CheckinTime, 120) + '/' + b.PhotoFileName)as 上班照片
//	                                from iEmployee  f 
//	                                join iDept as c on c.ID=f.DeptID 
//	                                join bRegist as b on b.EmployeeID=f.ID ";

//                                    if (!string.IsNullOrEmpty(depid))
//                                    {
//                                        sql = sql + " and b.DeptID=@depid ";
//                                    }
//                                    else
//                                    {
//                                        sql = sql + " and b.DeptID=f.DeptID ";
//                                    }

//                                    sql=sql+@" join iDuty as g on g.ID=f.DutyID
//	                                 join bCheckinSchedule as k on k.EmployeeID=f.ID ";

//                                    if (!string.IsNullOrEmpty(depid))
//                                    {
//                                        sql = sql + " and k.DeptID=@depid ";
//                                    }
//                                    else
//                                    {
//                                        sql = sql + " and k.DeptID=f.DeptID ";
//                                    }   
                                            
                                
                                  
//                                    /**
//                                     *抽查照片sql 
//                                     **/
//                                    sql = sql + @" left join (  select a.ID,min(b.CheckinTime) as 拍照时间,min(CONVERT(varchar(10), b.CheckinTime, 120) + '/' + b.PhotoFileName)as 突击抽查照片 from bRegist b
//                                     join iEmployee a on ";
//                                    if (!string.IsNullOrEmpty(depid))
//                                    {
//                                        sql = sql + " b.EmployeeID = a.ID where a.DeptID =@depid ";
//                                    }
//                                    else
//                                    {
//                                        sql = sql + " b.EmployeeID = a.ID where a.DeptID = b.DeptID  ";
//                                    }   

//                                    sql=sql+ @" and @SchouDate < b.CheckinTime and   b.CheckinTime < @EchouDate
//                                      group by a.ID
//                                      ) as ko on
//                                     ko.ID=f.ID";

//                                    sql = sql + @" where  f.IsDeleted = 0 ";

//                                    sql = sql + @" and datediff(DAY , b.CheckinTime,@date)=0 and datediff(DAY , k.ScheduleDate,@date)=0  
//                                        group by CONVERT(varchar(10), b.CheckinTime, 120), CONVERT(varchar(10), k.ScheduleDate, 120),
//                                        c.Title,f.Code,f.Title,f.Sex,g.Title,f.Mobile,c.Code,f.Age,k.WorkMode,f.DeptID,ko.突击抽查照片,ko.拍照时间";
                String sql = @"SELECT b.EmployeeID,b.上班时间,b.上班照片,ko .突击抽查照片 , SUBSTRING ( CONVERT ( varchar( 100 ), ko .拍照时间 , 24 ), 0, 6 ) as 拍照时间 ,
                            k .WorkMode 排班, f . Code 工号 , f . Title 姓名 , f . Age 年龄 , f . DeptID 部门 ,
                            c .Code 部门编码, c. Title 部门名称 , f . Sex 性别 , g .Title 职务, f. Mobile 手机
                            FROM iEmployee f
                            JOIN iDept AS c ON c. ID= f . DeptID
                            JOIN iDuty AS g ON g. ID= f . DutyID
                            left Join bCheckinSchedule k on k. EmployeeID =f . ID and k . DeptID = @depid
                            and DATEDIFF ( d, k .ScheduleDate , @date)= 0
                            left join (select b . EmployeeID, SUBSTRING ( CONVERT( varchar (100 ), min ( b .CheckinTime ), 24 ), 0, 6 )上班时间 ,
                                           min (CONVERT (varchar ( 10), b. CheckinTime , 120 ) + '/' + b . PhotoFileName ) AS 上班照片
                                       from bRegist b where b .DeptID =  @depid
                                          and datediff (DAY , b . CheckinTime , @date )=0 group by b .EmployeeID
                            ) b on f .ID = b .EmployeeID
                            LEFT JOIN (SELECT a. ID ,
                                   min (b .CheckinTime ) AS 拍照时间, min ( CONVERT ( varchar (10 ), b . CheckinTime, 120 ) + '/' + b .PhotoFileName )AS 突击抽查照片
                                   FROM bRegist b
                                   JOIN iEmployee a ON b .EmployeeID = a . ID
                                   WHERE a .DeptID = @depid
                                          AND @SchouDate < b .CheckinTime
                                          AND b .CheckinTime <@EchouDate
                                   GROUP BY a. ID ) AS ko ON ko . ID = f . ID
                            WHERE f .IsDeleted = 0 and f.state in ('在岗','待报道') AND f .DeptID = @depid Order By f.Code ASC";

                  prams.Add("@date", mydate);
                  prams.Add("@depid", depid);
                  prams.Add("@SchouDate", sdatetime);
                  prams.Add("@EchouDate", edatetime);
                  DataTable dt = kqgl.GetAll(sql, prams);
                if (dt.Rows.Count != 0)
                {
                    result = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
                }

            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
        
    }
       
}