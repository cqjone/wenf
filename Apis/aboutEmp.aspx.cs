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
    public partial class aboutEmp :AuthBasePage
    {
        protected BllApi.aboutEmp aEmp = new BllApi.aboutEmp();
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            {
                case "GetDept":
                    result = GetDept();
                    break;
                case "GetDuty":
                    result = GetDuty();
                    break;
                case "GetEmpCode":
                    result = GetEmpCode(Request["query"]);
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        /// <summary>
        /// 获得所有部门
        /// </summary>
        /// <returns></returns>
        public string GetDept()
        {
            string query = Request["query"];
            Hashtable parms = new Hashtable();
            if (query == null && string.IsNullOrEmpty(query))
            {
                query = "";
            }
            else
            {
                parms.Add("@query",query);
                query = " and Title like '%'+@query+'%'";
            }
            string sql = string.Format(@"select Id as myId,Title as displayText from iDept 
                                                                  where IsDeleted=0 and DeptTypeId=1 
                                                                   {0}  order by Code ",query);
            return Newtonsoft.Json.JsonConvert.SerializeObject(aEmp.ExecQuery(sql,parms));
        }

        /// <summary>
        /// 获得所有职位
        /// </summary>
        /// <returns></returns>
        public string GetDuty()
        {
            string sql = string.Format("select Id as myId,Title as displayText from iDuty where IsDeleted=0 and Id in ({0}) order by Code", Getwheresql());
            return Newtonsoft.Json.JsonConvert.SerializeObject(aEmp.ExecQuery(sql));
        }

        //员工号
        public string GetEmpCode(string EmpCode)
        {
            string sql = string.Empty;
            if (EmpCode == null || string.IsNullOrEmpty(EmpCode))
            {
                sql = string.Format("select Id as myId,Code as displayText from iEmployee where IsDeleted=0 and DutyId in ({0}) order by Code", Getwheresql());
                return Newtonsoft.Json.JsonConvert.SerializeObject(aEmp.ExecQuery(sql));
            }
            else
            {
                Hashtable parms = new Hashtable();
                parms.Add("@EmpCode", EmpCode);
                sql = string.Format("select Id as myId,Code as displayText from iEmployee where IsDeleted=0 and Code like @EmpCode+'%' and DutyId in ({0}) order by Code", Getwheresql());
                return Newtonsoft.Json.JsonConvert.SerializeObject(aEmp.ExecQuery(sql, parms));
            }
        }

        /// <summary>
        /// 职位为收银员的 Id的sql语句
        /// </summary>
        /// <returns></returns>
        protected static string Getwheresql()
        {
            string sql = string.Format("select isnull(MetaValue,0) from iSystem where IsDeleted=0 and MetaKey='CasherDuty'");
            object Ids = (new aboutEmp()).aEmp.ExecScalar(sql);
            if (Ids != null  &&  Ids.ToString().Length > 0)
            {
                return Ids.ToString();
            }
            else
            {
                return "0";
            }

        }

        /// <summary>
        /// 判断员工Code是否存在
        /// </summary>
        /// <param name="EmpCode"></param>
        /// <returns></returns>
        protected static int IsCode(string EmpCode)
        {
            Hashtable parms = new Hashtable();
            parms.Add("@EmpCode", EmpCode);
            string sql = string.Format("select count(id) from iEmployee where IsDeleted=0 and  Code=@EmpCode and DutyId in ({0})",Getwheresql());
            int count = 0;
            try
            {
                count = (int)((new aboutEmp()).aEmp.ExecScalar(sql, parms));
            }
            catch (Exception)
            {
                throw;
            }
            return count;
        }

        /// <summary>
        /// 判断部门是否存在
        /// </summary>
        /// <returns></returns>
        protected static int IsDept(string DeptName)
        {
            Hashtable parms = new Hashtable();
            parms.Add("@DeptName", DeptName);
            string sql = string.Format("select Id from iEmployee where IsDeleted=0 and  Title=@DeptName and DutyTypeId=1");
            int Id = 0;
            try
            {
                Id = (int)((new aboutEmp()).aEmp.ExecScalar(sql, parms));
            }
            catch (Exception)
            {
                throw;
            }
            return Id;
        }
    }
}