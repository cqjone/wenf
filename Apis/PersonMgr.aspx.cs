using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;

namespace BeautyPointWeb.Apis
{
    public partial class PersonMgr : AuthBasePage
    {
        private int QyMgrId = 238;
        private int YxMgrId = 239;

        private BllApi.PersonMgr mybll = new BllApi.PersonMgr();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string op = Request["op"];
                string result = string.Empty;
                if (op != null)
                {
                    op = op.ToLower();
                }
                switch (op)
                {
                    case "loadarea":
                        result = this.LoadArea();
                        break;
                    case "loadarea1":
                        result = this.LoadArea1();
                        break;
                    case "loaddept":
                        result = this.LoadDept();
                        break;
                    case "loademp":
                        result = this.LoadEmp();
                        break;
                    case "loaddeptinfo":
                        result = this.LoadDeptInfo();
                        break;
                    case "loadmgr":
                        result = this.LoadMgr();
                        break;
                    case "loadempinfo":
                        result = this.LoadEmpInfo();
                        break;
                    case "loadworked":
                        result = this.LoadWorked();
                        break;
                    case "searchemp":
                        result = this.SearchEmp();
                        break;
                    case "loadimg":
                        result = this.LoadImg();
                        break;
                    case "loadempcount":
                        result = this.LoaEmpCount();
                        break;
                    case "getdeptinfo":
                        result = this.GetDeptInfo();
                        break;
                    case "getdeptcount":
                        result = this.GetDeptCount();
                        break;
                    case "searchdept":
                        result = this.SearchDept();
                        break;
                    case "loaddept_animate":
                        result = this.LoadDept_Animate();
                        break;
                    case "getalldept":
                        result = this.GetAllDept();
                        break;
                    case "getdeptbb":
                        result = this.GetDeptBb();
                        break;
                    case "loadtotalmoney":
                        result = this.loadTotalMoney();
                        break;
                    case "loadtotalmoney_hiscash":
                        result = this.loadTotalMoney_HisCash();
                        break;
                    case "getdeptinfobyarea":
                        result = this.GetDeptInfoByArea();
                        break;
                    case "getdeptcountbyarea":
                        result = this.GetDeptCountByArea();
                        break;
                }
                Response.Write(result);
                Response.End();
            }
        }

        //只查东南、东北区域业绩(查部分区域)
        private string GetDeptInfoByArea()
        {
            string result = string.Empty;
            string sql;
            try
            {
                bool hideDept = Request["hideDept"] != null ? Boolean.Parse(Request["hideDept"]) : true;//隐藏已经关闭的门店 true:隐藏、false:显示
                string DeptName = Request["DeptName"];
                string AreaId = Request["AreaId"];
                string AreaIds = Request["AreaIds"];
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                string FieldName = Request["FieldName"];
                string Sort = Request["Sort"];

                Hashtable prams = new Hashtable();

                string OrderSql = string.Empty;
                if (!string.IsNullOrEmpty(FieldName) && !string.IsNullOrEmpty(Sort))
                {
                    OrderSql = string.Format("order by {0} {1}", FieldName, Sort);
                }
                else
                {
                    OrderSql = "order by DeptName asc";
                }

                string AreaSql = string.Empty;
                if (string.IsNullOrEmpty(AreaIds))
                {
                    if (!string.IsNullOrEmpty(AreaId))
                    {
                        AreaSql = " and idept.AreaId=@AreaId";
                        prams.Add("@AreaId", AreaId);
                    }
                }
                else
                {
                    //AreaSql = string.Format(" and (idept.AreaId in({0}) or idept.AreaId in (select Id from iarea where Parentid in ({0})))", AreaIds.TrimEnd(','));
                    AreaSql = string.Format(" and idept.AreaId in ({0})", AreaIds.TrimEnd(','));
                }

                string hideDeptSql = string.Empty;
                if (hideDept)
                {
                    hideDeptSql = " and (DeptStatus <> 0 or DeptStatus is null)";
                }


                //添加部门指标后重新构造sql代码
                sql = string.Format(@"select a.DeptID as DeptID,a.DeptName as DeptName,
			  a.TotalCash+isnull(z.HospitalMoney,0) as TotalCash, 
			  isnull(b.TargetMoney,0) as TargetMoney,
			  (select Count(iEmployee.Id) from iEmployee,iDuty  where iEmployee.IsDeleted = 0 and iEmployee.state<>'离职' and iEmployee.dutyId=iDuty.Id and iDuty.DutyTypeId=4 and iEmployee.DeptId=a.DeptId ) as mfs,
              (select Count(iEmployee.Id) from iEmployee,iDuty  where iEmployee.IsDeleted = 0 and iEmployee.state<>'离职' and iEmployee.dutyId=iDuty.Id and iDuty.DutyTypeId=5 and iEmployee.DeptId=a.DeptId ) as mrs,
			 'TargetPesent' = case 
			  when isnull(b.TargetMoney,0) = 0 then 0.0
			  when isnull(b.TargetMoney,0) <> 0 then cast((isnull(a.TotalCash,0.0)+isnull(z.HospitalMoney,0.0))/isnull(b.TargetMoney,0) as decimal(19,4))
			  end
			 from (
			 select refdeptid as DeptID,iDept.Title as DeptName,sum(cashsum) as TotalCash,sum(cashOut) as XOut,
			 sum(SrvCash) as ServiceX,sum(SrvCard) as ServiceK,sum(SrvTicket) as ServiceQ,
			 sum(SrvVip) as ServiceG,sum(SrvShampoo) as ServiceXT,sum(PdtCash) as ProductX,
			 sum(PdtCard) as ProductK,sum(PdtTicket) as ProductQ,sum(SaleCard) as CardX,
			 sum(Turnover) as TotalYy from rsale 
             left join idept on rsale.refdeptid=idept.id and idept.AreaId is not null {0} {1}
			 where (iDept.DeptTypeID=1 or iDept.DeptTypeID=2) and datediff(m,reffindate,getdate())=0
			 group by refdeptid,idept.title) as a
			 left join idepttarget b on a.DeptID = b.DeptID and b.isdeleted = 0
			 left join (select y.DeptID as DeptID,sum(y.DeptDeductMoney) as HospitalMoney 
			 from bHisCash as x,bHisCashList as y
			 where datediff(m,x.BillDate,getdate()) = 0 and
              x.IsDeleted = 0 and x.ID = y.HisCashID
			 group by y.DeptID) z on a.DeptID = z.DeptID", hideDeptSql, AreaSql);


                if (DeptName != null && !string.IsNullOrEmpty(DeptName))
                {
                    sql += " where a.DeptName like '%'+@DeptName+'%'";
                    prams.Add("@DeptName", DeptName.Trim());
                }

                DataTable dt = mybll.GetPageData(sql, OrderSql, start + 1, limit, prams);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //只查东南、东北区域业绩总数量
        private string GetDeptCountByArea()
        {
            string result = string.Empty;
            try
            {
                string DeptName = Request["DeptName"];
                string AreaIds = Request["AreaIds"];
                string sql = "select Count(Id) from iDept where IsDeleted=0 and DeptTypeId=1 and areaid is not null";
                Hashtable prams = new Hashtable();
                if (DeptName != null && !string.IsNullOrEmpty(DeptName))
                {
                    sql += " and Title like '%'+@DeptName+'%' ";
                    prams.Add("@DeptName", DeptName);
                }
                if (!string.IsNullOrEmpty(AreaIds))
                {
                    //sql += string.Format(" and AreaId in ({0}) or areaid in (select Id from iarea where Parentid in ({0}))", AreaIds.TrimEnd(','));
                    sql += string.Format(" and AreaId in ({0})", AreaIds.TrimEnd(','));
                }
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    object DeptCount = utl.ExecuteScalar(sql, prams);
                    result = "[{\"success\":\"true\",\"msg\":\"\",\"DeptCount\":\"" + DeptCount + "\"}]";
                }
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        //加载门店的历史现金总合计
        private string loadTotalMoney_HisCash()
        {
            bool hideDept = Request["hideDept"] != null ? Boolean.Parse(Request["hideDept"]) : true;//隐藏已经关闭的门店 true:隐藏、false:显示
            string BeginTime = Convert.ToDateTime(Request["BeginTime"]).ToString("yyyy-M-d");
            string EndTime = Convert.ToDateTime(Request["EndTime"]).ToString("yyyy-M-d") + " 23:59:59";
            string Depts = Request["Depts"];

            string hideDeptSql = string.Empty;
            if (hideDept)
            {
                hideDeptSql = " and (DeptStatus <> 0 or DeptStatus is null)";
            }

            Hashtable prams = new Hashtable();
            prams.Add("@BeginTime", BeginTime);
            prams.Add("@EndTime", EndTime);
            string sql = string.Format(@"select TotalMoney,(TotalMoney/totalTargetMoney) from (select 
			 cast(sum(a.TotalCash+isnull(z.HospitalMoney,0)) as decimal(19,2)) as TotalMoney
             ,cast(sum(b.TargetMoney) as decimal(19,2)) as totalTargetMoney
			 from (
			 select refdeptid as DeptID,iDept.Title as DeptName,sum(cashsum) as TotalCash
			 from rsale left join idept on rsale.refdeptid=idept.id {0}
			 where (iDept.DeptTypeID=1 or iDept.DeptTypeID=2)
             and RefDeptID in ({1}) 
             and reffindate>=@BeginTime and reffindate<=@EndTime
			 group by refdeptid,idept.title) as a
			 left join idepttarget b on a.DeptID = b.DeptID and b.isdeleted = 0
			 left join (select y.DeptID as DeptID,sum(y.DeptDeductMoney) as HospitalMoney 
			 from bHisCash as x,bHisCashList as y
			 where  x.BillDate>=@BeginTime and x.BillDate<=@EndTime
              and x.IsDeleted = 0 and x.ID = y.HisCashID
			 group by y.DeptID) z on a.DeptID = z.DeptID) as totalTb", hideDeptSql, Depts);
            string TotalMoney = string.Empty;
            using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
            {
                DataTable dt = utl.ExecuteQuery(sql, prams);
                return string.Format("{{\"success\":\"true\",\"totalmoney\":\"{0}\",\"TargetPesent\":{1}}}", dt.Rows[0][0], dt.Rows[0][1]);
            }
        }

        //加载当月门店的现金总合计
        private string loadTotalMoney()
        {
            bool hideDept = Request["hideDept"] != null ? Boolean.Parse(Request["hideDept"]) : true;
            string hideDeptSql = string.Empty;
            if (hideDept)
            {
                hideDeptSql = " and (idept.DeptStatus <> 0 or idept.DeptStatus is null)";
            }
            string sql = @"select TotalMoney,(TotalMoney/totalTargetMoney) from (select 
			 cast(sum(a.TotalCash+isnull(z.HospitalMoney,0)) as decimal(19,2)) as TotalMoney
              ,cast(sum(b.TargetMoney) as decimal(19,2)) as totalTargetMoney
             from (
			 select refdeptid as DeptID,iDept.Title as DeptName,sum(cashsum) as TotalCash
			 from rsale left join idept on rsale.refdeptid=idept.id and idept.areaid is not null " + hideDeptSql + @" {0} 
			 where (iDept.DeptTypeID=1 or iDept.DeptTypeID=2) and datediff(m,reffindate,getdate())=0
			 group by refdeptid,idept.title) as a
			 left join idepttarget b on a.DeptID = b.DeptID and b.isdeleted = 0
			 left join (select y.DeptID as DeptID,sum(y.DeptDeductMoney) as HospitalMoney 
			 from bHisCash as x,bHisCashList as y
			 where  datediff(m,x.BillDate,getdate()) = 0
              and x.IsDeleted = 0 and x.ID = y.HisCashID
			 group by y.DeptID) z on a.DeptID = z.DeptID ";
            string DeptName = Request["DeptName"];
            string AreaId = Request["AreaId"];
            string AreaIds = Request["AreaIds"];
            Hashtable prams = new Hashtable();
            if (!string.IsNullOrEmpty(AreaId) && AreaId != "0")
            {
                prams.Add("@AreaId", AreaId);
                sql = string.Format(sql, " and idept.areaid = @AreaId");
            }
            else
            {
                if (!string.IsNullOrEmpty(AreaIds))
                {
                    sql = string.Format(sql, " and idept.areaid in (" + AreaIds.TrimEnd(',') + ")");
                }
                else
                {
                    sql = string.Format(sql, string.Empty);
                }
            }

            if (!string.IsNullOrEmpty(DeptName))
            {
                sql += " where a.DeptName like '%'+@DeptName+'%'";
                prams.Add("@DeptName", DeptName.Trim());
            }

            sql += ") as totalTb";

            string TotalMoney = string.Empty;
            using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
            {
                DataTable dt = utl.ExecuteQuery(sql, prams);
                return string.Format("{{\"success\":\"true\",\"totalmoney\":\"{0}\",\"TargetPesent\":{1}}}", dt.Rows[0][0], dt.Rows[0][1]);
            }
        }

        //获取门店历史收益报表
        private string GetDeptBb()
        {
            try
            {
                bool hideDept = Request["hideDept"] != null ? Boolean.Parse(Request["hideDept"]) : true;//隐藏已经关闭的门店 true:隐藏、false:显示
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                string BeginTime = Convert.ToDateTime(Request["BeginTime"]).ToString("yyyy-M-d");
                string EndTime = Convert.ToDateTime(Request["EndTime"]).ToString("yyyy-M-d") + " 23:59:59";
                string Depts = Request["Depts"];
                string FieldName = Request["FieldName"];
                string Sort = Request["Sort"];

                string OrderSql = string.Empty;
                if (!string.IsNullOrEmpty(FieldName) && !string.IsNullOrEmpty(Sort))
                {
                    OrderSql = string.Format("order by {0} {1}", FieldName, Sort);
                }
                else
                {
                    OrderSql = "order by DeptName asc";
                }

                string hideDeptSql = string.Empty;
                if (hideDept)
                {
                    hideDeptSql = " and (idept.DeptStatus <> 0 or idept.DeptStatus is null)";
                }

                Hashtable prams = new Hashtable();
                prams.Add("@BeginTime", BeginTime);
                prams.Add("@EndTime", EndTime);
                prams.Add("@Depts", Depts);
                string sql = string.Format(@"select a.DeptID as DeptID,a.DeptName as DeptName,
			  a.TotalCash+isnull(z.HospitalMoney,0.0) as TotalCash, 
			  isnull(b.TargetMoney,0) as TargetMoney,
              'TargetPesent' = case 
			  when isnull(b.TargetMoney,0) = 0 then 0.0
			  when isnull(b.TargetMoney,0) <> 0 then cast((isnull(a.TotalCash,0.0)+isnull(z.HospitalMoney,0.0))/isnull(b.TargetMoney,0) as decimal(19,4))
			  end
			 from (
			 select refdeptid as DeptID,iDept.Title as DeptName,sum(cashsum) as TotalCash,sum(cashOut) as XOut,
			 sum(SrvCash) as ServiceX,sum(SrvCard) as ServiceK,sum(SrvTicket) as ServiceQ,
			 sum(SrvVip) as ServiceG,sum(SrvShampoo) as ServiceXT,sum(PdtCash) as ProductX,
			 sum(PdtCard) as ProductK,sum(PdtTicket) as ProductQ,sum(SaleCard) as CardX,
			 sum(Turnover) as TotalYy from rsale left join idept on rsale.refdeptid=idept.id {0}
			 where (iDept.DeptTypeID=1 or iDept.DeptTypeID=2)
              and RefDeptID in ({1})
              and reffindate>=@BeginTime and reffindate<=@EndTime
			 group by refdeptid,idept.title) as a
			 left join idepttarget b on a.DeptID = b.DeptID and b.isdeleted = 0
			 left join (select y.DeptID as DeptID,sum(y.DeptDeductMoney) as HospitalMoney 
			 from bHisCash as x,bHisCashList as y
			 where x.BillDate>=@BeginTime and x.BillDate<=@EndTime and
            x.IsDeleted = 0 and x.ID = y.HisCashID
			 group by y.DeptID) z on a.DeptID = z.DeptID", hideDeptSql, Depts);
                DataTable dt = mybll.GetPageData(sql, OrderSql, start + 1, limit, prams);
                return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                //return sql;
            }
            catch (Exception ex)
            {
                return "{success:false,msg:\"" + ex.Message + "\"}";
            }
        }

        //获取所有门店名称
        private string GetAllDept()
        {
            bool hideDept = Request["hideDept"] != null ? Boolean.Parse(Request["hideDept"]) : true;//隐藏已经关闭的门店 true:隐藏、false:显示
            string sql = "select Id,Title as DeptName from iDept where IsDeleted=0 and DeptTypeId=1 {0} order by DeptName";
            try
            {
                string hideDeptSql = string.Empty;
                if (hideDept)
                {
                    hideDeptSql = " and (idept.DeptStatus <> 0 or idept.DeptStatus is null)";
                }
                sql = string.Format(sql, hideDeptSql);
                DataTable dt = mybll.ExecQuery(sql, null);
                return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                return "{success:false,msg:\"" + ex.Message + "\"}";
            }
        }

        //动态加载门店
        private string LoadDept_Animate()
        {
            string result = string.Empty;
            try
            {
                string DeptId = Request["DeptId"];
                if (string.IsNullOrEmpty(DeptId))
                {
                    result = "{success:false,msg:\"Error:DeptId is null or empty\"}";
                }
                else
                {
                    string sql = @"select a.ParentId,b.AreaId from iArea a,iDept b
                               where b.AreaId=a.Id and b.Id=@DeptId";
                    Hashtable prams = new Hashtable();
                    prams.Add("@DeptId", DeptId);
                    DataTable dt = mybll.ExecQuery(sql, prams);
                    if (dt.Rows.Count > 0)
                    {
                        result = "{\"success\":true,\"results\":" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
                    }
                    else
                    {
                        result = "{\"success\":false,\"results\":\"没有数据！\"}";
                    }
                }
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }


        private string GetDeptCount()
        {
            string result = string.Empty;
            try
            {
                string DeptName = Request["DeptName"];
                string AreaIds = Request["AreaIds"];
                string sql = "select Count(Id) from iDept where IsDeleted=0 and DeptTypeId=1 and areaid is not null ";
                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(DeptName))
                {
                    sql += " and Title like '%'+@DeptName+'%' ";
                    prams.Add("@DeptName", DeptName);
                }
                if (!string.IsNullOrEmpty(AreaIds))
                {
                    sql += string.Format(" and AreaId in ({0})", AreaIds.TrimEnd(','));
                }
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    object DeptCount = utl.ExecuteScalar(sql, prams);
                    result = "[{\"success\":\"true\",\"msg\":\"\",\"DeptCount\":\"" + DeptCount + "\"}]";
                }
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        private string GetDeptInfo()
        {
            string result = string.Empty;
            string sql = "";
            try
            {
                bool hideDept = Request["hideDept"] != null ? Boolean.Parse(Request["hideDept"]) : true;//隐藏已经关闭的门店 true:隐藏、false:显示
                string DeptName = Request["DeptName"];
                string AreaIds = Request["AreaIds"];
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                string FieldName = Request["FieldName"];
                string Sort = Request["Sort"];

                Hashtable prams = new Hashtable();

                string OrderSql = string.Empty;
                if (!string.IsNullOrEmpty(FieldName) && !string.IsNullOrEmpty(Sort))
                {
                    OrderSql = string.Format("order by {0} {1}", FieldName, Sort);
                }
                else
                {
                    OrderSql = "order by DeptName asc";
                }

                string AreaSql = string.Empty;
                if (!string.IsNullOrEmpty(AreaIds))
                {
                    //AreaSql = " and idept.AreaId=@AreaId";
                    //prams.Add("@AreaId",AreaId);
                    AreaSql = string.Format(" and idept.AreaId in ({0})", AreaIds.TrimEnd(','));
                }

                string hideDeptSql = string.Empty;
                if (hideDept)
                {
                    hideDeptSql = " and (idept.DeptStatus <> 0 or idept.DeptStatus is null)";
                }

                //添加部门指标后重新构造sql代码
                sql = string.Format(@"select a.DeptID as DeptID,a.DeptName as DeptName,
			  a.TotalCash+isnull(z.HospitalMoney,0) as TotalCash, 
			  isnull(b.TargetMoney,0) as TargetMoney,
			  (select Count(iEmployee.Id) from iEmployee,iDuty  where iEmployee.IsDeleted = 0 and iEmployee.state<>'离职' and iEmployee.dutyId=iDuty.Id and iDuty.DutyTypeId=4 and iEmployee.DeptId=a.DeptId ) as mfs,
              (select Count(iEmployee.Id) from iEmployee,iDuty  where iEmployee.IsDeleted = 0 and iEmployee.state<>'离职' and iEmployee.dutyId=iDuty.Id and iDuty.DutyTypeId=5 and iEmployee.DeptId=a.DeptId ) as mrs,
			 'TargetPesent' = case 
			  when isnull(b.TargetMoney,0) = 0 then 0.0
			  when isnull(b.TargetMoney,0) <> 0 then cast((isnull(a.TotalCash,0.0)+isnull(z.HospitalMoney,0.0))/isnull(b.TargetMoney,0) as decimal(19,4))
			  end
			 from (
			 select refdeptid as DeptID,iDept.Title as DeptName,sum(cashsum) as TotalCash,sum(cashOut) as XOut,
			 sum(SrvCash) as ServiceX,sum(SrvCard) as ServiceK,sum(SrvTicket) as ServiceQ,
			 sum(SrvVip) as ServiceG,sum(SrvShampoo) as ServiceXT,sum(PdtCash) as ProductX,
			 sum(PdtCard) as ProductK,sum(PdtTicket) as ProductQ,sum(SaleCard) as CardX,
			 sum(Turnover) as TotalYy from rsale left join idept on rsale.refdeptid=idept.id and idept.AreaId is not null {0} {1}
			 where (iDept.DeptTypeID=1 or iDept.DeptTypeID=2) and datediff(m,reffindate,getdate())=0
			 group by refdeptid,idept.title) as a
			 left join idepttarget b on a.DeptID = b.DeptID and b.isdeleted = 0
			 left join (select y.DeptID as DeptID,sum(y.DeptDeductMoney) as HospitalMoney 
			 from bHisCash as x,bHisCashList as y
			 where datediff(m,x.BillDate,getdate()) = 0 and
              x.IsDeleted = 0 and x.ID = y.HisCashID
			 group by y.DeptID) z on a.DeptID = z.DeptID", hideDeptSql, AreaSql);


                if (DeptName != null && !string.IsNullOrEmpty(DeptName))
                {
                    sql += " where a.DeptName like '%'+@DeptName+'%'";
                    prams.Add("@DeptName", DeptName.Trim());
                }
                //sql += " group by a.Id,a.Title";
                //DataTable dt = aEmp.ExecQuery(sql);

                DataTable dt = mybll.GetPageData(sql, OrderSql, start + 1, limit, prams);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\",StackTrace:\"" + ex.StackTrace + "\"}";
            }
            return result;
        }


        //加载所有地区
        private string LoadArea()
        {
            string result = string.Empty;
            try
            {
                string sql = @"select '请选择' as text,0 as value union select Title as text,id as value from iArea 
                           where IsDeleted=0 and ParentId=1";
                //搜索类型
                string PType = Request["PType"];

                DataTable dt = new DataTable();
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    if (!string.IsNullOrEmpty(PType) && PType == "deptyj")
                    {//可见大区Id
                        object big = utl.ExecuteScalar("select visiableareasbig from agroup where id=" + CurrentSession.GroupId);
                        if (big != null && big.ToString() != "")
                        {
                            string[] bigAreas = big.ToString().Split(',');
                            sql += " and Id in (";
                            for (int i = 0; i < bigAreas.Length; i++)
                            {
                                sql += bigAreas[i] + ","; ;
                            }
                            sql = sql.TrimEnd(',');
                            sql += ")";
                        }
                    }
                    dt = utl.ExecuteQuery(sql);
                }
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //加载地区下的所属区域
        private string LoadArea1()
        {
            string result = string.Empty;
            try
            {
                string PType = Request["PType"];
                string sql = "select '请选择' as text,0 as value union select Title as text,id as value from iArea where IsDeleted=0 and ParentId=@PId";
                Hashtable prams = new Hashtable();
                prams.Add("@PId", Request["PId"]);
                DataTable dt = new DataTable();
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    if (!string.IsNullOrEmpty(PType) && PType == "deptyj")
                    {//可见小区Id
                        object small = utl.ExecuteScalar("select visiableareassmall from agroup where id=" + CurrentSession.GroupId);
                        if (small != null && small.ToString() != "")
                        {
                            string[] smallAreas = small.ToString().Split(',');
                            sql += " and Id in (";
                            for (int i = 0; i < smallAreas.Length; i++)
                            {
                                sql += smallAreas[i] + ",";
                            }
                            sql = sql.TrimEnd(',');
                            sql += ")";
                        }
                    }
                    dt = utl.ExecuteQuery(sql, prams);
                }
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //加载所选区域下的所有门店
        private string LoadDept()
        {
            string result = string.Empty;
            try
            {
                string sql = "select Title as text,Id as value from iDept where IsDeleted=0 {0} and DeptTypeId=1 and AreaId=@AreaId order by Title desc";
                Hashtable prams = new Hashtable();
                prams.Add("@AreaId", Request["AreaId"]);
                bool hideDept = Request["hideDept"] != null ? Boolean.Parse(Request["hideDept"]) : true;
                if (hideDept)
                {
                    sql = string.Format(sql, " and (DeptStatus<>0 or DeptStatus is null)");
                }
                else
                {
                    sql = string.Format(sql, string.Empty);
                }
                DataTable dt = new DataTable();
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    dt = utl.ExecuteQuery(sql, prams);
                }
                DataRow dr = dt.NewRow();
                dr["text"] = "请选择";
                dr["value"] = 0;
                dt.Rows.InsertAt(dr, 0);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //加载所选门店的信息
        private string LoadDeptInfo()
        {
            string result = string.Empty;
            try
            {
                //string sql = "select Title,AreaID,LandLord,RentBegin,RentEnd,BusinessLic,LordTel,Rental,Area,LegalPerson from iDept where IsDeleted=0 and Id=" + Request["DeptId"];
                string sql = string.Format(@"select b.Title,AreaID,LandLord,
                                        convert(nvarchar(50),RentBegin,102)+ '--' +convert(nvarchar(50),RentEnd,102) as Rent
                                        ,BusinessLic,LordTel,Rental,Area,LegalPerson
                                        from iDeptExt a,iDept b where a.IsDeleted=0 and a.DeptId=b.Id and a.DeptId=@DeptId");
                Hashtable prams = new Hashtable();
                prams.Add("@DeptId", Request["DeptId"]);
                DataTable dt = new DataTable();
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    dt = utl.ExecuteQuery(sql, prams);
                }
                if (dt.Rows.Count > 0)
                {
                    #region 生成 json 字符串
                    #region
                    string rent = dt.Rows[0]["Rent"].ToString();
                    string LandLord = dt.Rows[0]["LandLord"].ToString();
                    string BusinessLic = dt.Rows[0]["BusinessLic"].ToString();
                    string LordTel = dt.Rows[0]["LordTel"].ToString();
                    string Rental = dt.Rows[0]["Rental"].ToString();
                    string Area = dt.Rows[0]["Area"].ToString();
                    string LegalPerson = dt.Rows[0]["LegalPerson"].ToString();
                    dt.Rows[0]["Rent"] = "";
                    dt.Rows[0]["LandLord"] = "";
                    dt.Rows[0]["BusinessLic"] = "";
                    dt.Rows[0]["LordTel"] = "";
                    dt.Rows[0]["Rental"] = "";
                    dt.Rows[0]["Area"] = "";
                    dt.Rows[0]["LegalPerson"] = "";
                    #endregion
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        #region
                        if (i == 0)
                        {
                            dt.Rows[0]["Rent"] += rent;
                            dt.Rows[0]["LandLord"] = LandLord;
                            dt.Rows[0]["BusinessLic"] = BusinessLic;
                            dt.Rows[0]["LordTel"] = LordTel;
                            dt.Rows[0]["Rental"] = Rental;
                            dt.Rows[0]["Area"] = Area;
                            dt.Rows[0]["LegalPerson"] = LegalPerson;
                        }
                        else
                        {
                            dt.Rows[0]["Rent"] += dt.Rows[i]["Rent"].ToString();
                            dt.Rows[0]["LandLord"] += dt.Rows[i]["LandLord"].ToString();
                            dt.Rows[0]["BusinessLic"] += dt.Rows[i]["BusinessLic"].ToString();
                            dt.Rows[0]["LordTel"] += dt.Rows[i]["LordTel"].ToString();
                            dt.Rows[0]["Rental"] += dt.Rows[i]["Rental"].ToString();
                            dt.Rows[0]["Area"] += dt.Rows[i]["Area"].ToString();
                            dt.Rows[0]["LegalPerson"] += dt.Rows[i]["LegalPerson"].ToString();


                            DataRow dr = dt.Rows[i];
                            dt.Rows.Remove(dr);
                        }
                        #endregion
                        if (i < dt.Rows.Count - 1)
                        {
                            if (dt.Rows[0]["Rent"].ToString() != "")
                            {
                                dt.Rows[0]["Rent"] += " / ";
                            }
                            if (dt.Rows[0]["LandLord"].ToString() != "")
                            {
                                dt.Rows[0]["LandLord"] += " / ";
                            }
                            if (dt.Rows[0]["BusinessLic"].ToString() != "")
                            {
                                dt.Rows[0]["BusinessLic"] += " / ";
                            }
                            if (dt.Rows[0]["LordTel"].ToString() != "")
                            {
                                dt.Rows[0]["LordTel"] += " / ";
                            }
                            if (dt.Rows[0]["Rental"].ToString() != "")
                            {
                                dt.Rows[0]["Rental"] += " / ";
                            }
                            if (dt.Rows[0]["Area"].ToString() != "")
                            {
                                dt.Rows[0]["Area"] += " / ";
                            }
                            if (dt.Rows[0]["LegalPerson"].ToString() != "")
                            {
                                dt.Rows[0]["LegalPerson"] += " / ";
                            }
                        }
                    }
                    result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                    #endregion
                }
                else
                {
                    result = "[]";
                }
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        //加载所选门店下的所有员工
        private string LoadEmp()
        {
            string result = string.Empty;
            try
            {
                Hashtable prams = new Hashtable();
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit1"]);
                string EmpId = Request["EmpId"];
                string sql1 = string.Empty;
                if (EmpId != null && !string.IsNullOrEmpty(EmpId))
                {
                    sql1 = "  and a.Id = @EmpId";
                    prams.Add("@EmpId", EmpId.Trim());
                }
                prams.Add("@DeptId", Request["DeptId"]);
                string sql = string.Format(@"select top {1} a.Id,a.Title,a.Mobile,b.Title as Duty,
                                        (select top 1 filepath from iEmpImg where IsDeleted=0 and EmpId=a.Id) as ImgUrl
                                        from iEmployee a,iDuty b 
                                        where a.IsDeleted=0 and a.state<>'离职' and a.DeptId=@DeptId
                                        and a.Id not in 
                                        (select top {0} a.Id from iEmployee a,iDuty b
                                        where a.Isdeleted=0 and a.state<>'离职' and a.DeptId=@DeptId and a.DutyId=b.Id {2} order by b.SortId desc)
                                        and a.DutyId=b.Id {2} order by b.SortId desc", start, limit, sql1);
                DataTable dt = new DataTable();
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    dt = utl.ExecuteQuery(sql, prams);
                }
                result += "[";
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    result += "{";
                    result += "\"id\":" + dt.Rows[i]["ID"] + ",\"imgurl\":\"" + dt.Rows[i]["ImgUrl"] + "\",";
                    result += "\"title\":\"" + dt.Rows[i]["Title"] + "\",\"mobile\":\"" + dt.Rows[i]["Mobile"] + "\",";
                    result += "\"duty\":\"" + dt.Rows[i]["Duty"] + "\"";
                    result += "}";
                    if (dt.Rows.Count - 1 > i)
                    {
                        result += ",";
                    }
                }
                result += "]";
            }
            catch (Exception ex)
            {
                result = ex.Message + ex.StackTrace;
            }
            return result;
        }

        //加载所选区域下的经理
        private string LoadMgr()
        {
            string result = string.Empty;
            try
            {
                string start = Request["start"];
                string limit = Request["limit"];
                string duty = Request["Duty"];
                //string sql = string.Format("select a.EmpId from iAreaMgr a,iDuty b where a.IsDeleted=0 and b.IsDeleted=0 and a.AreaId=@AreaId and a.DutyId=b.Id ");
                string sql = @"select a.EmpId,c.Title,c.Mobile,b.Title as Duty,(select top 1 FilePath from iEmpImg where IsDeleted=0 and EmpId=a.EmpId) as ImgUrl
                            from iAreaMgr a,iDuty b,iEmployee c
                            where a.IsDeleted=0 and a.DutyId=b.Id and a.EmpId=c.Id and a.AreaId=@AreaId";
                if (duty.Equals("yxjl"))
                {
                    sql += " and b.Id=" + this.YxMgrId;
                }
                else if (duty.Equals("xqjl"))
                {
                    sql += " and b.Id=" + this.QyMgrId;
                }
                Hashtable prams = new Hashtable();
                prams.Add("@AreaId", Request["AreaId"]);
                DataTable dt = new DataTable();

                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    dt = utl.ExecuteQuery(sql, prams);
                }

                result += "[";
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    result += "{";
                    result += "\"id\":" + dt.Rows[i]["EmpId"] + ",\"imgurl\":\"" + dt.Rows[i]["ImgUrl"] + "\",";
                    result += "\"title\":\"" + dt.Rows[i]["Title"] + "\",\"mobile\":\"" + dt.Rows[i]["Mobile"] + "\",";
                    result += "\"duty\":\"" + dt.Rows[i]["Duty"] + "\"";
                    result += "}";
                    if (dt.Rows.Count - 1 > i)
                    {
                        result += ",";
                    }
                }
                result += "]";
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //加载员工详细信息
        private string LoadEmpInfo()
        {
            string result = string.Empty;
            try
            {
                string sql = @"select a.Title as EmpName,weight,height,Zodiac,Degree,Salary,Share,Term,Address,
                            a.MemoInfo,Nation,Language,PepTalent,b.Title as Duty,Mobile,Birthday,HireDate,WorkContract,EmployContract
                            from iEmployee a,iDuty as b where a.IsDeleted=0 and a.Id=@EmpId and a.DutyId=b.Id";
                Hashtable prams = new Hashtable();
                prams.Add("@EmpId", Request["EmpId"]);
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    DataTable dt = utl.ExecuteQuery(sql, prams);
                    result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                }
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //加载工作记录
        private string LoadWorked()
        {
            string result = string.Empty;
            try
            {
                string EmpId = Request["EmpId"];
                string sql = string.Format(@"select id,FromDeptName,FromDutyName,ToDeptName,DutyName,FlowDate,cast(FromBaseWage as numeric(18,2)) as FromBaseWage
                        from bEmpHistory where IsDeleted=0 and type='调动' and PermFlag='审核通过' 
                        and FlowDate>'2012-5-31' and EmpId=@EmpId 
                        order by FlowDate");
                Hashtable prams = new Hashtable();
                prams.Add("@EmpId", EmpId);
                DataTable dt = new DataTable();
                DataTable dtEmp = new DataTable();
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    dt = utl.ExecuteQuery(sql, prams);
                    sql = @"select a.id,c.Title as Duty,a.hiredate,b.Title,a.Salary as BaseWage 
                        from iEmployee a,iDept b,iDuty c
                        where a.IsDeleted=0 and b.IsDeleted=0 and c.IsDeleted=0 and a.DutyId=c.Id and a.deptid=b.id and a.Id=@EmpId";
                    dtEmp = utl.ExecuteQuery(sql, prams);
                }
                #region 生成Json字符串
                result = "[";
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    result += "{";
                    #region
                    if (i < dt.Rows.Count - 1)
                    {
                        DateTime dtime = Convert.ToDateTime(dt.Rows[i]["FlowDate"]);
                        result += "\"DeptName\":\"" + dt.Rows[i]["FromDeptName"] + "\",";
                        result += "\"WorkedTime\":\"";
                        DateTime dtime1 = DateTime.Now;
                        if (i == 0)
                        {
                            dtime1 = Convert.ToDateTime(dtEmp.Rows[0]["hiredate"]);
                            result += dtime1.Year.ToString() + "年" + dtime1.Month + "月" + dtime1.Day + "日" + " -- " + dtime.Year.ToString() + "年" + dtime.Month + "月" + dtime.Day + "日" + "\",";
                        }
                        else
                        {
                            dtime1 = Convert.ToDateTime(dt.Rows[i + 1]["FlowDate"]);
                            result += dtime.Year.ToString() + "年" + dtime.Month + "月" + dtime.Day + "日" + " -- " + dtime1.Year.ToString() + "年" + dtime1.Month + "月" + dtime1.Day + "日" + "\",";
                        }
                        result += "\"dy\":\"" + dt.Rows[i]["FromBaseWage"] + "\",";
                        result += "\"DutyName\":\"" + dt.Rows[i]["FromDutyName"] + "\"";
                    }
                    else
                    {
                        result += "\"DeptName\":\"" + dtEmp.Rows[0]["Title"] + "\",";
                        DateTime dtime = Convert.ToDateTime(dtEmp.Rows[0]["hiredate"]);
                        result += "\"WorkedTime\":\"" + dtime.Year.ToString() + "年" + dtime.Month + "月" + dtime.Day + "日" + " -- 至今\",";
                        result += "\"dy\":\"" + dtEmp.Rows[0]["BaseWage"] + "\",";
                        result += "\"DutyName\":\"" + dtEmp.Rows[0]["Duty"] + "\"";
                    }
                    #endregion
                    result += "}";
                    if (i < dt.Rows.Count - 1)
                    {
                        result += ",";
                    }
                }
                if (dt.Rows.Count == 0)
                {
                    DateTime dtime = (DateTime)dtEmp.Rows[0]["hiredate"];
                    result += "{";
                    result += "\"DeptName\":\"" + dtEmp.Rows[0]["Title"] + "\",";
                    result += "\"WorkedTime\":\"" + dtime.Year.ToString() + "年" + dtime.Month + "月" + dtime.Day + "日" + " -- 至今\",";
                    result += "\"DutyName\":\"" + dtEmp.Rows[0]["Duty"] + "\",";
                    result += "\"dy\":\"" + dtEmp.Rows[0]["BaseWage"] + "\"";
                    result += "}";
                }
                result += "]";
                #endregion
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //搜索员工
        private string SearchEmp()
        {
            string result = string.Empty;
            try
            {
                #region
                //            string sql = string.Format(@"select a.Id,a.Title,a.Mobile,b.Title as Duty,
                //                                        (select top 1 FilePath from iEmpImg where IsDeleted=0 and EmpId=a.Id) as ImgUrl
                //                                        from iEmployee a,iDuty b where a.IsDeleted=0 and a.state<>'离职' 
                //                                        and a.Title like '%'+@EmpName+'%' and a.DutyId=b.Id and a.DeptId=@DeptId");
                //            Hashtable parms = new Hashtable();
                //            parms.Add("@EmpName", Request["EmpName"].Trim());
                //            parms.Add("@DeptId", Request["DeptId"]);
                //            DataTable dt = new DataTable();
                //            using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                //            {
                //                dt=utl.ExecuteQuery(sql,parms);
                //            }
                //            result += "[";
                //            for (int i = 0; i < dt.Rows.Count; i++)
                //            {
                //                result += "{";
                //                result += "\"id\":" + dt.Rows[i]["ID"] + ",\"imgurl\":\"" + dt.Rows[i]["ImgUrl"] + "\",";
                //                result += "\"title\":\"" + dt.Rows[i]["Title"] + "\",\"mobile\":\"" + dt.Rows[i]["Mobile"] + "\",";
                //                result += "\"duty\":\"" + dt.Rows[i]["Duty"] + "\"";
                //                result += "}";
                //                if (dt.Rows.Count - 1 > i)
                //                {
                //                    result += ",";
                //                }
                //            }
                //            result += "]";
                #endregion

                string sql = @"select a.Id as EmpId,b.Id as DeptId,a.Title as EmpName,b.Title as DeptName
                           from iEmployee a,iDept b where a.IsDeleted=0 and b.IsDeleted=0 and a.DeptId=b.Id and a.state<>'离职' and b.DeptTypeId=1";
                Hashtable prams = new Hashtable();
                string EmpName = Request["EmpName"];
                if (!string.IsNullOrEmpty(EmpName))
                {
                    sql += " and a.Title like '%'+@EmpName+'%'";
                    prams.Add("@EmpName", EmpName);
                }
                sql += "order by b.Id,a.EmpName";
                DataTable dt = mybll.ExecQuery(sql, prams);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //搜索门店
        private string SearchDept()
        {
            try
            {
                string DeptName = Request["DeptName"].Trim();
                Hashtable prams = new Hashtable();
                prams.Add("@DeptName", DeptName);
                string sql = @"select Id as DeptID,Title as DeptName from iDept 
                           where IsDeleted=0 and DeptTypeId=1 and Title like '%'+@DeptName+'%'";
                DataTable dt = mybll.ExecQuery(sql, prams);
                return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                return "{success:false,msg:\"" + ex.Message + "\"}";
            }
        }

        //加载员工照片地址
        private string LoadImg()
        {
            string result = string.Empty;
            try
            {
                string sql = "select Id,FileName,FilePath from iEmpImg where IsDeleted=0 and EmpId=@EmpId";
                Hashtable prams = new Hashtable();
                prams.Add("@EmpId", Request["EmpId"]);
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    DataTable dt = utl.ExecuteQuery(sql, prams);
                    result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                }
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        //加载员工总数
        private string LoaEmpCount()
        {
            string result = string.Empty;
            try
            {
                string sql = @"select Count(a.Id) from iEmployee a,iDuty b
                        where a.IsDeleted=0 and a.state<>'离职' and a.DutyId=b.Id and DeptId=@DeptId";
                Hashtable prams = new Hashtable();
                prams.Add("@DeptId", Request["DeptId"]);
                string EmpName = Request["EmpName"];
                if (EmpName != null && !string.IsNullOrEmpty(EmpName))
                {
                    sql += " and a.Title like '%'+@EmpName+'%'";
                    prams.Add("@EmpName", EmpName);
                }
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    int EmpCount = Convert.ToInt32(utl.ExecuteScalar(sql, prams));
                    result = "[{\"EmpCount\":" + EmpCount + "}]";
                }
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
    }
}
