using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;
using System.Configuration;  

namespace BeautyPointWeb.Apis
{
    public partial class UploadMonthReport : AuthBasePage
    {
        private BllApi.BMonthReportApi upl = new BllApi.BMonthReportApi();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string result = string.Empty;
                switch (Request["actionName"])
                {
                    case "uploadMonthReports":
                        result = UploadFile();
                        break;
                    default:
                        result = UploadFile();
                        break;
                }
                Response.Write(result);
                Response.End();
            }
        }

        //protected void Page_Error(object sender, EventArgs e)
        //{
        //    HttpContext ctx = HttpContext.Current;
        //    string message = "服务器错误!" + Server.GetLastError().ToString();
        //    ctx.Response.Write("<script type='text/javascript'>alert('" + message + "')</script>");
        //    ctx.Server.ClearError();
        //    Response.Redirect("../BasePages/index.htm");
        //    Response.End();
        //    return;
        //}

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        private string UploadFile()
        {
            //IsScreenShot();
            string message = "";
            string reportType = Request["reportTypeCmb"];
            string result = string.Empty;
            if (Request.Files.Count > 0)
            {
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    try
                    {
                        HttpPostedFile file = Request.Files[i];
                        int DeptId = CurrentUser.DeptID;
                        string filename = file.FileName.ToString();
                        #region
                        if (file != null)
                        {
                            string maxSize = ConfigurationManager.AppSettings["MonthReportMaxSize"];
                            if (file.ContentLength > (Convert.ToDouble(maxSize)*1024))
                            {
                                message += filename + " 文件大小大于指定大小，上传失败！";
                            }
                            else
                            {
                                string SavePath = Server.MapPath("~/MonthReport/");
                                string houZhui = System.IO.Path.GetExtension(filename);
                                string saveFileName = System.Guid.NewGuid() + houZhui;
                                string fileSaveDir = SavePath + saveFileName;
                                ToCreateFile(SavePath);//判断文件夹是否存在，如果不存在则创建文件夹

                                if (filename.IndexOf(':') > 0)//用于判断不同的浏览器传过来的上传文件的路径
                                {
                                    filename = filename.Substring(filename.LastIndexOf('\\') + 1);
                                }
                                if (IsOutOfFileType(filename))
                                {
                                    string sql = string.Format(@"insert into bMonthReport(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,
                                                                                DeptID,BMonth,FileName,RealFileName,FileDir,FileSize,FileType,ReportType) 
                                                                                values(@CreateID,getdate(),@ModifyID,getdate(),@IsDeleted,
                                                                                @DeptID,MONTH(DATEADD(MONTH,-1,GETDATE())),@FileName,@RealFileName,@FileDir,@FileSize,@FileType,@ReportType)");


                                    Hashtable parms = new Hashtable();
                                    parms.Add("@CreateID", 0);
                                    parms.Add("@ModifyID", 0);
                                    parms.Add("@IsDeleted", 0);
                                    parms.Add("@DeptID", DeptId);
                                    parms.Add("@FileName", saveFileName);
                                    parms.Add("@RealFileName", filename);
                                    parms.Add("@FileDir", "/MonthReport/");
                                    parms.Add("@FileSize", file.ContentLength);
                                    parms.Add("@FileType", houZhui);
                                    parms.Add("@ReportType", reportType);
                                    #endregion
                                    int index = upl.ExecuteNonQuery(sql, parms);
                                    if (index > 0)
                                    {
                                        file.SaveAs(fileSaveDir);
                                    }
                                }
                                else
                                {
                                    message += filename + " 类型错误，不能进行上传！";
                                }
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        message += Request.Files[i].FileName.ToString() + ex.Message.Replace("'","\"").ToString();
                    }
                }
                if (message == "") { result = "{success:true,msg:\"上传成功！\"}"; }
                else { result = "{success:true,msg:\"" + message + "\"}"; }
            }
            return result;
        }

        /// <summary>
        /// 判断文件夹是否存在，如果不存在则创建文件夹
        /// </summary>
        /// <param name="SavePath"></param>
        private void ToCreateFile(string SavePath)
        {
            if (!Directory.Exists(SavePath))
            {
                Directory.CreateDirectory(SavePath);
            }
        }

        private bool IsOutOfFileType(string fileName)
        {
            bool flag = false;
            string fileType = ConfigurationManager.AppSettings["FileType"];
            string[] typeList = fileType.Split(';');
            foreach (string oneType in typeList)
            {
                if (oneType == System.IO.Path.GetExtension(fileName))
                    flag = true;
            }
            return flag;
        }
    }
}