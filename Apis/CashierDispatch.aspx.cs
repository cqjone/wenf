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
    public partial class CashierDispatch : aboutEmp
    {
        BllApi.CashierDispatch mybll = new BllApi.CashierDispatch();
        
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            { 
                case "Search":
                    result = Search();
                    break;
                case "New_CashierDispatch":
                    result = New_CashierDispatch();
                    break;
                case "GetEmpInfo":
                    result = GetEmpInfo();
                    break;
                case "Update":
                    result = Update();
                    break;
            }
            Response.Write(result);
            Response.End();
        }


        private string Search()
        {
            string result = string.Empty;
            Hashtable parms = new Hashtable();
            try
            {
                string EmpCode = Request["EmpCode"];
                string Title = Request["Title"];

                if (EmpCode != null && !string.IsNullOrEmpty(EmpCode))
                {
                    parms.Add("@EmpCode", EmpCode);
                    EmpCode = " and b.Code like '%' + @EmpCode+'%'";
                }
                else
                {
                    EmpCode = "";
                }
                if (Title != null && !string.IsNullOrEmpty(Title))
                {
                    parms.Add("@Title", Title);
                    Title = " and b.Title like '%' + @Title+'%'";
                }
                else
                {
                    Title = "";
                }

                string sql = string.Format(@"select a.Id, case a.Status when 0 then '未回店' else '已回店' end as Status
										  , CONVERT(varchar(100),a.BillDate, 23) AS BillDate ,b.Code as EmpCode,b.Title as EmpName,c.Code as SourceCode,a.EmpID,
									      c.Title as SourceTitle,d.Code as TargetCode,d.Title as TargetTitle,a.TargetDeptID,
									      CONVERT(varchar(100),ExpiredDate, 23) AS ExpiredDate 
									      from bDipatch a ,iEmployee b,iDept c,iDept d
									      where a.EmpID = b.ID
									      and a.SourceDeptID = c.ID
									      and a.TargetDeptID = d.ID {0}  {1}", EmpCode, Title);

                int start = int.Parse(Request["start"]);
                int limit = int.Parse(Request["limit"]);
                DataTable dt = mybll.GetPageData(sql, "order by Id desc", start + 1, limit, parms);

                sql = string.Format(@"select count(a.Id)
									      from bDipatch a ,iEmployee b,iDept c,iDept d
									      where a.EmpID = b.ID
									      and a.SourceDeptID = c.ID
									      and a.TargetDeptID = d.ID {0}  {1}", EmpCode, Title);
                int count = (int)mybll.ExecScalar(sql, parms);

                result = "{totalCount:" + count + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"");
                result = "{success:false,msg:'" + result + "'}";
            }
            return result;
        }

        //通过EmpId 获得Emp信息
        private string GetEmpInfo()
        {
            string result = string.Empty;

            string EmpId = Request["EmpId"];
            string sql = string.Format(@"select top 1 a.Id,a.Code as EmpCode,a.Title as EmpName,a.IdNo,getdate() as ExpiredDate,
                                                                    a.MemoInfo as MemoInfo,b.Title as DeptName,a.DeptId
                                                                    from iEmployee a,iDept b
                                                                    where a.IsDeleted=0 and b.IsDeleted=0 and a.DeptId=b.Id and a.Id={0}",EmpId);
            DataTable dt=mybll.GetPageData(sql, "order by Id desc", 0, 2);
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return result;
        }

        //新建
        private string New_CashierDispatch()
        {
            string result = string.Empty;

            string EmpCode = Request["EmpCode"];
            string EmpName = Request["EmpName"];
            string EmpId = Request["Id"];
            string MemoInfo = Request["MemoInfo"];
            string DeptId = Request["DeptId"];
            //string DeptName=Request["DeptName"];
            string ToDeptId=Request["ToDeptId"];
            string ExpiredDate = Request["ExpiredDate"];

            Hashtable parms = new Hashtable();
            parms.Add("@EmpCode",EmpCode);
            parms.Add("@EmpName",EmpName);
            parms.Add("@EmpId",EmpId);
            parms.Add("@MemoInfo",MemoInfo);
            parms.Add("@DeptId",DeptId);
            parms.Add("@ToDeptId",ToDeptId);
            parms.Add("@ExpiredDate",ExpiredDate);

            return mybll.New_CashierDispatch(parms, CurrentUser.Id);
        }

        //更新
        private string Update()
        {
            int Id = Convert.ToInt32(Request["Id"]);
            int EmpId = Convert.ToInt32(Request["EmpId"]);
            int did = Convert.ToInt32(Request["did"]);

            return mybll.Update(Id,EmpId,did,CurrentSession.UserID);
        }
    }
}