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
    public partial class EmphiredSingle : aboutEmp
    {
        private BllApi.EmphiredSingle ehireds = new BllApi.EmphiredSingle();

        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            { 
                case "Search":
                    result = Search();
                    break;
                case "NewhireSingle":
                    result = NewhireSingle();
                    break;
                case "ShowhireSingleById":
                    result = ShowhireSingleById();
                    break;
                case "GetPerson_rehab":
                    result = GetPerson_rehab();
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
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);

                string HireDate = Request["HireDate"];
                string FireDate = Request["FireDate"];
                string DeptId = Request["DeptId"];
                string DutyTitle = Request["DutyTitle"];
                string EmpCode = Request["EmpCode"];
                string EmpTitle = Request["EmpTitle"];
                string FromDeptId = Request["FromDeptId"];
                string GroupState = Request["GroupState"];
                string Tel_Mobile = Request["Tel_Mobile"];

                Hashtable parms = new Hashtable();
                parms.Add("@HireDate", HireDate);
                parms.Add("@FireDate", FireDate);
                parms.Add("@DutyTitle", DutyTitle);
                parms.Add("@EmpCode", EmpCode);
                parms.Add("@EmpTitle", EmpTitle);
                parms.Add("@GroupState", GroupState);
                parms.Add("@Tel_Mobile", Tel_Mobile);

                #region 过滤
                if (DeptId.ToString() == "" || DeptId.ToString() == "0")
                {
                    DeptId = "";
                }
                else
                {
                    DeptId = string.Format(" and a.DeptId={0}", DeptId);
                }
                if (FromDeptId.ToString() == "" || FromDeptId.ToString() == "0")
                {
                    FromDeptId = "";
                }
                else
                {
                    FromDeptId = string.Format(" and a.FromDeptId={0}", FromDeptId);
                }
                if (string.IsNullOrEmpty(DutyTitle.ToString()))
                {
                    DutyTitle = "";
                }
                else
                {
                    DutyTitle = string.Format(" and a.DutyName like '%'+@DutyTitle+'%'");
                }
                if (string.IsNullOrEmpty(EmpCode.ToString()))
                {
                    EmpCode = "";
                }
                else
                {
                    EmpCode = string.Format(" and a.EmpCode like @EmpCode+'%'");
                }
                if (string.IsNullOrEmpty(EmpTitle.ToString()))
                {
                    EmpTitle = "";
                }
                else
                {
                    EmpTitle = string.Format(" and a.EmpTitle like '%'+@EmpTitle+'%'");
                }
                if (string.IsNullOrEmpty(GroupState.ToString()))
                {
                    GroupState = "";
                }
                else
                {
                    GroupState = string.Format(" and a.GroupType=@GroupState");
                }
                #endregion

                string sql = string.Format(@"select a.Id,CONVERT(varchar(100), a.CreateDate , 23) as CreateDate  
                                                                    ,a.EmpCode,a.EmpTitle,a.DeptName,isnull(b.Title,'') as FromDeptTitle,a.DutyName,a.GroupType,
                                                                             CONVERT(varchar(100), a.HireDate , 23)  as HireDate,
                                                                        a.Nvarchar2,a.Sex,a.Age,a.Degree,a.Tel,a.Mobile,a.Nvarchar1,a.MemoInfo
                                                                         from bEmpHired a
                                                                        left join iDept b on a.FromDeptId=b.Id and b.IsDeleted=0
                                                                        where a.IsDeleted=0
                                                                        and (HireDate between @HireDate and @FireDate )
                                                                       {0} {1} {2} {3} {4} {5}
                                                                         and a.Tel like '%'+@Tel_Mobile+'%' and a.Mobile like '%'+@Tel_Mobile+'%'
                                                                        and a.DutyId in ({6})"
                                                                    , DeptId, DutyTitle, EmpCode, EmpTitle, FromDeptId, GroupState, Getwheresql());
                
                DataTable dt = ehireds.GetPageData(sql, "order by CreateDate desc", start+1, limit,parms);

                sql = string.Format(@"select count(a.Id)
                                                                         from bEmpHired a
                                                                        left join iDept b on a.FromDeptId=b.Id and b.IsDeleted=0
                                                                        where a.IsDeleted=0
                                                                        and (HireDate between @HireDate and @FireDate )
                                                                       {0} {1} {2} {3} {4} {5}
                                                                         and a.Tel like '%'+@Tel_Mobile+'%' and a.Mobile like '%'+@Tel_Mobile+'%'
                                                                        and a.DutyId in ({6})"
                                                                   , DeptId, DutyTitle, EmpCode, EmpTitle, FromDeptId, GroupState, Getwheresql());

                int count = Convert.ToInt32(aEmp.ExecScalar(sql,parms));
                result = "{totalCount:"+count+",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
               
            }
            catch (Exception ex)
            {
                result=ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }

        //新建单据
        private string NewhireSingle()
        {
            int type = 1;
            #region 所有字段
            string EmpCode = null;
            string EmpTitle = Request["EmpTitle"];
            string State = Request["State"];
            string DeptName = Request["DeptName"];
            string DeptId = Request["DeptId"];
            string DutyName = Request["DutyName"];
            string DutyId = Request["DutyId"];
            string IsGlobal = Request["IsGlobal"];
            string Sex = Request["Sex"];
            string IdNo = Request["IdNo"];
            string HireDate = Request["HireDate"];
            string FireDate = Request["FireDate"];
            string Birthday = Request["Birthday"];
            string Degree = Request["Degree"];
            string Politics = Request["Politics"];
            string Tel = Request["Tel"];
            string Nvarchar2 = Request["Nvarchar2"];
            string Marriage = Request["Marriage"];
            string FromDeptId = Request["FromDeptId"];
            string BaseWage = Request["BaseWage"];
            string BaseWageInfo = Request["BaseWageInfo"];
            string Age = Request["Age"];
            string Rank = Request["Rank"];
            string Nvarchar1 = Request["Nvarchar1"];
            string Nation = Request["Nation"];
            string Nvarchar3 = Request["Nvarchar3"];
            string GroupType = Request["GroupType"];
            string Mobile = Request["Mobile"];
            string PepTalent = Request["PepTalent"];
            string PepNotes = Request["PepNotes"];
            string TrainRecords = Request["TrainRecords"];
            string SocRelations = Request["SocRelations"];
            string MemoInfo = Request["MemoInfo"];
            string UnitInfo = Request["UnitInfo"];
            string IdentInfo = Request["IdentInfo"];
            string PermInfo = Request["PermInfo"];
            #endregion

            #region 过滤
            if (string.IsNullOrEmpty(BaseWage.ToString()))
            {
                BaseWage = "0";
            }

            string sql = string.Empty;

            if (Nvarchar2 != null && Nvarchar2.ToString().Equals("复职"))
            {
                type = 2;
                EmpCode = Request["EmpCode"];
                sql = string.Format(@"select a.HireDate,a.FireDate,b.Title as DeptTitle,a.State from iEmployee a,iDept  b
                                                                       where a.IsDeleted=0 and b.IsDeleted=0 and a.DeptId=b.Id and a.Code='{0}'",EmpCode);
                DataTable dt = aEmp.ExecQuery(sql);
                string HireDateStr = "";
                string FireDateStr = "";
                string empOldDeptName = "";
                if ((dt != null) && (dt.Rows.Count > 0))
                {
                    if (!dt.Rows[0]["HireDate"].Equals(""))
                    {
                        HireDateStr = DateTime.Parse(dt.Rows[0]["HireDate"].ToString()).ToShortDateString();
                    }
                    if (!dt.Rows[0]["FireDate"].Equals(""))
                    {
                        FireDateStr = DateTime.Parse(dt.Rows[0]["FireDate"].ToString()).ToShortDateString();
                    }
                    if (!dt.Rows[0]["DeptTitle"].Equals(""))
                    {
                        empOldDeptName = dt.Rows[0]["DeptTitle"].ToString();
                    }
                }
                PepNotes += string.Format(@"{0} 于 {1} 至 {2} 在 {3} 工作过！  ", EmpTitle, HireDateStr, FireDateStr, empOldDeptName);
                
                //判断 复职 是否 合法:
                //1、根据code 查询是否存在该员工
                //2、该员工状态 是否 !离职 ，否则不允许
                if (dt == null || dt.Rows.Count == 0)
                {
                    return "{success:false,msg:'预复职的员工工号不存在，请确认正确！'}";
                }
                if (!"离职".Equals(dt.Rows[0]["State"].ToString()))
                {
                    return "{success:false,msg:'预复职的员工现在仍在岗，不能进行复职操作！'}";
                }
            }
            else
            {
                type = 1;

                sql = string.Format("exec sp_GetNewEmpCode");

                //sql = string.Format("exec sp_GetNewEmpCode_New {0}", DutyId);
                sql = "exec sp_GetNewEmpCode ";

                EmpCode = aEmp.ExecScalar(sql).ToString();
            }
            #endregion

            //检查身份证号码是否重复
            DataTable d = aEmp.ExecQuery("Select IdNo from iEmployee where Isdeleted=0 and Code<>'" + EmpCode.ToString()
                + "' and IdNo='" + IdNo.ToString() + "'");
            if (d != null && d.Rows.Count > 0)
            {
                return "{success:false,msg:'该身份证号码已经存在！'}";
            }

            #region parms
            Hashtable parms = new Hashtable();
            parms.Add("@EmpCode", EmpCode);
            parms.Add("@EmpTitle", EmpTitle);
            parms.Add("@State", State);
            parms.Add("@DeptName", DeptName);
            parms.Add("@DeptId", DeptId);
            parms.Add("@DutyName", DutyName);
            parms.Add("@DutyId", DutyId);
            parms.Add("@IsGlobal", IsGlobal);
            parms.Add("@Sex", Sex);
            parms.Add("@IdNo", IdNo);
            parms.Add("@HireDate", HireDate);
            parms.Add("@FireDate", FireDate);
            parms.Add("@Birthday", Birthday);
            parms.Add("@Degree", Degree);
            parms.Add("@Politics", Politics);
            parms.Add("@Tel", Tel);
            parms.Add("@Nvarchar2", Nvarchar2);
            parms.Add("@Marriage", Marriage);
            parms.Add("@FromDeptId", FromDeptId);
            parms.Add("@BaseWage", BaseWage);
            parms.Add("@BaseWageInfo", BaseWageInfo);
            parms.Add("@Age", Age);
            parms.Add("@Rank", Rank);
            parms.Add("@Nvarchar1", Nvarchar1);
            parms.Add("@Nation", Nation);
            parms.Add("@Nvarchar3", Nvarchar3);
            parms.Add("@GroupType", GroupType);
            parms.Add("@Mobile", Mobile);
            parms.Add("@PepTalent", PepTalent);
            parms.Add("@PepNotes", PepNotes);
            parms.Add("@TrainRecords", TrainRecords);
            parms.Add("@SocRelations", SocRelations);
            parms.Add("@MemoInfo", MemoInfo);
            parms.Add("@UnitInfo", UnitInfo);
            parms.Add("@IdentInfo", IdentInfo);
            parms.Add("@PermInfo", PermInfo);
            #endregion

            return ehireds.NewEmphiredSingle_iEmployee(parms, CurrentUser.Id, type);
        }
    
        //通过id显示某个录用单
        private string ShowhireSingleById()
        {
            string result = string.Empty;
            try
            {
                object Id = Request["Id"];
                String sql = @"SELECT ID,CreateDate,CreateID,ModifyDate,ModifyID,IsDeleted,EmpCode,EmpTitle,State,Age,DeptID,DeptName,DutyID,DutyName,IsGlobal,Sex,IdNo,Degree,Politics,Tel,Nvarchar2,Marriage,Rank,BaseWage,BaseWageInfo,Nvarchar1,Nation,PepTalent,Nvarchar3,PepNotes,SocRelations,TrainRecords,InsureNum,UnitInfo,IdentInfo,PermInfo,PermFlag,MemoInfo,FromDeptID,GroupType,Mobile,
	                            CONVERT(varchar(100), HireDate , 23) as HireDate,
	                            CONVERT(varchar(100), FireDate , 23) as FireDate,
	                            CONVERT(varchar(100), Birthday , 23) as Birthday
                            FROM bEmpHired where IsDeleted=0 and Id={0}";
                DataTable dt = aEmp.ExecQuery(string.Format(sql, Id));
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception)
            {
                
                throw;
            }
            return result;
        }

        //根据EmpTitle或IdNo或Code 获得 复职人员的信息
        private string GetPerson_rehab()
        {
            string result = string.Empty;
            try
            {
                string type = Request["type"];//处理类型：EmpTitle、IdNo
                string txt = Request["txt"];
                Hashtable parms = new Hashtable();
                parms.Add("@txt",txt);
                string sql = string.Format(@"select *,Code as EmpCode,Title as EmpTitle from iEmployee 
                                                                        where IsDeleted=0 and State='离职' and {0} = @txt", type);
                DataTable dt=aEmp.ExecQuery(sql, parms);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                //result = "{success:true,data:" + result +"}";
            }
            catch (Exception)
            {
                throw;
            }
            return result;
        }
    }
}