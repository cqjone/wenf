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
    public partial class TaskMgr : AuthBasePage
    {
        private BllApi.TaskMgr mybll = new BllApi.TaskMgr();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                switch (ActionName)
                { 
                    case "searTask":
                        SearchTask();
                        break;
                    case "getDept":
                        getDept();
                        break;
                    case "newTask":
                        newTask();
                        break;
                }
            }
        }

        /// <summary>
        /// 搜索iTask表数据
        /// </summary>
        private void SearchTask()
        {
            try
            {
                #region 参数
                string Code = Request["TCode"];
                string Title = Request["TTitle"];
                string DateBegin = Request["TDateBegin"];
                string DateEnd = Request["TDateEnd"];
                string DeptStatus = Request["DeptStatus"];
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);

                string sqlToDept = string.Empty;// 当选择了门店状态时则不选择 ToDeptId = 0 的数据
                string sqlToDeptCount = string.Empty;// 当选择了门店状态时则不记录 ToDeptId = 0 的数据的数量
                
                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(Code))
                {
                    prams.Add("@Code", Code);
                    Code = " and a.Code like '%'+@Code+'%'";
                }
                if (!string.IsNullOrEmpty(Title))
                {
                    prams.Add("@Title", Title);
                    Title = " and a.Title like '%'+@Title+'%'";
                }
                if (!string.IsNullOrEmpty(DeptStatus))
                {
                    int deptStatus = Convert.ToInt32(DeptStatus) - 1;
                    if (deptStatus > -1)
                    {
                        prams.Add("@DeptStatus", deptStatus);
                        DeptStatus = " and b.DeptStatus = @DeptStatus";
                    }
                    else 
                    {
                        sqlToDept = @"select a.Id,a.CreateDate,a.Code,a.Title,a.Params,a.Type,a.IsCompleted,'全部' as ToDept from iTask a
                                      where a.IsDeleted=0 and a.ToDeptId=0 and a.Type='SQL' and a.CreateDate between @DateBegin and @DateEnd {0} {1}
                                      union all ";
                        sqlToDeptCount = @"union all
                                            select count(a.Id) as taskCount from iTask a
                                            where a.IsDeleted=0 and a.ToDeptId=0 and a.CreateDate between @DateBegin and @DateEnd and a.Type='SQL' {0} {1}";
                        DeptStatus = string.Empty;
                    }
                }
                prams.Add("@DateBegin", DateBegin);
                prams.Add("@DateEnd", DateEnd);
                #endregion

                string sql = string.Format(sqlToDept + @"select a.Id,a.CreateDate,a.Code,a.Title,a.Params,a.Type,a.IsCompleted,b.Title as ToDept from iTask a,iDept b
                                            where a.IsDeleted=0 and b.IsDeleted=0 and a.ToDeptId=b.Id and a.Type='SQL'  {0} {1} {2} and a.CreateDate between @DateBegin and @DateEnd
                                            ", Code, Title, DeptStatus);

                DataTable dt = mybll.GetPageData(sql, "order by CreateDate desc", start, limit, prams);

                sql = string.Format(@"select sum(taskCount) from 
                                    (
                                    select count(a.Id) as taskCount from iTask a,iDept b where a.IsDeleted=0 and b.IsDeleted=0 
                                    and a.ToDeptId=b.Id and a.CreateDate between @DateBegin and @DateEnd and Type='SQL' {0} {1} {2}
                                    " + sqlToDeptCount + ") as _TaskCount", Code, Title, DeptStatus);
                int totalCount = 0;
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    totalCount = (int)utl.ExecuteScalar(sql, prams);
                }
                Response.Write("{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}");
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.Message);
            }
            finally
            {
                Response.End();
            }
        }

        /// <summary>
        /// 获取门店
        /// </summary>
        private void getDept()
        {
            string DeptCode = Request["DeptCode"];
            string DeptTitle = Request["DeptTitle"];
            string DeptStatus = Request["DeptStatus"];

            Hashtable prams = new Hashtable();
            if (!string.IsNullOrEmpty(DeptCode))
            {
                prams.Add("@DeptCode", DeptCode);
                DeptCode = "and Code like '%'+@DeptCode+'%'";
            }
            if (!string.IsNullOrEmpty(DeptTitle))
            {
                prams.Add("@DeptTitle", DeptTitle);
                DeptTitle = "and Title like '%'+@DeptTitle+'%'";
            }
            if (!string.IsNullOrEmpty(DeptStatus))
            {
                int deptStatus = Convert.ToInt32(DeptStatus) - 1;
                if (deptStatus > -1)
                {
                    prams.Add("@DeptStatus", deptStatus);
                    DeptStatus = "and DeptStatus = @DeptStatus";
                }
                else
                {
                    DeptStatus = string.Empty;
                }
            }
            string sql = string.Format(@"select Id,Code as DeptCode,DeptStatus,Title as DeptName from iDept where IsDeleted=0 and DeptTypeId=1 {0} {1} {2}",DeptCode,DeptTitle,DeptStatus);
            DataTable dt = new DataTable();
            int totalCount = 0;
            using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
            {
                dt=utl.ExecuteQuery(sql, prams);
                totalCount = (int)utl.ExecuteScalar("select count(Id) from iDept where IsDeleted = 0 and DeptTypeId=1");
            }
            string msg = "{totalCount:'" + totalCount + "',results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            Response.Write(msg);
            //Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(dt));
            Response.End();
        }

        /// <summary>
        /// 新增任务
        /// </summary>
        private void newTask()
        {
            string Code = Request["TCode"];
            string Title = Request["TTitle"];
            string Params = Request["TParams"];
            string _deptIds = Request["DeptIds"].TrimEnd(',');
            string[] DeptIds = _deptIds.Split(',');

            string xmlParams = string.Format("<?xml version=\"1.0\" encoding=\"UTF-8\" ?><Params><SQL><![CDATA[{0}]]></SQL></Params>", Params);
            Hashtable prams = new Hashtable();
            prams.Add("@xmlParams", xmlParams);
            prams.Add("@Code", Code);
            prams.Add("@Title", Title);
            string sql = @"insert into iTask (CreateDate,CreateId,ModifyDate,ModifyId,IsDeleted,Code,Title,Type,Params,IsCompleted,ToDeptId)
                           values(getdate()," + CurrentUser.Id + ",getdate()," + CurrentUser.Id + ",0,@Code,@Title,'SQL',@xmlParams,0,{0})";
            string sql1 = "";
            if (!string.IsNullOrEmpty(_deptIds))
            {
                for (int i = 0; i < DeptIds.Length; i++)
                {
                    sql1 += string.Format(sql, DeptIds[i]) + ";";
                }
                int index = mybll.newTask(sql1, prams);
                if (index > 0)
                {
                    base.ReturnResultJson("true", "操作完成");
                }
                else
                {
                    base.ReturnResultJson("false", "操作失败");
                }
            }
        }
    }
}