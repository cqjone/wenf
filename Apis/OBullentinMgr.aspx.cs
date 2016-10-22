using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.IO;

namespace BeautyPointWeb.Apis
{
    public partial class OBullentinMgr  : AuthBasePage
    {
        private BllApi.OBullentinApis aba = new BllApi.OBullentinApis();
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            {
                case "ShowOBullentin":
                    ShowOBullentin();
                    break;
                case "IsExistFile":
                    IsExistFile();
                    break;
                case "DownFile":
                    DownFile();
                    break;
            }
        }
        //通过查询条件显示报表
        private void ShowOBullentin()
        {
            string result = string.Empty;
            try
            {
                string DeptID = (Request["DeptID"].Replace("'", "''"));
                string Month = (Request["Month"].Replace("'", "''"));
                string ReportType = (Request["ReportType"].Replace("'", "''"));
                
                string sql = string.Format(@"select a.Id as Id,a.FileName as FileName,a.BMonth as BMonth,b.Title as DeptTitle,a.FileSize as FileSize, 
                                             a.RealFileName as RealFileName,a.FileDir as FileDir,CONVERT(varchar(100), a.CreateDate, 120) as CreateDate from bMonthReport a,iDept b
                                             where a.IsDeleted=0 and a.DeptID = b.ID ");
                string sqlCount = string.Format(@"select count(1) 
                                             from bMonthReport a,iDept b
                                             where a.IsDeleted=0 and a.DeptID = b.ID ");
                if (ReportType != "-1")
                {
                    sql += string.Format(@" and a.ReportType = {0}", ReportType);
                    sqlCount += string.Format(@" and a.ReportType = {0}", ReportType);
                }
                if (DeptID != "")
                {
                    sql += string.Format(@" and a.DeptID = {0}",DeptID);
                    sqlCount += string.Format(@" and a.DeptID = {0}", DeptID);
                }
                if (Month != "")
                {
                    sql += string.Format(@" and a.BMonth = {0}", Month);
                    sqlCount += string.Format(@" and a.BMonth = {0}", Month);
                }
                DataTable dt = aba.GetBySql(sql);
                DataTable dtCount = aba.GetCountBySql(sqlCount);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                Response.Write("{results:" + result + ",totalCount:"+dtCount.Rows[0][0]+"}");
                Response.End();
            }
           catch (Exception ex)
            {
            //    throw new ApplicationException(ex.Message);
            }
            
        }
        ///// <summary>
        ///// 判断是否存在
        ///// </summary>
        public void IsExistFile()
        {
            string filePath = Server.MapPath("~/MonthReport/") + Request.QueryString["fileName"];
            string a = Request.QueryString["fileName"];
            if (filePath == "")
            {
                Response.Write(string.Format("{{\"success\":\"false\",\"msg\":\"文件不存在\"}}"));
                Response.End();
            }
            if (aba.IsExistFile(filePath))
            {
                Response.Write(string.Format("{{\"success\":\"true\",\"msg\":\"存在文件\"}}"));
                Response.End();
            }
            else
            {
                Response.Write(string.Format("{{\"success\":\"false\",\"msg\":\"文件不存在\"}}"));
                Response.End();
            }
        }
        /// <summary>
        /// 下载文件
        /// </summary>
        public void DownFile()
        {
            string UserAgent = Request.ServerVariables["http_user_agent"].ToLower();
            string fileName = Request.QueryString["fileName"];
            if (UserAgent.IndexOf("firefox") == -1)
            {
                fileName = HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8);
            }
            else 
            {
                fileName = "\"" + fileName + "\"";
            }
            string filePath = Server.MapPath("~/MonthReport/")+Request.QueryString["filePath"];
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