using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;

namespace BeautyPointWeb.Apis
{
    public partial class ReguinalManagercheck : AuthBasePage
    {
        BllApi.AttendanceMgr kqgl = new BllApi.AttendanceMgr();
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            {
                case "getRegionalManagercheckData":
                    result = GetRegionalManagercheckData();
                    break;
                case "getRegionalManagercheckpicture":
                    result = GetRegionalManagercheckpicture();
                    break;
                    
             
            }
            Response.Write(result);
            Response.End();
        }






        /**
         * 获取照片
         * */
        private string GetRegionalManagercheckpicture()
        {
            string result = string.Empty;
            string mydate = string.Empty;
            if (!string.IsNullOrEmpty(Request["mydate"]))
            {
                mydate = DateTime.Parse(Request["mydate"]).ToString("yyyy-MM-dd");
            }

            int DeptID = 0;

            if (!string.IsNullOrEmpty(Request["DeptID"]))
            {
                DeptID = int.Parse(Request["DeptID"]);
            }

            try
            {
                Hashtable prams = new Hashtable();

                String sql = @" 
                            select CONVERT (varchar ( 10), (CheckinTime) , 120 ) + '/' + (PhotoFileName)  AS 照片 from bRegist 
                    where datediff (DAY , CheckinTime , @date)=0 and DeptID=@DeptID ";

                prams.Add("@date", mydate);
                prams.Add("@DeptID", DeptID);

                DataTable dt = kqgl.GetPageData(sql, prams);
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
        /// <summary>
        /// 获取信息
        /// </summary>
        /// <returns></returns>
        private string GetRegionalManagercheckData()
        {
            string result = string.Empty;
            string mydate = string.Empty;
            if (!string.IsNullOrEmpty(Request["mydate"]))
            {
                mydate = DateTime.Parse(Request["mydate"]).ToString("yyyy-MM-dd");
            }
            int start = 0;
            if (!string.IsNullOrEmpty(Request["start"] ))
            {
                start = int.Parse(Request["start"]);
            }
            int limit = 0;
            if (!string.IsNullOrEmpty(Request["limit"] ))
            {
                limit = int.Parse(Request["limit"]);
            }
            int empid = 0;

            if (!string.IsNullOrEmpty(Request["empid"]))
            {
                empid = int.Parse(Request["empid"]);
            }

            try
            {
                Hashtable prams = new Hashtable();

                String sql = @" 
                             select  CONVERT( varchar (100 ),  min(a.CheckinTime ), 23 ) 日期,datename(weekday, min(a.CheckinTime)) as 星期,b.Title 门店,
                             (CONVERT (varchar ( 10), min(CheckinTime) , 120 ) + '/' + min(PhotoFileName) ) AS 照片,
                             SUBSTRING ( CONVERT( varchar (100 ),  min(a.CheckinTime ), 24 ), 0, 6 ) 进店时间,
                             SUBSTRING ( CONVERT( varchar (100 ),  max(a.CheckinTime ), 24 ), 0, 6 ) 出店时间 ,
                             (datediff(MI,MIN(a.CheckinTime),max(a.CheckinTime)))时长
                             ,a.DeptID,a.EmployeeID
                             from bRegist a
                             join iDept b on b.ID=a.DeptID
                             where datediff (DAY , CheckinTime , @date)=0 and a.EmployeeID=@empid
                             group by a.DeptID,a.EmployeeID,b.Title";

                prams.Add("@date", mydate);
                prams.Add("@empid", empid);

                DataTable dt = kqgl.GetPageData(sql, "order by EmployeeID", start + 1, limit, prams);
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