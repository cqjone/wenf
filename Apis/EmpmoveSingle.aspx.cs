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
    public partial class EmpmoveSingle : aboutEmp
    {
        private BllApi.EmpmoveSingle emoves = new BllApi.EmpmoveSingle();

        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            {
                case "Search":
                    result = Search();
                    break;
                case "GetSingleById":
                    result = GetSingleById();
                    break;
                case "GetEmpInfo":
                    result = GetEmpInfo();
                    break;
                case "NewSingle":
                    result = NewSingle();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        //查询
        private string Search()
        {
            string result = string.Empty;
            try
            {
                string moveBegin = Request["moveBegin"];
                string moveEnd = Request["moveEnd"];
                string FromDeptId = Request["FromDeptId"];
                string ToDeptId = Request["ToDeptId"];
                string DutyName = Request["DutyName"];
                string EmpCode = Request["EmpCode"];
                string EmpTitle = Request["EmpTitle"];

                Hashtable parms = new Hashtable();
                parms.Add("@moveBegin", moveBegin);
                parms.Add("@moveEnd", moveEnd);
                parms.Add("@FromDeptId", FromDeptId);
                parms.Add("@ToDeptId", ToDeptId);
                parms.Add("@DutyName", DutyName);
                parms.Add("@EmpCode", EmpCode);
                parms.Add("@EmpTitle", EmpTitle);

                #region 过滤
                if (string.IsNullOrEmpty(FromDeptId))
                {
                    FromDeptId = "";
                }
                else
                {
                    FromDeptId = " and FromDept=" + FromDeptId;
                }
                if (string.IsNullOrEmpty(ToDeptId))
                {
                    ToDeptId = "";
                }
                else
                {
                    ToDeptId = " and ToDept=" + ToDeptId;
                }
                if (string.IsNullOrEmpty(DutyName))
                {
                    DutyName = "";
                }
                else
                {
                    DutyName = string.Format(" and DutyName like '%'+@DutyName+'%'");
                }
                if (string.IsNullOrEmpty(EmpCode))
                {
                    EmpCode = "";
                }
                else
                {
                    EmpCode = string.Format(" and EmpCode like @EmpCode+'%'");
                }
                if (string.IsNullOrEmpty(EmpTitle))
                {
                    EmpTitle = "";
                }
                else
                {
                    EmpTitle = string.Format(" and EmpName like '%'+@EmpTitle+'%'");
                }
                #endregion

                string sql = string.Format(@"select ID,CONVERT(varchar(100),CreateDate, 23) AS CreateDate,BaxaFlag,EmpCode,
                                                EmpName,FromDeptName,ToDeptName,DutyName,Sex,Age,BaseWage,ShqinnInfo,MemoInfo,
                                                 CONVERT(varchar(100),FlowDate, 23) AS FlowDate
                                                from bEmpHistory
                                                                      where IsDeleted=0 and (FlowDate between @moveBegin and @moveEnd) and type='调动'
                                                                      {0} {1} {2} {3} {4}  and DutyID in ({5})", FromDeptId, ToDeptId, DutyName, EmpCode
                                                                      , EmpTitle, Getwheresql());
                int start = int.Parse(Request["start"]);
                int limit = int.Parse(Request["limit"]);
                DataTable dt = emoves.GetPageData(sql, "order by CreateDate desc", start + 1, limit, parms);

                sql = string.Format(@"select count(id) from bEmpHistory
                                                                      where IsDeleted=0 and (FlowDate between @moveBegin and @moveEnd) and type='调动'
                                                                      {0} {1} {2} {3} {4}  and DutyID in ({5})", FromDeptId, ToDeptId, DutyName, EmpCode
                                                                      , EmpTitle, Getwheresql());

                int count = (int)aEmp.ExecScalar(sql, parms);
                result = "{totalCount:" + count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"");
                result = "{success:false,msg:'" + result + "'}";
            }
            return result;
        }

        //通过Id条件获得复职单
        private string GetSingleById()
        {
            string result = string.Empty;
            try
            {
                object Id = Request["Id"];
                if (Id == null || string.IsNullOrEmpty(Id.ToString()))
                {
                    Id = "";
                }
                else
                {
                    Id = string.Format(" and a.Id={0}", Id);
                }

                string sql = string.Format(@"select top 1 a.EmpCode,a.EmpName,a.FromDeptName,a.ToDeptName,a.DutyName,a.Nvarchar1,a.Age,a.Sex,a.BaseWage,
                                                                     a.BaseWageInfo,a.FromDeptInfo,a.ToDeptInfo,a.RensInfo,a.MemoInfo,a.ShqinnInfo
                                                                     ,CONVERT(varchar(100),FlowDate, 23) AS FlowDate,b.IdNo
                                                                     from bEmpHistory a,iEmployee b
                                                                     where a.IsDeleted=0 and b.IsDeleted=0 and a.EmpId=b.Id and a.type='调动'   {0}", Id);

                DataTable dt = aEmp.ExecQuery(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"");
                result = "{succes:false,msg:'" + result + "'}";
            }
            return result;
        }

        //通过搜索条件获得iEmployee信息
        private string GetEmpInfo()
        {
            string result = string.Empty;
            try
            {
                string type = Request["type"].Trim();
                string txt = Request["txt"].Trim();
                Hashtable parms = new Hashtable();
                parms.Add("@txt", txt);
                string sql = string.Format(@"select top 1 a.Id as EmpId,a.Code as EmpCode,a.Title as EmpName,a.IdNo,b.Title as FromDeptName,getdate() as FlowDate,
                                                                      Duty as FromDutyName,a.Nvarchar1,a.Sex,a.Age,a.DutyId as FromDutyId,a.Duty as FromDutyName,b.Id as FromDeptId,
                                                                       a.BaseWage as FromBaseWage,a.BaseWageInfo as FromBaseWageInfo
                                                                      from iEmployee a,iDept b where a.IsDeleted = 0 and b.IsDeleted=0 and a.DeptId=b.Id and a.DutyId in ({0})",Getwheresql());
                if (type.Equals("Code") || type.Equals("Id") || type.Equals("IdNo"))
                {
                    sql += string.Format(" and a.{0}=@txt", type);
                }
                else if (type.Equals("Title"))
                {
                    string DeptName = Request["txt1"].Trim();
                    parms.Add("@DeptName", DeptName);
                    sql += string.Format(" and a.Title=@txt and b.Title=@DeptName");
                }

                DataTable dt = aEmp.ExecQuery(sql, parms);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"");
                result = "{success:false,msg:'" + result + "'}";
            }
            return result;
        }

        //新建一个调动Single
        private string NewSingle()
        {
            string result = string.Empty;
            try
            {
                #region
                string Age = Request["Age"];
                string BaseWage = Request["BaseWage"];
                string BaseWageInfo = Request["BaseWageInfo"];
                string DutyId = Request["DutyId"];
                string EmpCode = Request["EmpCode"];
                string EmpName = Request["EmpName"];
                string FlowDate = Request["FlowDate"];
                string FromBaseWage = Request["FromBaseWage"];
                string FromBaseWageInfo = Request["FromBaseWageInfo"];
                string FromDeptId = Request["FromDeptId"];
                string FromDeptInfo = Request["FromDeptInfo"];
                string FromDeptName = Request["FromDeptName"];
                string FromDutyID = Request["FromDutyID"];
                string FromDutyName = Request["FromDutyName"];
                string EmpId = Request["EmpId"];
                string MemoInfo = Request["MemoInfo"];
                string Nvarchar1 = Request["Nvarchar1"];
                string RensInfo = Request["RensInfo"];
                string ToDeptInfo = Request["ToDeptInfo"];
                string Sex = Request["Sex"];
                string ShqinnInfo = Request["ShqinnInfo"];
                string ToDeptId = Request["ToDeptId"];
                string ToDeptName = Request["ToDeptName"];
                string ToDutyName = Request["ToDutyName"];

                if (string.IsNullOrEmpty(BaseWage))
                {
                    BaseWage = "0.000000";
                }

                Hashtable parms = new Hashtable();
                parms.Add("@Age",Age); 
                parms.Add("@BaseWage",BaseWage); 
                parms.Add("@BaseWageInfo",BaseWageInfo); 
                parms.Add("@DutyId",DutyId); 
                parms.Add("@EmpCode",EmpCode); 
                parms.Add("@EmpName",EmpName); 
                parms.Add("@FlowDate",FlowDate); 
                parms.Add("@FromBaseWage",FromBaseWage); 
                parms.Add("@FromBaseWageInfo",FromBaseWageInfo); 
                parms.Add("@FromDeptId",FromDeptId); 
                parms.Add("@FromDeptInfo",FromDeptInfo); 
                parms.Add("@FromDeptName",FromDeptName); 
                parms.Add("@FromDutyID",FromDutyID); 
                parms.Add("@FromDutyName",FromDutyName); 
                parms.Add("@EmpId",EmpId); 
                parms.Add("@MemoInfo",MemoInfo); 
                parms.Add("@Nvarchar1",Nvarchar1); 
                parms.Add("@RensInfo",RensInfo); 
                parms.Add("@ToDeptInfo",ToDeptInfo); 
                parms.Add("@Sex",Sex); 
                parms.Add("@ShqinnInfo",ShqinnInfo); 
                parms.Add("@ToDeptId",ToDeptId); 
                parms.Add("@ToDeptName",ToDeptName); 
                parms.Add("@ToDutyName", ToDutyName); 

                #endregion
                if (IsCode(EmpCode) > 0)
                {
                    string sql = string.Format(@"select count(id) from iEmployee where IsDeleted=0 and State<>'离职' and Id='{0}'", EmpId);
                    object index = aEmp.ExecScalar(sql);
                    if (index != null || Convert.ToInt32(index) > 0)
                    {
                        return emoves.NewSingle(parms, CurrentUser.Id);
                    }
                    else
                    {
                        return "{success:false,msg:'预调动的员工不存在！'}";
                    }
                }
                else
                {
                    return "{success:false,msg:'预调动的员工不存在！'}";
                }
                
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"");
                result = "{success:false,msg:'" + result + "'}";
            }
            return result;
        }
    }
}