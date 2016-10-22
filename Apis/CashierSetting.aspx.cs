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
    public partial class CashierSetting  : System.Web.UI.Page
    {
        private BllApi.CashierSetting basebll = new BllApi.CashierSetting();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string jsons = string.Empty;
                switch (Request["actionName"])
                {
                    case "delEmployeeToDept":
                        jsons = delEmployeeToDept();
                        break;
                    case "getdate":
                        jsons = getdate();
                        break;
                    case "getPeriod":
                        jsons = getPeriod();
                        break;
                    case "getDept":
                        jsons = getDept();
                        break;
                    case "getEmployee":
                        jsons = getEmployee();
                        break;
                    case "addCashierSetting":
                        jsons = addCashierSetting();
                        break;
                        
                    default:
                        break;
                }

                Response.Write(jsons);
                Response.End();


                    //string json = (string)this.inokeMethod(this.ActionName);
                    //if (!String.IsNullOrEmpty(json))
                    //{
                    //    Response.Write(json);
                    //    Response.End();
                    //}

            }
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        public string delEmployeeToDept()
        {
            int ID = Convert.ToInt16(Request["id"]);
            string sql = "update iCashierSetting set IsDelete=1 where ID='" + ID + "'";
            basebll.ExecuteNonQuery(sql);
           return getdate();
        }

        public string addCashierSetting()
        {

            string Result = string.Empty;

            int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
            int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
            string EmpId = string.IsNullOrEmpty(Request["EmpId"]) ? null : Request["EmpId"];
            string DeptId = string.IsNullOrEmpty(Request["DeptId"]) ? null : Request["DeptId"];
            string ID = Request["sid"];
            string Reamrk = Request["Reamrk"];

            Hashtable Verity = new Hashtable();
            Verity.Add("DeptID", DeptId);
            Verity.Add("EmployeeID", EmpId);
            Verity.Add("year", year);
            Verity.Add("month", month);
            string Viertysql = "select ID from iCashierSetting where DeptID=@DeptID  and EmployeeID=@EmployeeID and year=@year and month=@month";
            DataTable Viritydt = basebll.GetList(Viertysql, Verity);

            int IsHave = Viritydt.Rows.Count;
            if (IsHave==0)
            {
                Hashtable prams = new Hashtable();
                string AreaDepsql = "select AreaID from iDept where ID='" + DeptId + "'";
                DataTable dt = basebll.GetList(AreaDepsql, prams);
                string AreaID = string.Empty;
                if (dt.Rows.Count != 0)
                {
                     AreaID = dt.Rows[0][0].ToString();
                }
                else
                {
                    Result = "添加失败!此门店没有相应的区域!";
                    return Result;
                }

                string Empsql = "select Code from iEmployee  where ID='" + EmpId + "'";
                DataTable Empdt = basebll.GetList(Empsql, prams);
                string EmpCode = string.Empty;
                if (Empdt.Rows.Count != 0)
                {
                     EmpCode = Empdt.Rows[0][0].ToString();
                }
                else
                {
                    Result = "添加失败!此人员没有相应的编码!";
                    return Result;
                }


                prams.Add("AreaID", AreaID);
                prams.Add("DeptID", int.Parse(DeptId));
                prams.Add("EmployeeID", int.Parse(EmpId));
                prams.Add("EmployeeCode", EmpCode);
                prams.Add("CreateDate", DateTime.Now);
                prams.Add("Remark", Reamrk);
                prams.Add("Period", Convert.ToDateTime(year + "-" + month + "-" + "01").ToShortDateString());
                prams.Add("Year", year);
                prams.Add("Month", month);
                string InserSql = @"INSERT INTO [iCashierSetting]
           ([AreaID]
           ,[DeptID]
           ,[EmployeeID]
           ,[EmployeeCode]
           ,[CreateID]
           ,[CreateDate]
           ,[ModifyID]
           ,[ModifyDate]
           ,[IsDelete]
           ,[Remark]
           ,[Period]
           ,[Year]
           ,[Month])
     VALUES
           (@AreaID,@DeptID,@EmployeeID,@EmployeeCode,null,@CreateDate,null,null,0,@Remark,@Period,@Year,@Month)";

                int ok = basebll.ExecuteNonQuery(InserSql, prams);
            }
            else
            {
                Result = "已存在此人员和此门店信息,添加失败!";
                return Result;
            }
            return Result;
        }



        /// <summary>
        /// 获取当前的数据
        /// </summary>
        /// <returns></returns>
        public string getdate()
        {
            string result = string.Empty;
            try
            {
                int year = string.IsNullOrEmpty(Request["queryYear"]) ? DateTime.Now.Year : Convert.ToInt16(Request["queryYear"]);
                int month = string.IsNullOrEmpty(Request["queryMonth"]) ? DateTime.Now.Month : Convert.ToInt16(Request["queryMonth"]);
                Hashtable prams = new Hashtable();
                prams.Add("year", year);
                prams.Add("Month", month);
                //验证是否存在当月数据，不存在自动添加上月数据
                string VeritySql = "select ID from iCashierSetting where IsDelete!=1 and Year=@year and Month=@Month";
                DataTable Veritydt = basebll.GetList(VeritySql, prams);

                if (Veritydt.Rows.Count == 0)
                {
                    string InsetSql = @" insert  iCashierSetting SELECT 
                 [AreaID]
                 ,[DeptID]
                 ,[EmployeeID]
                ,[EmployeeCode]
                 ,[CreateID]
                 ,[CreateDate]
                 ,[ModifyID]
                 ,[ModifyDate]
                 ,[IsDelete]
                 ,[Remark]
                 ,GETDATE()
                  ,Year ( getdate ())
      , month ( getdate())
                  FROM [iCashierSetting]  where datediff(m,Period,getdate())=1";
                 int ok = basebll.ExecuteNonQuery(InsetSql);
                }
            string sql = @"select a.ID ID,c.Title 区域,b.Title 大区 ,b.Title 门店 ,a.EmployeeCode 片区主管工号 ,d.Title 片区主管,a.Remark 备注 from iCashierSetting as a 
join iDept as b on a.DeptID=b.ID 
join iArea as c on a.AreaID=c.ID 
join iEmployee as d on a.EmployeeID=d.ID where IsDelete!=1 and a.Year=@year and a.Month=@Month";
            DataTable dt = basebll.GetList(sql, prams);

            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            result = "{totalCount:" + 9999 + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;

        }



        /// <summary>
        /// 获取年月份数据
        /// </summary>
        /// <returns></returns>
        public string getPeriod()
        {
            string result = string.Empty;
            try
            {
                DataTable tb = new DataTable();
                tb.Columns.Add("Value");
                tb.Columns.Add("Title");

                Hashtable prams = new Hashtable();

                string sql = @"select * from (
select left(CONVERT(varchar(100), GETDATE(), 23 ),7) as Value,CAST(YEAR(GETDATE()) as nvarchar(4))+'年'+CAST(Month(GETDATE() ) as nvarchar(2))+'月' as Title  from iCashierSetting
 union 
select distinct left(CONVERT(varchar(100), Period, 23 ),7) as Value,CAST(Year as nvarchar(4))+'年'+CAST(Month as nvarchar(2))+'月' as Title  from iCashierSetting
) a order by a.Value desc ";
                DataTable dt = new DataTable();

                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    dt = db.ExecuteQuery(sql);
                }
                foreach (DataRow rw in dt.Rows)
                {
                    DataRow dr = tb.NewRow();
                    dr["Title"] = rw["Title"];
                    dr["Value"] = rw["Value"];
                    tb.Rows.Add(dr);
                }
                result = Newtonsoft.Json.JsonConvert.SerializeObject(tb);
            }
            catch (Exception ex)
            {

            }
            return result;
        }

        /// <summary>
        /// 获取门店索引信息
        /// </summary>
        /// <returns></returns>
        public String getDept()
        {
            string result = string.Empty;
            try
            {
                DataTable dt = new DataTable();
                //String key = Request["key"];
                String key = String.IsNullOrEmpty(Request["key"]) ? Request["query"] : Request["key"];
                String state = Request["state"];
                String deptType = Request["type"];

                Hashtable parms = new Hashtable();
                String sql = @"select top 50 ID,Code+' '+Title+' '+KeyCode as CombineWord,Code from iDept where IsDeleted=0 ";
                if (!String.IsNullOrEmpty(key))
                {
                    sql += @" and (Code like '%" + key + @"%' or Title like '%" + key + @"%' or KeyCode like '%" + key + @"%' )";
                    parms.Add("@key", key);
                }

                if (!String.IsNullOrEmpty(deptType))
                {
                    sql += @" and DeptTypeId in (@type) ";
                    parms.Add("@type", deptType);
                }


                if (!String.IsNullOrEmpty(state) && deptType != "3")
                {
                    sql += @" and DeptStatus=@state ";
                    parms.Add("@state", state);
                }



                dt = this.GetAll(sql, parms);

                //result = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";   
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }
            return result;
        }
        /// <summary>
        /// 获取人员索引信息
        /// </summary>
        /// <returns></returns>
        public String getEmployee()
        {
            string result = string.Empty;
            try
            {
                int minCharLength = 0;
                DataTable dt = new DataTable();

                String key = String.IsNullOrEmpty(Request["key"]) ? Request["query"] : Request["key"];
                String state = Request["state"];
                String deptId = Request["deptid"];
                //String filerByLoginDept = Request["filerByLoginDept"];
                String realState = "";
                String matchAll = "false";



                if (!String.IsNullOrEmpty(Request["match_all"]))
                {
                    matchAll = Request["match_all"];
                }
                if (state == "leave")
                {
                    realState = "'离职'";
                }
                else if (state == "active")
                {
                    realState = "'在岗','待报到'";
                }
                if (!String.IsNullOrEmpty(key))
                {
                    key = key.Trim();
                    if (key.Split(' ').Length > 1)
                    {
                        key = key.Split(' ')[0];
                    }
                }
                else
                {
                    return "";
                }

                if (!String.IsNullOrEmpty(Request["char_length"]))
                {
                    minCharLength = Int16.Parse(Request["char_length"]);
                    if (key.Length < minCharLength)
                    {
                        return "";
                    }
                }


                if (!String.IsNullOrEmpty(Request["match_all"]))
                {
                    matchAll = Request["match_all"];
                }

                Hashtable parms = new Hashtable();
                String sql = @"select top 50 ID,Code+' '+Title as CombineWord,Code,Title from iEmployee where IsDeleted=0 ";
                if (!String.IsNullOrEmpty(key))
                {
                    if (matchAll == "true")
                    {
                        sql += @" and (Code = '" + key + @"' or Title = '" + key + @"'  )";
                    }
                    else
                    {
                        sql += @" and (Code like '%" + key + @"%' or Title like '%" + key + @"%'  )";
                    }
                    //parms.Add("@key", key);
                }

                if (!String.IsNullOrEmpty(state))
                {
                    sql += @" and State in (" + realState + ") ";

                }

                if (!String.IsNullOrEmpty(deptId))
                {
                    sql += @" and DeptID =@deptId";
                    parms.Add("@deptId", deptId);
                }
                //else if (!String.IsNullOrEmpty(filerByLoginDept))
                //{
                //    sql += @" and DeptID =@deptId";
                //    parms.Add("@deptId", CurrentUser.DeptID);
                //}

                if (!String.IsNullOrEmpty(key))
                {
                    using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                    {
                        dt = db.ExecuteQuery(sql);
                    }
                }


                //if (key.Length >= minCharLength) 
                //{
                //    dt = this.GetAll(sql, parms);
                //}


                //result = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }
            return result;
        }
        public DataTable GetAll(string sql, Hashtable prams)
        {
            using (DbCommon.DbUtil dbl = new DbCommon.DbUtil())
            {
                return dbl.ExecuteQuery(sql, prams);
            }
        }



    }
}
