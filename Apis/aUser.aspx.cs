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
    public partial class aUser : AuthBasePage
    {
        private BllApi.aUserApis auser = new BllApi.aUserApis();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string result = string.Empty;
                switch (ActionName)
                {
                    case "ShowDept":
                        result = ShowDept();
                        break;
                    case "ShowaGroup":
                        result = ShowaGroup();
                        break;
                    case "SearchaUser":
                        result = SearchaUser();
                        break;
                    case "ShowaUserbyId":
                        result = ShowaUserbyId();
                        break;
                    case "AddaUser":
                        result = AddaUser();
                        break;
                    case "aUserEdit":
                        result = aUserEdit();
                        break;
                    case "DelaUserbyId":
                        result = DelaUserbyId();
                        break;
                    case "ShowEmployeeByDeptId":
                        result = ShowEmployeeByDeptId();
                        break;
                    case "ReadEmployeeTitle":
                        result = ReadEmployeeTitle();
                        break;
                }
                Response.Write(result);
                Response.End();
            }
        }

        //读取员工名字
        private string ReadEmployeeTitle()
        {
            object result = "{success:true,msg:''}";
            string EmployeeId = Request["EmployeeId"];
            string sql = string.Format(@"select Title from iEmployee where IsDeleted=0 and Id={0}", EmployeeId);
            result = auser.ExecScalar(sql);
            if (result != null && result.ToString().Length > 0)
            {
                result = "{success:true,msg:'" + result + "'}";
            }
            else
            {
                result = "{success:true,msg:''}";
            }
            return result.ToString();
        }

        //获得所有部门名称
        private string ShowDept()
        {
            string DeptTypeId = Request["DeptTypeId"];
            string query = Request["query"];
            Hashtable parms = new Hashtable();
            if (DeptTypeId == null || string.IsNullOrEmpty(DeptTypeId)|| DeptTypeId=="0")
            {
                DeptTypeId = "";
            }
            else
            {
                DeptTypeId = string.Format(" and DeptTypeId={0}", DeptTypeId);
            }
            if (query == null || string.IsNullOrEmpty(query))
            {
                query = "";
            }
            else
            {
                parms.Add("@query", query);
                query = string.Format(" and Title like '%'+@query+'%'");
            }

            string sql = string.Format(@"select Id as myId,Title as displayText 
                                                                   from iDept where IsDeleted=0 {0} {1}",DeptTypeId,query);
            if (Request["type"].Equals("Search"))
            {
                sql += " union select 0 as myId,'全部' as displayText";
            }
            DataTable dt = auser.ExecQuery(sql,parms);
            string result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            result = "{results:" + result + "}";
            return result;
        }

        //获得所有权限组名称
        private string ShowaGroup()
        {
            string sql = "select Id as myId,Title as displayText from aGroup where IsDeleted=0";
            if (CurrentSession.GroupId != 4)//判断登录用户的GroupId如果不是系统管理员则不显示管理员帐号
            {
                sql += " and Id<>4";
            }
            if (Request["type"].Equals("Search"))
            {
                sql += " union select 0 as myId,'全部' as displayText";
            }
            DataTable dt = auser.ExecQuery(sql);
            string result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            result = "{results:" + result + "}";
            return result;
        }

        //通过部门获得员工
        private string ShowEmployeeByDeptId()
        {
            string result = string.Empty;
            string sql = string.Empty;
            try
            {
                string DeptId = Request["DeptId"];
                string query = Request["query"];
                string EmpId = Request["EmpId"];
                Hashtable parms = new Hashtable();
                if (DeptId != null && DeptId.Length > 0 && DeptId.ToString() != "0")
                {
                    parms.Add("@DeptId",DeptId);
                    DeptId = " and b.Id=@DeptId";
                }
                else
                {
                    DeptId = "";
                }
                if (query == null || string.IsNullOrEmpty(query))
                {
                    query = "";
                }
                else 
                {
                    parms.Add("@query",query);
                    query = " and a.Code like '%'+@query+'%'";
                }
                if (EmpId != null && !string.IsNullOrEmpty(EmpId))
                {
                    EmpId = string.Format(" and a.Id={0}",EmpId);
                }
                else
                {
                    EmpId = "";
                }
                sql = string.Format(@"select a.Id as myId,a.Code+'   '+a.Title as displayText from iEmployee a,iDept b
                                                           where a.IsDeleted=0 and b.IsDeleted=0  and a.DeptId=b.Id {0} {1} {2}", DeptId, query, EmpId);
                DataTable dt = auser.ExecQuery(sql,parms);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{success:true,results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'","\"");
                result = "{success:false,msg:'"+result+"'}";
            }
            return result;
        }

        //通过搜索条件获得操作员数据
        private string SearchaUser()
        {
            string result = string.Empty;
            try
            {
                string GroupId = Request["GroupId"];
                string DeptId = Request["DeptId"];
                string Username = Request["Username"];
                string withGroupId = string.Empty;
                if (CurrentSession.GroupId != 4)//判断登录用户的GroupId如果不是系统管理员则不显示管理员帐号
                {
                    withGroupId = " and GroupId<>4";
                }
                Hashtable prams=new Hashtable();
                if (GroupId != null && GroupId.ToString().Length > 0 && GroupId.ToString() != "0")
                {
                    //GroupId = string.Format(" and a.GroupId={0}", GroupId);
                    prams.Add("@GroupId", Convert.ToInt32(GroupId));
                    GroupId = " and a.GroupId=@GroupId";
                }
                else
                {
                    GroupId = "";
                }
                if (DeptId != null && DeptId.ToString().Length > 0 && DeptId.ToString() != "0")
                {
                    //DeptId = string.Format(" and a.DeptId={0}", DeptId);
                    prams.Add("@DeptId", DeptId);
                    DeptId = " and a.DeptId=@DeptId";
                }
                else
                {
                    DeptId = "";
                }
                if (Username != null && Username.ToString().Trim().Length != 0)
                {
                    Username = Username.ToString().Replace("'", "''");
                    //Username = string.Format(" and a.Username like '%{0}%'", Username);
                    prams.Add("@UserName", Username);
                    Username = " and a.Username like '%'+@UserName+'%'";
                }
                else
                {
                    Username = "";
                }
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                string sql = string.Format(@"select a.Id,a.Username,a.RealName,b.Title as aGroupTitle,c.Title as DeptName,a.MemoInfo 
                                                                        from aUser a,aGroup b,iDept c 
                                                                        where a.IsDeleted=0 and b.IsDeleted=0 and c.IsDeleted=0
                                                                        and a.GroupId=b.Id and a.DeptId=c.Id 
                                                                        {0} {1} {2} {3}", GroupId, DeptId, Username, withGroupId);
                DataTable dt = auser.GetPageData(sql, "order by ID desc", start + 1, limit,prams);
                //DataTable dt = auser.ExecQuery(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                sql = string.Format(@"select count(*)
                                                                        from aUser a,aGroup b,iDept c 
                                                                        where a.IsDeleted=0 and b.IsDeleted=0 and c.IsDeleted=0
                                                                        and a.GroupId=b.Id and a.DeptId=c.Id 
                                                                        {0} {1} {2} {3}", GroupId, DeptId, Username, withGroupId);
                int count = (int)auser.ExecScalar(sql,prams);
                result = "{totalCount:"+count+",results:" + result + "}";
            }
            catch (Exception)
            {
                throw;
            }
            return result;
        }

        //通过Id获得aUser
        private string ShowaUserbyId()
        {
            string result = string.Empty;
            try
            {
                string Id = Request["Id"];
                string sql = string.Format(@"select a.Username,a.RealName,a.GroupId,a.DeptId,a.MemoInfo,a.Password,a.EmployeeId,c.DeptTypeId
                                                                    from aUser a,aGroup b,iDept c
                                                                    where a.Id={0} and a.IsDeleted=0 and b.IsDeleted=0 and c.IsDeleted=0 
                                                                    and a.GroupId=b.Id and a.DeptId=c.Id", Id);
                DataTable dt = auser.ExecQuery(sql);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception)
            {
                throw;
            }
            return result;
        }

        //添加一个aUser
        private string AddaUser()
        {
            string username = Request["Username"];
            string password = Request["Password"];
            string GroupId = Request["GroupId"];
            string RealName = Request["RealName"];
            object DeptId = Request["DeptId"];
            string DeptTitle = Request["DeptTitle"];
            string DeptTypeId = Request["DeptTypeId"];
            string MemoInfo = Request["MemoInfo"];
            object EmployeeId = Request["EmployeeId"];
            string EmpTitle = Request["EmpTitle"];

            
            if (EmployeeId == null || string.IsNullOrEmpty(EmployeeId.ToString()))
            {
                EmployeeId = "0";
            }

            Hashtable parms = new Hashtable();
            parms.Add("@Username", username);
            parms.Add("@Password", password);
            parms.Add("@GroupId", GroupId);
            parms.Add("@RealName", RealName);
            parms.Add("@DeptId", DeptId);
            parms.Add("@DeptTitle", DeptTitle);
            parms.Add("@DeptTypeId", DeptTypeId);
            parms.Add("@MemoInfo", MemoInfo);
            parms.Add("@EmployeeId", EmployeeId);
            parms.Add("@EmpTitle", EmpTitle);

            try
            {
                string sql = string.Empty;
                if (DeptTitle != null && !string.IsNullOrEmpty(DeptTitle))
                {
                    sql = @"select a.Id from iDept a,iDeptType b
                                            where a.IsDeleted=0 and b.IsDeleted=0 and a.DeptTypeId=b.Id and a.Title=@DeptTitle and b.Id=@DeptTypeId";
                    DeptId = auser.ExecScalar(sql, parms);
                    if (DeptId == null)
                    {
                        return "{success:false,msg:'操作失败，原因：部门不存在！'}";
                    }
                    else
                    {
                        parms["@DeptId"] = DeptId;
                    }
                }


                if (EmpTitle != null && !string.IsNullOrEmpty(EmpTitle))
                {
                    sql = @"select top 1 a.Id from iEmployee a,iDept b
                                where a.IsDeleted=0 and b.IsDeleted=0 and a.DeptId=b.Id and a.Title=@EmpTitle and b.Id=@DeptId";
                    EmployeeId = auser.ExecScalar(sql, parms);
                    if (EmployeeId == null)
                    {
                        return "{success:false,msg:'操作失败，原因：操作员不存在！'}";
                    }
                    else
                    {
                        parms["@EmployeeId"] = EmployeeId;
                    }
                }
            }
            catch (Exception ex)
            {
                string result = ex.Message.Replace("'", "\"");
                result = "{success:false,msg:'" + result + "'}";
                return result;
            }
            


            return auser.AddaUser(parms, CurrentSession.UserID);
        }

        //更新一个aUser
        private string aUserEdit()
        {
            string username = Request["Username"];
            string password = Request["Password"];
            string GroupId = Request["GroupId"];
            string RealName = Request["RealName"];
            object DeptId = Request["DeptId"];
            string DeptTitle = Request["DeptTitle"];
            string DeptTypeId = Request["DeptTypeId"];
            string MemoInfo = Request["MemoInfo"];
            object EmployeeId = Request["EmployeeId"];
            string EmpTitle = Request["EmpTitle"];
            int aUserId = Convert.ToInt32(Request["aUserId"]);


            if (EmployeeId == null || string.IsNullOrEmpty(EmployeeId.ToString()))
            {
                EmployeeId = "0";
            }

            Hashtable parms = new Hashtable();
            parms.Add("@Username", username);
            parms.Add("@Password", password);
            parms.Add("@GroupId", GroupId);
            parms.Add("@RealName", RealName);
            parms.Add("@DeptId", DeptId);
            parms.Add("@DeptTitle",DeptTitle);
            parms.Add("@DeptTypeId", DeptTypeId);
            parms.Add("@MemoInfo", MemoInfo);
            parms.Add("@aUserId", aUserId);
            parms.Add("@EmployeeId", EmployeeId);
            parms.Add("@EmpTitle", EmpTitle);

            

            try
            {
                string sql = string.Empty;
                if (DeptTitle != null && !string.IsNullOrEmpty(DeptTitle))
                {
                    sql = @"select a.Id from iDept a,iDeptType b
                                            where a.IsDeleted=0 and b.IsDeleted=0 and a.DeptTypeId=b.Id and a.Title=@DeptTitle and b.Id=@DeptTypeId";
                    DeptId = auser.ExecScalar(sql, parms);
                    if (DeptId == null)
                    {
                        return "{success:false,msg:'操作失败，原因：部门不存在！'}";
                    }
                    else
                    {
                        parms["@DeptId"] = DeptId;
                    }
                }


                if (EmpTitle != null && !string.IsNullOrEmpty(EmpTitle))
                {
                    sql = @"select top 1 a.Id from iEmployee a,iDept b
                                where a.IsDeleted=0 and b.IsDeleted=0 and a.DeptId=b.Id and a.Title=@EmpTitle and b.Id=@DeptId";
                    EmployeeId = auser.ExecScalar(sql, parms);
                    if (EmployeeId == null)
                    {
                        return "{success:false,msg:'操作失败，原因：操作员不存在！'}";
                    }
                    else
                    {
                        parms["@EmployeeId"] = EmployeeId;
                    }
                }
            }
            catch (Exception ex)
            {
                string result = ex.Message.Replace("'", "\"");
                result = "{success:false,msg:'" + result + "'}";
                return result;
            }

            return auser.aUserEdit(parms, CurrentSession.UserID);
        }

        //通过aUser.Id删除一个aUser
        private string DelaUserbyId()
        {
            string aUser_Id = Request["aUserId"];

            return auser.DelaUserbyId(CurrentSession.UserID, aUser_Id);
        }
    }
}