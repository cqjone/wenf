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
    public partial class EmpaskforleaveSingle : aboutEmp
    {
        private BllApi.EmpaskforleaveSingle eafls = new BllApi.EmpaskforleaveSingle();

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
                string FlowBegin = Request["FlowBegin"];
                string FlowEnd = Request["FlowEnd"];
                string FlowType = Request["FlowType"];
                string DutyName = Request["DutyName"];
                string EmpName = Request["EmpName"];
                string DeptId = Request["DeptId"];
                string EmpCode = Request["EmpCode"];

                Hashtable parms = new Hashtable();
                parms.Add("@FlowBegin", FlowBegin);
                parms.Add("@FlowEnd", FlowEnd);
                parms.Add("@FlowType", FlowType);
                parms.Add("@DutyName", DutyName);
                parms.Add("@EmpName", EmpName);
                parms.Add("@DeptId", DeptId);
                parms.Add("@EmpCode", EmpCode);

                #region 过滤
                if (string.IsNullOrEmpty(FlowType))
                {
                    FlowType = "";
                }
                else
                {
                    FlowType = " and FlowType=@FlowType";
                }
                if (string.IsNullOrEmpty(DutyName))
                {
                    DutyName = "";
                }
                else
                {
                    DutyName = " and DutyName like '%'+@DutyName+'%'";
                }
                if (string.IsNullOrEmpty(EmpName))
                {
                    EmpName = "";
                }
                else
                {
                    EmpName = " and EmpName like '%'+@EmpName+'%'";
                }
                if (string.IsNullOrEmpty(DeptId))
                {
                    DeptId = "";
                }
                else
                {
                    DeptId = " and FromDept=@DeptId";
                }
                if (string.IsNullOrEmpty(EmpCode))
                {
                    EmpCode = "";
                }
                else
                {
                    EmpCode = " and EmpCode like @EmpCode+'%'";
                }
                #endregion

                string sql = string.Format(@"select  ID,CONVERT(varchar(100),CreateDate, 23) AS CreateDate, 
                                                BaxaFlag,EmpCode,EmpName,FromDeptName,DutyName,FlowType,Days,FactDays,MemoInfo
                                                ,CONVERT(varchar(100),FlowDate, 23) AS FlowDate
                                                from bEmpHistory
                                                                      where IsDeleted=0 and (FlowDate between @FlowBegin and @FlowEnd) and type='请假'
                                                                      {0} {1} {2} {3} {4}  and DutyID in ({5})", FlowType, DutyName,EmpName, EmpCode
                                                                      , DeptId, Getwheresql());
                int start = int.Parse(Request["start"]);
                int limit = int.Parse(Request["limit"]);
                DataTable dt = eafls.GetPageData(sql, "order by CreateDate desc", start + 1, limit, parms);

                sql = string.Format(@"select count(Id) from bEmpHistory
                                                                      where IsDeleted=0 and (FlowDate between @FlowBegin and @FlowEnd) and type='请假'
                                                                      {0} {1} {2} {3} {4}  and DutyID in ({5})", FlowType, DutyName, EmpName, EmpCode
                                                                      , DeptId, Getwheresql());

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
                    Id = string.Format(" and Id={0}", Id);
                }

                string sql = string.Format(@"select  ID,CONVERT(varchar(100),CreateDate, 23) AS CreateDate, 
                                                BaxaFlag,EmpCode,EmpName,FromDeptName,DutyName,FlowType,Days,FactDays,MemoInfo
                                                ,CONVERT(varchar(100),FlowDate, 23) AS FlowDate
                                                from bEmpHistory where IsDeleted=0 and type='请假'   {0}", Id);

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
                string sql = string.Format(@"select top 1 a.ID,a.Code as EmpCode,a.Title as EmpName,b.Title as FromDeptName,
                                                                    Duty as DutyName, getdate() as FlowDate,a.DeptId,a.DutyId
                                                                    from iEmployee a,iDept b 
                                                                    where a.IsDeleted = 0 and b.IsDeleted=0 and a.DeptId=b.Id and a.DutyId in ({0})",Getwheresql());
                if (type.Equals("Code") || type.Equals("Id"))
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

        //新建一个请假Single
        private string NewSingle()
        {
            string result = string.Empty;
            try
            {
                #region
                string EmpId = Request["EmpId"];
                string EmpCode = Request["EmpCode"];
                string EmpName = Request["EmpName"];
                string FromDeptId = Request["FromDeptId"];
                string FromDeptName = Request["FromDeptName"];
                string DutyId = Request["DutyId"];
                string DutyName = Request["DutyName"];
                string FlowDate=Request["FlowDate"];
                string FlowType = Request["FlowType"];
                string Days = Request["Days"];
                string FromDeptInfo = Request["FromDeptInfo"];
                string RensInfo = Request["RensInfo"];
                string MemoInfo = Request["MemoInfo"];

                Hashtable parms = new Hashtable();
                parms.Add("@EmpId", EmpId);
                parms.Add("@EmpCode",EmpCode);
                parms.Add("@EmpName",EmpName);
                parms.Add("@FromDeptId", FromDeptId);
                parms.Add("@FromDeptName",FromDeptName);
                parms.Add("@DutyId", DutyId);
                parms.Add("@DutyName",DutyName);
                parms.Add("@FlowDate",FlowDate);
                parms.Add("@FlowType",FlowType);
                parms.Add("@Days",Days);
                parms.Add("@FromDeptInfo",FromDeptInfo);
                parms.Add("@RensInfo",RensInfo);
                parms.Add("@MemoInfo", MemoInfo);

                #endregion
                if (IsCode(EmpCode) > 0)
                {
                    #region
                    string sql = string.Format("select State from iEmployee where IsDeleted=0 and Id={0} and Code=@EmpCode", EmpId);
                    object state = aEmp.ExecScalar(sql, parms);
                    if (state == null || string.IsNullOrEmpty(state.ToString()))
                    {
                        return "{success:false,msg:'预请假的员工不存在！'}";
                    }
                    else if (state.Equals("离职"))
                    {
                        return "{success:false,msg:'该员工已经离职，请输入其他的预请假员工！'}";
                    }
                    else if (state.Equals("请假"))
                    {
                        return "{success:false,msg:'该员工已经请假，请输入其他的预请假员工！'}";
                    }
                    else if (state.Equals("在岗"))
                    {
                        return eafls.NewSingle(parms, CurrentUser.Id);
                    }
                    else
                    {
                        return "{success:false,msg:'预请假的员工不存在！'}";
                    }
                    #endregion
                }
                else 
                {
                    return "{success:false,msg:'预请假的员工不存在！'}";
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