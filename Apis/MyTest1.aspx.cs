using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text.RegularExpressions;
using DbCommon;
using System.Collections;

namespace BeautyPointWeb.Apis
{
    public partial class MyTest1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int deptid =Convert.ToInt32(Request["deptID"].Trim());
            int empID = Convert.ToInt32(Request["empID"].Trim());
            string checkinTime = Request["checkinTime"].Trim();
            int recordMode = Convert.ToInt32(Request["recordMode"].Trim());
            int timeSource = Convert.ToInt32(Request["timeSource"].Trim());
            Guid g = Guid.NewGuid();
            string imgUrl = g.ToString() + ".jpg";
            Request.Files[0].SaveAs(Server.MapPath("~/UploadImg") + "//" + imgUrl);
            string sql = @"insert into bRegist (CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,
                            DeptID,EmployeeID,CheckinTime,PhotoFileName,RecordMode,TimeSource) values 
                            (0,getdate(),0,getdate(),0,@DeptID,@EmployeeID,@CheckinTime,@PhotoFileName,
                            @RecordMode,@TimeSource)";
            Hashtable prams = new Hashtable();
            prams.Add("@DeptID", deptid);
            prams.Add("@EmployeeID", empID);
            prams.Add("@CheckinTime", checkinTime);
            prams.Add("@PhotoFileName", imgUrl);
            prams.Add("@RecordMode", recordMode);
            prams.Add("@TimeSource", timeSource);
            using (DbCommon.DbUtil dbl = new DbCommon.DbUtil())
            {
                try
                {
                    int i = dbl.ExecuteNoneQuery(sql,prams);
                    dbl.Commit();
                }
                catch (Exception ex)
                {
                    dbl.Rollback();
                    throw new ApplicationException(ex.Message.ToString());
                }
            }
            Response.Redirect("../Pages/myTest.html");
        }

        
    }
}