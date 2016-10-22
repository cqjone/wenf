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
    public partial class EmpSickleave : aboutEmp
    {
        private BllApi.EmpSickleave EmpSicleave = new BllApi.EmpSickleave();
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            {
                case "GetEmpInfo":
                    result = GetEmpInfo();
                    break;
                case "Sickleave":
                    result = Sickleave();
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
                DataTable dt = aEmp.ExecQuery(sql, parms);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"");
                result = "{succes:false,msg:'" + result + "'}";
            }
            return result;
        }

        //销假
        private string Sickleave()
        {
            string EmpId = Request["EmpId"];
            string EmpCode = Request["EmpCode"];
            string EmpTitle = Request["EmpTitle"];
            string BaxaDate = Request["BaxaDate"];

            Hashtable parms = new Hashtable();
            parms.Add("@EmpId", EmpId);
            parms.Add("@EmpCode", EmpCode);
            parms.Add("@EmpTitle", EmpTitle);
            parms.Add("@BaxaDate", BaxaDate);

            if (!string.IsNullOrEmpty(EmpId))
            {
                if (IsCode(EmpCode) > 0)
                {
                    string sql = string.Format("select State from iEmployee where IsDeleted=0 and Id={0}", EmpId);
                    string state = aEmp.ExecScalar(sql).ToString();
                    if (state.Equals("请假"))
                    {
                        return EmpSicleave.Sickleave(parms, CurrentUser.Id);
                    }
                    else
                    {
                        return "{success:false,msg:'预销假员工不存在！'}";
                    }
                }
                else
                {
                    return "{success:false,msg:'预销假员工不存在！'}";
                }
            }
            else
            {
                return "{success:false}";
            }
        }

    }
}