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
    public partial class EmprehabSingle : aboutEmp
    {
        private BllApi.EmprehabSingle erehabs = new BllApi.EmprehabSingle();

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
                string rehabBegin = Request["rehabBegin"];
                string rehabEnd = Request["rehabEnd"];
                string FromDeptId = Request["FromDeptId"];
                string ToDeptId = Request["ToDeptId"];
                string FromDutyName = Request["FromDutyName"];
                string ToDutyName = Request["ToDutyName"];
                string EmpCode = Request["EmpCode"];
                string EmpTitle = Request["EmpTitle"];
                string IdNo = Request["IdNo"];

                Hashtable parms = new Hashtable();
                parms.Add("@rehabBegin", rehabBegin);
                parms.Add("@rehabEnd", rehabEnd);
                parms.Add("@FromDeptId",FromDeptId);
                parms.Add("@ToDeptId",ToDeptId);
                parms.Add("@FromDutyName",FromDutyName);
                parms.Add("@ToDutyName",ToDutyName);
                parms.Add("@EmpCode",EmpCode);
                parms.Add("@EmpTitle",EmpTitle);
                parms.Add("@IdNo", IdNo);

                #region 过滤
                if (string.IsNullOrEmpty(FromDeptId))
                {
                    FromDeptId = "";
                }
                else 
                {
                    FromDeptId = " and FromDeptId="+FromDeptId;
                }
                if (string.IsNullOrEmpty(ToDeptId))
                {
                    ToDeptId = "";
                }
                else
                {
                    ToDeptId = " and ToDeptId=" + ToDeptId;
                }
                if (string.IsNullOrEmpty(FromDutyName))
                {
                    FromDutyName = "";
                }
                else
                {
                    FromDutyName = string.Format(" and FromDutyName like '%'+@FromDutyName+'%'");
                }
                if (string.IsNullOrEmpty(ToDutyName))
                {
                    ToDutyName = "";
                }
                else
                {
                    ToDutyName = string.Format(" and ToDutyName like '%'+@ToDutyName+'%'");
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
                    EmpTitle = string.Format(" and EmpTitle like '%'+@EmpTitle+'%'");
                }
                if (string.IsNullOrEmpty(IdNo))
                {
                    IdNo = "";
                }
                else
                {
                    IdNo = string.Format(" and IdNo like '%'+@IdNo+'%'");
                }
                #endregion

                string sql = string.Format(@"select ID,EmpCode,EmpTitle,IdNo,FromDeptName,FromDutyName,ToDeptName,ToDutyName,MemoInfo
                                                  ,CONVERT(varchar(100),CreateDate, 23) AS CreateDate
                                                  ,CONVERT(varchar(100),ReinstatementDate, 23) AS ReinstatementDate
                                                from bEmpReinstatement  where IsDeleted=0 and (ReinstatementDate between @rehabBegin and @rehabEnd)
                                                                      {0} {1} {2} {3} {4} {5} {6} and ToDutyId in ({7})", FromDeptId, ToDeptId, FromDutyName, ToDutyName, EmpCode
                                                                      , EmpTitle,IdNo,Getwheresql());
                int start = int.Parse(Request["start"]);
                int limit = int.Parse(Request["limit"]);
                DataTable dt = erehabs.GetPageData(sql, "order by CreateDate desc", start + 1, limit, parms);

                sql = string.Format(@"select count(id) from bEmpReinstatement
                                                                      where IsDeleted=0 and (ReinstatementDate between @rehabBegin and @rehabEnd)
                                                                      {0} {1} {2} {3} {4} {5} {6} and ToDutyId in ({7})", FromDeptId, ToDeptId, FromDutyName, ToDutyName, EmpCode
                                                                      , EmpTitle, IdNo, Getwheresql());

                int count = (int)aEmp.ExecScalar(sql, parms);
                result = "{totalCount:" + count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
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
                    Id = string.Format(" and Id={0}", Id);
                }
                String sql = @"SELECT  ID,CreateDate,CreateID,ModifyDate,ModifyID,IsDeleted,EmpID,EmpCode,EmpTitle,IdNo,FromDeptID,FromDeptName,FromDutyID,FromDutyName,ToDeptID,ToDeptName,ToDutyID,ToDutyName,ReinstatementInfo,ManagerInfo,RensInfo,MemoInfo,PermFlag,
                                 CONVERT(varchar(100), PreFireDate , 23) as PreFireDate,
                                 CONVERT(varchar(100), ReinstatementDate , 23) as ReinstatementDate
                                FROM bEmpReinstatement  where IsDeleted=0 {0}";
                sql = string.Format(sql, Id);

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
                parms.Add("@txt",txt);
                string sql = string.Format(@"select top 1 a.Id as EmpId,a.Code as EmpCode,a.Title as EmpTitle,a.FireDate as PreFireDate,
                                                                     b.Title as FromDeptName,a.Duty as FromDutyName ,a.IdNo,getdate() as ReinstatementDate,
                                                                     a.DeptId as FromDeptId,a.DutyId as FromDutyId
                                                                     from iEmployee a,iDept b where a.IsDeleted = 0 and b.IsDeleted=0  and a.DeptId=b.Id and a.DutyId in ({0})", Getwheresql());
                if (type.Equals("Code") || type.Equals("Id") || type.Equals("IdNo"))
                {
                    sql += string.Format(" and a.{0}=@txt",type);
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
                result = ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }

        //新建一个复职Single
        private string NewSingle()
        {
            string result = string.Empty;
            try
            {
                #region
                string EmpId = Request["EmpId"];
                string EmpCode = Request["EmpCode"];
                string EmpTitle = Request["EmpTitle"];
                string IdNo = Request["IdNo"];
                string ReinstatementDate = Request["ReinstatementDate"];
                string FromDeptId = Request["FromDeptId"];
                string FromDeptName = Request["FromDeptName"];
                string FromDutyId = Request["FromDutyId"];
                string FromDutyName = Request["FromDutyName"];
                string ToDeptId = Request["ToDeptId"];
                string ToDeptName = Request["ToDeptName"];
                string ToDutyId = Request["ToDutyId"];
                string ToDutyName = Request["ToDutyName"];
                string ManagerInfo = Request["ManagerInfo"];
                string RensInfo = Request["RensInfo"];
                string MemoInfo = Request["MemoInfo"];
                string PreFireDate = Request["PreFireDate"];
                string ReinstatementInfo = Request["ReinstatementInfo"];

                Hashtable parms = new Hashtable();
                parms.Add("@EmpId",EmpId);
                parms.Add("@EmpCode",EmpCode);
                parms.Add("@EmpTitle",EmpTitle);
                parms.Add("@IdNo",IdNo);
                parms.Add("@ReinstatementDate",ReinstatementDate);
                parms.Add("@FromDeptId",FromDeptId);
                parms.Add("@FromDeptName",FromDeptName);
                parms.Add("@FromDutyId",FromDutyId);
                parms.Add("@FromDutyName",FromDutyName);
                parms.Add("@ToDeptId",ToDeptId);
                parms.Add("@ToDeptName",ToDeptName);
                parms.Add("@ToDutyId",ToDutyId);
                parms.Add("@ToDutyName",ToDutyName);
                parms.Add("@ManagerInfo",ManagerInfo);
                parms.Add("@RensInfo", RensInfo);
                parms.Add("@MemoInfo", MemoInfo);
                parms.Add("@PreFireDate", PreFireDate);
                parms.Add("@ReinstatementInfo", ReinstatementInfo);
                #endregion
                if (IsCode(EmpCode) > 0)
                {
                    string sql = string.Format(@"select count(id) from iEmployee where IsDeleted=0 and State<>'离职' and Id='{0}'", EmpId);
                    object index = aEmp.ExecScalar(sql);
                    if (index == null || Convert.ToInt32(index) <= 0)
                    {
                        return erehabs.NewSingle(parms, CurrentUser.Id);
                    }
                    else
                    {
                        return "{success:false,msg:'该员工未离职，请输入其他预复职员工！'}";
                    }
                }
                else
                {
                    return "{success:false,msg:'预复职员工不存在！'}";
                }
                
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }
    }
}