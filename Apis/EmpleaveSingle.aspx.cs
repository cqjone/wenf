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
    public partial class EmpleaveSingle : aboutEmp
    {
        /// <summary>
        /// EmpleaveSingle_BLL
        /// </summary>
        private BllApi.EmpleaveSingle eleaves = new BllApi.EmpleaveSingle();

        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            { 
                case "Search":
                    result = Search();
                    break;
                case "ShowsingleById":
                    result = ShowsingleById();
                    break;
                case "NewEmpleaveSingle":
                    result = NewEmpleaveSingle();
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
                string LeaveDateBegin = Request["LeaveDateBegin"];
                string LeaveDateEnd = Request["LeaveDateEnd"];
                object DeptId = Request["DeptId"];
                string DutyName = Request["DutyName"].Trim();
                string EmpCode = Request["EmpCode"].Trim();
                string EmpTitle = Request["EmpTitle"].Trim();
                string LeaveType = Request["LeaveType"];

                Hashtable parms = new Hashtable();
                if (!String.IsNullOrEmpty(DutyName))
                {
                    parms.Add("@DutyName", DutyName);
                }

                if (!String.IsNullOrEmpty(EmpCode))
                {
                    parms.Add("@EmpCode", EmpCode);
                }

                if (!String.IsNullOrEmpty(EmpTitle))
                {
                    parms.Add("@EmpTitle", EmpTitle);
                }
                
                
              

                #region 过滤
                if (string.IsNullOrEmpty(DeptId.ToString()) && DeptId.ToString() != "0")
                {
                    DeptId = "";
                }
                else
                {
                    DeptId = string.Format(" and DeptId = {0}",DeptId);
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
                    EmpTitle = string.Format(" and EmpTitle like '%'+@EmpTitle+'%'");
                }
                if (string.IsNullOrEmpty(LeaveType))
                {
                    LeaveType = "";
                }
                else
                {
                    LeaveType = string.Format(" and LeaveType='{0}'", LeaveType);
                }
                #endregion

                string sql = string.Format(@" select ID,CONVERT(varchar(100),CreateDate, 23) AS CreateDate ,EmpCode,EmpTitle,Sex,DeptName,DutyName,LeaveInfo,LeaveType,MemoInfo
                                                ,CONVERT(varchar(100),LeaveDate, 23) AS LeaveDate
                                                from bEmpLeave where IsDeleted=0 and (LeaveDate between '{0}' and '{1}')
                                                                      {2} {3} {4} {5} {6} and dutyid in ({7})", LeaveDateBegin, LeaveDateEnd, DeptId, DutyName, EmpCode, EmpTitle, LeaveType, Getwheresql());
                int start = int.Parse(Request["start"]);
                int limit = int.Parse(Request["limit"]);
                DataTable dt = eleaves.GetPageData(sql, "order by CreateDate desc", start + 1, limit, parms);

//                sql = string.Format(@"select count(*) from bEmpLeave where IsDeleted=0 and (LeaveDate between '{0}' and '{1}')
//                                                           {2} {3} {4} {5} {6} and dutyid in ({7})", LeaveDateBegin, LeaveDateEnd, DeptId, DutyName, EmpCode, EmpTitle, LeaveType, Getwheresql());

                //int count = (int)aEmp.ExecScalar(sql,parms);
                int count = dt.Rows.Count;
               result = "{totalCount:" + count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result=ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }

        //通过Id 显示leaveSingle
        private string ShowsingleById()
        {
            string result = string.Empty;
            try
            {
                object Id = Request["Id"];// iEmployee _ Id
                string type = Request["type"];
                string sql = string.Empty;

                if (type.Equals("StoreDBClick"))
                {
                    sql = string.Format(@"select a.Code as EmpCode,a.Title as EmpTitle,b.Title as DeptName,c.LeaveType,CONVERT(varchar(100), LeaveDate , 23) LeaveDate,c.LeaveInfo,
                                                                        a.Duty as DutyName,a.Sex,a.State,c.DeptInfo,c.ManagerInfo,c.MemoInfo
                                                                        from iEmployee a,iDept b,bEmpLeave c
                                                                        where a.IsDeleted=0 and b.IsDeleted=0 and c.IsDeleted=0
                                                                        and a.DeptId=b.Id and c.EmpId=a.Id and c.Id={0}", Id);
                }
                else if (type.Equals("Newsingle"))
                {
                    #region  过滤
                    if (Id==null || string.IsNullOrEmpty(Id.ToString()))
                    {
                        Id = "";
                    }
                    else
                    {
                        Id = string.Format(" and a.Id={0}",Id);
                    }
                    object EmpCode = Request["EmpCode"];
                    if (EmpCode == null || string.IsNullOrEmpty(EmpCode.ToString()))
                    {
                        EmpCode = "";
                    }
                    else 
                    {
                        EmpCode = string.Format(" and a.Code='{0}'", EmpCode);
                    }
                    object EmpTitle = Request["EmpTitle"];
                    if (EmpTitle == null || string.IsNullOrEmpty(EmpTitle.ToString()))
                    {
                        EmpTitle = "";
                    }
                    else
                    {
                        EmpTitle = string.Format(" and a.Title='{0}'", EmpTitle);
                    }
                    object DeptName = Request["DeptName"];
                    if (DeptName == null || string.IsNullOrEmpty(DeptName.ToString()))
                    {
                        DeptName = "";
                    }
                    else
                    {
                        DeptName = string.Format(" and b.Title like '%{0}%'", DeptName);
                    }
                    #endregion
                    sql = string.Format(@"select top 1 a.Id as EmpId,a.Code as EmpCode,a.Title as EmpTitle,a.DeptId,b.Title as DeptName,a.DutyId,
                                                                 a.Duty as DutyName,a.State,a.Sex,CONVERT(varchar(100), GetDate() , 23) as LeaveDate 
                                                                from iEmployee a,iDept b
                                                                where a.IsDeleted=0 and b.IsDeleted=0 
                                                                and a.DeptId=b.Id {0} {1} {2} {3} and a.DutyId in ({4})", Id, EmpCode, EmpTitle, DeptName,Getwheresql());
                }



                result = Newtonsoft.Json.JsonConvert.SerializeObject(aEmp.ExecQuery(sql));
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }

        //New 一个 EmpleaveSingle
        private string NewEmpleaveSingle()
        {
            #region 
            string EmpId = Request["EmpId"];
            string EmpCode = Request["EmpCode"];
            string LeaveDate = Request["LeaveDate"];
            string EmpTitle = Request["EmpTitle"];
            string DutyId = Request["DutyId"];
            string DutyName = Request["DutyName"];
            string DeptId = Request["DeptId"];
            string DeptName = Request["DeptName"];
            string Sex = Request["Sex"];
            string LeaveType = Request["LeaveType"];
            string State = Request["State"];
            string LeaveInfo = Request["LeaveInfo"];
            string ManagerInfo = Request["ManagerInfo"];
            string DeptInfo = Request["DeptInfo"];
            string MemoInfo = Request["MemoInfo"];
            #endregion

            #region parms参数
            Hashtable parms = new Hashtable();
            parms.Add("@EmpId", EmpId);
            parms.Add("@EmpCode",EmpCode);
            parms.Add("@LeaveDate",LeaveDate);
            parms.Add("@EmpTitle",EmpTitle);
            parms.Add("@DutyId", DutyId);
            parms.Add("@DutyName",DutyName);
            parms.Add("@DeptId", DeptId);
            parms.Add("@DeptName",DeptName);
            parms.Add("@Sex",Sex);
            parms.Add("@LeaveType",LeaveType);
            parms.Add("@State",State);
            parms.Add("@LeaveInfo",LeaveInfo);
            parms.Add("@ManagerInfo",ManagerInfo);
            parms.Add("@DeptInfo",DeptInfo);
            parms.Add("@MemoInfo", MemoInfo);
            #endregion

            
            int count = IsCode(EmpCode.ToString());

            if (count > 0)
            {
                string sql = string.Format(@"select count(id) from iEmployee where IsDeleted=0 and State='离职' and Code='{0}'", EmpCode);
                count = (int)aEmp.ExecScalar(sql);
                if (count <= 0)
                {
                    return eleaves.NewEmpleaveSingle(parms, CurrentUser.Id);
                }
                else
                {
                    return "{success:false,msg:'该员工已经离职，请输入其他预离职员工！'}";
                }
            }
            else
            {
                return "{success:false,msg:'预离职员工不存在！'}";
            }
           
        }
    }
}