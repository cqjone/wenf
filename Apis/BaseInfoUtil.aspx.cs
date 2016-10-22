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
using System.Text;

namespace BeautyPointWeb.Apis
{
    public partial class BaseInfoUtil : AuthBasePage
    {
        private BllApi.BaseApi basebll = new BllApi.BaseApi();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string json = (string)this.inokeMethod(this.ActionName);
                if (!String.IsNullOrEmpty(json)) 
                {
                    Response.Write(json);
                    Response.End();
                }
                
            }
        }

        public  String getDept() 
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


                if (!String.IsNullOrEmpty(state) && deptType!="3")
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
                Response.Write(ex.Message+"\r\n"+ex.StackTrace);
            }
            return result;
        }


        public String getPeriod() 
        {
            string result = string.Empty;
            
            try
            {
                DataTable tb = new DataTable();
                tb.Columns.Add("Title");
                tb.Columns.Add("Value");
                int day = DateTime.Now.Day;
                DataRow dr = tb.NewRow();
                dr["Title"] = DateTime.Now.ToString("yyyy年MM月");
                dr["Value"] = DateTime.Now.ToString("yyyy-MM");
                tb.Rows.Add(dr);
                if (day <= 4) 
                {
                    DataRow dr2 = tb.NewRow();
                    dr2["Title"] = DateTime.Now.AddMonths(-1).ToString("yyyy年MM月");
                    dr2["Value"] = DateTime.Now.AddMonths(-1).ToString("yyyy-MM");
                    tb.Rows.Add(dr2);
                }
                result = Newtonsoft.Json.JsonConvert.SerializeObject(tb);   
            }
            catch (Exception ex) 
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }
            return result;
        }
        /// <summary>
        /// 得到日期,默认为当前日期，并获取数据表中已有日期
        /// </summary>
        /// <returns></returns>
        public String getExistPeriod()
        {
            string tablename=string.IsNullOrEmpty(Request["tableName"])?"iEmployeeToDept":Request["tablename"];
            string result = string.Empty;

            try
            {
                string sql = "select distinct (convert(char(4),CreateDate,120)+'年'+ RIGHT('0'+ltrim(MONTH(CreateDate)),2)+'月') as Title,(convert(char(7),CreateDate,120)) as Value  from " + tablename;
                DataTable tb = new DataTable();
                DataTable tbresult = new DataTable();
                tbresult.Columns.Add("Title");
                tbresult.Columns.Add("Value");
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    tb = db.ExecuteQuery(sql);
                }

                string todayValue=DateTime.Now.ToString("yyyy-MM");
                string todayTitle=DateTime.Now.ToString("yyyy年MM月");
                string lastdayValue=DateTime.Now.AddMonths(-1).ToString("yyyy-MM");
                string lastdayTitle=DateTime.Now.AddMonths(-1).ToString("yyyy年MM月");
                DataRow dr1 = tbresult.NewRow();
                dr1["Title"]=todayTitle;
                dr1["Value"]=todayValue;
                tbresult.Rows.Add(dr1);
                DataRow dr2 = tbresult.NewRow();
                dr2["Title"]=lastdayTitle;
                dr2["Value"]=lastdayValue;
                tbresult.Rows.Add(dr2);
                if(tb!=null && tb.Rows.Count>0)
                {
                    DataRow[] drs=tb.Select();
                    foreach(DataRow drtmp in drs )
                    {
                        DataRow dr=tbresult.NewRow();
                        if(!drtmp["Value"].Equals(todayValue) && !drtmp["Value"].Equals(lastdayValue))
                        {
                            dr["Title"]=drtmp["Title"];
                            dr["Value"]=drtmp["Value"];
                            tbresult.Rows.Add(dr);
                        } 
                    }
                }
                result = Newtonsoft.Json.JsonConvert.SerializeObject(tbresult);
            }
            catch (Exception ex)
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }
            return result;
        }

        public String getDuty()
        {
            string result = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                String dutyTypeID = Request["DutyTypeID"];
                String key = Request["key"];

                string sql = "select ID,Title from iDuty where IsDeleted=0 ";
                

                if (!String.IsNullOrEmpty(dutyTypeID))
                {
                    sql += " and DutyTypeID=" + dutyTypeID;
                }

                if (!String.IsNullOrEmpty(key))
                {
                    sql += " and Title like '%"+key+"%'";
                }

                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    dt = db.ExecuteQuery(sql);

                }
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

            }
            catch (Exception ex)
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }
            return result;
        }


        //public String getDuty()
        //{
        //    string result = string.Empty;
        //    DataTable dt = new DataTable();
        //    try
        //    {
        //        String dutyTypeID = Request["DutyTypeID"];
        //        string sql = "select ID,Title from iDuty where IsDeleted=0 ";
        //        if (!String.IsNullOrEmpty(dutyTypeID)) 
        //        {
        //            sql += " and DutyTypeID=" + dutyTypeID;
        //        } 
        //        using (DbCommon.DbUtil db = new DbCommon.DbUtil())
        //        {
        //            dt = db.ExecuteQuery(sql);

        //        }
        //        result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);  
               
        //    }
        //    catch (Exception ex)
        //    {
        //        Response.Write(ex.Message + "\r\n" + ex.StackTrace);
        //    }
        //    return result;
        //}

        public String getDutyType()
        {
            string result = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                string sql = "select ID,Title from iDutyType where IsDeleted=0";
                using (DbCommon.DbUtil db = new DbCommon.DbUtil())
                {
                    dt = db.ExecuteQuery(sql);

                }
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

            }
            catch (Exception ex)
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }
            return result;
        }


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
                String filerByLoginDept = Request["filerByLoginDept"]; 
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
                    else {
                        sql += @" and (Code like '%" + key + @"%' or Title like '%" + key + @"%'  )";
                    }
                    //parms.Add("@key", key);
                }

                if (!String.IsNullOrEmpty(state) )
                {
                    sql += @" and State in (" + realState + ") ";
                 
                }

                if (!String.IsNullOrEmpty(deptId))
                {
                    sql += @" and DeptID =@deptId";
                    parms.Add("@deptId", deptId);
                }
                else if (!String.IsNullOrEmpty(filerByLoginDept)){
                    sql += @" and DeptID =@deptId";
                    parms.Add("@deptId", CurrentUser.DeptID);
                }

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


        public String getEmployeeWithCheckin()
        {
            string result = string.Empty;
            try
            {
                DataTable dt = new DataTable();
                String key = String.IsNullOrEmpty(Request["key"]) ? Request["query"] : Request["key"];
                String state = Request["state"];
                String deptId = CurrentSession.DeptID+"";
                String filerByLoginDept = Request["filerByLoginDept"];
                
                String matchAll = "false";

                if (!String.IsNullOrEmpty(Request["match_all"]))
                {
                    matchAll = Request["match_all"];
                }


                Hashtable parms = new Hashtable();
                String sql = @"select top 50 a.ID,Code+' '+Title as CombineWord,Code,Title from iEmployee a
                            where a.IsDeleted=0 ";
                
                
                if (!String.IsNullOrEmpty(key))
                {
                    //sql += @" and (Code like '%" + key + @"%' or Title like '%" + key + @"%'  )";

                    //parms.Add("@key", key);
                    key = key.Trim();
                    if (key.Split(' ').Length > 1)
                    {
                        key = key.Split(' ')[0];
                    }


                    if (matchAll == "true")
                    {
                        sql += @" and (Code = '" + key + @"' or Title = '" + key + @"'  )";
                    }
                    else
                    {
                        sql += @" and (Code like '%" + key + @"%' or Title like '%" + key + @"%'  )";
                    }

                }
                sql += @"and exists(
							select ID from bRegist b where  a.ID=b.EmployeeID and b.DeptID=@DeptID and datediff(d,b.checkintime,getdate())<=61  
                        )";

                parms.Add("@DeptID", deptId);
               /** if (!String.IsNullOrEmpty(deptId))
                {
                    sql += @" and a.DeptID =@deptId";
                    parms.Add("@deptId", deptId);
                }
                else if (!String.IsNullOrEmpty(filerByLoginDept))
                {
                    sql += @" and DeptID =@deptId";
                    parms.Add("@deptId", CurrentUser.DeptID);
                }**/


                if (!String.IsNullOrEmpty(key)) 
                {
                    dt = this.GetAll(sql, parms);
                }

                

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
        /// 获取社保代扣标准
        /// </summary>
        /// <returns></returns>
        public String getSocialWithHold()
        {
            string result = string.Empty;
            try
            {
                DataTable dt = new DataTable();
                //String key = Request["key"];
                String key = String.IsNullOrEmpty(Request["key"]) ? Request["query"] : Request["key"];
                int year = Convert.ToInt16(Request["year"]);
                int month =Convert.ToInt16(Request["month"]);
                //int DeptID = CurrentUser.DeptID;
                Hashtable parms = new Hashtable();
                parms.Add("@DataYear", year);
                parms.Add("@DataMonth", month);
               // parms.Add("@DeptID", DeptID);
                String sql = @"select top 50 ID,Code+'- '+Title+' '+cast(Balance as varchar(30)) as CombineWord,Code from iSocialSWithhold where DataYear=@DataYear and DataMonth=@DataMonth and IsDeleted=0 ";
                if (!String.IsNullOrEmpty(key))
                {
                    sql += @" and (Code like '%" + key + @"%' or Title like '%" + key + @"%')";
                    parms.Add("@key", key);
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



    }
}
