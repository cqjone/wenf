using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using DbCommon;
using System.Text;
using System.IO;

namespace BeautyPointWeb.Apis
{
    /**
     * 物料管理
     * @author Milon
     * */
    public partial class LogisticsManagement :AuthBasePage
    {
        protected string strReportTemplatePath = "~/Templates/LogisticsRepot.html";
        protected string strReportItemTemplatePath = "~/Templates/LogisticsItem.html";
        BllApi.BiLogisticsApi objLogistics = new BllApi.BiLogisticsApi();

        protected void Page_Load(object sender, EventArgs e)
        {
            CurrentUser = new UserInfo();
            CurrentUser.Id = CurrentSession.UserID;
            CurrentUser.DeptID = CurrentSession.DeptID;
            CurrentUser.UserType = CurrentSession.UserType;
            DeptId = CurrentUser.DeptID;
            UserId = CurrentUser.Id;
            UserName = CurrentUser.UserName;
            UserType = CurrentUser.UserType;
            switch (ActionName)
            {
                default:
                    base.ReturnResultJson("false", "没有该API");
                    break;
                case "getLogisticsRegister":
                    getLogisticsRegister();
                    break;
                case "addLogisticsRegister":
                    addLogisticsRegister();
                    break;
                case "getLogisticsTypeName":
                    getLogisticsTypeName();
                    break;
                case "getLogisticsReport":
                    getLogisticsReport();
                    break;
                case "getProduct":
                    getProduct();
                    break;

                case "initLogisticReport":
                    initLogisticReport();
                    break;

                case "reCalculate":
                    reCalculate();
                    break;

                case "deleteItem":
                    Del();
                    break;
                case "getEmployeeToDept":
                    getEmployeeToDept();
                    break;
                case "addEmployeeToDept":
                    addEmployeeToDept();
                    break;
                case "delEmployeeToDept":
                    delEmployeeToDept();
                    break;
                case "getDeptPurchasePrice":
                    getDeptPurchasePrice();
                    break;
                case "addDeptPurchasePrice":
                    addDeptPurchasePrice();
                    break;
                case "delDeptPurchasePrice":
                    delDeptPurchasePrice();
                    break;
                case "addSendSocialSWithhold":
                    addSendSocialSWithhold();
                    break;
				case "getSendSocialSWithhold":
                    getSendSocialSWithhold();
                    break;
                case "delSendSocialSWithhold":
                    delSendSocialSWithhold();
                    break;
				case "getWithHoldStandard":
                    getWithHoldStandard();
                    break;
				case "addSocialSWithhold":
					addSocialSWithhold();
					break;
				case "getSocialSWithhold":
					getSocialSWithhold();
					break;
                case "delSocialSWithhold":
                    delSocialSWithhold();
                    break;
				case "getSearchSocialSWithhold":
                    getSearchSocialSWithhold();
                    break;					
                case "initLogisticReportByPrvPeriod":
                    initLogisticReportByPrvPeriod();
                    break;
                case "export2Excel":
                    export2Excel();
                    break;
            }
        }

        #region 查询物料登记记录
        /**
         * 查询物料登记记录
         * */
        private void getLogisticsRegister()
        {
            //if (!validateDeptID())
            //{
            //    return ;
            //}
            bool isOnlyThisMonth = string.IsNullOrEmpty(Request["isThisMonth"]) ? true : Request["isThisMonth"].Equals("1") ? true : false;//是否只显示当月记录
            bool isMonthEndDay = false;//是否为月结日
            DateTime today = DateTime.Now;
            string currentYearMonth = DateTime.Now.Date.ToString("yyyy-MM");//当前年月
            string formerYearMonth = DateTime.Now.Date.AddMonths(-1).ToString("yyyy-MM");//上月
            int thisDay = today.Day;
            //if (thisDay >= 1 && thisDay <= 4)
            //{
            //    isMonthEndDay = true;
            //}
            Hashtable parms = new Hashtable();
            String showAll = "false";
            if (!String.IsNullOrEmpty(Request["showAll"]))
            {
                showAll = Request["showAll"];
            }
            else if (isMonthEndDay) 
            {
                showAll = "true"; 
            }
            
            //int deptID=Convert.ToInt32(Request["DeptID"]);//部门ID

            string wheresql = " a.IsDeleted=0 and  a.DeptID=@deptID ";
            parms.Add("@deptID", CurrentUser.DeptID);
            if (isOnlyThisMonth)
            {
                if (isMonthEndDay)
                {
                    //wheresql += " and convert(char(7) ,date , 120)>=@formerYearMonth and convert(char(7) ,date , 120)<=@currentYearMonth";
                    //parms.Add("@formerYearMonth", formerYearMonth);
                    //parms.Add("@currentYearMonth", currentYearMonth);
                    // wheresql+=" and datediff(m,[date],GetDate())<=1";
                }
                else
                {
                    //wheresql += " and convert(char(7) ,date , 120)=@currentYearMonth";
                    //wheresql += " and datediff(m,[date],GetDate())=0";
                    //parms.Add("@currentYearMonth", currentYearMonth);
                }

            }
            //如果
            //if (showAll == "false") 
            //{
            //    wheresql += " and datediff(m,BillDate,GetDate())=0";
            //}

            /*  if (!string.IsNullOrEmpty(code))
              {
                  wheresql += " and Code=@code";
                  parms.Add("@code", code);
              }
              if (!string.IsNullOrEmpty(type))
              {
                  wheresql += " and type=@type";
                  parms.Add("@type", type);
              }
              if (!string.IsNullOrEmpty(date))
              {
                  string dateFormat = Convert.ToDateTime(date).ToString("yyyy-MM-dd");
                  wheresql += " and date=@dateFormat";
                  parms.Add("@date", dateFormat);
              }*/
                wheresql += " and datediff(d,BillDate,GetDate())<=3";
            DataTable dt = objLogistics.GetData(CurrentUser, wheresql, parms);
            if (dt != null && dt.Rows.Count > 0)
            {
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

                Response.Write(html);
                Response.End();
            }
            else
            {
                base.ReturnResultJson("false", "无数据!");
                return;
            }
        }

        #endregion

        private void initLogisticReport() 
        {
            String period = DateTime.Now.ToString("yyyy-MM-01");
            String finDate = Request["FinDate"];
            String strDeptId = Request["DeptId"];
            if (!String.IsNullOrEmpty(finDate)) 
            {
                period = DateTime.Parse(finDate).ToString("yyyy-MM-01");  
            }
            int index = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                try
                {
                    String sql = "select distinct DeptID,ProductID from biLogistics a  where IsDeleted=0 and   DATEDIFF(m,a.BillDate,'"+period+"')=0";
                    if (!String.IsNullOrEmpty(strDeptId)) 
                    {
                        sql += " and DeptID=" + strDeptId;    
                    }
                    DataTable tbDeptProduct = db.ExecuteQuery(sql);
                    
                    for (int i = 0; i < tbDeptProduct.Rows.Count; i++) 
                    {
                        index = i;
                        DataRow dr = tbDeptProduct.Rows[i];
                        int deptId = Int32.Parse(dr["DeptID"].ToString());
                        int productId = Int32.Parse(dr["ProductID"].ToString());
                        objLogistics.UpdateReportData(CurrentUser, productId, deptId, DateTime.Parse(period), db);
                    }
                    
                    db.Commit();
                }
                catch (Exception ex)
                {
                    db.Rollback();
                }
            }
            
        }

        private void initLogisticReportByPrvPeriod()
        {
            String period = DateTime.Now.ToString("yyyy-MM-01");
            String finDate = Request["FinDate"];
            String strDeptId = Request["DeptId"];
            if (!String.IsNullOrEmpty(finDate))
            {
                period = DateTime.Parse(finDate).ToString("yyyy-MM-01");
            }
            int index = 0;
            try
            {
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    try
                    {
                        String sql = @"select distinct DeptID,ProductID from bLogisticsReport a  where IsDeleted=0 
                        and IsNull(RNum,0)+IsNull(LNum,0)+IsNull(XNum,0)+IsNull(StartNum,0)+IsNull(EndNum,0)+Abs(IsNull(EndNum,0)) !=0 
                        and   DATEDIFF(m,a.Findate,'" + DateTime.Parse(finDate).AddMonths(-1).ToString("yyyy-MM-01") + @"')=0 ";
                        if (!String.IsNullOrEmpty(strDeptId))
                        {
                            sql += " and DeptID=" + strDeptId;
                        }
                        sql += " order by ProductID Asc";
                        DataTable tbDeptProduct = db.ExecuteQuery(sql);
                        for (int i = 0; i < tbDeptProduct.Rows.Count; i++)
                        {
                            index = i;
                            DataRow dr = tbDeptProduct.Rows[i];
                            int deptId = Int32.Parse(dr["DeptID"].ToString());
                            int productId = Int32.Parse(dr["ProductID"].ToString());
                            objLogistics.UpdateReportData(CurrentUser, productId, deptId, DateTime.Parse(period), db);
                            Response.Write("deptId:" + deptId + ",Product:" + productId);
                            Response.Clear();
                        }

                        db.Commit();
                    }
                    catch (Exception ex)
                    {
                        db.Rollback();
                    }
                }
            }
            catch (Exception ex) 
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }

        }


        private void markUpReportByPrvPeriod(String finDate,int DeptId,DbCommon.DbUtil db )
        {
            DateTime prvFinDate = DateTime.Parse(finDate).AddMonths(-1);
            String sqlExists = "select * from bLogisticsMakeupLogs where DeptID=" + DeptId + " and DateDiff(m,FinDate,finDate)=0";
            DataTable tb = db.ExecuteQuery(sqlExists);
            if (tb != null && tb.Rows.Count > 0)
                return;
            String sql = @"insert into bLogisticsReport(CreateDate,CreateID,ModifyDate,ModifyID,IsDeleted,FinDate,ProductID,DeptID,DataYear,DataMonth,StartNum) 
                           select GETDATE() as CreateDate,1 as CreateID ,GETDATE() as ModifyDate, 1 as ModifyID,0 as IsDeleted,'"+finDate+@"' as FinDate,ProductID,DeptID, 
                            YEAR('" + finDate + @"') as DataYear,MONTH('" + finDate + @"') as DataMonth,EndNum as StartNum from bLogisticsReport 
                            where DeptId=" + DeptId + @"  and datediff(m,FinDate,'" + prvFinDate.ToString("yyyy-MM-dd") + @"')=0 and ISNULL(EndNum,0)!=0
                            and ProductId not in (select distinct ProductId  from bLogisticsReport  where DeptId=" + DeptId + @" and datediff(m,FinDate,'" + finDate + @"')=0)";
            db.ExecuteNoneQuery(sql);
            sql = "insert into bLogisticsMakeupLogs(DeptID,FinDate)values(" + DeptId + ",'" + finDate + "')";
            db.ExecuteNoneQuery(sql);
        }


        private void initLogisticReportByPeriod()
        {
            String period = DateTime.Now.ToString("yyyy-MM-01");
            String finDate = Request["FinDate"];
            if (!String.IsNullOrEmpty(finDate))
            {
                period = DateTime.Parse(finDate).ToString("yyyy-MM-01");
            }
            int index = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                try
                {
                    String sql = "select distinct DeptID,ProductID from biLogistics a  where IsDeleted=0 and   DATEDIFF(m,a.BillDate,'" + period + "')=0";
                    DataTable tbDeptProduct = db.ExecuteQuery(sql);

                    for (int i = 0; i < tbDeptProduct.Rows.Count; i++)
                    {
                        index = i;
                        DataRow dr = tbDeptProduct.Rows[i];
                        int deptId = Int32.Parse(dr["DeptID"].ToString());
                        int productId = Int32.Parse(dr["ProductID"].ToString());
                        objLogistics.UpdateReportData(CurrentUser, productId, deptId, DateTime.Parse(period), db);
                    }

                    db.Commit();
                }
                catch (Exception ex)
                {
                    db.Rollback();
                }
            }

        }


        private void reCalculate()
        {
            String period = DateTime.Now.ToString("yyyy-MM-01");
            String finDate = Request["FinDate"];
            if (!String.IsNullOrEmpty(finDate))
            {
                period = DateTime.Parse(finDate).ToString("yyyy-MM-01");
            }
            int index = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                try
                {
                    String sql = @"select distinct DeptID,ProductID from bLogisticsReport a  where IsDeleted=0 and StartNum=0 
                        and IsNull(RNum,0)+IsNull(LNum,0)+IsNull(XNum,0)+IsNull(StartNum,0)+IsNull(EndNum,0)+Abs(IsNull(EndNum,0)) !=0
                        and   DATEDIFF(m,a.FinDate,'" + period + @"')=0";
                    DataTable tbDeptProduct = db.ExecuteQuery(sql);

                    for (int i = 0; i < tbDeptProduct.Rows.Count; i++)
                    {
                        index = i;
                        DataRow dr = tbDeptProduct.Rows[i];
                        int deptId = Int32.Parse(dr["DeptID"].ToString());
                        int productId = Int32.Parse(dr["ProductID"].ToString());
                        objLogistics.UpdateReportData(CurrentUser, productId, deptId, DateTime.Parse(period), db);
                    }

                    db.Commit();
                }
                catch (Exception ex)
                {
                    db.Rollback();
                }
            }

        }


        /**
         * 查询物流报表
         * */
        private void getLogisticsReport()
        {
            int year = string.IsNullOrEmpty(Request["Year"]) ? DateTime.Now.Year : Convert.ToInt16(Request["Year"]);
            int month = string.IsNullOrEmpty(Request["Month"]) ? DateTime.Now.Month : Convert.ToInt16(Request["Month"]);
            int deptID = string.IsNullOrEmpty(Request["DeptID"]) ? CurrentUser.DeptID : Convert.ToInt16(Request["DeptID"]);

            Hashtable parms = new Hashtable();
            string wheresql = " DataYear=@year and  DataMonth=@month and DeptID=@deptID ";
            parms.Add("year", year);
            parms.Add("month", month);
            parms.Add("deptID", deptID);
            objLogistics.GenerateCurrentPeriodData(CurrentSession.DeptID + "");
            DataTable dt = objLogistics.GetReportData(CurrentUser, wheresql, parms);
            if (dt != null && dt.Rows.Count > 0)
            {
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

                Response.Write(html);
                Response.End();
            }
            else
            {
                base.ReturnResultJson("false", "无数据!");
                return;
            }
        }


        private void getProduct()
        {
            string productCode = Request["Code"] == null ? Request["query"] : Request["Code"];
            DataTable dtResult = null;
            dtResult = objLogistics.getProduct(productCode);
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);
            Response.Write(html);
            Response.End();

        }

        private void Del()
        {
            string did = Request["delID"];
            int uid = base.CurrentSession.UserID;
            Hashtable parms = new Hashtable();
            parms.Add("@did", did);
            parms.Add("@uid", uid);
            
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                try
                {
                    String sql = "select * from biLogistics where ID=@did";
                    DataTable dtRes = db.ExecuteQuery(sql, parms);
                    if (dtRes != null && dtRes.Rows.Count > 0)
                    {
                        DataRow dr = dtRes.Rows[0];
                        sql = "update biLogistics set IsDeleted=1,ModifyDate=GetDate(),ModifyID=@uid where ID=@did and datediff(d,BillDate,GetDate())<=3 ";
                        db.ExecuteNoneQuery(sql, parms);
                        
                        int productId = Int16.Parse(dr["ProductID"].ToString());
                        DateTime billDate = DateTime.Parse(dr["BillDate"].ToString());
                        DateTime period = DateTime.Parse(billDate.ToString("yyyy-MM-01"));
                        objLogistics.UpdateReportData(CurrentUser, productId, CurrentSession.DeptID, period, db);
                    }
                }
                catch (Exception ex) 
                {
                    db.Rollback();
                }
                db.Commit();
                
                //objLogistics.UpdateReportData(CurrentUser,productId,CurrentSession.DeptID,
               
            }
            //添加更新报表代码
            //DataTable dtRes = null;
            //sql = "select * from biLogistics where ID=@did";
            //using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            //{
            //    dtRes=db.ExecuteQuery(sql, parms);
            //    db.Commit();
            //}
            //if (dtRes != null)
            //{
            //    Hashtable pramsRe = new Hashtable();
            //    DateTime date = Convert.ToDateTime(dtRes.Rows[0]["CreateDate"]);
            //    pramsRe.Add("year", date.Year);
            //    pramsRe.Add("month", date.Month);
            //    pramsRe.Add("remark", "");
            //    pramsRe.Add("DeptID", dtRes.Rows[0]["DeptID"]);
            //    pramsRe.Add("ProductID", dtRes.Rows[0]["ProductID"]);
            //    pramsRe.Add("type", dtRes.Rows[0]["type"]);
            //    pramsRe.Add("count", "-" + dtRes.Rows[0]["count"]);
            //    if (dtRes.Rows[0]["type"].ToString() != "P")
            //    {
            //        int res = objLogistics.UpdateReportData(CurrentUser, pramsRe);
            //    }
            //    else
            //    {
            //        sql = "select top 1 * from biLogistics where IsDeleted=1 and ID!='" + dtRes.Rows[0]["ID"] + "' and type='" + dtRes.Rows[0]["type"] + "' and  Code='" + dtRes.Rows[0]["Code"] + "' order by CreateDate desc";
            //        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            //        {
            //            dtRes = null;
            //            dtRes = db.ExecuteQuery(sql, parms);
            //            db.Commit();
            //        }
            //        int pnumCount = 0;
            //        if (dtRes != null&&dtRes.Rows.Count>0)
            //        {
            //            pnumCount = Convert.ToInt16(dtRes.Rows[0]["count"]);
            //        }
            //        sql = "update biLogisticsReport set pnum='" + pnumCount + "' where year=@year and month=@month and DeptID=@DeptID and code=(select code from iProduct where ID=@ProductID)";
            //        int result = 0;
            //        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            //        {
            //            result = db.ExecuteNoneQuery(sql, pramsRe);
            //            db.Commit();
            //        }

            //    }

            //}
            base.ReturnResultJson("true", "删除成功");

        }



        /**
         * 新建登记
         * */
        private void addLogisticsRegister()
        {
            if (!validateDeptID())
            {
                return;
            }
            string id = Request["id"];
            object result = null;

            if (string.IsNullOrEmpty(id) || "0".Equals(id))
            {
                //insert
                String type = "L";
                if (!String.IsNullOrEmpty(Request["mytype"]))
                {
                    type = Request["mytype"].Substring(0, 1);
                }
                string date = Request["mydate"];
                string time = "";
                DateTime date1 = Convert.ToDateTime(date);
                int cDays = DateTime.DaysInMonth(date1.Year, date1.Month);
                if (type != "P")
                {
                    time = "18:00:00";
                }
                else if (cDays == date1.Day)
                {
                    time = "23:59:59";
                }
                else
                {
                    time = "05:00:00";
                }
                try
                {
                    //Hashtable pramsRe = new Hashtable();
                    //pramsRe.Add("year", date1.Year);
                    //pramsRe.Add("month", date1.Month);
                    //pramsRe.Add("remark", "");
                    //pramsRe.Add("DeptID", CurrentUser.DeptID);
                    //pramsRe.Add("ProductID", Request["mycode"]);
                    //pramsRe.Add("RecordType", type);
                    //pramsRe.Add("count", Request["mycount"]);
                    //prams.Add("Billdate", date + " " + time);
                    //prams.Add("Num", date + " " + Request["mycount"]);
                    //result = objLogistics.UpdateReportData(CurrentUser, pramsRe);

                    using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                    {
                        try
                        {
                            Hashtable prams = new Hashtable();
                            prams.Add("date", date);
                            prams.Add("ProductID", Request["mycode"]);
                            prams.Add("type", type);
                            prams.Add("count", Request["mycount"]);
                            prams.Add("CreateID", CurrentUser.Id);
                            prams.Add("DeptID", CurrentUser.DeptID);
                            prams.Add("time", time);
                            prams.Add("Billdate", date + " " + time);
                            prams.Add("Num", Request["mycount"]);
                            DateTime billDate = DateTime.Parse(date);
                            TimeSpan span = (DateTime.Now-billDate);
                            if (span.Days < 0 || span.Days > 3) 
                            {
                                
                                Response.Write(string.Format(ResultJson, "false", "只允许录入3天内的单据"));
                                return;
                            }
                            if (!objLogistics.doValildate(type, prams, db))
                            {
                                if (type == "P")
                                {
                                    //base.ReturnResultJson("false", "录入盘点单之前请确认当天没有其他单据。");
                                    Response.Write(string.Format(ResultJson, "false", "盘点当日该产品已经有单据，请先删除该商品单据。"));
                                }
                                else {
                                    //base.ReturnResultJson("false", "录入盘点单之前请确认当天没有盘点单。");
                                    Response.Write(string.Format(ResultJson, "false", "该商品当日已盘点，请勿再盘点"));
                                }
                                return;
                            }

                            result = objLogistics.AddData(CurrentUser, prams, db);
                            DateTime finDate = DateTime.Parse(date);
                            String period = finDate.ToString("yyyy-MM-01");
                            objLogistics.UpdateReportData(CurrentUser, Int16.Parse(Request["mycode"]), CurrentSession.DeptID, DateTime.Parse(period), db);
                            this.markUpReportByPrvPeriod(period, CurrentSession.DeptID, db);

                            
                            db.Commit();
                        }
                        catch (Exception ex1)
                        {
                            db.Rollback();
                        }
                    }

                    
                   
                }
                catch (Exception ex)
                {
                    base.ReturnResultJson("false", ex.Message);
                }

            }

            string msg = "{success:true}";
            base.ReturnResultJson("true", "添加");

            // Response.Write(msg);
            // Response.End();
        }
        /// <summary>
        /// 商品操作类型,根据缩写获取全称
        /// </summary>
        /// <returns></returns>
        private void getLogisticsTypeName()
        {
            string shortText = Request["shorttext"];
            DataTable dtResult = null;
            dtResult = objLogistics.getLogisticsTypeName(shortText);
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);
            Response.Write(html);
            Response.End();

        }
        /// <summary>
        /// 验证DeptID参数是否带过来
        /// </summary>
        /// <returns></returns>
        private bool validateDeptID()
        {
            if (string.IsNullOrEmpty(Request["DeptID"]+""))
            {
                base.ReturnResultJson("false", "缺少DeptID!");
                return false;
            }
            return true;
        }
        /// <summary>
        /// 根据给定的 table名称，映射 页面对应的名称并赋值返回
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public DataTable MappingDataFromPageByLogistics(string tableName, string id,SortedList<string,string> columns)
        {
            if (string.IsNullOrEmpty(tableName))
            {
                return null;
            }
            DbCommon.BaseInfo baseInfo = new BaseInfo();
            DataTable dt = baseInfo.GetDataByID(CurrentUser, tableName, id);
            if (dt == null)
            { return null; }
            DataRow row;
            if (dt.Rows.Count == 0)
            {
                row = dt.NewRow();
            }
            else
            {
                row = dt.Rows[0];
            }
            foreach (DataColumn col in dt.Columns)
            {
                if (columns.ContainsKey(col.ColumnName))
                {
                    string value = columns[col.ColumnName];
                    if (col.DataType == typeof(DateTime))
                    {
                        row[col.ColumnName] = Convert.ToDateTime(value);
                    }
                    else if (col.DataType == typeof(decimal) ||
                        col.DataType == typeof(Int32) ||
                        col.DataType == typeof(double))
                    {
                        row[col.ColumnName] = string.IsNullOrEmpty(value) ? "0" : value;
                    }
                    else
                    {
                        row[col.ColumnName] = value;
                    }
                }
                if (col.ColumnName == "ModifyID")
                {
                    row["ModifyID"] = CurrentSession.UserID;
                }
            }
            if (dt.Rows.Count == 0)
            {
                dt.Rows.Add(row);
            }
            return dt;
        }

        #region 跨店人员设定

        /// <summary>
        /// 获取跨店人员设定信息
        /// </summary>
        public void getEmployeeToDept()
        {
           string  sql = @"select ed.ID,ed.EmployeeID,emp.Code,emp.Title,ed.DutyID,duty.Title as DutyTitle,ed.DeptID,dept.Title as DeptTitle from iEmployeeToDept ed ";
           sql += @"inner join iEmployee emp on ed.EmployeeID=emp.ID inner join iDuty duty on ed.DutyID=duty.ID inner join iDept dept ";
           sql += @"on ed.DeptID=dept.ID where 1=1 and ed.IsDeleted=0";
           int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
           int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
           //int deptID = CurrentUser.DeptID;

           Hashtable parms = new Hashtable();
          // string wheresql = " and ed.DataYear=@year and  ed.DataMonth=@month and ed.DeptID=@deptID ";
           string wheresql = " and ed.DataYear=@year and  ed.DataMonth=@month ";
           parms.Add("year", year);
           parms.Add("month", month);
         //  parms.Add("deptID", deptID);
           sql += wheresql + @" order by ed.ID desc";
           DataTable dtResult = null;
           using (DbCommon.DbUtil db = new DbCommon.DbUtil())
           {
               dtResult = db.ExecuteQuery(sql, parms);
           }
           if (dtResult != null)
           {
               string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);

               Response.Write(html);
               Response.End();
           }
           else
           {
               base.ReturnResultJson("false", "无数据!");
               return;
           } 
        }
        
        #endregion


        #region 新建跨店人员记录
        /// <summary>
        ///新建跨店人员记录
        /// </summary>
        private void addEmployeeToDept()
        {
            string id = Request["id"];
            object result = null;

            if (string.IsNullOrEmpty(id) || "0".Equals(id))
            {
                int year = string.IsNullOrEmpty(Request["myYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["myYear"]);
                int month = string.IsNullOrEmpty(Request["myMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["myMonth"]);
                int EmpId =Convert.ToInt32(Request["EmpId"]);
                int DeptId = Convert.ToInt32(Request["DeptId"]);
                int DutyID = Convert.ToInt32(getDutyIDByEmplyee(EmpId));
                if (isExistEmployeeToDept(EmpId, DeptId,year,month))
                {
                    Response.Write(string.Format(ResultJson, "false", "该员工已经设置了该门店"));
                    return;
                }
                try
                {
                    using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                    {
                        try
                        {
                            Hashtable prams = new Hashtable();
                            prams.Add("EmployeeID", EmpId);
                            prams.Add("DeptID", DeptId);
                            prams.Add("IsDeleted", 0);
                            prams.Add("DataYear", year);
                            prams.Add("DataMonth", month);
                            prams.Add("CreateDate", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            prams.Add("CreateID", base.CurrentSession.UserID);
                            prams.Add("ModifyDate", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            prams.Add("ModifyID", base.CurrentSession.UserID);
                            prams.Add("DutyID", DutyID);
                            string sql = "insert into iEmployeeToDept(EmployeeID,DeptID,IsDeleted,DataYear,DataMonth,CreateDate,CreateID,ModifyDate,ModifyID,DutyID) ";
                            sql += " values(@EmployeeID,@DeptID,@IsDeleted,@DataYear,@DataMonth,@CreateDate,@CreateID,@ModifyDate,@ModifyID,@DutyID)";
                            result = db.ExecuteNoneQuery(sql, prams);
                            db.Commit();
                        }
                        catch (Exception ex1)
                        {
                            db.Rollback();
                        }
                    }

                }
                catch (Exception ex)
                {
                    base.ReturnResultJson("false", ex.Message);
                }

            }

            string msg = "{success:true}";
            base.ReturnResultJson("true", "添加");

            // Response.Write(msg);
            // Response.End();
        }
        #endregion

        #region 删除跨店人员设定
        /// <summary>
        /// 删除跨店人员设定记录
        /// </summary>
        private void delEmployeeToDept()
        {
            int id=string.IsNullOrEmpty(Request["id"])?0:Convert.ToInt32(Request["id"]); 
            Hashtable prams = new Hashtable();
            prams.Add("id", id);
            prams.Add("ModifyID", base.CurrentSession.UserID);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                try
                {
                    string sql = "update iEmployeeToDept set IsDeleted=1,ModifyDate=GetDate(),ModifyID=@ModifyID where ID=@id";
                    db.ExecuteNoneQuery(sql, prams);
                }
                catch(Exception ex)
                {
                   db.Rollback();
                   base.ReturnResultJson("false", "删除失败");
                }
                db.Commit();
                
            }
            base.ReturnResultJson("true", "删除成功");
        }
        #endregion

        #region 门店进货价格设定

        /// <summary>
        /// 门店进货价格设定
        /// </summary>
        public void getDeptPurchasePrice()
        {
            string sql = @"select dpp.ID,dpp.ProductID,p.Code,p.Title,dpp.BiType,dpp.Price from iDeptPurchasePrice dpp inner join iProduct p on dpp.ProductID=p.ID ";
            sql += @" where 1=1 and dpp.IsDeleted=0";
            int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
            int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
            int DeptID = CurrentUser.DeptID;

            Hashtable parms = new Hashtable();
            string wheresql = " and dpp.DataYear=@year and  dpp.DataMonth=@month and dpp.DeptID=@DeptID ";
            parms.Add("year", year);
            parms.Add("month", month);
            parms.Add("deptID", DeptID);
            sql += wheresql + @" order by dpp.ID desc";
            DataTable dtResult = null;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dtResult = db.ExecuteQuery(sql, parms);
            }
            if (dtResult != null)
            {
                string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);

                Response.Write(html);
                Response.End();
            }
            else
            {
                base.ReturnResultJson("false", "无数据!");
                return;
            }
        }

        #endregion

        #region 新建门店进货价格记录
        /// <summary>
        ///新建门店进货价格记录
        /// </summary>
        private void addDeptPurchasePrice()
        {
            string id = Request["id"];
            object result = null;

            if (string.IsNullOrEmpty(id) || "0".Equals(id))
            {
                int year = string.IsNullOrEmpty(Request["myYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["myYear"]);
                int month = string.IsNullOrEmpty(Request["myMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["myMonth"]);
                int ProductID = Convert.ToInt32(Request["ProductID"]);
                int DeptId = CurrentUser.DeptID;
                decimal price = Convert.ToDecimal(Request["price"]);
                string BiType = Request["BiType"];
                int BiTypeID = Convert.ToInt16(Request["BiTypeID"]);
                try
                {
                    using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                    {
                        try
                        {
                            Hashtable prams = new Hashtable();
                            prams.Add("ProductID", ProductID);
                            prams.Add("DeptID", DeptId);
                            prams.Add("IsDeleted", 0);
                            prams.Add("DataYear", year);
                            prams.Add("DataMonth", month);
                            prams.Add("CreateDate", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            prams.Add("CreateID", base.CurrentSession.UserID);
                            prams.Add("ModifyDate", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            prams.Add("ModifyID", base.CurrentSession.UserID);
                            prams.Add("price", price);
                            prams.Add("BiType", BiType);
                            prams.Add("BiTypeID", BiTypeID);
                            string sql = "insert into iDeptPurchasePrice(ProductID,DeptID,IsDeleted,DataYear,DataMonth,CreateDate,CreateID,ModifyDate,ModifyID,price,BiType,BiProductTypeID) ";
                            sql += " values(@ProductID,@DeptID,@IsDeleted,@DataYear,@DataMonth,@CreateDate,@CreateID,@ModifyDate,@ModifyID,@price,@BiType,@BiTypeID)";
                            result = db.ExecuteNoneQuery(sql, prams);
                            db.Commit();
                        }
                        catch (Exception ex1)
                        {
                            db.Rollback();
                        }
                    }

                }
                catch (Exception ex)
                {
                    base.ReturnResultJson("false", ex.Message);
                }

            }

            string msg = "{success:true}";
            base.ReturnResultJson("true", "添加");

            // Response.Write(msg);
            // Response.End();
        }
        #endregion

        #region 删除门店进货价格
        /// <summary>
        /// 删除门店进货价格
        /// </summary>
        private void delDeptPurchasePrice()
        {
            int id = string.IsNullOrEmpty(Request["id"]) ? 0 : Convert.ToInt32(Request["id"]);
            Hashtable prams = new Hashtable();
            prams.Add("id", id);
            prams.Add("ModifyID", base.CurrentSession.UserID);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                try
                {
                    string sql = "update iDeptPurchasePrice set IsDeleted=1,ModifyDate=GetDate(),ModifyID=@ModifyID where ID=@id";
                    db.ExecuteNoneQuery(sql, prams);
                }
                catch (Exception ex)
                {
                    db.Rollback();
                    base.ReturnResultJson("false", "删除失败");
                }
                db.Commit();

            }
            base.ReturnResultJson("true", "删除成功");
        }
        #endregion

        /// <summary>
        /// 获取员工的职务
        /// </summary>
        /// <param name="EmpId">员工ID</param>
        /// <returns>int</returns>
        private object getDutyIDByEmplyee(int EmpId)
        {
            Hashtable prams = new Hashtable();
            prams.Add("EmpId", EmpId);
            string sql = "select DutyID from iEmployee where ID=@EmpId";
            object result = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                result = db.ExecuteScalar(sql, prams);
            }
            return result;
        }
        /// <summary>
        /// 判断员工是否已经设置门店
        /// </summary>
        /// <param name="EmpId">员工ID</param>
        /// <param name="DeptId">门店ID</param>
        /// <param name="year">年份</param>
        /// <param name="month">月份</param>
        /// <returns>boolean</returns>
        private bool isExistEmployeeToDept(int EmpId,int DeptId,int year,int month)
        {
            Hashtable prams = new Hashtable();
            prams.Add("EmpId", EmpId);
            prams.Add("DeptId", DeptId);
            prams.Add("year", year);
            prams.Add("month", month);
            string sql = "select count(ID) from iEmployeeToDept where EmployeeID=@EmpId and DeptID=@DeptId and DataYear=@year and DataMonth=@month and IsDeleted=0";
            object result = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                result = db.ExecuteScalar(sql, prams);
            }
            return Convert.ToInt16(result)>0?true:false;
        }
        /// <summary>
        /// 判断代扣标准是否已经存在
        /// </summary>
        /// <param name="Code">编号</param>
        /// <param name="Title">名称</param>
        /// <returns>boolean</returns>
        private bool isExistSocialSWithhold(string Code)
        {
            Hashtable prams = new Hashtable();
            prams.Add("Code", Code);
            string sql = "select count(ID) from iSocialSWithhold where Code=@Code and IsDeleted=0";
            object result = 0;
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                result = db.ExecuteScalar(sql, prams);
            }
            return Convert.ToInt16(result) > 0 ? true : false;
        }

        private void addSendSocialSWithhold()
        {
            object result = null;
			    int year = string.IsNullOrEmpty(Request["myYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["myYear"]);
                int month = string.IsNullOrEmpty(Request["myMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["myMonth"]);
                int EmpId = Convert.ToInt32(Request["EmpId"]);
                int DeptId = Convert.ToInt32(Request["DeptId"]);
                int DutyID = Convert.ToInt32(getDutyIDByEmplyee(EmpId));
				string withhold = Request["Withhold"];
				/*
                if (isExistEmployeeToDept(EmpId, DeptId, year, month))
                {
                    Response.Write(string.Format(ResultJson, "false", "该员工已经设置了该门店"));
                    return;
                }
				*/
                try
                {
                    using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                    {
                        try
                        {
                            Hashtable prams = new Hashtable();
                            prams.Add("EmployeeID", EmpId);
                            prams.Add("DeptID", DeptId);
                            prams.Add("IsDeleted", 0);
                            prams.Add("DataYear", year);
                            prams.Add("DataMonth", month);
                            prams.Add("CreateDate", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            prams.Add("CreateID", base.CurrentSession.UserID);
                            prams.Add("ModifyDate", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            prams.Add("ModifyID", base.CurrentSession.UserID);
                            prams.Add("WithHoldStandardID", withhold);
                            string sql = "insert into bSendSocialSWithhold(EmployeeID,DeptID,WithHoldStandardID,IsDeleted,DataYear,DataMonth,CreateDate,CreateID,ModifyDate,ModifyID)";
                            sql += " values(@EmployeeID,@DeptID,@WithHoldStandardID,@IsDeleted,@DataYear,@DataMonth,@CreateDate,@CreateID,@ModifyDate,@ModifyID)";
                            result = db.ExecuteNoneQuery(sql, prams);
                            db.Commit();
                        }
                        catch (Exception ex1)
                        {
                            db.Rollback();
                        }
                    }

                }
                catch (Exception ex)
                {
                    base.ReturnResultJson("false", ex.Message);
                }

            string msg = "{success:true}";
            base.ReturnResultJson("true", "添加");
        }
		
		public void getSendSocialSWithhold()
        {
		   string  sql = @"select ss.ID,ss.EmployeeID,emp.Code,emp.Title,ss.DeptID,dept.Title as DeptTitle,ss.WithHoldStandardID,ws.Title as WsTitle from bSendSocialSWithhold ss ";
		   sql += @" inner join iEmployee emp on ss.EmployeeID=emp.ID left join iDept dept on ss.DeptID=dept.ID ";
           sql += @" left join iSocialSWithhold ws on ss.WithHoldStandardID=ws.ID where 1=1 and ss.IsDeleted=0 ";
           int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
           int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
           int deptID =string.IsNullOrEmpty(Request["DeptID"])?0:Convert.ToInt16(Request["DeptID"]);
           int EmpID = string.IsNullOrEmpty(Request["EmpID"]) ? 0 : Convert.ToInt16(Request["EmpID"]);
           Hashtable parms = new Hashtable();
          // string wheresql = " and ed.DataYear=@year and  ed.DataMonth=@month and ed.DeptID=@deptID ";
           string wheresql = " and ss.DataYear=@year and  ss.DataMonth=@month ";
           parms.Add("year", year);
           parms.Add("month", month);
           if (deptID > 0)
           {
               parms.Add("deptID", deptID);
               sql += " and ss.DeptID=@deptID";
           }
           if (EmpID > 0)
           {
               parms.Add("EmpID", EmpID);
               sql += " and ss.EmployeeID=@EmpID";
           }
           
           sql += wheresql + @" order by ss.ID desc";
           DataTable dtResult = null;
           using (DbCommon.DbUtil db = new DbCommon.DbUtil())
           {
               dtResult = db.ExecuteQuery(sql, parms);
           }
           if (dtResult != null)
           {
               string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);

               Response.Write(html);
               Response.End();
           }
           else
           {
               base.ReturnResultJson("false", "无数据!");
               return;
           } 
        }
		
		#region 删除社保代扣名单
        /// <summary>
        /// 删除社保代扣名单
        /// </summary>
        private void delSendSocialSWithhold()
        {
            int id=string.IsNullOrEmpty(Request["id"])?0:Convert.ToInt32(Request["id"]); 
            Hashtable prams = new Hashtable();
            prams.Add("id", id);
            prams.Add("ModifyID", base.CurrentSession.UserID);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                try
                {
                    string sql = "update bSendSocialSWithhold set IsDeleted=1,ModifyDate=GetDate(),ModifyID=@ModifyID where ID=@id";
                    db.ExecuteNoneQuery(sql, prams);
                }
                catch(Exception ex)
                {
                   db.Rollback();
                   base.ReturnResultJson("false", "删除失败");
                }
                db.Commit();
                
            }
            base.ReturnResultJson("true", "删除成功");
        }
        #endregion

        /// <summary>
        /// 获取代扣标准
        /// </summary>
		private void getWithHoldStandard() 
        {
            string result = string.Empty;
            DataTable dt = new DataTable();
            //String key = Request["key"];
            String key = String.IsNullOrEmpty(Request["key"]) ? Request["query"] : Request["key"];

            Hashtable parms = new Hashtable();
            String sql = @"select top 50 ID,DisplayText as CombineWord from iWithHoldStandard where IsDeleted=0 ";
            if (!String.IsNullOrEmpty(key)) 
            {
                sql += @" and (ID like '%" + key + @"%' or ShortText like '%" + key + @"%' or DisplayText like '%" + key + @"%' )";
                parms.Add("@key", key);
            }

            dt = this.GetAll(sql, parms); 
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(result);
            Response.End();
            return;
        }

        #region 新增代扣标准

        private void addSocialSWithhold()
        {
            object result = null;
			    int year = string.IsNullOrEmpty(Request["myYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["myYear"]);
                int month = string.IsNullOrEmpty(Request["myMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["myMonth"]);
                string Code = Request["Code"];
                string Name = Request["Name"];
				string Price = Request["Price"];

                if (isExistSocialSWithhold(Code))
                {
                    Response.Write(string.Format(ResultJson, "false", "该编号已经存在"));
                    return;
                }
				
                try
                {
                    using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                    {
                        try
                        {
                            Hashtable prams = new Hashtable();
							int DeptId = CurrentUser.DeptID;
                            prams.Add("Code", Code);
                            prams.Add("Title", Name);
                            prams.Add("Balance", Price);
							prams.Add("DeptID", DeptId);
							prams.Add("IsDeleted", 0);
                            prams.Add("DataYear", year);
                            prams.Add("DataMonth", month);
                            prams.Add("CreateDate", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            prams.Add("CreateID", base.CurrentSession.UserID);
                            prams.Add("ModifyDate", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            prams.Add("ModifyID", base.CurrentSession.UserID);
                            string sql = "insert into iSocialSWithhold(Code,Title,Balance,DeptID,IsDeleted,DataYear,DataMonth,CreateDate,CreateID,ModifyDate,ModifyID)";
                            sql += " values(@Code,@Title,@Balance,@DeptID,@IsDeleted,@DataYear,@DataMonth,@CreateDate,@CreateID,@ModifyDate,@ModifyID)";
                            result = db.ExecuteNoneQuery(sql, prams);
                            db.Commit();
                        }
                        catch (Exception ex1)
                        {
                            db.Rollback();
                        }
                    }

                }
                catch (Exception ex)
                {
                    base.ReturnResultJson("false", ex.Message);
                }

            string msg = "{success:true}";
            base.ReturnResultJson("true", "添加");
        }
        #endregion

        #region 查询代扣标准
        public void getSocialSWithhold()
        {
		   string  sql = @"SELECT [ID],[Code],[Title],[Balance] as [Price],[DeptID],[IsDeleted],[DataYear],[DataMonth] FROM iSocialSWithhold WHERE IsDeleted=0 ";
           int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
           int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
           int deptID = CurrentUser.DeptID;

           Hashtable parms = new Hashtable();
          // string wheresql = " and ed.DataYear=@year and  ed.DataMonth=@month and ed.DeptID=@deptID ";
           string wheresql = " and DataYear=@year and DataMonth=@month and DeptID=@deptID";
           parms.Add("year", year);
           parms.Add("month", month);
           parms.Add("DeptID", deptID);
         //  parms.Add("deDeptIDptID", deptID);
           sql += wheresql + @" order by ID desc";
           DataTable dtResult = null;
           using (DbCommon.DbUtil db = new DbCommon.DbUtil())
           {
               dtResult = db.ExecuteQuery(sql, parms);
           }
           if (dtResult != null)
           {
               string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);

               Response.Write(html);
               Response.End();
           }
           else
           {
               base.ReturnResultJson("false", "无数据!");
               return;
           }
        }
        #endregion
		
		#region 查询代扣标准
        public void getSearchSocialSWithhold()
        {
		   //['ID','EmpId','Name','sCode','Withhold'],
		   string  sql = @"select ss.ID,ss.EmployeeID as EmpId,emp.idno as sCode,emp.Code,emp.Title as Name,ss.DeptID,dept.Title as DeptTitle,ss.WithHoldStandardID,ws.Title as Withhold from bSendSocialSWithhold ss ";
		   sql += @" inner join iEmployee emp on ss.EmployeeID=emp.ID left join iDept dept on ss.DeptID=dept.ID ";
           sql += @" left join iSocialSWithhold ws on ss.WithHoldStandardID=ws.ID where 1=1 and ss.IsDeleted=0 ";
           int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
           int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
           int deptID =string.IsNullOrEmpty(Request["DeptID"])?0:Convert.ToInt16(Request["DeptID"]);
           int EmpID = string.IsNullOrEmpty(Request["EmpID"]) ? 0 : Convert.ToInt16(Request["EmpID"]);
           Hashtable parms = new Hashtable();
          // string wheresql = " and ed.DataYear=@year and  ed.DataMonth=@month and ed.DeptID=@deptID ";
           string wheresql = " and ss.DataYear=@year and  ss.DataMonth=@month ";
           parms.Add("year", year);
           parms.Add("month", month);
           if (deptID > 0)
           {
               parms.Add("deptID", deptID);
               sql += " and ss.DeptID=@deptID";
           }
           if (EmpID > 0)
           {
               parms.Add("EmpID", EmpID);
               sql += " and ss.EmployeeID=@EmpID";
           }
           
           sql += wheresql + @" order by ss.ID desc";
           DataTable dtResult = null;
           using (DbCommon.DbUtil db = new DbCommon.DbUtil())
           {
               dtResult = db.ExecuteQuery(sql, parms);
           }
           if (dtResult != null)
           {
               string html = Newtonsoft.Json.JsonConvert.SerializeObject(dtResult);

               Response.Write(html);
               Response.End();
           }
           else
           {
               base.ReturnResultJson("false", "无数据!");
               return;
           } 
        }
        #endregion

        #region 删除代扣标准
        /// <summary>
        /// 删除代扣标准
        /// </summary>
        private void delSocialSWithhold()
        {
            int id = string.IsNullOrEmpty(Request["id"]) ? 0 : Convert.ToInt32(Request["id"]);
            Hashtable prams = new Hashtable();
            prams.Add("id", id);
            prams.Add("ModifyID", base.CurrentSession.UserID);
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                try
                {
                    string sql = "update iSocialSWithhold set IsDeleted=1,ModifyDate=GetDate(),ModifyID=@ModifyID where ID=@id";
                    db.ExecuteNoneQuery(sql, prams);
                }
                catch (Exception ex)
                {
                    db.Rollback();
                    base.ReturnResultJson("false", "删除失败");
                }
                db.Commit();

            }
            base.ReturnResultJson("true", "删除成功");
        }
        #endregion

        public DataTable GetAll(string sql)
        {
            using (DbCommon.DbUtil dbl = new DbCommon.DbUtil())
            {
                return dbl.ExecuteQuery(sql);
            }
        }
		
        public DataTable GetAll(string sql, Hashtable prams)
        {
            using (DbCommon.DbUtil dbl = new DbCommon.DbUtil())
            {
                return dbl.ExecuteQuery(sql, prams);
            }
        }

        public void export2Excel() 
        {

            int year = string.IsNullOrEmpty(Request["Year"]) ? DateTime.Now.Year : Convert.ToInt16(Request["Year"]);
            int month = string.IsNullOrEmpty(Request["Month"]) ? DateTime.Now.Month : Convert.ToInt16(Request["Month"]);
            int deptID = string.IsNullOrEmpty(Request["DeptID"]) ? CurrentUser.DeptID : Convert.ToInt16(Request["DeptID"]);
            string strTemplate= Common.ReadFile(Page.Server.MapPath(this.strReportTemplatePath), Encoding.UTF8);
            string strTemplateItem = Common.ReadFile(Page.Server.MapPath(this.strReportItemTemplatePath), Encoding.UTF8);
            
            Hashtable parms = new Hashtable();
            string wheresql = " DataYear=@year and  DataMonth=@month and DeptID=@deptID ";
            parms.Add("year", year);
            parms.Add("month", month);
            parms.Add("deptID", deptID);
            string DeptTitle = objLogistics.ExecScalar("select Title from iDept where ID=@deptID", parms) + "";
            string fileName = DeptTitle + "_" + year +"年"+ month + "月.xls";
            string todayFileName = DeptTitle + "_" + DateTime.Now.Year +"年"+ DateTime.Now.Month + "月.xls";
            string filePath = System.Configuration.ConfigurationSettings.AppSettings["ExportFiles"];
            Common.ToCreateFile(filePath);
            filePath = filePath + fileName;
            if (fileName.Equals(todayFileName) ||  !File.Exists(filePath))   
            {
                objLogistics.GenerateCurrentPeriodData(CurrentSession.DeptID + "");
                DataTable dt = objLogistics.GetReportData(CurrentUser, wheresql, parms);
                String strContent = "";
                if (dt != null && dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        DataRow dr = dt.Rows[i];
                        String strItem = strTemplateItem;
                        String backColor = i % 2 == 0 ? "#FFFFFF" : "#aaaaaa";
                        for (int j = 0; j < dt.Columns.Count; j++)
                        {
                            String field = dt.Columns[j].ColumnName;
                            strItem = strItem.Replace("{" + field + "}", dr[field].ToString());
                        }
                        strItem = strItem.Replace("{color}", backColor);
                        strContent += strItem;
                    }
                    strContent = strTemplate.Replace("{content}", strContent);
                    //string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

                    //Response.Write(strContent);
                    //Response.End();
                    Common.WriteFile(filePath, strContent);
                }
                
            }

            if (File.Exists(filePath)) 
            {
                FileStream fs = new FileStream(filePath, FileMode.Open);
                byte[] bytes = new byte[(int)fs.Length];
                fs.Read(bytes, 0, bytes.Length);
                fs.Close();
                System.Web.HttpContext.Current.Response.ContentType = "application/octet-stream";

                //通知浏览器下载文件而不是打开 
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName);
                System.Web.HttpContext.Current.Response.BinaryWrite(bytes);
                System.Web.HttpContext.Current.Response.Flush();
                System.Web.HttpContext.Current.Response.End();
            }
           

            
        }
    }
}
