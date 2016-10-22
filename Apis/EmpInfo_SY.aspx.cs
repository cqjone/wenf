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
    public partial class EmpInfo_SY : aboutEmp
    {
        BllApi.EmpInfo_SY sy = new BllApi.EmpInfo_SY();

        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            { 
                case "Search":
                    result = Search();
                    break;
                case "GetEmpById":
                    result = GetEmpById();
                    break;
                case "GetbEmpHistory":
                    result = GetbEmpHistory();
                    break;
                case "GetEmpPayerInsure":
                    result = GetEmpPayerInsure();
                    break;
                case "Update":
                    result = Update();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        //搜索
        private string Search() 
        {
            string result = string.Empty ;
            try
            {
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                #region
                string EmpCode = Request["EmpCode"];
                string EmpTitle = Request["EmpTitle"];
                string DeptId = Request["DeptId"];
                string State = Request["State"];
                string DutyId = Request["DutyId"];
                string Sex = Request["Sex"];
                string IdNo = Request["IdNo"];
                string Nvarchar1 = Request["Nvarchar1"];
                string FromDeptId = Request["FromDeptId"];
                string GroupType = Request["GroupState"];
                string Tel_Mobile = Request["Tel_Mobile"];

                Hashtable parms = new Hashtable();
                parms.Add("@EmpCode",EmpCode);
                parms.Add("@EmpTitle",EmpTitle);
                parms.Add("@IdNo",IdNo);
                parms.Add("@Nvarchar1",Nvarchar1);
                parms.Add("@Tel_Mobile", Tel_Mobile);
                #region 过滤
                if (EmpCode == null || string.IsNullOrEmpty(EmpCode))
                {
                    EmpCode = "";
                }
                else
                {
                    EmpCode = " and a.Code like @EmpCode+'%'";
                }
                if (EmpTitle == null || string.IsNullOrEmpty(EmpTitle))
                {
                    EmpTitle = "";
                }
                else
                {
                    EmpTitle = " and a.Title like '%'+@EmpTitle+'%'";
                }
                if (DeptId == null || string.IsNullOrEmpty(DeptId))
                {
                    DeptId = "";
                }
                else
                {
                    DeptId = string.Format(" and a.DeptId={0}", DeptId);
                }
                if (State == null || string.IsNullOrEmpty(State))
                {
                    State = "";
                }
                else
                {
                    State = string.Format(" and a.State='{0}'",State);
                }
                if (DutyId == null || string.IsNullOrEmpty(DutyId))
                {
                    DutyId = "";
                }
                else
                {
                    DutyId = string.Format(" and a.DutyId={0}", DutyId);
                }
                if (Sex == null || string.IsNullOrEmpty(Sex))
                {
                    Sex = "";
                }
                else
                {
                    Sex = string.Format(" and Sex='{0}'", Sex);
                }
                if (IdNo == null || string.IsNullOrEmpty(IdNo))
                {
                    IdNo = "";
                }
                else
                {
                    IdNo = " and a.IdNo like '%'+@IdNo+'%'" ;
                }
                if (Nvarchar1 == null || string.IsNullOrEmpty(Nvarchar1))
                {
                    Nvarchar1 = "";
                }
                else
                {
                    Nvarchar1 = " and a.Nvarchar1 like '%'+@Nvarchar1+'%'";
                }
                if (FromDeptId == null || string.IsNullOrEmpty(FromDeptId))
                {
                    FromDeptId = "";
                }
                else
                {
                    FromDeptId = string.Format("and a.FromDeptId={0}", FromDeptId);
                }
                if (GroupType == null || string.IsNullOrEmpty(GroupType))
                {
                    GroupType = "";
                }
                else
                {
                    GroupType = string.Format("and a.GroupType='{0}'", GroupType);
                }
                if (Tel_Mobile == null || string.IsNullOrEmpty(Tel_Mobile))
                {
                    Tel_Mobile = "";
                }
                else
                {
                    Tel_Mobile = "and a.Tel_Mobile like '%'+@Tel_Mobile+'%'";
                }
                #endregion

                #endregion

                string sql = string.Format(@"select a.ID as ID,a.Code as Code,a.Title as Title,a.Sex as Sex,a.IdNo as IdNo,
                                                                    isnull(b.Title,'') as DeptName,isnull(c.Title,'') as DutyName,isnull(d.Title,'') as FromDeptName,
                                                                    IsGlobalName = case when a.IsGlobal = 0 then '否' else '是' end,
                                                                    a.State as State,a.Degree as Degree,a.Tel as Tel,a.Mobile as Mobile,a.Nvarchar2 as Nvarchar2,a.Rank as Rank,
                                                                    a.Nation as Nation,a.Politics as Politics,a.Marriage as Marriage,a.GroupType as GroupType,
                                                                    a.HireDate as HireDate,a.FireDate as FireDate,a.BaseWage as BaseWage,a.BaseWageInfo as BaseWageInfo,
                                                                    a.TrainRecords as TrainRecords,a.MemoInfo as MemoInfo,a.PepNotes as PepNotes,a.Nvarchar1 as Nvarchar1
                                                                    from iEmployee as a
                                                                    left join iDept b on a.DeptID = b.ID
                                                                    left join iDuty c on a.DutyID = c.ID
                                                                    left join iDept d on a.FromDeptID = d.ID
                                                                    where a.IsDeleted = 0 
                                                                    {0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {10}  and a.DutyId in ({11})", EmpCode, EmpTitle, DeptId, State, DutyId, Sex, IdNo, Nvarchar1, FromDeptId, GroupType, Tel_Mobile,Getwheresql());
                DataTable dt=aEmp.GetPageData(sql, "order by Code asc", start + 1, limit,parms);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                sql = string.Format(@"select  count(a.ID)  from iEmployee as a
                                                                    left join iDept b on a.DeptID = b.ID
                                                                    left join iDuty c on a.DutyID = c.ID
                                                                    left join iDept d on a.FromDeptID = d.ID
                                                                    where a.IsDeleted = 0 
                                                                    {0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {10}  and a.DutyId in ({11})", EmpCode, EmpTitle, DeptId, State, DutyId, Sex, IdNo, Nvarchar1, FromDeptId, GroupType, Tel_Mobile, Getwheresql());
                int count = (int)aEmp.ExecScalar(sql,parms);
                result = "{totalCount:" + count + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"'");
                result = "{success:false,msg:'"+result+"'}";
            }

            return result;
        }

        //通过Emp Id获得Emp基本信息
        private string GetEmpById()
        {
            string result = string.Empty;
            try
            {
                string Id = Request["Id"];
                string sql = string.Format(@"select a.Id,a.Code,a.Title,a.State,a.Duty as DutyName,a.IsGlobal,a.Sex,a.IdNo,
                                                                    a.Degree,a.Politics,a.Tel,a.Nvarchar2,a.Marriage,a.BaseWage,a.BaseWageInfo,a.Age,a.Rank,a.Nvarchar1,a.Nation,
                                                                    a.Nvarchar3,a.GroupType,a.Mobile,a.PepTalent,a.PepNotes,a.TrainRecords,a.SocRelations,a.MemoInfo,
                                                                    b.Title as DeptName,c.Title as FromDeptName,
                                                                    CONVERT(varchar(100),HireDate, 23) AS HireDate,
                                                                    CONVERT(varchar(100),FireDate, 23) AS FireDate,
                                                                    CONVERT(varchar(100),Birthday, 23) AS Birthday
                                                                    from iEmployee a
                                                                    left join iDept b on a.DeptId=b.Id
                                                                    left join iDept c on a.FromDeptId=c.Id
                                                                    where a.IsDeleted=0 and a.Id={0}", Id);
                DataTable dt = aEmp.ExecQuery(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }

        //通过Emp Id 获得Emp 调动信息
        private string GetbEmpHistory()
        {
            string result = string.Empty;
            try
            {
                string Id=Request["Id"];
                string sql = string.Format(@"select EmpId,CONVERT(varchar(100),FlowDate, 23) AS FlowDate,FromDeptName,FromDutyName,ToDeptName,DutyName
                                                                        from bEmpHistory
                                                                        where IsDeleted=0 and [Type]='调动' and EmpId={0}",Id);
                DataTable dt = aEmp.ExecQuery(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }

        //通过Emp Id 获得保险缴费记录
        private string GetEmpPayerInsure()
        {
            string result = string.Empty;
            try
            {
                string Id=Request["Id"];
                string sql = string.Format(@"select CONVERT(varchar(100),PayerDate, 23) AS PayerDate,InsureName,PayerMoney from bEmpPayerInsureList
                                                                        where EmpId={0}",Id);
                DataTable dt = aEmp.ExecQuery(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }

        //更新Emp基本信息
        private string Update()
        {
            string Id = Request["Id"];
            string Politics = Request["Politics"];//政治面貌
            string Tel = Request["Tel"];
            string Marriage = Request["Marriage"];
            string BaseWage = Request["BaseWage"];
            string BaseWageInfo = Request["BaseWageInfo"];
            string Age = Request["Age"];
            string Rank = Request["Rank"];//星级
            string Mobile = Request["Mobile"];
            string PepTalent = Request["PepTalent"];//特长
            string TrainRecords = Request["TrainRecords"];//岗位培训记录
            string SocRelations = Request["SocRelations"];//社会关系
            string MemoInfo = Request["MemoInfo"];

            Hashtable parms = new Hashtable();
            parms.Add("@Id",Id);
            parms.Add("@Politics", Politics);
            parms.Add("@Tel", Tel);
            parms.Add("@Marriage", Marriage);
            parms.Add("@BaseWage", BaseWage);
            parms.Add("@BaseWageInfo", BaseWageInfo);
            parms.Add("@Age", Age);
            parms.Add("@Rank", Rank);
            parms.Add("@Mobile", Mobile);
            parms.Add("@PepTalent", PepTalent);
            parms.Add("@TrainRecords", TrainRecords);
            parms.Add("@SocRelations", SocRelations);
            parms.Add("@MemoInfo", MemoInfo);

            return sy.Update(parms,CurrentUser.Id); ;
        }
    }

}