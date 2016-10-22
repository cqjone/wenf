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
    public partial class Empreport : aboutEmp
    {
        private BllApi.Empreport Empre = new BllApi.Empreport();

        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            {
                case "GetEmpInfo":
                    result = GetEmpInfo();
                    break;
                case "report":
                    result = report();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        //通过Id条件获得iEmployee
        private string GetEmpInfo()
        {
            string result = string.Empty;
            try
            {
                string type = Request["type"].Trim();
                string txt = Request["txt"].Trim();
                Hashtable parms = new Hashtable();
                parms.Add("@txt", txt);

                string sql = string.Format(@"select top 1 a.Id as EmpId,a.Code as EmpCode,a.Title as EmpTitle,getdate() as BaxaDate
                                                                     from iEmployee a
                                                                     where a.IsDeleted = 0 and a.DutyId in ({0})",Getwheresql());
                if (type.Equals("Code") || type.Equals("Id"))
                {
                    sql += string.Format(" and a.{0}=@txt", type);
                }
                DataTable dt = aEmp.ExecQuery(sql,parms);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"");
                result = "{succes:false,msg:'" + result + "'}";
            }
            return result;
        }

        //报到
        private string report()
        {
            string EmpId = Request["EmpId"];
            string EmpCode = Request["EmpCode"];
            string EmpTitle = Request["EmpTitle"];
            string BaxaDate = Request["BaxaDate"];

            Hashtable parms = new Hashtable();
            parms.Add("@EmpId",EmpId);
            parms.Add("@EmpCode",EmpCode);
            parms.Add("@EmpTitle",EmpTitle);
            parms.Add("@BaxaDate", BaxaDate);

            string result = string.Empty;
            if (!string.IsNullOrEmpty(EmpId))
            {
                if (IsCode(EmpCode) > 0)
                {
                    string sql = string.Format("select State from iEmployee where IsDeleted=0 and Id={0}", EmpId);
                    object state = aEmp.ExecScalar(sql);
                    if (state.ToString() == "待报到")
                    {
                        result = Empre.report(parms, CurrentUser.Id);
                    }
                    else
                    {
                        result = "{success:false,msg:'预报到员工不存在！'}";
                    }
                }
                else
                {
                    result = "{success:false,msg:'预报到员工不存在！'}";
                }
            }
            else
            {
                result = "{success:false}";
            }

            
            return result ;
            
        }
    }
}