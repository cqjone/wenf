using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using Newtonsoft;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace BeautyPointWeb.Apis
{
    public partial class AttendanceMgr : AuthBasePage
    {
        BllApi.AttendanceMgr kqgl = new BllApi.AttendanceMgr();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string json = string.Empty;
                switch (ActionName)
                {

                    case "getQdepSchedule":
                        GetQdepSchedule();
                        break;
                    case "getsixDate":
                        json = GetsixDate();
                        break;
                    case "queryMakeup":
                        QueryMakeup();
                        break;
                    case "queryEmployeeName":
                        json = QueryEmployeeName();
                        break;
                    case "queryAllEmployeeName":
                        json = QueryAllEmployeeName();
                        break;
                    case "makeupDel":
                        json = MakeupDel();
                        break;
                    case "makeupAdd":
                        MakeupAdd();
                        break;
                    case "queryDeptAttendanceDetails":
                        QueryDeptAttendanceDetails();
                        break;
                    case "queryDeptAttendanceStatistics":
                        QueryDeptAttendanceStatistics();
                        break;
                    case "updateSchedule":
                        UpdateSchedule();
                        break;
                    case "querySchedule":
                        QuerySchedule();
                        break;
                    case "queryEmplyeeInform":
                        json = QueryEmplyeeInform();
                        break;
                    case "queryEmployeeImg":
                        json = QueryEmployeeImg();
                        break;
                    case "queryAttendancePhotoCheck":
                        QueryAttendancePhotoCheck();
                        break;
                    case "getEmp":
                        GetEmp();
                        break;
                    case "getDept":
                        GetDept();
                        break;

                    case "searchCheckinImag":
                        searchCheckinImag();
                        break;

                    case "generateMakeupCode":
                        GenerateMakeCode();
                        break;

                    case "getWorkModeSet":
                        getWorkModeSet();
                        break;
                    case "queryNoScheduleReport":
                        QueryNoScheduleReport();
                        break;
                    case "update2":
                        Update2();
                        break;


                }

                Response.Write(json);
                Response.End();
            }
        }
        private BllApi.BaseApi basebll = new BllApi.BaseApi();
        /// <summary>
        /// 获取补录表格数据
        /// </summary>



        public void getWorkModeSet()
        {
            String sql = "select * from iWorkMode where IsDeleted=0";
            DataTable dt = this.GetAll(sql, new Hashtable());
            String result = "";
            if (dt != null && dt.Rows.Count > 0)
            {
                result = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            Response.Write(result);

        }

        public void QueryNoScheduleReport()
        {
            String sql = @"select 
	                    e.ID, e.Code, e.Title, 
	                    d.Title as Dept, t.Title Duty,e.Mobile,
	                    CONVERT(varchar(100),(select max(h.BillDate) from hDeduct as h where h.RefEmplID=e.ID ),23) as LastBusinessDate,
	                    CONVERT(varchar(100),(select max(r.CheckinTime) from bRegist as r where r.EmployeeID=e.ID ),23) as LastScheduleDate,
	                    CONVERT(varchar(100),(select max(s.ScheduleDate) from bCheckinSchedule as s where s.EmployeeID=e.ID ),23) as LastCheckinDate

                    from iEmployee as e, iDept as d, iDuty as t 
                    where e.IsDeleted=0 and e.State in ('在岗','待报道') 
                    and d.IsDeleted=0 and d.DeptStatus=1 and d.DeptTypeID=1 and d.AreaID<>27
                    and e.ID not in (select EmployeeID from bRegist where CheckinTime>DateAdd(Day,-30,GetDate()) )
                    and e.ID not in (select EmployeeID from bCheckinSchedule where ScheduleDate>DateAdd(Day,-30,GetDate()) )
                    and e.DeptID=d.ID and e.DutyID=t.ID
                    order by e.Code";

            DataTable dt = this.GetAll(sql, new Hashtable());
            String msg = "{totalCount:" + dt.Rows.Count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            Response.Write(msg);
            Response.End();
        }

        public String Update2()
        {
            String ids = Request["ids"];
            String result = "";
            if (!String.IsNullOrEmpty(ids))
            {
                String sql = @"update iEmployee
                        set IsDeleted=2
                        where 
                        IsDeleted=0 
                        and ID in (" + ids + @")
                        and State in ('在岗','待报道') 
                        and DeptID in (
	                        select ID from iDept where IsDeleted=0 and DeptTypeID=1 and DeptStatus=1 and AreaID<>27
                        )
                        and ID not in (
                            select EmployeeID from bRegist where CheckinTime>DateAdd(Day,-30,GetDate()))
                        and ID not in (
                            select EmployeeID from bCheckinSchedule where ScheduleDate>DateAdd(Day,-30,GetDate())
                        )";
                kqgl.ExecuteNoneQuery(sql);
                result = "{success:true,msg:'设置成功！'}";
            }
            else
            {
                result = "{success:false,msg:'操作失败！'}";
            }
            return result;

        }
        public void GenerateMakeCode()
        {
            String deptId = Request["DeptID"];
            String vaildate = Request["VailDate"];
            String result = "";

            String code = "";
            if (!String.IsNullOrEmpty(deptId) && !String.IsNullOrEmpty(vaildate))
            {
                DateTime date = Convert.ToDateTime(vaildate);
                Hashtable prams = new Hashtable();
                prams.Add("@DeptID", deptId);
                prams.Add("@VailDate", date.ToString("yyyy-MM-dd"));

                String sql = @"select a.ID,a.Code,CONVERT(varchar(100), a.VailDate , 23) as VailDate,b.Title as Dept from bMakeupCode a inner join iDept b on a.DeptID=b.ID
                        where a.IsDeleted=0 and DeptID=@DeptID and VailDate=@VailDate";
                DataTable dt = this.GetAll(sql, prams);
                if (dt != null && dt.Rows.Count > 0)
                {
                    result = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
                }
                else
                {
                    Random seed = new Random();
                    code = seed.Next(10000) + "";
                    String sqlInsert = @"insert into bMakeupCode(CreateDate,CreateID,ModifyDate,ModifyID,IsDeleted,DeptID,Vaildate,Code) 
                                   values(GetDate(),0,GetDate(),0,0,@DeptID,@VailDate,@Code);";
                    prams.Add("@Code", code);

                    int isOK = kqgl.ExecuteNoneQuery(sqlInsert, prams);
                    if (isOK > 0)
                    {
                        dt = this.GetAll(sql, prams);

                        result = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
                    }

                }
                Response.Write(result);
            }
        }

        //根据日期 获取今天星期几
        public string CaculateWeekDay(int y, int m, int d)
        {
            if (m == 1) m = 13;
            if (m == 2) m = 14;
            int week = (d + 2 * m + 3 * (m + 1) / 5 + y + y / 4 - y / 100 + y / 400) % 7 + 1;
            string weekstr = "";
            switch (week)
            {
                case 1: weekstr = "1"; break;
                case 2: weekstr = "2"; break;
                case 3: weekstr = "3"; break;
                case 4: weekstr = "4"; break;
                case 5: weekstr = "5"; break;
                case 6: weekstr = "6"; break;
                case 7: weekstr = "7"; break;
            }

            return weekstr;
        }

        private void searchCheckinImag()
        {
            try
            {
                string msg = "";
                String empCode = Request["EmployeeCode"];
                String checkinTime = Request["checkinTime"];
                Hashtable prams = new Hashtable();
                prams.Add("Code", empCode);
                prams.Add("CheckinTime", checkinTime);
                String sql = @"select CheckinTime,CONVERT(varchar(10), a.CheckinTime, 120 )+'/'+a.PhotoFileName  as  PhotoFileName from bRegist  a inner join iEmployee b on a.EmployeeID=b.ID
                                and b.Code=@Code
                    where RecordMode=0 and datediff(d,CheckinTime,@CheckinTime)=0 order by CheckinTime";
                DataTable dt = basebll.GetPageData(sql, prams);
                // msg = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
                msg = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                Response.Write(msg);
                Response.End();

            }
            catch (Exception ex)
            {

            }
        }

        #region 注销

        //        private void searchCheckinImag() 
        //        {
        //            try
        //            {
        //                string msg = "";
        //                String empCode = Request["EmployeeCode"];
        //                String checkinTime = Request["checkinTime"];
        //                String NumRow = Request["dataRow"];
        //                String NumCol = Request["dataCol"];

        //                Hashtable prams = new Hashtable();
        //                prams.Add("Code",empCode);
        //                prams.Add("CheckinTime", checkinTime);
        //                String sql = @"select a.workMode, a.Reason,a.DeptID,c.Title,CheckinTime,CONVERT(varchar(10), a.CheckinTime, 120 )+'/'+a.PhotoFileName  as  PhotoFileName from bRegist  a inner join iEmployee b on a.EmployeeID=b.ID
        //                            inner join iDept as c on c.ID=a.DeptID                                
        //                            and b.Code=@Code
        //                    where   datediff(d,CheckinTime,@CheckinTime)=0 order by CheckinTime";
        //                DataTable dt = basebll.GetPageData(sql, prams);

        //                int year=int.Parse(checkinTime.Split('-')[0]);

        //                int month=int.Parse(checkinTime.Split('-')[1]);

        //                int days = System.Threading.Thread.CurrentThread.CurrentUICulture.Calendar.GetDaysInMonth(year, month);


        //                string jsNum = CaculateWeekDay(year,month,1);

        //                int DayDate = int.Parse(jsNum);

        //                int hang=int.Parse(NumRow);

        //                int lie=int.Parse(NumCol);
        //                int NumLine = 0;
        //                if (hang != 0)
        //                {
        //                     NumLine = (7 - int.Parse(jsNum)+1) + (hang - 1) * 7 + lie;
        //                }
        //                else
        //                {
        //                    if (lie >= DayDate)
        //                    {
        //                      NumLine= lie - DayDate+1;
        //                    }
        //                }



        //                Hashtable dayHas = new Hashtable();
        //                dayHas.Add("depid", dt.Rows[0]["DeptID"].ToString());
        //                dayHas.Add("empid", empCode);

        //                //从排班表中获取相应的数据，计算出点击的天数，获取相应的状态。
        //                string workstatus = " select WorkMode from bCheckinSchedule where DeptID=@depid and EmployeeID=@empid";

        //                DataTable statusTable = basebll.GetPageData(workstatus, dayHas);
        //                //string Scheduling = "(未排班)";
        //                //if (statusTable.Rows.Count > 0)
        //                //{
        //                //    int status = int.Parse(statusTable.Rows[NumLine]["WorkMode"].ToString());
        //                //    if (status == -1)
        //                //    {
        //                //        Scheduling = "缺勤";
        //                //    }
        //                //    if (status ==2)
        //                //    {
        //                //        Scheduling = "休息";
        //                //    }
        //                //    if (status == 3)
        //                //    {
        //                //        Scheduling = "请假";
        //                //    }
        //                //    if (status == 4)
        //                //    {
        //                //        Scheduling = "未排班";
        //                //    }
        //                //    if (status == 5)
        //                //    {
        //                //        Scheduling = "通班";
        //                //    }
        //                //    if (status == 41)
        //                //    {
        //                //        Scheduling = "补录";
        //                //    }

        //                //}

        //                DataTable result = new DataTable();

        //                result.Columns.Add("Reason");
        //                result.Columns.Add("Title");
        //                result.Columns.Add("CheckinTime");
        //                result.Columns.Add("PhotoFileName");
        //                result.Columns.Add("CheckinTimeEnd");
        //                result.Columns.Add("Scheduling");
        //               // msg = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";

        //                //一张照片的时候没有下班时间,只有上班时间。
        //                if (dt.Rows.Count== 1)
        //                {
        //                    DataRow dr = result.NewRow();

        //                    dr["Reason"] = dt.Rows[0]["Reason"].ToString();
        //                    dr["Title"] = dt.Rows[0]["Title"].ToString();
        //                    dr["CheckinTime"] = dt.Rows[0]["CheckinTime"].ToString();
        //                    dr["PhotoFileName"] = dt.Rows[0]["PhotoFileName"].ToString();
        //                    dr["CheckinTimeEnd"] ="";
        //                    dr["Scheduling"] = GetWorkType(dt.Rows[0]["workMode"].ToString());
        //                    result.Rows.Add(dr);
        //                }
        //                //两张照片的时候取第一张照片的部门,取最后一张照片，和最后一张照片的时间为下班时间。
        //                if (dt.Rows.Count > 1)
        //                {
        //                    var endNum = dt.Rows.Count - 1;
        //                    DataRow dr = result.NewRow();
        //                    dr["Reason"] = dt.Rows[endNum]["Reason"].ToString();
        //                    dr["Title"]=dt.Rows[0]["Title"].ToString();
        //                    dr["CheckinTime"]=dt.Rows[0]["CheckinTime"].ToString();
        //                    dr["PhotoFileName"]=dt.Rows[endNum]["PhotoFileName"].ToString();
        //                    dr["CheckinTimeEnd"]=dt.Rows[endNum]["CheckinTime"].ToString();
        //                    dr["Scheduling"] = GetWorkType(dt.Rows[0]["workMode"].ToString());
        //                    result.Rows.Add(dr);
        //                }
        //                msg = Newtonsoft.Json.JsonConvert.SerializeObject(result);
        //                Response.Write(msg);
        //                Response.End();

        //            }
        //            catch (Exception ex) 
        //            {

        //            }
        //        }
        #endregion

        private void QueryMakeup()
        {
            string msg = "";
            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]);
            int DeptID = CurrentSession.DeptID;
            int day = DateTime.Now.Day;
            String strTimeFilter = " and datediff(Month,a.CheckinTime,getdate())=0";
            if (day < 5)
            {
                strTimeFilter = " and datediff(Month,a.CheckinTime,getdate())<=1";
            }
            String sql = @"select a.ID as ID ,CONVERT(varchar(100), a.CheckinTime , 23) as CheckinDate,CONVERT(varchar(100), a.CheckinTime , 24) as CheckinTime,a.RecordMode as RecordMode, 
                           b.Code as EmployeeCode,b.Title as EmployeeName,a.RecordMode as RecordModeDel,a.Reason as Reason from bRegist a,iEmployee b 
                            where a.EmployeeID = b.ID and a.IsDeleted = 0 " + strTimeFilter + @" and a.DeptID = @DeptID  order by  CONVERT(varchar(100), CheckinTime, 120) desc  ";
            Hashtable prams = new Hashtable();
            prams.Add("@DeptID", DeptID);
            DataTable dt = basebll.GetPageData(sql, prams);
            //int totalCount = basebll.GetCount(sql, prams);
            //DataTable dt = basebll.GetPageData(sql, "order by CheckinTime desc", start + 1, limit, prams);

            sql = "";
            msg = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            Response.Write(msg);
            Response.End();
        }


        /// <summary>
        /// 获取该门店下员工姓名
        /// </summary>
        private string QueryEmployeeName()
        {
            string result = string.Empty;
            try
            {
                string Code = Request["Code"].Trim();
                string msg = "";
                string sql = "";
                int DeptID = CurrentSession.DeptID;
                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(Code))
                {
                    sql = "select isnull(Title,'') from iEmployee where Code = @Code and IsDeleted = 0 and DeptID=@DeptID ";
                    prams.Add("@Code", Code);
                    prams.Add("@DeptID", DeptID);
                    if (kqgl.Scalar(sql, prams) == null)
                    {
                        msg = "";
                    }
                    else
                    {
                        msg = kqgl.Scalar(sql, prams).ToString();
                    }
                }
                result = "{success:true,msg:\"" + msg + "\"}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
        /// <summary>
        /// 获取所有员工姓名
        /// </summary>
        private string QueryAllEmployeeName()
        {
            string result = string.Empty;
            try
            {
                string Code = Request["Code"].Trim();
                DataTable dt = new DataTable();
                string sql = "";
                int DeptID = CurrentSession.DeptID;
                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(Code))
                {
                    sql = "select isnull(Title,'') as Title,ID from iEmployee where Code = @Code and IsDeleted = 0  ";
                    prams.Add("@Code", Code);
                    dt = kqgl.GetAll(sql, prams);
                }
                result = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
        /// <summary>
        /// 补录删除
        /// </summary>
        /// <returns></returns>
        private string MakeupDel()
        {
            string result = string.Empty;
            try
            {
                string ID = Request["ID"].Trim();
                Hashtable prams = new Hashtable();
                string sql = "update bRegist set IsDeleted = 1 where ID = @ID and IsDeleted = 0 ";
                prams.Add("@ID", ID);
                int isOK = kqgl.ExecuteNoneQuery(sql, prams);
                if (isOK > 0)
                {
                    result = "{success:true,msg:'删除成功！'}";
                }
                else
                {
                    result = "{success:false,msg:'删除异常！'}";
                }

            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
        /// <summary>
        /// 添加补录
        /// </summary>
        /// <returns></returns>
        private void MakeupAdd()
        {
            string result = string.Empty;
            string comboYear = Request["searchYear"].Trim();
            string comboMonth = Request["searchMonth"].Trim();
            string comboDay = Request["searchDay"].Trim();
            string comboHour = Request["searchHour"].Trim();
            string comboMinute = Request["searchMinute"].Trim();
            string EmployeeCode = Request["EmployeeCode"].Trim();
            string Reason = Request["Reason"].Trim();
            string AuthorCode = Request["AuthorCode"].Trim();
            string checkinTime = comboYear + "/" + comboMonth + "/" + comboDay + " " + comboHour + ":" + comboMinute + ":00";
            int DeptID = CurrentSession.DeptID;

            DataTable dt = new DataTable();
            Hashtable prams = new Hashtable();
            if (string.IsNullOrEmpty(EmployeeCode) || EmployeeCode.Length != 8)
            {
                ReturnResultJson("false", "请输入一个有效的8位工号！");
            }
            string sqlEmp = "select ID,DeptID from iEmployee where Code=@Code and IsDeleted = 0 ";
            prams.Add("@Code", EmployeeCode);
            dt = kqgl.GetAll(sqlEmp, prams);
            if (dt.Rows.Count == 0)
            {
                ReturnResultJson("false", "请输入一个有效的8位工号！");

            }
            String sqlVailDate = "select * from bMakeupCode where DeptID=@DeptID and  datediff(d,VailDate,@CheckinDate)=0 and Code=@Code and IsDeleted=0";
            Hashtable prams1 = new Hashtable();
            prams1.Add("@DeptID", DeptID);
            prams1.Add("@CheckinDate", comboYear + "-" + comboMonth + "-" + comboDay);
            prams1.Add("@Code", AuthorCode);
            int qty = kqgl.GetCount(sqlVailDate, prams1);
            if (qty <= 0)
            {
                ReturnResultJson("false", "验证码不正确请联系IT部！");
                return;
            }
            string TimeStart = comboYear + "/" + comboMonth + "/" + comboDay + " 00:00:00";
            string TimeEnd = comboYear + "/" + comboMonth + "/" + comboDay + " 23:59:59";
            string sqlExist = "select count(1) from bRegist where EmployeeID = @EmployeeID and IsDeleted = 0 and CheckinTime between @TimeStart and @TimeEnd  ";
            Hashtable pramsExist = new Hashtable();
            pramsExist.Add("@EmployeeID", dt.Rows[0]["ID"]);
            pramsExist.Add("@TimeStart", TimeStart);
            pramsExist.Add("@TimeEnd", TimeEnd);

            int count = Convert.ToInt32(kqgl.Scalar(sqlExist, pramsExist));
            if (count > 0)
            {
                ReturnResultJson("false", "该员工此天已有补录记录！");
                return;
            }
            string sql = @"insert into bRegist (CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,DeptID,EmployeeID,
                        CheckinTime,PhotoFileName,RecordMode,Reason,TimeSource,AuthorCode ) values (@CreateID,getdate(),@ModifyID,getdate(),0,@DeptID,@EmployeeID,
                        @CheckinTime,'',1,@Reason,4,@AuthorCode) ";
            Hashtable addPrams = new Hashtable();
            addPrams.Add("@CreateID", CurrentUser.Id);
            addPrams.Add("@ModifyID", CurrentUser.Id);
            addPrams.Add("@DeptID", DeptID);
            addPrams.Add("@EmployeeID", dt.Rows[0]["ID"]);
            addPrams.Add("@CheckinTime", checkinTime);
            addPrams.Add("@Reason", Reason);
            addPrams.Add("@AuthorCode", AuthorCode);

            int isOK = kqgl.ExecuteNoneQuery(sql, addPrams);
            if (isOK > 0)
            {
                ReturnResultJson("true", "添加补录成功！");
            }
            else
            {
                ReturnResultJson("false", "添加补录异常！");
            }
        }
        /// <summary>
        /// 查询门店考勤流水
        /// </summary>
        private void QueryDeptAttendanceDetails()
        {
            string msg = "";
            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]);
            String employeeId = Request["EmployeeID"];

            string urlName = Request["urlName"].Trim();
            String sql = "";
            Hashtable prams = new Hashtable();
            int searchYear = DateTime.Now.Year;
            if (!String.IsNullOrEmpty(Request["searchYear"]) && Request["searchYear"] != "0")
            {
                searchYear = Convert.ToInt32(Request["searchYear"]);
            }
            int searchMonth = DateTime.Now.Month;
            if (!String.IsNullOrEmpty(Request["searchMonth"]) && Request["searchMonth"] != "0")
            {
                searchMonth = Convert.ToInt32(Request["searchMonth"]);
            }
            if (urlName == "total")
            {
                int searchDept = 0;
                if (Request["searchDept"] != "")
                {
                    searchDept = Convert.ToInt32(Request["searchDept"]);
                }
                int searchEmp = 0;
                if (Request["searchEmp"] != "")
                {
                    searchEmp = Convert.ToInt32(Request["searchEmp"]);
                }
                //                sql = @"select  c.Title as Dept, a.ID as ID ,CheckinTime RealCheckinTime, CONVERT(varchar(100), a.CheckinTime , 23) as CheckinDate,CheckinTime,a.TimeSource as TimeSource ,a.RecordMode as RecordMode, 
                //                           b.Code as EmployeeCode,b.Title as EmployeeName,a.RecordMode as RecordModeDel,a.Reason as Reason,IsNull(PhotoFileName,'') as PhotoFileName from bRegist a,iEmployee b 
                //                            inner join iDept c on b.DeptID=c.ID
                //                            where a.EmployeeID = b.ID and a.IsDeleted = 0 ";


                sql = @"select  ISNULL(d.WorkMode,4) as WorkMode ,c.Title as Dept, a.ID as ID ,a.CheckinTime RealCheckinTime, CONVERT(varchar(100), a.CheckinTime , 23) as CheckinDate,a.CheckinTime,a.TimeSource as TimeSource ,a.RecordMode as RecordMode, 
                           b.Code as EmployeeCode,b.Title as EmployeeName,a.RecordMode as RecordModeDel,a.Reason as Reason,IsNull(PhotoFileName,'') as PhotoFileName from bRegist a
						   inner join iEmployee b on a.EmployeeID=b.id
                           inner join iDept c on a.DeptID=c.ID
                           left join bCheckinSchedule d on a.EmployeeID =d.EmployeeID and a.DeptID=d.DeptID 
                            and CONVERT(varchar(100), a.CheckinTime , 23)=CONVERT(varchar(100), d.ScheduleDate, 23)
                            and  d.IsDeleted=0 where 1=1 ";
                if (searchDept != 0)
                {
                    sql += " and a.DeptID =@searchDept ";
                    prams.Add("@searchDept", searchDept);

                }
                if (searchEmp != 0)
                {
                    sql += " and b.ID =@searchEmp ";
                    prams.Add("@searchEmp", searchEmp);

                }

                if (!String.IsNullOrEmpty(employeeId))
                {
                    sql += " and a.EmployeeID=@EmployeeID";
                    prams.Add("@EmployeeID", employeeId);

                }



            }
            else
            {
                int DeptID = CurrentSession.DeptID;
                sql = @"select   ISNULL(d.WorkMode,4) as WorkMode,a.ID as ID , CONVERT(varchar(100), a.CheckinTime , 23) as CheckinDate, a.CheckinTime,a.TimeSource as TimeSource ,a.RecordMode as RecordMode, 
                           b.Code as EmployeeCode,b.Title as EmployeeName,a.RecordMode as RecordModeDel,a.Reason as Reason ,IsNull(PhotoFileName,'') as PhotoFileName from bRegist a
                              inner join iEmployee b on a.EmployeeID = b.ID
                             left join bCheckinSchedule d on a.EmployeeID =d.EmployeeID and a.DeptID=d.DeptID 
                             and CONVERT(varchar(100), a.CheckinTime , 23)=CONVERT(varchar(100), d.ScheduleDate, 23)
                             and d.IsDeleted=0
                            where a.IsDeleted = 0  and a.DeptID = @DeptID";

                prams.Add("@DeptID", DeptID);
            }
            if (searchYear != 0)
            {
                sql += " and YEAR(a.CheckinTime) =@searchYear ";
                prams.Add("@searchYear", searchYear);

            }
            if (searchMonth != 0)
            {
                sql += " and MONTH(a.CheckinTime) =@searchMonth ";
                prams.Add("@searchMonth", searchMonth);

            }

            if (!String.IsNullOrEmpty(employeeId))
            {
                sql += " and a.EmployeeID=@EmployeeID";
                prams.Add("@EmployeeID", employeeId);

            }



            int totalCount = basebll.GetCount(sql, prams);
            DataTable dt = new DataTable();

            // DataTable dt = basebll.GetPageData(sql, "order by CheckinTime desc", start + 1, limit, prams);
            if (urlName == "total")
            {
                dt = basebll.GetPageData(sql, "order by  CONVERT(varchar(100), RealCheckinTime, 120) ASC", start + 1, limit, prams);
            }
            else
            {
                sql += " order by  CONVERT(varchar(100), a.CheckinTime, 120) ASC ";
                dt = this.GetAll(sql, prams);
            }

            if (dt != null)
            {
                dt.Columns.Add("DisplayCheckinTime");
            }
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                if (dr["CheckinTime"] != DBNull.Value)
                {
                    String checkinTime = dr["CheckinTime"].ToString();
                    dr["DisplayCheckinTime"] = DateTime.Parse(checkinTime).ToString("HH:mm:ss");
                }

            }
            msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            Response.Write(msg);
            Response.End();
        }
        /// <summary>
        /// 门店考勤统计
        /// </summary>
        /// 
        public DataTable GetAll(string sql, Hashtable prams)
        {
            using (DbCommon.DbUtil dbl = new DbCommon.DbUtil())
            {
                return dbl.ExecuteQuery(sql, prams);
            }
        }
//        private void QueryDeptAttendanceStatistics()
//        {
//            string msg = "";
//            int start = Convert.ToInt32(Request["start"]);
//            int limit = Convert.ToInt32(Request["limit"]);
//            string urlName = Request["urlName"].Trim();
//            String strFilterEmployee1 = "";
//            String strFilterEmployee2 = "";
//            String strFilterDept = "";
//            if (!String.IsNullOrEmpty(Request["searchDept"]))
//            {
//                strFilterDept = "  and a.DeptID = @DeptID ";
//            }
//            if (string.IsNullOrEmpty(strFilterDept) && urlName.Equals("dept"))
//            {
//                strFilterDept = "  and a.DeptID = @DeptID ";
//            }
//            Hashtable prams = new Hashtable();

//            int searchYear = DateTime.Now.Year;
//            if (!String.IsNullOrEmpty(Request["searchYear"]) && Request["searchYear"] != "0")
//            {
//                searchYear = Convert.ToInt32(Request["searchYear"]);
//            }
//            int searchMonth = DateTime.Now.Month;
//            if (!String.IsNullOrEmpty(Request["searchMonth"]) && Request["searchMonth"] != "0")
//            {
//                searchMonth = Convert.ToInt32(Request["searchMonth"]);
//            }
//            String periodDate = searchYear + "-" + searchMonth + "-01";

//            if (!String.IsNullOrEmpty(Request["searchEmp"]))
//            {
//                String employee = Request["searchEmp"];
//                strFilterEmployee1 = " and a.ID=@EmployeeID ";
//                strFilterEmployee2 = " and EmployeeID=@EmployeeID ";
//                prams.Add("@EmployeeID", employee);
//            }


//            string sqlEmployee = @"create table #tableEmployee(id int,code nvarchar(50),title nvarchar(50),DeptID int);
//                                    insert into #tableEmployee
//                                    select a.id,a.code,a.title,a.DeptID from iEmployee a,iDept b 
//                                    where a.DeptID = b.ID " + strFilterDept + @" and a.IsDeleted = 0 " + strFilterEmployee1 + @"
//                                    union
//                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bCheckinSchedule a,iEmployee b 
//                                    where    datediff(m,'" + periodDate + @"',ScheduleDate  )=0    " + strFilterDept + @" and  a.EmployeeID = b.ID  and a.IsDeleted = 0 " + strFilterEmployee2 + @"
//                                    union
//                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bRegist a,iEmployee b 
//                                    where a.EmployeeID = b.ID  and datediff(m,'" + periodDate + @"',CheckinTime)=0  " + strFilterDept + @" and a.IsDeleted = 0 " + strFilterEmployee2;

//            string sqlTable1 = @"create table #table1(employeeid int,employeecode nvarchar(50),employeeTitle nvarchar(50),DeptID int ,dayGoTo int);
//                                insert into #table1 
//                                select b.id,b.code,b.Title,a.DeptID,count(a.workMode) 
//                                from bCheckinSchedule a  right join #tableEmployee b
//                                on a.EmployeeID = b.ID and a.workMode = 0 and a.IsDeleted = 0 " + strFilterDept;

//            string sqlTable2 = @"create table #table2(employeeid int,DeptID int,Rest int);
//                                insert into #table2
//                                select b.id,a.DeptID,COUNT(a.workMode) from bCheckinSchedule a right join #tableEmployee b
//                                on a.EmployeeID = b.ID and a.workMode = 2 and a.IsDeleted = 0  " + strFilterDept;

//            string sqlTable3 = @"create table #table3(employeeid int,DeptID int,Leave int);
//                                insert into #table3
//                                select b.id,a.DeptID,COUNT(a.workMode) from bCheckinSchedule a right join #tableEmployee b
//                                on a.EmployeeID = b.ID and a.workMode = 3 and a.IsDeleted = 0  " + strFilterDept;

//            string sqlTable4 = @"create table #table4(employeeid int,DeptID int,realTo int);
//                                insert into #table4
//                                select b.id,a.DeptID,COUNT(a.RecordMode) from bRegist a right join #tableEmployee b
//                                on a.EmployeeID = b.ID  and a.IsDeleted = 0  " + strFilterDept;

//            string sqlTable5 = @"create table #table5(employeeid int,DeptID int,pSign int);
//                                insert into #table5
//                                select b.id,a.DeptID,COUNT(a.RecordMode) from bRegist a right join #tableEmployee b
//                                on a.EmployeeID = b.ID and a.RecordMode = 1 and a.IsDeleted = 0  " + strFilterDept;

//            string sqlTable6 = @"create table #table6(employeeid int,employeecode nvarchar(50),employeeTitle nvarchar(50),DeptID int,nightGoTo int);
//                                insert into #table6 
//                                select b.id,b.code,b.Title,a.DeptID,count(a.workMode) 
//                                from bCheckinSchedule a right join #tableEmployee b
//                                on a.EmployeeID = b.ID and a.workMode = 1 and a.IsDeleted = 0  " + strFilterDept;

//            string sqlTable7 = @"create table #table7(employeeid int,DeptID int,middleDay int);
//                                insert into #table7 
//                                select b.id,a.DeptID,count(a.workMode) 
//                                from bCheckinSchedule a right join #tableEmployee b
//                                on a.EmployeeID = b.ID and a.workMode =6 and a.IsDeleted = 0  " + strFilterDept;

//            string sqlTable8 = @"create table #table8(employeeid int,DeptID int, wholeDay int);
//                                insert into #table8 
//                                select b.id,a.DeptID int,count(a.workMode) 
//                                from bCheckinSchedule a right join #tableEmployee b
//                                on a.EmployeeID = b.ID and a.workMode = 5 and a.IsDeleted = 0  " + strFilterDept;

//            string sqlTable9 = @"create table #table9(employeeid int,DeptID int, Train int);
//                                insert into #table9 
//                                select b.id,a.DeptID int,count(a.workMode) 
//                                from bCheckinSchedule a right join #tableEmployee b
//                                on a.EmployeeID = b.ID and a.workMode = 7 and a.IsDeleted = 0  " + strFilterDept;



//            if (searchYear != 0)
//            {
//                sqlTable1 += " and YEAR(a.ScheduleDate) =@searchYear ";
//                sqlTable2 += " and YEAR(a.ScheduleDate) =@searchYear ";
//                sqlTable3 += " and YEAR(a.ScheduleDate) =@searchYear ";
//                sqlTable4 += " and YEAR(a.CheckinTime) =@searchYear ";
//                sqlTable5 += " and YEAR(a.CheckinTime) =@searchYear ";
//                sqlTable6 += " and YEAR(a.ScheduleDate) =@searchYear ";
//                sqlTable7 += " and YEAR(a.ScheduleDate) =@searchYear ";
//                sqlTable8 += " and YEAR(a.ScheduleDate) =@searchYear ";
//                sqlTable9 += " and YEAR(a.ScheduleDate) =@searchYear ";
//                prams.Add("@searchYear", searchYear);

//            }
//            if (searchMonth != 0)
//            {
//                sqlTable1 += " and MONTH(a.ScheduleDate) =@searchMonth ";
//                sqlTable2 += " and MONTH(a.ScheduleDate) =@searchMonth ";
//                sqlTable3 += " and MONTH(a.ScheduleDate) =@searchMonth ";
//                sqlTable4 += " and MONTH(a.CheckinTime) =@searchMonth ";
//                sqlTable5 += " and MONTH(a.CheckinTime) =@searchMonth ";
//                sqlTable6 += " and MONTH(a.ScheduleDate) =@searchMonth ";
//                sqlTable7 += " and MONTH(a.ScheduleDate) =@searchMonth ";
//                sqlTable8 += " and MONTH(a.ScheduleDate) =@searchMonth ";
//                sqlTable9 += " and MONTH(a.ScheduleDate) =@searchMonth ";
//                prams.Add("@searchMonth", searchMonth);
//            }



//            if (strFilterEmployee2 != "")
//            {
//                sqlTable1 += strFilterEmployee2;
//                sqlTable2 += strFilterEmployee2;
//                sqlTable3 += strFilterEmployee2;
//                sqlTable4 += strFilterEmployee2;
//                sqlTable5 += strFilterEmployee2;
//                sqlTable6 += strFilterEmployee2;
//                sqlTable7 += strFilterEmployee2;
//                sqlTable8 += strFilterEmployee2;
//                sqlTable9 += strFilterEmployee2;


//            }

//            //// sqlTable1 += " Group By a.DeptID";
//            //sqlTable2 += " Group By a.DeptID";
//            //sqlTable3 += " Group By a.DeptID";
//            //sqlTable4 += " Group By a.DeptID";
//            //sqlTable5 += " Group By a.DeptID";
//            ////sqlTable6 += " Group By a.DeptID";
//            //sqlTable7 += " Group By a.DeptID";
//            //sqlTable8 += " Group By a.DeptID";
//            string sqlStr = "";
//            int DeptID = 0;
//            if (urlName == "total")
//            {

//                int searchEmp = 0;
//                int searchDept = 0;
//                if (Request["searchEmp"] != "")
//                {
//                    searchEmp = Convert.ToInt32(Request["searchEmp"]);
//                }
//                if (Request["searchDept"] != "")
//                {
//                    searchDept = Convert.ToInt32(Request["searchDept"]);
//                }
//                sqlStr = @"select  a.employeecode as EmployeeCode ,a.employeeTitle as EmployeeName,a.dayGoTo as DayGoTo,f.nightGoTo as NightGoTo,g.middleDay as MiddleDay,h.wholeDay as WholeDay,i.Train as Train
//                            ,convert(nvarchar(10),d.realTo)+'('+convert(nvarchar(10),e.pSign)+'补录)' as RealTo,b.Rest as Rest,c.Leave as Leave,0 as BeLate,0 as LeaveEarly,0 as Train,iDept.Title as DeptName
//                             from #table1 a,#table2 b,#table3 c,#table4 d,#table5 e,#table6 f,#table7 g,#table8 h,#table9 i,iDept
//                             
//                             where a.employeeid=b.employeeid and a.employeeid=c.employeeid 
//                            and iDept.ID = d.DeptID
//                             and a.employeeid = d.employeeid and a.employeeid = e.employeeid and a.employeeid=f.employeeid  and a.employeeid=g.employeeid  and a.employeeid=h.employeeid and  a.employeeid=i.employeeid
//                             and ISNULL(dayGoTo,0)+ISNULL(nightGoTo,0)+ISNULL(dayGoTo,0)+ISNULL(middleDay,0)+ISNULL(dayGoTo,0)+ISNULL(middleDay,0)+ISNULL(wholeDay,0)+ISNULL(Leave,0)+ISNULL(realTo,0)+ISNULL(Rest,0)+ISNULL(Train,0)>0";
//                if (searchDept != 0)
//                {
//                    DeptID = searchDept;
//                }
//                if (searchEmp != 0)
//                {
//                    //                    sqlEmployee = @"create table #tableEmployee(id int,code nvarchar(50),title nvarchar(50),DeptID int);
//                    //                                    insert into #tableEmployee
//                    //                                    select a.id,a.code,a.title,a.DeptID from iEmployee a,iDept b 
//                    //                                    where a.DeptID = b.ID and a.id = @searchEmp and a.IsDeleted = 0
//                    //                                    union
//                    //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bCheckinSchedule a,iEmployee b 
//                    //                                    where a.EmployeeID = b.ID and b.ID = @searchEmp and a.IsDeleted = 0
//                    //                                    union
//                    //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bRegist a,iEmployee b 
//                    //                                    where a.EmployeeID = b.ID and a.EmployeeID = @searchEmp and a.IsDeleted = 0;";
//                    //                    prams.Add("@searchEmp", searchEmp);

//                }
//                if (searchDept == 0 && searchEmp == 0)
//                {
//                    //                    sqlEmployee = @"create table #tableEmployee(id int,code nvarchar(50),title nvarchar(50),DeptID int);
//                    //                                    insert into #tableEmployee
//                    //                                    select a.id,a.code,a.title,a.DeptID from iEmployee a,iDept b 
//                    //                                    where a.DeptID = b.ID and a.IsDeleted = 0
//                    //                                    union
//                    //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bCheckinSchedule a,iEmployee b 
//                    //                                    where a.EmployeeID = b.ID and a.IsDeleted = 0
//                    //                                    union
//                    //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bRegist a,iEmployee b 
//                    //                                    where a.EmployeeID = b.ID and a.IsDeleted = 0;";
//                }

//            }
//            else
//            {
//                sqlStr = @"select a.employeecode as EmployeeCode ,a.employeeTitle as EmployeeName,a.dayGoTo as DayGoTo,f.nightGoTo as NightGoTo,g.middleDay as MiddleDay,
//                             h.wholeDay as WholeDay,i.Train as Train,iDept.Title as DeptName,
//                                convert(nvarchar(10),d.realTo)+'('+convert(nvarchar(10),e.pSign)+'补录)' as RealTo,b.Rest as Rest,c.Leave as Leave,0 as BeLate,0 as LeaveEarly
//                             from #table1 a,#table2 b,#table3 c,#table4 d,#table5 e,#table6 f,#table7 g,#table8 h,#table9 i,iDept
//                             where a.employeeid=b.employeeid and a.employeeid=c.employeeid 
//                               and a.employeeid = d.employeeid and a.employeeid = e.employeeid and a.employeeid=f.employeeid  and a.employeeid=g.employeeid  and a.employeeid=h.employeeid and a.employeeid=i.employeeid
//                                and iDept.ID = d.DeptID
//                                and ISNULL(dayGoTo,0)+ISNULL(nightGoTo,0)+ISNULL(dayGoTo,0)+ISNULL(middleDay,0)+ISNULL(dayGoTo,0)+ISNULL(middleDay,0)+ISNULL(wholeDay,0)+ISNULL(Leave,0)+ISNULL(realTo,0)+ISNULL(Rest,0)>0";
//                DeptID = CurrentSession.DeptID;
//            }
//            if (DeptID != 0)
//            {
//                prams.Add("@DeptID", DeptID);
//            }
//            string strgroup = " group by a.DeptID,b.ID;";
//            string sqlCreate = sqlEmployee + sqlTable1 + " group by b.ID,b.Code,b.Title,a.DeptID;" + sqlTable6 + " group by b.ID,b.Code,b.Title,a.DeptID;" +
//                sqlTable2 + strgroup + sqlTable3 + strgroup + sqlTable4 + strgroup + sqlTable5 + strgroup + sqlTable7 + strgroup + sqlTable8 + strgroup + sqlTable9 + strgroup;
//            //int totalCount = kqgl.GetCount(sqlCreate,sqlStr, prams);
//            int totalCount = 0;
//            DataTable dt = new DataTable();
//            //if (totalCount > 0) 
//            //{
//            //    if (urlName == "total")
//            //    {
//            //        dt = kqgl.GetPageData(sqlCreate, sqlStr, "order by  employeecode", start + 1, limit, prams);
//            //    }
//            //    else
//            //    {
//            //        sqlStr += " order by EmployeeCode";
//            //        dt = this.GetAll(sqlCreate + sqlStr, prams);
//            //    }
//            //}
//            sqlStr += " order by EmployeeCode";
//            dt = this.GetAll(sqlCreate + sqlStr, prams);
//            if (dt != null)
//            {
//                totalCount = dt.Rows.Count;
//            }

//            sqlCreate = "";
//            sqlStr = "";
//            msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
//            Response.Write(msg);
//            Response.End();
//        }
        private void QueryDeptAttendanceStatistics()
        {
            string msg = "";
            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]);
            String export2Excel = Request["export2Excel"] + "";
            string urlName = Request["urlName"].Trim();
            String strFilterEmployee1 = "";
            String strFilterEmployee2 = "";
            String strFilterDept = "";
            if (!String.IsNullOrEmpty(Request["searchDept"]) && Request["searchDept"] != "undefined")
            {
                strFilterDept = "  and a.DeptID = @DeptID ";
            }
            if (string.IsNullOrEmpty(strFilterDept) && urlName.Equals("dept"))
            {
                strFilterDept = "  and a.DeptID = @DeptID ";
            }
            Hashtable prams = new Hashtable();

            int searchYear = DateTime.Now.Year;
            if (!String.IsNullOrEmpty(Request["searchYear"]) && Request["searchYear"] != "0")
            {
                searchYear = Convert.ToInt32(Request["searchYear"]);
            }
            int searchMonth = DateTime.Now.Month;

            if (!String.IsNullOrEmpty(Request["searchMonth"]) && Request["searchMonth"] != "0")
            {
                searchMonth = Convert.ToInt32(Request["searchMonth"]);
            }
            String periodDate = searchYear + "-" + searchMonth + "-01";

            if (!String.IsNullOrEmpty(Request["searchEmp"]))
            {
                String employee = Request["searchEmp"];
                strFilterEmployee1 = " and a.ID=@EmployeeID ";
                strFilterEmployee2 = " and EmployeeID= " + Request["searchEmp"];
                prams.Add("@EmployeeID", employee);
            }
            DateTime dtPeriodDate = DateTime.Parse(periodDate);
            int days = DateTime.DaysInMonth(dtPeriodDate.Year, dtPeriodDate.Month);
            //            string sqlEmployee = @"create table #tableEmployee(id int,code nvarchar(50),title nvarchar(50),DeptID int);
            //                                    insert into #tableEmployee
            //                                    select a.id,a.code,a.title,a.DeptID from iEmployee a,iDept b 
            //                                    where a.DeptID = b.ID " + strFilterDept + @" and a.IsDeleted = 0 " + strFilterEmployee1 + @"
            //                                    union
            //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bCheckinSchedule a,iEmployee b 
            //                                    where    datediff(m,'" + periodDate + @"',ScheduleDate  )=0    " + strFilterDept + @" and  a.EmployeeID = b.ID  and a.IsDeleted = 0 " + strFilterEmployee2 + @"
            //                                    union
            //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bRegist a,iEmployee b 
            //                                    where a.EmployeeID = b.ID  and datediff(m,'" + periodDate + @"',CheckinTime)=0  " + strFilterDept + @" and a.IsDeleted = 0 " + strFilterEmployee2;

            string sqlEmployee = @"create table #tableEmployee(id int,code nvarchar(50),title nvarchar(50),DeptID int);
                                    insert into #tableEmployee
                                   SELECT a.EmployeeID,a.code,a.title,a.DeptID
                                        FROM
                                            (SELECT SUM(WorkMode) AS Num,
                                                    b.Code,
                                                    b.Title,
                                                    EmployeeID,
		                                            b.DeptID
                                             FROM bCheckinSchedule a,
                                                  iEmployee b
                                             WHERE datediff(m,'" + periodDate + @"',ScheduleDate)=0
                                                 AND a.EmployeeID=b.ID and a.Isdeleted=0 " + strFilterEmployee2 + @"
                                                 " + strFilterDept + @"
                                             GROUP BY EmployeeID,
                                                      b.Code,
			                                            b.DeptID,
                                                      b.Title) a
                                        WHERE a.Num!=4*" + days + @" 
                                        union 
                                            select a.EmployeeID,b.Code,b.Title,b.DeptID from bRegist a,iEmployee b 
                                             where a.EmployeeID = b.ID  and datediff(m,'" + periodDate + @"',CheckinTime)=0  " + strFilterDept + @" and a.IsDeleted = 0 " + strFilterEmployee2;







            string sqlTable1 = @"create table #table1(employeeid int,employeecode nvarchar(50),employeeTitle nvarchar(50),DeptID int ,dayGoTo int);
                                insert into #table1 
                                select b.id,b.code,b.Title,a.DeptID,count(a.workMode) 
                                from bCheckinSchedule a  right join #tableEmployee b
                                on a.EmployeeID = b.ID and a.workMode = 0 and a.IsDeleted = 0 " + strFilterDept;

            string sqlTable2 = @"create table #table2(employeeid int,DeptID int,Rest int);
                                insert into #table2
                                select b.id,a.DeptID,COUNT(a.workMode) from bCheckinSchedule a right join #tableEmployee b
                                on a.EmployeeID = b.ID and a.workMode = 2 and a.IsDeleted = 0  " + strFilterDept;

            string sqlTable3 = @"create table #table3(employeeid int,DeptID int,Leave int);
                                insert into #table3
                                select b.id,a.DeptID,COUNT(a.workMode) from bCheckinSchedule a right join #tableEmployee b
                                on a.EmployeeID = b.ID and a.workMode = 3 and a.IsDeleted = 0  " + strFilterDept;

            string sqlTable4 = @"create table #table4(employeeid int,DeptID int,realTo int);
                                insert into #table4
                                select b.id,a.DeptID,COUNT(distinct(CONVERT(varchar(10), a.CheckinTime, 120 ))) from bRegist a right join #tableEmployee b
                                on a.EmployeeID = b.ID  and a.IsDeleted = 0  " + strFilterDept;

            string sqlTable5 = @"create table #table5(employeeid int,DeptID int,pSign int);
                                insert into #table5
                                select b.id,a.DeptID,COUNT(distinct(CONVERT(varchar(10), a.CheckinTime, 120 ))) from bRegist a right join #tableEmployee b
                                on a.EmployeeID = b.ID and a.RecordMode = 1 and a.IsDeleted = 0  " + strFilterDept;

            string sqlTable6 = @"create table #table6(employeeid int,employeecode nvarchar(50),employeeTitle nvarchar(50),DeptID int,nightGoTo int);
                                insert into #table6 
                                select b.id,b.code,b.Title,a.DeptID,count(a.workMode) 
                                from bCheckinSchedule a right join #tableEmployee b
                                on a.EmployeeID = b.ID and a.workMode = 1 and a.IsDeleted = 0  " + strFilterDept;

            string sqlTable7 = @"create table #table7(employeeid int,DeptID int,middleDay int);
                                insert into #table7 
                                select b.id,a.DeptID,count(a.workMode) 
                                from bCheckinSchedule a right join #tableEmployee b
                                on a.EmployeeID = b.ID and a.workMode =6 and a.IsDeleted = 0  " + strFilterDept;

            string sqlTable8 = @"create table #table8(employeeid int,DeptID int, wholeDay int);
                                insert into #table8 
                                select b.id,a.DeptID int,count(a.workMode) 
                                from bCheckinSchedule a right join #tableEmployee b
                                on a.EmployeeID = b.ID and a.workMode = 5 and a.IsDeleted = 0  " + strFilterDept;

            string sqlTable9 = @"create table #table9(employeeid int,DeptID int, Train int);
                                insert into #table9 
                                select b.id,a.DeptID int,count(a.workMode) 
                                from bCheckinSchedule a right join #tableEmployee b
                                on a.EmployeeID = b.ID and a.workMode = 7 and a.IsDeleted = 0  " + strFilterDept;



            if (searchYear != 0)
            {
                sqlTable1 += " and YEAR(a.ScheduleDate) =@searchYear ";
                sqlTable2 += " and YEAR(a.ScheduleDate) =@searchYear ";
                sqlTable3 += " and YEAR(a.ScheduleDate) =@searchYear ";
                sqlTable4 += " and YEAR(a.CheckinTime) =@searchYear ";
                sqlTable5 += " and YEAR(a.CheckinTime) =@searchYear ";
                sqlTable6 += " and YEAR(a.ScheduleDate) =@searchYear ";
                sqlTable7 += " and YEAR(a.ScheduleDate) =@searchYear ";
                sqlTable8 += " and YEAR(a.ScheduleDate) =@searchYear ";
                sqlTable9 += " and YEAR(a.ScheduleDate) =@searchYear ";
                prams.Add("@searchYear", searchYear);

            }
            if (searchMonth != 0)
            {
                sqlTable1 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                sqlTable2 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                sqlTable3 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                sqlTable4 += " and MONTH(a.CheckinTime) =@searchMonth ";
                sqlTable5 += " and MONTH(a.CheckinTime) =@searchMonth ";
                sqlTable6 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                sqlTable7 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                sqlTable8 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                sqlTable9 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                prams.Add("@searchMonth", searchMonth);
            }



            if (strFilterEmployee2 != "")
            {
                sqlTable1 += strFilterEmployee2;
                sqlTable2 += strFilterEmployee2;
                sqlTable3 += strFilterEmployee2;
                sqlTable4 += strFilterEmployee2;
                sqlTable5 += strFilterEmployee2;
                sqlTable6 += strFilterEmployee2;
                sqlTable7 += strFilterEmployee2;
                sqlTable8 += strFilterEmployee2;
                sqlTable9 += strFilterEmployee2;


            }

            //// sqlTable1 += " Group By a.DeptID";
            //sqlTable2 += " Group By a.DeptID";
            //sqlTable3 += " Group By a.DeptID";
            //sqlTable4 += " Group By a.DeptID";
            //sqlTable5 += " Group By a.DeptID";
            ////sqlTable6 += " Group By a.DeptID";
            //sqlTable7 += " Group By a.DeptID";
            //sqlTable8 += " Group By a.DeptID";
            string sqlStr = "";
            int DeptID = 0;
            if (urlName == "total")
            {

                int searchEmp = 0;
                int searchDept = 0;
                if (Request["searchEmp"] != "" && Request["searchEmp"] != "undefined")
                {
                    searchEmp = Convert.ToInt32(Request["searchEmp"]);
                }
                if (Request["searchDept"] != "" && Request["searchDept"] != "undefined")
                {
                    searchDept = Convert.ToInt32(Request["searchDept"]);
                }
                //                sqlStr = @"select  a.employeecode as EmployeeCode ,a.employeeTitle as EmployeeName,a.dayGoTo as DayGoTo,f.nightGoTo as NightGoTo,g.middleDay as MiddleDay,h.wholeDay as WholeDay,i.Train as Train
                //                            ,convert(nvarchar(10),d.realTo)+'('+convert(nvarchar(10),e.pSign)+'补录)' as RealTo,b.Rest as Rest,c.Leave as Leave,0 as BeLate,0 as LeaveEarly,0 as Train,iDept.Title as DeptName
                //                             from #table1 a,#table2 b,#table3 c,#table4 d,#table5 e,#table6 f,#table7 g,#table8 h,#table9 i,iDept
                //                             
                //                             where a.employeeid=b.employeeid and a.employeeid=c.employeeid 
                //                            and iDept.ID = d.DeptID
                //                             and a.employeeid = d.employeeid and a.employeeid = e.employeeid and a.employeeid=f.employeeid  and a.employeeid=g.employeeid  and a.employeeid=h.employeeid and  a.employeeid=i.employeeid
                //                             and ISNULL(dayGoTo,0)+ISNULL(nightGoTo,0)+ISNULL(dayGoTo,0)+ISNULL(middleDay,0)+ISNULL(dayGoTo,0)+ISNULL(middleDay,0)+ISNULL(wholeDay,0)+ISNULL(Leave,0)+ISNULL(realTo,0)+ISNULL(Rest,0)+ISNULL(Train,0)>0";

                sqlStr = @"select  a.employeecode as EmployeeCode ,a.employeeTitle as EmployeeName,a.dayGoTo as DayGoTo,f.nightGoTo as NightGoTo,g.middleDay as MiddleDay,h.wholeDay as WholeDay,i.Train as Train
                            ,convert(nvarchar(10),d.realTo)+'('+convert(nvarchar(10),e.pSign)+'补录)' as RealTo,b.Rest as Rest,c.Leave as Leave,0 as BeLate,0 as LeaveEarly,0 as Train,iDept.Title as DeptName
                             from #table1 a 
                                    left join #table2 b on a.employeeid=b.employeeid
                                    left join #table3  c on a.employeeid=c.employeeid
                                    left join #table4  d on a.employeeid=d.employeeid
                                    left join #table5  e on a.employeeid=e.employeeid
                                    left join #table6  f on a.employeeid=f.employeeid
                                    left join #table7  g on a.employeeid=g.employeeid
                                    left join #table8  h on a.employeeid=h.employeeid
                                    left join #table9  i on a.employeeid=i.employeeid
                                    LEFT JOIN iDept ON isnull(a.DeptID,d.DeptID)=iDept.ID ";

                if (searchDept != 0)
                {
                    DeptID = searchDept;
                }
                if (searchEmp != 0)
                {
                    //                    sqlEmployee = @"create table #tableEmployee(id int,code nvarchar(50),title nvarchar(50),DeptID int);
                    //                                    insert into #tableEmployee
                    //                                    select a.id,a.code,a.title,a.DeptID from iEmployee a,iDept b 
                    //                                    where a.DeptID = b.ID and a.id = @searchEmp and a.IsDeleted = 0
                    //                                    union
                    //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bCheckinSchedule a,iEmployee b 
                    //                                    where a.EmployeeID = b.ID and b.ID = @searchEmp and a.IsDeleted = 0
                    //                                    union
                    //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bRegist a,iEmployee b 
                    //                                    where a.EmployeeID = b.ID and a.EmployeeID = @searchEmp and a.IsDeleted = 0;";
                    //                    prams.Add("@searchEmp", searchEmp);

                }
                if (searchDept == 0 && searchEmp == 0)
                {
                    //                    sqlEmployee = @"create table #tableEmployee(id int,code nvarchar(50),title nvarchar(50),DeptID int);
                    //                                    insert into #tableEmployee
                    //                                    select a.id,a.code,a.title,a.DeptID from iEmployee a,iDept b 
                    //                                    where a.DeptID = b.ID and a.IsDeleted = 0
                    //                                    union
                    //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bCheckinSchedule a,iEmployee b 
                    //                                    where a.EmployeeID = b.ID and a.IsDeleted = 0
                    //                                    union
                    //                                    select a.EmployeeID,b.Code,b.Title,b.DeptID from bRegist a,iEmployee b 
                    //                                    where a.EmployeeID = b.ID and a.IsDeleted = 0;";
                }

            }
            else
            {
                //                sqlStr = @"select a.employeecode as EmployeeCode ,a.employeeTitle as EmployeeName,a.dayGoTo as DayGoTo,f.nightGoTo as NightGoTo,g.middleDay as MiddleDay,
                //                             h.wholeDay as WholeDay,i.Train as Train,iDept.Title as DeptName,
                //                                convert(nvarchar(10),d.realTo)+'('+convert(nvarchar(10),e.pSign)+'补录)' as RealTo,b.Rest as Rest,c.Leave as Leave,0 as BeLate,0 as LeaveEarly
                //                             from #table1 a,#table2 b,#table3 c,#table4 d,#table5 e,#table6 f,#table7 g,#table8 h,#table9 i,iDept
                //                             where a.employeeid=b.employeeid and a.employeeid=c.employeeid 
                //                               and a.employeeid = d.employeeid and a.employeeid = e.employeeid and a.employeeid=f.employeeid  and a.employeeid=g.employeeid  and a.employeeid=h.employeeid and a.employeeid=i.employeeid
                //                                and iDept.ID = d.DeptID
                //                                and ISNULL(dayGoTo,0)+ISNULL(nightGoTo,0)+ISNULL(dayGoTo,0)+ISNULL(middleDay,0)+ISNULL(dayGoTo,0)+ISNULL(middleDay,0)+ISNULL(wholeDay,0)+ISNULL(Leave,0)+ISNULL(realTo,0)+ISNULL(Rest,0)>0";


                sqlStr = @"select a.employeecode as EmployeeCode ,a.employeeTitle as EmployeeName,a.dayGoTo as DayGoTo,f.nightGoTo as NightGoTo,g.middleDay as MiddleDay,
                             h.wholeDay as WholeDay,i.Train as Train,iDept.Title as DeptName,
                                convert(nvarchar(10),d.realTo)+'('+convert(nvarchar(10),e.pSign)+'补录)' as RealTo,b.Rest as Rest,c.Leave as Leave,0 as BeLate,0 as LeaveEarly
                            from #table1 a 
                                    left join #table2 b on a.employeeid=b.employeeid
                                    left join #table3  c on a.employeeid=c.employeeid
                                    left join #table4  d on a.employeeid=d.employeeid
                                    left join #table5  e on a.employeeid=e.employeeid
                                    left join #table6  f on a.employeeid=f.employeeid
                                    left join #table7  g on a.employeeid=g.employeeid
                                    left join #table8  h on a.employeeid=h.employeeid
                                    left join #table9  i on a.employeeid=i.employeeid
                                    left join iDept on IsNull(d.DeptID,a.DeptID)=iDept.ID";
                DeptID = CurrentSession.DeptID;
            }
            if (DeptID != 0)
            {
                prams.Add("@DeptID", DeptID);
            }
            string strgroup = " group by a.DeptID,b.ID;";
            string sqlCreate = sqlEmployee + sqlTable1 + " group by b.ID,b.Code,b.Title,a.DeptID;" + sqlTable6 + " group by b.ID,b.Code,b.Title,a.DeptID;" +
                sqlTable2 + strgroup + sqlTable3 + strgroup + sqlTable4 + strgroup + sqlTable5 + strgroup + sqlTable7 + strgroup + sqlTable8 + strgroup + sqlTable9 + strgroup;
            //int totalCount = kqgl.GetCount(sqlCreate,sqlStr, prams);
            int totalCount = 0;
            DataTable dt = new DataTable();
            //if (totalCount > 0) 
            //{
            //    if (urlName == "total")
            //    {
            //        dt = kqgl.GetPageData(sqlCreate, sqlStr, "order by  employeecode", start + 1, limit, prams);
            //    }
            //    else
            //    {
            //        sqlStr += " order by EmployeeCode";
            //        dt = this.GetAll(sqlCreate + sqlStr, prams);
            //    }
            //}
            sqlStr += " order by EmployeeCode";
            
            dt = this.GetAll(sqlCreate + sqlStr, prams);
            if (dt != null)
            {
                totalCount = dt.Rows.Count;
            }
            DbCommon.DbUtil db = new DbCommon.DbUtil();
            if (export2Excel == "true")
            {
                string strReportTemplatePath = "~/Templates/DeptAttendanceStatistics.html";
                string strReportItemTemplatePath = "~/Templates/DeptAttendanceStatisticsItem.html";
                string fileName = "";
                if (urlName.Equals("total"))
                {
                    strReportTemplatePath = "~/Templates/HeadquartersRepot.html";
                    strReportItemTemplatePath = "~/Templates/HeadquartersItem.html";
                    if (Request["searchDept"] != "" && Request["searchDept"] != "undefined")
                    {
                        Object deptName = db.ExecuteScalar("select Title from iDept where ID=" + Request["searchDept"]);
                        fileName = searchYear + "年" + searchMonth + "月总考勤统计_" + deptName + ".xls";
                    }
                    else
                    {
                        fileName = searchYear + "年" + searchMonth + "月总考勤统计.xls";
                    }



                }
                else
                {
                    Object deptName = db.ExecuteScalar("select Title from iDept where ID=" + CurrentSession.DeptID);
                    strReportTemplatePath = "~/Templates/DeptAttendanceStatistics.html";
                    strReportItemTemplatePath = "~/Templates/DeptAttendanceStatisticsItem.html";
                    fileName = searchYear + "年" + searchMonth + "月考勤统计_" + deptName + ".xls";
                    // fileName = searchYear + "年" + searchMonth + "月" + deptName + "店考勤统计.xls";
                }
                string strContent = "";

                string strTemplate = Common.ReadFile(Page.Server.MapPath(strReportTemplatePath), Encoding.UTF8);
                string strTemplateItem = Common.ReadFile(Page.Server.MapPath(strReportItemTemplatePath), Encoding.UTF8);

                string filePath = System.Configuration.ConfigurationSettings.AppSettings["ExportFiles"];
                Common.ToCreateFile(filePath);
                filePath = filePath + fileName;

                if (dt != null && dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        DataRow dr = dt.Rows[i];
                        String strItem = strTemplateItem;
                        String backColor = i % 2 == 0 ? "#FFFFFF" : "#aaaaaa";
                        for (int j = 0; j < dt.Columns.Count; j++)
                        {
                            String field = dt.Columns[j].ColumnName;
                            if (field.Equals("RealTo") && dr[field] != DBNull.Value)
                            {

                                strItem = strItem.Replace("{" + field + "}", Regex.Match(dr[field].ToString(), @"^\d+").Value);
                            }
                            else
                            {
                                strItem = strItem.Replace("{" + field + "}", dr[field].ToString());
                            }

                        }
                        strItem = strItem.Replace("{color}", backColor);
                        strContent += strItem;
                    }
                    strContent = strTemplate.Replace("{content}", strContent);

                    Common.WriteFile(filePath, strContent);

                    if (File.Exists(filePath))
                    {
                        //FileStream fs = new FileStream(filePath, FileMode.Open);
                        //byte[] bytes = new byte[(int)fs.Length];
                        //fs.Read(bytes, 0, bytes.Length);
                        //fs.Close();
                        //System.Web.HttpContext.Current.Response.ContentType = "application/octet-stream";


                        ////通知浏览器下载文件而不是打开 
                        //System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName);
                        //System.Web.HttpContext.Current.Response.BinaryWrite(bytes);
                        //System.Web.HttpContext.Current.Response.Flush();
                        msg = "{\"totalCount\":" + totalCount + ", \"file\":\"" + fileName + "\"}";
                        Response.Write(msg);
                        System.Web.HttpContext.Current.Response.End();
                    }

                }
                else
                {
                    msg = "{totalCount:" + 0 + ",results:{},fileName:\"\" }";
                    Response.Write(msg);
                    Response.End();

                }

            }
            else
            {
                sqlCreate = "";
                sqlStr = "";
                msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
                Response.Write(msg);
                Response.End();
            }




        }

        /// <summary>
        /// 保存排班
        /// </summary>
        /// <returns></returns>
        private void UpdateSchedule()
        {
            string oldData = Request["oldData"];
            string nowData = Request["nowData"];
            int queryYear = DateTime.Now.Year;
            int queryMonth = DateTime.Now.Month;
            Hashtable newData = new Hashtable();
            DateTime nowTime = DateTime.Now;
            if (!String.IsNullOrEmpty(Request["queryYear"]) && !String.IsNullOrEmpty(Request["queryMonth"]))
            {
                queryYear = Convert.ToInt32(Request["queryYear"]);
                queryMonth = Convert.ToInt32(Request["queryMonth"]);
                nowTime = DateTime.Parse(queryYear + "-" + queryMonth + "-1");
            }

            int DeptID = CurrentSession.DeptID;
            int loginID = CurrentUser.Id;

            //获取查询年月以及当月的天数

            try
            {
                TimeSpan days = nowTime.AddMonths(1) - nowTime;
                int diffDays = days.Days;
                Newtonsoft.Json.Linq.JArray oldArr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(oldData);
                Newtonsoft.Json.Linq.JArray nowArr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(nowData);

                string sql = "";
                //获取界面上新增人员的数据，拼接sql,新增该人员排班表里面的所有记录（通过新增的数据没有给定empID来判断）
                for (int i = 0; i < nowArr.Count; i++)
                {
                    string ID = nowArr[i]["ID"].ToString().Replace("\"", "");

                    newData.Add(ID, i);

                    if (!(string.IsNullOrEmpty(ID) || ID.Contains(",")))
                    {
                        continue;
                    }
                    string EmpID = ID.Substring(0, ID.Length - 1);
                    for (int j = 1; j <= diffDays; j++)
                    {
                        string columnName = "Day" + j;
                        string workModeStr = nowArr[i][columnName].ToString().Replace("\"", "");
                        int workMode = 4;
                        if (!(string.IsNullOrEmpty(workModeStr) || workModeStr == "null"))
                        {
                            workMode = Convert.ToInt32(workModeStr);
                        }
                        DateTime dayDt = new DateTime(queryYear, queryMonth, j);
                        Hashtable param = new Hashtable();
                        string sqlCheck = "select * from bCheckinSchedule where IsDeleted=0  and datediff(d,ScheduleDate,@ScheduleDate)=0  and employeeid=" + EmpID;
                        param.Add("@ScheduleDate", dayDt.ToString("yyyy-MM-dd 00:00:00"));
                        DataTable tbChk = this.GetAll(sqlCheck, param);

                        string nowSql = "";
                        if (tbChk != null && tbChk.Rows.Count > 0 )

                        {

                            if (workMode != 4)
                            {
                                nowSql = "update bCheckinSchedule set  ModifyDate=GetDate(),ModifyID=" + loginID + "  ,WorkMode = " + workMode + ",DeptId=" + DeptId + " where EmployeeID = " + EmpID + "   and IsDeleted=0 and  datediff(Day,ScheduleDate,'" + dayDt + "')=0; ";
                            }


                        }

                        else
                        {
                            nowSql = "insert into bCheckinSchedule(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,DeptID,EmployeeID,ScheduleDate,WorkMode)" +
                                        " values(" + loginID + ",getDate()," + loginID + ",getDate(),0," + DeptID + "," + EmpID + ",'" + dayDt + "'," + workMode + "); ";
                        }
						sql = sql + nowSql;
                    }
                }
                //通过循环对比原始数据跟修改后的数据
                for (int m = 0; m < oldArr.Count; m++)
                {
                    string ID = oldArr[m]["ID"].ToString().Replace("\"", "");
                    int nowArrIndex = 0;
                    bool deleteFlag = true;//flag为true,则是删除的数据进行删除
                    //if (newData.ContainsKey(ID)) 
                    //{
                    //    deleteFlag = false;
                    //    nowArrIndex = Int16.Parse(newData[ID].ToString());
                    //}
                    for (int n = 0; n < nowArr.Count; n++)
                    {
                        string nowID = nowArr[n]["ID"].ToString().Replace("\"", "");
                        if (ID == nowID)
                        {
                            nowArrIndex = n;
                            deleteFlag = false;
                            break;
                        }
                    }
                    if (deleteFlag)
                    {
                        string nowSql = "update bCheckinSchedule set ModifyDate=GetDate(),ModifyID=" + loginID + " ,IsDeleted = 1 where IsDeleted=0  and EmployeeID = " + ID + " and  datediff(Month,ScheduleDate,'" + nowTime + "')=0";
                        sql = sql + nowSql;
                    }
                    //数据存在 则要判断在该月记录中是否已经有记录，如果没有记录，则进行一次性新增，如有记录，则进行判断先后数据是否一致，进行修改
                    else
                    {
                        string getEmpScheduleCount = "select Count(*) from bCheckinSchedule where EmployeeID = @EmployeeID and  datediff(Month,ScheduleDate,'" + nowTime + "')=0 and IsDeleted = 0";
                        Hashtable getEmpCountPrams = new Hashtable();
                        getEmpCountPrams.Add("@EmployeeID", ID);
                        int count = Convert.ToInt32(kqgl.ExecScalar(getEmpScheduleCount, getEmpCountPrams));
                        if (count <= 0)//新增
                        {
                            for (int k = 1; k <= diffDays; k++)
                            {
                                string columnName = "Day" + k;
                                string workModeStr = nowArr[nowArrIndex][columnName].ToString().Replace("\"", "");
                                int workMode = 4;
                                if (!(string.IsNullOrEmpty(workModeStr) || workModeStr == "null"))
                                {
                                    workMode = Convert.ToInt32(workModeStr);
                                }
                                DateTime dayDt = new DateTime(queryYear, queryMonth, k);
                                Hashtable param = new Hashtable();
                                string sqlCheck = "select * from bCheckinSchedule where IsDeleted=0 and datediff(m,ScheduleDate,@ScheduleDate)=0   and employeeid=" + ID;
                                param.Add("@ScheduleDate", dayDt.ToString("yyyy-MM-dd 00:00:00"));
                                DataTable tbChk = this.GetAll(sqlCheck, param);
                                if (tbChk != null && tbChk.Rows.Count > 0)
                                {
                                    continue;
                                }

                                string nowSql = "insert into bCheckinSchedule(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,DeptID,EmployeeID,ScheduleDate,WorkMode)" +
                                                " values(" + loginID + ",getDate()," + loginID + ",getDate(),0," + DeptID + "," + ID + ",'" + dayDt + "'," + workMode + "); ";
                                sql = sql + nowSql;
                            }
                        }//判断值是否改变没有改变修改
                        else
                        {
                            for (int k = 1; k <= diffDays; k++)
                            {
                                string columnName = "Day" + k;
                                string nowWorkModeStr = nowArr[nowArrIndex][columnName].ToString().Replace("\"", "");
                                string oldWorkModeStr = oldArr[m][columnName].ToString().Replace("\"", "");
                                if (nowWorkModeStr == oldWorkModeStr)
                                {
                                    continue;
                                }
                                DateTime dayDt = new DateTime(queryYear, queryMonth, k);
                                //string nowSql = "update bCheckinSchedule set WorkMode = " + nowWorkModeStr + " where EmployeeID = " + ID + " and DeptId=" + DeptId + "  and IsDeleted=0 and  datediff(Day,ScheduleDate,'" + dayDt + "')=0; ";
                                string nowSql = "update bCheckinSchedule set ModifyDate=GetDate(),ModifyID=" + loginID + "  ,WorkMode = " + nowWorkModeStr + ",DeptId=" + DeptId + " where EmployeeID = " + ID + "   and IsDeleted=0 and  datediff(Day,ScheduleDate,'" + dayDt + "')=0; ";
                                sql = sql + nowSql;
                            }
                        }
                    }
                }
                int ok = kqgl.ExecuteNoneQuery(sql);
                if (ok >= 0)
                {
                    //ReturnResultJson("true", "保存排班成功！");
                    Response.Write(string.Format(ResultJson, "true", "保存排班成功"));
                }
            }
            catch (Exception ex)
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }
        }

        public string doubleNum(string Num)
        {

            if (int.Parse(Num) < 10)
            {
                return "0" + Num;
            }
            else
            {
                return Num;
            }
        }

        public string GetsixDate()
        {
            string result = string.Empty;
            try
            {
                DataTable tb = new DataTable();
                tb.Columns.Add("Value");
                tb.Columns.Add("Title");

                List<string> list = new List<string>();

                int year = int.Parse(DateTime.Now.Year.ToString());
                int month = int.Parse(DateTime.Now.Month.ToString());

                for (int i = 0; i < 6; i++)
                {
                    DataRow dr = tb.NewRow();
                    dr["Title"] = DateTime.Now.AddMonths(-i).Year.ToString() + "年" + doubleNum(DateTime.Now.AddMonths(-i).Month.ToString()) + "月";
                    dr["Value"] = DateTime.Now.AddMonths(-i).Year.ToString() + "-" + doubleNum(DateTime.Now.AddMonths(-i).Month.ToString());
                    tb.Rows.Add(dr);
                }




                result = Newtonsoft.Json.JsonConvert.SerializeObject(tb);
            }
            catch (Exception ex)
            {

            }
            return result;
        }

        //分门店查询数据
        private void QuerySchedule()
        {
            string xxx = Request["data_rows"];
            DateTime searhDate = DateTime.Now;
            if (!String.IsNullOrEmpty(Request["queryYear"]) && !String.IsNullOrEmpty(Request["queryMonth"]))
            {
                int queryYear = Convert.ToInt32(Request["queryYear"]);
                int queryMonth = Convert.ToInt32(Request["queryMonth"]);
                searhDate = DateTime.Parse(queryYear + "-" + queryMonth + "-1");
            }

            int DeptID = CurrentSession.DeptID;
            //DateTime searhDate = new DateTime(queryYear, queryMonth, 1);
            // DateTime searhDate = DateTime.Parse(queryYear + "-" + queryMonth + "-1");
            try
            {
                DataTable queryScheduleDt = new DataTable();
                //                string querySql = @"select c.Code,c.Title,State,c.ID,c.DeptID ,d.WorkModes,c.ID as DeleteEnable,IsNull(r.ID ,0) as CheckinId  from iEmployee c left join
                //                     (select a.EmployeeID,WorkModes=(select ','+CONVERT(nvarchar,b.WorkMode) from bCheckinSchedule b 
                //                     where  b.DeptID="+DeptId+@" and   datediff(Month,ScheduleDate,@searchDate)=0 and b.IsDeleted = 0 and b.EmployeeID = a.EmployeeID for xml path(''))from bCheckinSchedule a
                //                     where a.IsDeleted = 0 and a.DeptID="+DeptID+ @"  group by a.EmployeeID) as d on c.ID = d.EmployeeID 
                //                    left join (
                //						select top 1 * from bRegist r where   r.DeptID="+DeptID+ @" 
                //							and r.IsDeleted = 0 
                //							and  datediff(m,CheckinTime,@searchDate)=0 
                //					) r on c.ID = r.EmployeeID 
                //
                //                    where c.ID in(select distinct(employeeid) from bCheckinSchedule where DeptID = " + DeptID + " and  datediff(Month,ScheduleDate,@searchDate)=0  and isDeleted = 0" +
                //                        " union select id from iemployee where DeptID = " + DeptID + " and isDeleted = 0 and state in ('在岗','待报到')) and c.IsDeleted= 0 order by c.Code";
                string querySql = @"select c.Code,c.Title,State,c.ID,c.DeptID ,d.WorkModes,c.ID as DeleteEnable,0 as CheckinId  from iEmployee c left join
                     (select a.EmployeeID,WorkModes=(select ','+CONVERT(nvarchar,b.WorkMode) from bCheckinSchedule b 
                     where    datediff(Month,ScheduleDate,@searchDate)=0 and b.IsDeleted = 0 and b.EmployeeID = a.EmployeeID  order by b.ScheduleDate for xml path('')) from bCheckinSchedule a
                     where a.IsDeleted = 0 and a.DeptID=" + DeptID + @"  group by a.EmployeeID) as d on c.ID = d.EmployeeID 
                     where c.ID in(select distinct(employeeid) from bCheckinSchedule where DeptID = " + DeptID + @" and  datediff(Month,ScheduleDate,@searchDate)=0  and isDeleted = 0
                         union select id from iemployee where DeptID = " + DeptID + @" and isDeleted = 0 and state in ('在岗','待报到')) and c.IsDeleted= 0 order by c.Code";
                Hashtable getEmpCountPrams = new Hashtable();
                getEmpCountPrams.Add("@searchDate", searhDate);
                queryScheduleDt = kqgl.GetAll(querySql, getEmpCountPrams);
                List<string> column = new List<string>();
                column.Add("ID");
                column.Add("EmpCode");
                column.Add("EmpTitle");
                for (int i = 1; i <= 31; i++)
                {
                    column.Add("Day" + i);
                }
                DataTable listDt = CreateTableByColumn(column);
                if (listDt != null)
                {
                    listDt.Columns.Add("DeleteEnable");
                }
                for (int j = 0; j < queryScheduleDt.Rows.Count; j++)
                {
                    DataRow dr = listDt.NewRow();
                    String deptId = queryScheduleDt.Rows[j]["DeptId"].ToString();
                    String checkinId = queryScheduleDt.Rows[j]["CheckinId"].ToString();
                    dr["ID"] = queryScheduleDt.Rows[j]["ID"];
                    dr["EmpCode"] = queryScheduleDt.Rows[j]["Code"];
                    dr["EmpTitle"] = queryScheduleDt.Rows[j]["Title"];

                    String state = queryScheduleDt.Rows[j]["State"].ToString();
                    if ((CurrentSession.DeptID.ToString().Equals(deptId) && (state == "在岗" || state == "待报到")) || checkinId != "0")
                    {
                        dr["DeleteEnable"] = "0";
                    }
                    else
                    {
                        dr["DeleteEnable"] = queryScheduleDt.Rows[j]["ID"];
                    }

                    string statusDays = queryScheduleDt.Rows[j]["WorkModes"].ToString();
                    string[] status = new string[0];
                    if (statusDays.Length > 1)
                    {
                        statusDays = statusDays.Substring(1, statusDays.Length - 1);
                        status = statusDays.Split(',');
                    }
                    if (status.Length > 0)
                    {
                        for (int i = 0; i < status.Length; i++)
                        {
                            //if (i + 1 > 31) break;
                            string columnName = "day" + (i + 1);
                            if (dr.Table.Columns.Contains(columnName))
                            {
                                dr[columnName] = status[i];
                                if (status[i] != "4")
                                {
                                    dr["DeleteEnable"] = "0";
                                }
                            }

                        }
                    }
                    listDt.Rows.Add(dr);
                }
                string msg = "{totalCount:" + listDt.Rows.Count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(listDt) + "}";
                Response.Write(msg);
                Response.End();
            }
            catch (Exception ex)
            {
                //Response.Write(ex.Message+"\r\n"+ex.StackTrace);
            }
        }


        private void GetQdepSchedule()
        {
            string xxx = Request["data_rows"];
            DateTime searhDate = DateTime.Now;
            if (!String.IsNullOrEmpty(Request["queryYear"]) && !String.IsNullOrEmpty(Request["queryMonth"]))
            {
                int queryYear = Convert.ToInt32(Request["queryYear"]);
                int queryMonth = Convert.ToInt32(Request["queryMonth"]);
                searhDate = DateTime.Parse(queryYear + "-" + queryMonth + "-1");
            }

            int DeptID = 0;
            int EmpID = 0;
            if (!string.IsNullOrEmpty(Request["querydepID"]))
            {
                DeptID = int.Parse(Request["querydepID"]);
            }

            if (!string.IsNullOrEmpty(Request["queryempID"]))
            {
                EmpID = int.Parse(Request["queryempID"]);
            }
            //DateTime searhDate = new DateTime(queryYear, queryMonth, 1);
            // DateTime searhDate = DateTime.Parse(queryYear + "-" + queryMonth + "-1");
            try
            {
                DataTable queryScheduleDt = new DataTable();
                string querySql = @"select  NEWID() as ID,c.Code,c.Title,State,c.ID as EmployeeID,c.DeptId,d.Code as depCode ,d.Title as depTitle,d.WorkModes,d.WorkMode, d.WorkNum,c.ID as DeleteEnable,0 as CheckinId 
                    into #tmp from iEmployee c
                             left join
                     (select a.EmployeeID, h.Code,h.Title
                        ,WorkModes=(select ','+CONVERT(nvarchar,b.WorkMode) from bCheckinSchedule b where 
                    datediff(Month,ScheduleDate,@searchDate)=0 and b.IsDeleted = 0 and b.EmployeeID = a.EmployeeID  and b.deptid=a.deptid ";
                if (EmpID != 0)
                {
                    querySql += " and b.EmployeeID=" + EmpID;
                }
                if (DeptID != 0)
                {
                    querySql += " and  b.DeptID=" + DeptID;
                }
                querySql += @" order by b.ScheduleDate for xml path('')) 
                ,WorkMode = (SELECT sum(ISNULL (WorkMode, 4)%4 ) AS WorkMode FROM bCheckinSchedule b where 
                datediff(Month,ScheduleDate,@searchDate)=0 and b.IsDeleted = 0 and b.EmployeeID = a.EmployeeID  and b.deptid=a.deptid ";
                if (EmpID != 0)
                {
                    querySql += " and b.EmployeeID=" + EmpID;
                }
                if (DeptID != 0)
                {
                    querySql += " and  b.DeptID=" + DeptID;
                }

                querySql += @"), 
                  WorkNum = (SELECT avg(ISNULL (WorkMode, 4) )         
                  FROM bCheckinSchedule b
                  WHERE  datediff(Month,ScheduleDate,@searchDate)=0
                      AND b.IsDeleted = 0
                      AND b.EmployeeID = a.EmployeeID
                      AND b.deptid=a.deptid";

                if (EmpID != 0)
                {
                    querySql += " and b.EmployeeID=" + EmpID;
                }
                if (DeptID != 0)
                {
                    querySql += " and  b.DeptID=" + DeptID;
                }
                querySql += @" ) from bCheckinSchedule a  
                inner join iDept h on a.DeptID=h.ID where a.IsDeleted = 0  ";
                if (DeptID != 0 && EmpID != 0)
                {
                    querySql += " and a.EmployeeID=" + EmpID + " and a.DeptID=" + DeptID;
                }
                else
                {
                    if (EmpID != 0)
                    {
                        querySql += " and a.EmployeeID=" + EmpID;
                    }
                    if (DeptID != 0)
                    {
                        querySql += " and a.DeptID=" + DeptID;
                    }
                }

                querySql += "  group by a.EmployeeID,a.DeptID,h.Code,h.Title) as d on c.ID = d.EmployeeID ";

                querySql += " where c.ID in(select (employeeid) from bCheckinSchedule where ";



                if (DeptID != 0 && EmpID != 0)
                {
                    querySql += " EmployeeID=" + EmpID + " and  DeptID = " + DeptID + " and ";
                }
                else
                {
                    if (EmpID != 0)
                    {
                        querySql += " EmployeeID=" + EmpID + " and ";
                    }
                    if (DeptID != 0)
                    {
                        querySql += " DeptID=" + DeptID + " and ";
                    }
                }


                querySql += "  datediff(Month,ScheduleDate,@searchDate)=0  and isDeleted = 0  union select id from iemployee where";


                if (DeptID != 0 && EmpID != 0)
                {
                    querySql += " ID=" + EmpID + " and  DeptID = " + DeptID + " and ";
                }
                else
                {
                    if (EmpID != 0)
                    {
                        querySql += " ID=" + EmpID + " and ";
                    }
                    if (DeptID != 0)
                    {
                        querySql += " DeptID=" + DeptID + " and ";
                    }
                }

                querySql += "  isDeleted = 0 and state in ('在岗','待报到')) and c.IsDeleted= 0 ";
                querySql += "select * from  #tmp where (WorkMode>0 or  WorkNum!=4)order by Code";
                Hashtable getEmpCountPrams = new Hashtable();
                getEmpCountPrams.Add("@searchDate", searhDate);
                queryScheduleDt = kqgl.GetAll(querySql, getEmpCountPrams);
                List<string> column = new List<string>();
                column.Add("ID");
                column.Add("DepTitle");
                column.Add("DepCode");
                column.Add("EmpCode");
                column.Add("EmpTitle");
                for (int i = 1; i <= 31; i++)
                {
                    column.Add("Day" + i);
                }
                DataTable listDt = CreateTableByColumn(column);
                if (listDt != null)
                {
                    listDt.Columns.Add("DeleteEnable");
                }
                for (int j = 0; j < queryScheduleDt.Rows.Count; j++)
                {
                    DataRow dr = listDt.NewRow();
                    String deptId = queryScheduleDt.Rows[j]["DeptId"].ToString();
                    String checkinId = queryScheduleDt.Rows[j]["CheckinId"].ToString();
                    dr["ID"] = queryScheduleDt.Rows[j]["ID"];
                    dr["DepTitle"] = queryScheduleDt.Rows[j]["depTitle"];
                    dr["DepCode"] = queryScheduleDt.Rows[j]["depCode"];
                    dr["EmpCode"] = queryScheduleDt.Rows[j]["Code"];
                    dr["EmpTitle"] = queryScheduleDt.Rows[j]["Title"];

                    String state = queryScheduleDt.Rows[j]["State"].ToString();
                    if ((CurrentSession.DeptID.ToString().Equals(deptId) && (state == "在岗" || state == "待报到")) || checkinId != "0")
                    {
                        dr["DeleteEnable"] = "0";
                    }
                    else
                    {
                        dr["DeleteEnable"] = queryScheduleDt.Rows[j]["ID"];
                    }

                    string statusDays = queryScheduleDt.Rows[j]["WorkModes"].ToString();
                    string[] status = new string[0];
                    if (statusDays.Length > 1)
                    {
                        statusDays = statusDays.Substring(1, statusDays.Length - 1);
                        status = statusDays.Split(',');
                    }
                    if (status.Length > 0)
                    {
                        for (int i = 0; i < status.Length; i++)
                        {
                            //if (i + 1 > 31) break;
                            string columnName = "day" + (i + 1);
                            if (dr.Table.Columns.Contains(columnName))
                            {
                                dr[columnName] = status[i];
                                if (status[i] != "4")
                                {
                                    dr["DeleteEnable"] = "0";
                                }
                            }

                        }
                    }
                    listDt.Rows.Add(dr);
                }
                string msg = "{totalCount:" + listDt.Rows.Count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(listDt) + "}";
                Response.Write(msg);
                Response.End();
            }
            catch (Exception ex)
            {
                //Response.Write(ex.Message+"\r\n"+ex.StackTrace);
            }
        }

        /// <summary>
        /// 根据列名创建datatable
        /// </summary>
        /// <param name="columns"></param>
        /// <returns></returns>
        public DataTable CreateTableByColumn(List<string> columns)
        {
            DataTable dt = new DataTable();
            DataColumn dc;
            for (int i = 0; i < columns.Count; i++)
            {
                dc = new DataColumn(columns[i], System.Type.GetType("System.String"));
                dt.Columns.Add(dc);
            }
            return dt;
        }
        /// <summary>
        /// 获取员工信息
        /// </summary>
        /// <returns></returns>
        private string QueryEmplyeeInform()
        {
            string result = string.Empty;
            int searchYear = 0;
            if (Request["searchYear"] != "")
            {
                searchYear = Convert.ToInt32(Request["searchYear"]);
            }
            int searchMonth = 0;
            if (Request["searchMonth"] != "")
            {
                searchMonth = Convert.ToInt32(Request["searchMonth"]);
            }
            int searchDept = 0;
            if (Request["searchDept"] != "")
            {
                searchDept = Convert.ToInt32(Request["searchDept"]);
            }
            int searchEmp = 0;
            if (Request["searchEmp"] != "")
            {
                searchEmp = Convert.ToInt32(Request["searchEmp"]);
            }
            try
            {
                Hashtable prams = new Hashtable();


                string sql = @"select top 1 list.EmployeeID,list.DeptTitle,list.Code,list.Title,list.Sex,list.Age,list.Duty from
                            (select distinct EmployeeID,c.Title as DeptTitle,b.Code as Code,b.Title as Title,b.Sex as Sex,  cast (year ( getdate ())- CAST (SUBSTRING ( IdNo , 7 , 4 ) as float ) as int)  as Age,d.Title as Duty
                            from bRegist a,iEmployee b,iDept c ,iDuty d 
                            where  a.IsDeleted = 0 and a.EmployeeID = b.ID and a.DeptID = c.ID and b.DutyID=d.ID
                                and YEAR(a.CheckinTime)=@searchYear 
                                and MONTH(a.CheckinTime)=@searchMonth  ";

                string sql1 = " ) as list order by NewID()";
                if (searchDept != 0)
                {
                    sql += " and a.DeptID =@searchDept ";
                    prams.Add("@searchDept", searchDept);

                }
                if (searchEmp != 0)
                {
                    sql += " and a.EmployeeID =@searchEmp ";
                    prams.Add("@searchEmp", searchEmp);

                }
                sql = sql + sql1;
                prams.Add("@searchYear", searchYear);
                prams.Add("@searchMonth", searchMonth);
                DataTable dt = kqgl.GetAll(sql, prams);
                if (dt.Rows.Count == 0)
                {
                    result = "{success:false,msg:'本月无考勤记录！'}";
                }
                else
                {
                    result = "{success:true,EmployeeID:\"" + dt.Rows[0]["EmployeeID"] + "\",DeptTitle:\"" + dt.Rows[0]["DeptTitle"] +
                        "\",Code:\"" + dt.Rows[0]["Code"] + "\",Title:\"" + dt.Rows[0]["Title"] + "\",Sex:\"" + dt.Rows[0]["Sex"] +
                        "\",Age:\"" + dt.Rows[0]["Age"] + "\",Duty:\"" + dt.Rows[0]["Duty"] + "\",msg:\"ok\"}";

                }

            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
        /// <summary>
        /// 获取员工图片
        /// </summary>
        /// <returns></returns>
        private string QueryEmployeeImg()
        {
            string EmployeeCode = Request["EmployeeCode"].Trim();

            //Hashtable prams = new Hashtable();
            string picStr = "http://jf.wenfeng.com.cn/Imgs/EmpImgs/" + EmployeeCode + ".jpg?num=" + DateTime.Now.ToString("yyyyMMddhhmmss");
            return "{success:true,ImageResult:[{src:\"" + picStr + "\"}]}";
            //System.IO.DirectoryInfo path = new System.IO.DirectoryInfo(Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["EmpImgs"]));
            //string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["EmpImgs"]);
            //if (!Directory.Exists(dirpath))
            //{
            //    return "{success:true,ImageResult:[{src:\"\"}]}";
            //}
            //foreach (System.IO.FileInfo f in path.GetFiles())
            //{
            //    if (picStr == f.Name)
            //    {
            //        return "{success:true,ImageResult:[{src:\"" + System.Configuration.ConfigurationSettings.AppSettings["EmpImgs"] + picStr + "\"}]}";
            //    }
            //}
            //return "{success:true,ImageResult:[{src:\"\"}]}";
        }


        public string GetWorkType(string type)
        {
            string result = string.Empty;
            if (type == "5")
            {
                result = "通班";
            }
            if (type == "0")
            {
                result = "白班";
            }
            if (type == "2")
            {
                result = "休息";
            }
            if (type == "4")
            {
                result = "未排班";
            }
            if (type == "3")
            {
                result = "请假";
            }
            if (type == "6")
            {
                result = "中班";
            }
            if (type == "1")
            {
                result = "晚班";
            }
            if (type == "7")
            {
                result = "培训";
            }
            return result;
        }


        /// <summary>
        /// 获取web需要的string对象
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="Num"></param>
        /// <returns></returns>
        public string GetStringData(DataTable dt, int Num)
        {
            string Result = string.Empty;
            //string[] arry = new string[7];
            string[] arry = new string[8];
            arry[0] = System.Configuration.ConfigurationSettings.AppSettings["EmpCheckinImgs"] + dt.Rows[Num]["PhotoFileName"];
            arry[1] = dt.Rows[Num]["Title"].ToString();
            arry[2] = dt.Rows[Num]["CheckinTime"].ToString();
            arry[3] = dt.Rows[Num]["maxtime"].ToString();
            arry[4] = GetWorkType(dt.Rows[Num]["workMode"].ToString());
            arry[5] = dt.Rows[Num]["Reason"].ToString();
            arry[6] = dt.Rows[Num]["workMode"].ToString();
            if (dt.Rows[Num]["PhotoFileName2"] != DBNull.Value )
            {
                arry[7] = System.Configuration.ConfigurationSettings.AppSettings["EmpCheckinImgs"] + dt.Rows[Num]["PhotoFileName2"];
            }
            else 
            {
                arry[7] = ""; 
            }
            
            string result = null;
            for (int y = 0; y < arry.Count(); y++)
            {
                string item = "";
                if (!string.IsNullOrEmpty(arry[y]))
                {
                    item = arry[y];
                }
                else
                {
                    item = "";
                }
                result += item + ",";
            }
            return result;
        }


        /// <summary>
        /// 获取考勤 -1:缺勤 1:补录 2：休息 3：请假 4：未排班  41：未排班有补录签到  UUID.JPG4：未排班有拍照签到
        /// </summary>
        private void QueryAttendancePhotoCheck()
        {
            string sqlStr = "";
            List<string> column = new List<string>();
            column.Add("Mon");
            column.Add("Tue");
            column.Add("Wed");
            column.Add("Thu");
            column.Add("Fri");
            column.Add("Sat");
            column.Add("Sun");
            column.Add("CheckinTime");
            column.Add("Reason");
            DataTable listDT = CreateTableByColumn(column);
            Hashtable prams = new Hashtable();
            int searchYear = DateTime.Now.Year;
            if (!String.IsNullOrEmpty(Request["searchYear"]))
            {
                searchYear = Convert.ToInt32(Request["searchYear"]);
            }
            int searchMonth = DateTime.Now.Month;
            if (!String.IsNullOrEmpty(Request["searchMonth"]))
            {
                searchMonth = Convert.ToInt32(Request["searchMonth"]) % 13;
            }

            int EmployeeID = Convert.ToInt32(Request["EmployeeID"]);
            Hashtable deptParams = new Hashtable();
            deptParams.Add("@searchYear", searchYear);
            deptParams.Add("@searchMonth", searchMonth);
            deptParams.Add("@employeeID", EmployeeID);

            //            string sqlDept = @"select top 1 DeptID from bRegist a where EmployeeID =@employeeID
            //                                    and  Year(CheckinTime)=@searchYear
            //                                    and  Month(CheckinTime)=@searchMonth
            //                                    and IsDeleted = 0  ";
            //            Object deptId = kqgl.Scalar(sqlDept, deptParams);

            //string deptId = Request["DepID"];
            //排班表有记录，签到表有记录
            string sql = "select count(1) from bCheckinSchedule where EmployeeID = @EmployeeID and IsDeleted = 0 ";
            /**
            string sqlStr_1 = @"select isnull(a.workMode,0) as workMode ,isnull(RecordMode,0) as RecordMode ,a.ScheduleDate,
                                isnull(b.Title,'无') as Title,
                                isnull(SUBSTRING ( CONVERT(varchar(100), b.maxtime, 24), 0, 6 ),'') as maxtime, 
                                isnull(SUBSTRING ( CONVERT(varchar(100), b.CheckinTime, 24), 0, 6 ),'') as CheckinTime ,
                                isnull(PhotoFileName,'') as PhotoFileName,
                                isnull(PhotoFileName2,'') as PhotoFileName2,
                                isnull(Reason,'') as Reason
                                from bCheckinSchedule a left join(
                                select min(DeptID) as DeptID,min(RecordMode) as RecordMode,c.Title,max(CheckinTime) as maxtime,min(CheckinTime) as CheckinTime ,min(Reason) as Reason,
                                    min(CONVERT(varchar(10), b.CheckinTime, 120 )+'/'+b.PhotoFileName ) as  PhotoFileName
                                    ,max(CONVERT(varchar(10), b.CheckinTime, 120 )+'/'+b.PhotoFileName ) as  PhotoFileName2
	                                from bRegist b join iDept as c on c.ID=b.DeptID where  b.IsDeleted = 0 and b.EmployeeID = @EmployeeID ";
            string sqlStr_2 = @"    group by CONVERT(varchar(10), b.CheckinTime, 120 ),c.Title
                                    ) b  on   CONVERT(varchar(10), a.ScheduleDate, 120 )=CONVERT(varchar(10), b.CheckinTime, 120 )  
                                     where  a.IsDeleted = 0 and a.EmployeeID = @EmployeeID  "; 
            **/


            string sql1 = @"SELECT isnull(a.workMode,0) AS workMode ,
                           isnull(RecordMode,0) AS RecordMode ,a.ScheduleDate,
                           isnull(b.Title,'无') AS Title,
                           isnull(SUBSTRING (CONVERT(varchar(100), c.CheckinTime, 24), 0, 6),'') AS maxtime,
                           isnull(SUBSTRING (CONVERT(varchar(100), b.CheckinTime, 24), 0, 6),'') AS CheckinTime ,
                           isnull(b.PhotoFileName,'') AS PhotoFileName,
                           isnull(c.PhotoFileName2,'') AS PhotoFileName2,
                           isnull(Reason,'') AS Reason
                    FROM bCheckinSchedule a
                    LEFT JOIN
                        ( SELECT min(DeptID) AS DeptID,
                                 min(RecordMode) AS RecordMode,
                                 min(c.Title) as Title,
                                 min(CheckinTime) AS CheckinTime ,
                                 min(Reason) AS Reason,
                                 min(CONVERT(varchar(10), b.CheckinTime, 120)+'/'+b.PhotoFileName) AS PhotoFileName 
                                 
                         FROM bRegist b
                         JOIN iDept AS c ON c.ID=b.DeptID
                         WHERE b.IsDeleted = 0  {filter1}
                         GROUP BY CONVERT(varchar(10), b.CheckinTime, 120)) b ON CONVERT(varchar(10), a.ScheduleDate, 120)=CONVERT(varchar(10), b.CheckinTime, 120)
                        
                    LEFT JOIN
                        ( SELECT            
                                 Max(CheckinTime) AS CheckinTime,
                                 max(CONVERT(varchar(10), b.CheckinTime, 120)+'/'+b.PhotoFileName) AS PhotoFileName2
                         FROM bRegist b
                         JOIN iDept AS c ON c.ID=b.DeptID
                         WHERE b.IsDeleted = 0  {filter1}
                             
                         GROUP BY CONVERT(varchar(10), b.CheckinTime, 120)
                      ) c ON CONVERT(varchar(10), a.ScheduleDate, 120)=CONVERT(varchar(10), c.CheckinTime, 120) 
                      where  a.IsDeleted = 0 and a.EmployeeID = @EmployeeID {filter2}";

            //排班无记录，签到表有记录sql
            int days = System.DateTime.DaysInMonth(searchYear, searchMonth);
            string sql_table = "create table #table(DeptId int, EmployeeID int,ScheduleDate datetime,workMode int,IsDeleted int); ";
            string ScheduleDate = "";
            for (int i = 1; i <= days; i++)
            {
                ScheduleDate = searchYear + "/" + searchMonth + "/" + i + " 00:00:00 ";
                sql_table += "insert into #table (EmployeeID,ScheduleDate,workMode,IsDeleted) values (" + EmployeeID + ",'" + ScheduleDate + "',4,0);";
            }

            /**
            sql_table += @"select a.workMode as workMode ,RecordMode as RecordMode ,a.ScheduleDate, 
                                isnull(b.Title,'无') as Title,
                                isnull(SUBSTRING ( CONVERT(varchar(100), b.maxtime, 24), 0, 6 ),'') as maxtime, 
                                isnull(SUBSTRING ( CONVERT(varchar(100), b.CheckinTime, 24), 0, 6 ),'') as CheckinTime ,
                                PhotoFileName,PhotoFileName2,Reason
                                from #table a left join(
                                select min(DeptID) as DeptID,min(RecordMode) as RecordMode,c.Title,
                                max(CheckinTime) as maxtime,min(CheckinTime) as CheckinTime,min(Reason) as Reason
                                ,min(CONVERT(varchar(10), b.CheckinTime, 120 )+'/'+b.PhotoFileName ) as  PhotoFileName
                                ,max(CONVERT(varchar(10), b.CheckinTime, 120 )+'/'+b.PhotoFileName ) as  PhotoFileName2
	                                from bRegist b join iDept  c on c.ID=b.DeptID where  b.IsDeleted = 0 and b.EmployeeID = @EmployeeID";
            string sql_table1 = @" group by CONVERT(varchar(10), b.CheckinTime, 120 ),c.Title 
                                  ) b on CONVERT(varchar(10), a.ScheduleDate, 120 )=CONVERT(varchar(10), b.CheckinTime, 120 )  
                                     where  a.IsDeleted = 0 and a.EmployeeID = @EmployeeID ";
            **/
            sql_table+= @"SELECT isnull(a.workMode,0) AS workMode ,
                           isnull(RecordMode,0) AS RecordMode ,a.ScheduleDate,
                           isnull(b.Title,'无') AS Title,
                           isnull(SUBSTRING (CONVERT(varchar(100), c.CheckinTime, 24), 0, 6),'') AS maxtime,
                           isnull(SUBSTRING (CONVERT(varchar(100), b.CheckinTime, 24), 0, 6),'') AS CheckinTime ,
                           isnull(b.PhotoFileName,'') AS PhotoFileName,
                           isnull(c.PhotoFileName2,'') AS PhotoFileName2,
                           isnull(Reason,'') AS Reason
                    FROM #table a
                    LEFT JOIN
                        ( SELECT min(DeptID) AS DeptID,
                                 min(RecordMode) AS RecordMode,
                                 min(c.Title) as Title,
                                 min(CheckinTime) AS CheckinTime ,
                                 min(Reason) AS Reason,
                                 min(CONVERT(varchar(10), b.CheckinTime, 120)+'/'+b.PhotoFileName) AS PhotoFileName 
                                 
                         FROM bRegist b
                         JOIN iDept AS c ON c.ID=b.DeptID
                         WHERE b.IsDeleted = 0  {filter1}
                         GROUP BY CONVERT(varchar(10), b.CheckinTime, 120)) b ON CONVERT(varchar(10), a.ScheduleDate, 120)=CONVERT(varchar(10), b.CheckinTime, 120)
                        
                    LEFT JOIN
                        ( SELECT            
                                 Max(CheckinTime) AS CheckinTime,
                                 max(CONVERT(varchar(10), b.CheckinTime, 120)+'/'+b.PhotoFileName) AS PhotoFileName2
                         FROM bRegist b
                         JOIN iDept AS c ON c.ID=b.DeptID
                         WHERE b.IsDeleted = 0  {filter1}
                             
                         GROUP BY CONVERT(varchar(10), b.CheckinTime, 120)
                      ) c ON CONVERT(varchar(10), a.ScheduleDate, 120)=CONVERT(varchar(10), c.CheckinTime, 120) 
                      where  a.IsDeleted = 0 and a.EmployeeID = @EmployeeID {filter2}";

            prams.Add("@EmployeeID", EmployeeID);
            String strFilter1 = " and EmployeeID = @EmployeeID ";
            String strFilter2 = "";
            if (searchYear != 0)
            {
                sql += " and YEAR(ScheduleDate) =@searchYear ";
                strFilter1 += " and YEAR(CheckinTime) =@searchYear";
                strFilter2 += " and YEAR(ScheduleDate) =@searchYear";
                
                //sqlStr_1 += " and YEAR(b.CheckinTime) =@searchYear ";
                //sqlStr_2 += " and YEAR(a.ScheduleDate) =@searchYear ";
                //sql_table += " and YEAR(b.CheckinTime) =@searchYear ";
                prams.Add("@searchYear", searchYear);
            }
            if (searchMonth != 0)
            {
                sql += " and MONTH(ScheduleDate) =@searchMonth ";
                strFilter1 += " and MONTH(CheckinTime) =@searchMonth";
                strFilter2 += " and MONTH(ScheduleDate) =@searchMonth";
                //sqlStr_1 += " and MONTH(b.CheckinTime) =@searchMonth ";
                //sqlStr_2 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                //sql_table += " and MONTH(b.CheckinTime) =@searchMonth ";
                prams.Add("@searchMonth", searchMonth);
            }
            sql1 = sql1.Replace("{filter1}", strFilter1).Replace("{filter2}",strFilter2);
            sql_table = sql_table.Replace("{filter1}", strFilter1).Replace("{filter2}", strFilter2);

            int num = Convert.ToInt32(kqgl.Scalar(sql, prams));
            DataRow dr = listDT.NewRow();
            if (num != 0)
            {
                //sqlStr = sqlStr_1 + sqlStr_2;
                sqlStr = sql1;
                sqlStr += " order by a.scheduledate";
            }
            else
            {
                //sqlStr = sql_table + sql_table1;
                sqlStr = sql_table;
            }


            DataTable dt = new DataTable();
            dt = kqgl.GetAll(sqlStr, prams);
            DateTime dateValue = new DateTime(searchYear, searchMonth, 1);
            int OneDay_Week = Convert.ToInt32(dateValue.DayOfWeek);
            if (OneDay_Week == 0)
            {
                OneDay_Week = 7;
            }
            if (dt.Rows.Count > 0)
            {


                //新建datatable的第一行记录
                for (int i = 0; i < 7; i++)
                {



                    if (i >= (OneDay_Week - 1))
                    {
                       
                        DateTime scheduleDate = DateTime.Now;
                        if (dt.Rows[i - OneDay_Week + 1]["ScheduleDate"] != DBNull.Value)
                        {
                            scheduleDate = DateTime.Parse(dt.Rows[i - OneDay_Week + 1]["ScheduleDate"].ToString());
                        }

                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 0)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {

                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);

                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 1)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {
                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }


                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 4)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {
                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else
                            {
                                dr[i] = 41 + "," + dt.Rows[i - OneDay_Week + 1]["Reason"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 2)
                        {
                            //dr[i] = 2;
                            int Num = i - OneDay_Week + 1;
                            dr[i] = GetStringData(dt, Num);
                        }
                        else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 3)
                        {
                            //dr[i] = 3;
                            int Num = i - OneDay_Week + 1;
                            dr[i] = GetStringData(dt, Num);
                        }
                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 5)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {

                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }

                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 6)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {
                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 7)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {
                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }

                        dr["CheckinTime"] = dt.Rows[i - OneDay_Week + 1]["CheckinTime"];

                    }

                    else
                    {
                        dr[i] = "";
                    }



                }
                listDT.Rows.Add(dr);
                //新建datatable中间几行记录
                int CycleBegin = 7 - OneDay_Week + 1;
                int CycleEnd = dt.Rows.Count - (dt.Rows.Count - CycleBegin) % 7;
                for (int j = 0; j < (CycleEnd - CycleBegin) / 7; j++)
                {
                    dr = listDT.NewRow();
                    for (int k = 0; k < 7; k++)
                    {
                        
                        DateTime scheduleDate = DateTime.Now;
                        if (dt.Rows[CycleBegin + j * 7 + k]["ScheduleDate"] != DBNull.Value)
                        {
                            scheduleDate = DateTime.Parse(dt.Rows[CycleBegin + j * 7 + k]["ScheduleDate"].ToString());
                        }

                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 0)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 1)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["Reason"];
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 4)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = 4;
                                //dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else
                            {
                                dr[k] = 41 + "," + dt.Rows[CycleBegin + j * 7 + k]["Reason"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 2)
                        {
                            //dr[k] = 2;
                            int Num = CycleBegin + j * 7 + k;
                            dr[k] = GetStringData(dt, Num);
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 3)
                        {
                            //dr[k] = 3;
                            int Num = CycleBegin + j * 7 + k;
                            dr[k] = GetStringData(dt, Num);
                        }

                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 5)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 6)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }
                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 7)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }

                        dr["Reason"] = dt.Rows[CycleBegin + j * 7 + k]["Reason"];




                    }



                    listDT.Rows.Add(dr);
                }
                //新建datatable最后一行记录
                int CycleLast = dt.Rows.Count - CycleEnd;
                dr = listDT.NewRow();
                for (int m = 0; m < 7; m++)
                {
                    if (m <= (CycleLast - 1))
                    {
                        DateTime scheduleDate = DateTime.Now;
                        if (dt.Rows[CycleEnd + m]["ScheduleDate"] != DBNull.Value)
                        {
                            scheduleDate = DateTime.Parse(dt.Rows[CycleEnd + m]["ScheduleDate"].ToString());
                        }


                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 0)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }

                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 1)
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["Reason"];
                            }

                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 1)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 1)
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["Reason"];
                            }
                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 4)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else
                            {
                                dr[m] = 41 + "," + dt.Rows[CycleEnd + m]["Reason"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 2)
                        {
                            //dr[m] = 2;
                            int Num = CycleEnd + m;
                            dr[m] = GetStringData(dt, Num);
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 3)
                        {
                            //dr[m] = 3;
                            int Num = CycleEnd + m;
                            dr[m] = GetStringData(dt, Num);
                        }
                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 5)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {

                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 6)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 1)
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["Reason"];
                            }
                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }
                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 7)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 1)
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["Reason"];
                            }
                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }




                    }
                    else
                    {
                        dr[m] = "";
                    }

                }
            }
            listDT.Rows.Add(dr);
            string msg = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(listDT) + "}";
            Response.Write(msg);
            Response.End();
        }

        #region  QueryAttendancePhotoCheck backup
        /**
        private void QueryAttendancePhotoCheck()
        {
            string sqlStr = "";
            List<string> column = new List<string>();
            column.Add("Mon");
            column.Add("Tue");
            column.Add("Wed");
            column.Add("Thu");
            column.Add("Fri");
            column.Add("Sat");
            column.Add("Sun");
            column.Add("CheckinTime");
            column.Add("Reason");
            DataTable listDT = CreateTableByColumn(column);
            Hashtable prams = new Hashtable();
            int searchYear = DateTime.Now.Year;
            if (!String.IsNullOrEmpty(Request["searchYear"]))
            {
                searchYear = Convert.ToInt32(Request["searchYear"]);
            }
            int searchMonth = DateTime.Now.Month;
            if (!String.IsNullOrEmpty(Request["searchMonth"]))
            {
                searchMonth = Convert.ToInt32(Request["searchMonth"]) % 13;
            }

            int EmployeeID = Convert.ToInt32(Request["EmployeeID"]);
            Hashtable deptParams = new Hashtable();
            deptParams.Add("@searchYear", searchYear);
            deptParams.Add("@searchMonth", searchMonth);
            deptParams.Add("@employeeID", EmployeeID);

            //            string sqlDept = @"select top 1 DeptID from bRegist a where EmployeeID =@employeeID
            //                                    and  Year(CheckinTime)=@searchYear
            //                                    and  Month(CheckinTime)=@searchMonth
            //                                    and IsDeleted = 0  ";
            //            Object deptId = kqgl.Scalar(sqlDept, deptParams);

            //string deptId = Request["DepID"];
            //排班表有记录，签到表有记录
            string sql = "select count(1) from bCheckinSchedule where EmployeeID = @EmployeeID and IsDeleted = 0 ";

            string sqlStr_1 = @"select isnull(a.workMode,0) as workMode ,isnull(RecordMode,0) as RecordMode ,a.ScheduleDate,
                                isnull(b.Title,'无') as Title,
                                isnull(SUBSTRING ( CONVERT(varchar(100), b.maxtime, 24), 0, 6 ),'') as maxtime, 
                                isnull(SUBSTRING ( CONVERT(varchar(100), b.CheckinTime, 24), 0, 6 ),'') as CheckinTime ,
                                isnull(PhotoFileName,'') as PhotoFileName,
                                isnull(PhotoFileName2,'') as PhotoFileName2,
                                isnull(Reason,'') as Reason
                                from bCheckinSchedule a left join(
                                select min(DeptID) as DeptID,min(RecordMode) as RecordMode,c.Title,max(CheckinTime) as maxtime,min(CheckinTime) as CheckinTime ,min(Reason) as Reason,
                                    min(CONVERT(varchar(10), b.CheckinTime, 120 )+'/'+b.PhotoFileName ) as  PhotoFileName
                                    ,max(CONVERT(varchar(10), b.CheckinTime, 120 )+'/'+b.PhotoFileName ) as  PhotoFileName2
	                                from bRegist b join iDept as c on c.ID=b.DeptID where  b.IsDeleted = 0 and b.EmployeeID = @EmployeeID ";
            string sqlStr_2 = @"    group by CONVERT(varchar(10), b.CheckinTime, 120 ),c.Title
                                    ) b  on   CONVERT(varchar(10), a.ScheduleDate, 120 )=CONVERT(varchar(10), b.CheckinTime, 120 )  
                                     where  a.IsDeleted = 0 and a.EmployeeID = @EmployeeID  ";


            //排班无记录，签到表有记录sql
            int days = System.DateTime.DaysInMonth(searchYear, searchMonth);
            string sql_table = "create table #table(DeptId int, EmployeeID int,ScheduleDate datetime,workMode int,IsDeleted int); ";
            string ScheduleDate = "";
            for (int i = 1; i <= days; i++)
            {
                ScheduleDate = searchYear + "/" + searchMonth + "/" + i + " 00:00:00 ";
                sql_table += "insert into #table (EmployeeID,ScheduleDate,workMode,IsDeleted) values (" + EmployeeID + ",'" + ScheduleDate + "',4,0);";
            }


            sql_table += @"select a.workMode as workMode ,RecordMode as RecordMode ,a.ScheduleDate, 
                                isnull(b.Title,'无') as Title,
                                isnull(SUBSTRING ( CONVERT(varchar(100), b.maxtime, 24), 0, 6 ),'') as maxtime, 
                                isnull(SUBSTRING ( CONVERT(varchar(100), b.CheckinTime, 24), 0, 6 ),'') as CheckinTime ,
                                PhotoFileName,PhotoFileName2,Reason
                                from #table a left join(
                                select min(DeptID) as DeptID,min(RecordMode) as RecordMode,c.Title,
                                max(CheckinTime) as maxtime,min(CheckinTime) as CheckinTime,min(Reason) as Reason
                                ,min(CONVERT(varchar(10), b.CheckinTime, 120 )+'/'+b.PhotoFileName ) as  PhotoFileName
                                ,max(CONVERT(varchar(10), b.CheckinTime, 120 )+'/'+b.PhotoFileName ) as  PhotoFileName2
	                                from bRegist b join iDept  c on c.ID=b.DeptID where  b.IsDeleted = 0 and b.EmployeeID = @EmployeeID";
            string sql_table1 = @" group by CONVERT(varchar(10), b.CheckinTime, 120 ),c.Title 
                                  ) b on CONVERT(varchar(10), a.ScheduleDate, 120 )=CONVERT(varchar(10), b.CheckinTime, 120 )  
                                     where  a.IsDeleted = 0 and a.EmployeeID = @EmployeeID ";



            prams.Add("@EmployeeID", EmployeeID);
            if (searchYear != 0)
            {
                sql += " and YEAR(ScheduleDate) =@searchYear ";
                sqlStr_1 += " and YEAR(b.CheckinTime) =@searchYear ";
                sqlStr_2 += " and YEAR(a.ScheduleDate) =@searchYear ";
                sql_table += " and YEAR(b.CheckinTime) =@searchYear ";
                prams.Add("@searchYear", searchYear);
            }
            if (searchMonth != 0)
            {
                sql += " and MONTH(ScheduleDate) =@searchMonth ";
                sqlStr_1 += " and MONTH(b.CheckinTime) =@searchMonth ";
                sqlStr_2 += " and MONTH(a.ScheduleDate) =@searchMonth ";
                sql_table += " and MONTH(b.CheckinTime) =@searchMonth ";
                prams.Add("@searchMonth", searchMonth);
            }

            int num = Convert.ToInt32(kqgl.Scalar(sql, prams));
            DataRow dr = listDT.NewRow();
            if (num != 0)
            {
                sqlStr = sqlStr_1 + sqlStr_2;
                sqlStr += " order by a.scheduledate";
            }
            else
            {
                sqlStr = sql_table + sql_table1;
            }


            DataTable dt = new DataTable();
            dt = kqgl.GetAll(sqlStr, prams);
            DateTime dateValue = new DateTime(searchYear, searchMonth, 1);
            int OneDay_Week = Convert.ToInt32(dateValue.DayOfWeek);
            if (OneDay_Week == 0)
            {
                OneDay_Week = 7;
            }
            if (dt.Rows.Count > 0)
            {


                //新建datatable的第一行记录
                for (int i = 0; i < 7; i++)
                {



                    if (i >= (OneDay_Week - 1))
                    {
                        DateTime scheduleDate = DateTime.Now;
                        if (dt.Rows[i - OneDay_Week + 1]["ScheduleDate"] != DBNull.Value)
                        {
                            scheduleDate = DateTime.Parse(dt.Rows[i - OneDay_Week + 1]["ScheduleDate"].ToString());
                        }

                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 0)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {

                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);

                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 1)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {
                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }


                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 4)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {
                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else
                            {
                                dr[i] = 41 + "," + dt.Rows[i - OneDay_Week + 1]["Reason"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 2)
                        {
                            dr[i] = 2;
                        }
                        else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 3)
                        {
                            dr[i] = 3;
                        }
                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 5)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {

                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }

                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 6)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {
                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["workMode"]) == 7)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i - OneDay_Week + 1]["RecordMode"].ToString()))
                            {
                                dr[i] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 0)
                            {
                                int Num = i - OneDay_Week + 1;
                                dr[i] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else if (Convert.ToInt32(dt.Rows[i - OneDay_Week + 1]["RecordMode"]) == 1)
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["Reason"];
                            }
                            else
                            {
                                dr[i] = dt.Rows[i - OneDay_Week + 1]["RecordMode"];
                            }
                        }

                        dr["CheckinTime"] = dt.Rows[i - OneDay_Week + 1]["CheckinTime"];

                    }

                    else
                    {
                        dr[i] = "";
                    }



                }
                listDT.Rows.Add(dr);
                //新建datatable中间几行记录
                int CycleBegin = 7 - OneDay_Week + 1;
                int CycleEnd = dt.Rows.Count - (dt.Rows.Count - CycleBegin) % 7;
                for (int j = 0; j < (CycleEnd - CycleBegin) / 7; j++)
                {
                    dr = listDT.NewRow();
                    for (int k = 0; k < 7; k++)
                    {
                        DateTime scheduleDate = DateTime.Now;
                        if (dt.Rows[CycleBegin + j * 7 + k]["ScheduleDate"] != DBNull.Value)
                        {
                            scheduleDate = DateTime.Parse(dt.Rows[CycleBegin + j * 7 + k]["ScheduleDate"].ToString());
                        }

                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 0)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 1)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["Reason"];
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 4)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else
                            {
                                dr[k] = 41 + "," + dt.Rows[CycleBegin + j * 7 + k]["Reason"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 2)
                        {
                            dr[k] = 2;
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 3)
                        {
                            dr[k] = 3;
                        }

                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 5)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 6)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }
                        if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["workMode"]) == 7)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"].ToString()))
                            {
                                dr[k] = (scheduleDate - DateTime.Now).Hours <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 0)
                            {
                                int Num = CycleBegin + j * 7 + k;
                                dr[k] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleBegin + j * 7 + k]["RecordMode"]) == 1)
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                            else
                            {
                                dr[k] = dt.Rows[CycleBegin + j * 7 + k]["RecordMode"];
                            }
                        }

                        dr["Reason"] = dt.Rows[CycleBegin + j * 7 + k]["Reason"];




                    }



                    listDT.Rows.Add(dr);
                }
                //新建datatable最后一行记录
                int CycleLast = dt.Rows.Count - CycleEnd;
                dr = listDT.NewRow();
                for (int m = 0; m < 7; m++)
                {
                    if (m <= (CycleLast - 1))
                    {
                        DateTime scheduleDate = DateTime.Now;
                        if (dt.Rows[CycleEnd + m]["ScheduleDate"] != DBNull.Value)
                        {
                            scheduleDate = DateTime.Parse(dt.Rows[CycleEnd + m]["ScheduleDate"].ToString());
                        }


                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 0)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }

                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 1)
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["Reason"];
                            }

                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 1)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 1)
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["Reason"];
                            }
                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 4)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else
                            {
                                dr[m] = 41 + "," + dt.Rows[CycleEnd + m]["Reason"].ToString();
                            }
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 2)
                        {
                            dr[m] = 2;
                        }
                        else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 3)
                        {
                            dr[m] = 3;
                        }
                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 5)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {

                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }

                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 6)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 1)
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["Reason"];
                            }
                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }
                        if (Convert.ToInt32(dt.Rows[CycleEnd + m]["workMode"]) == 7)
                        {
                            if (string.IsNullOrEmpty(dt.Rows[CycleEnd + m]["RecordMode"].ToString()))
                            {
                                dr[m] = (scheduleDate - DateTime.Now).Days <= 0 ? -1 : 4;
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 0)
                            {
                                int Num = CycleEnd + m;
                                dr[m] = GetStringData(dt, Num);
                            }
                            else if (Convert.ToInt32(dt.Rows[CycleEnd + m]["RecordMode"]) == 1)
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["Reason"];
                            }
                            else
                            {
                                dr[m] = dt.Rows[CycleEnd + m]["RecordMode"];
                            }
                        }




                    }
                    else
                    {
                        dr[m] = "";
                    }

                }
            }
            listDT.Rows.Add(dr);
            string msg = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(listDT) + "}";
            Response.Write(msg);
            Response.End();
        }

        **/
        #endregion   QueryAttendancePhotoCheck backup
        
        
        //查询门店
        private void GetDept()
        {
            Hashtable parms = new Hashtable();
            string sql = "";
            string dName = Request["dName"];
            if (!string.IsNullOrEmpty(dName))
            {
                parms.Add("@dName", dName);
                sql += "and Title like '%'+@dName+'%'";
            }
            DataTable dt = kqgl.GetDept(sql, parms);
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(html);
            Response.End();
        }
        //查询员工
        private void GetEmp()
        {
            Hashtable parms = new Hashtable();
            string sql = "";
            string eName = Request["eName"];
            if (!string.IsNullOrEmpty(eName))
            {
                parms.Add("@eName", eName);
                sql += "and Title like '%'+@eName+'%'";
            }
            DataTable dt = kqgl.GetEmp(sql, parms);
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(html);
            Response.End();
        }
    }
}