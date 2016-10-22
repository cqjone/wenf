using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;

namespace BeautyPointWeb.Apis
{
    public partial class Uploadfile : System.Web.UI.Page
    {
        private BllApi.Uploadfile upl = new BllApi.Uploadfile();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string result = string.Empty;
                switch (Request["actionName"])
                {
                    case "upload":
                        result = UploadFile();
                        break;
                    case "isscreenshot":
                        result = IsScreenShot();
                        break;
                    default:
                        result = UploadFile();
                        break;
                }
                Response.Write(result);
                Response.End();
            }
        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        private string UploadFile()
        {
            //IsScreenShot();
            string result = string.Empty;
            if (Request.Files.Count > 0)
            {
                try
                {
                    HttpPostedFile file = Request.Files["File"];
                    string ScreenTime = Request["ScreenTime"];
                    int DeptId = Convert.ToInt32(Request["DeptID"]);
                    int PosId = Convert.ToInt32(Request["PosId"]);
                    if (String.IsNullOrEmpty(ScreenTime)) 
                    {
                        ScreenTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    #region
                    if (file != null && file.ContentLength > 0)
                    {
                        if (file.ContentLength > (1024 * 1024))
                        {
                            result = "{failure:true,msg:'对不起，目前上文件大小限定于1M之内，上传失败！'}";
                        }
                        else if (file.ContentLength < (1024 * 1024))
                        {
                            string SavePath = Server.MapPath("~/ScreenUpload");
                            ToCreateFile(SavePath);//判断文件夹是否存在，如果不存在则创建文件夹

                            string filename = file.FileName.ToString();
                            if (filename.IndexOf(':') > 0)//用于判断不同的浏览器传过来的上传文件的路径
                            {
                                filename = filename.Substring(filename.LastIndexOf('\\') + 1);
                            }
                            if (filename.Substring(filename.LastIndexOf('.') + 1).ToLower() == "jpg" || filename.Substring(filename.LastIndexOf('.') + 1).ToLower() == "jpge")
                            {
                                //当文件为 jpg/jpge 图片类型时
                                filename = DeptId + "_" +PosId+"_"+ DateTime.Now.ToString("yyyyMMddHHmmss") + ".jpg";
                                #region
                                SavePath = SavePath + "\\" + filename;

                                string sql = string.Format(@"insert into bScreenLog(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,
                                                                                DeptID,ScreenTime,FileSize,FileName,FilePath,IpAddr,PosId) 
                                                                                values(@CreateID,getdate(),@ModifyID,getdate(),@IsDeleted,
                                                                                @DeptID,@ScreenTime,@FileSize,@FileName,@FilePath,@IpAddr,@PosId)");
                                //获取Ip
                                string ipAddr = Request.ServerVariables["HTTP_X_Forwarded_For"];
                                if (ipAddr == null)
                                {
                                    ipAddr = Request.ServerVariables["Remote_addr"];
                                }

                                #region Hashtable
                                Hashtable parms = new Hashtable();
                                parms.Add("@CreateID", 0);
                                parms.Add("@ModifyID", 0);
                                parms.Add("@IsDeleted", 0);
                                parms.Add("@DeptID", DeptId);
                                parms.Add("@ScreenTime", ScreenTime);
                                parms.Add("@FileSize", file.ContentLength);
                                parms.Add("@FileName", filename);
                                parms.Add("@FilePath", "/ScreenUpload/" + filename);
                                parms.Add("@IpAddr", ipAddr);
                                parms.Add("@PosId", PosId);
                                #endregion
                                
                                int index = upl.ExecuteNonQuery(sql, parms);
                                if (index > 0)
                                {
                                    file.SaveAs(SavePath);
                                    result = "{success:true,msg:'上传成功！'}";
                                    sql = @"update iPos set ModifyDate = getdate(),ScreenShot = 0
                                            where IsDeleted =0 and Id = @PosId";
                                    upl.ExecuteNonQuery(sql, parms);
                                }
                                #endregion
                            }
                            else
                            {
                                result = "{failure:true,msg:'上传失败！只能是jpg/jpge图片类型!'}";
                            }
                        }

                    }
                    #endregion
                
                }
                catch (Exception ex)
                {
                    result = "{failure:true,msg:\"上传失败！"+ex.Message.ToString()+"\"}";
                }
                
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

        /// <summary>
        /// 判断是否允许截屏
        /// </summary>
        private string IsScreenShot()
        {
            int isScreenShot = 0;
            string result = string.Empty;
            try
            {
                string PosId = Request["PosId"];
                //获取Ip
                string ipAddr = Request.ServerVariables["HTTP_X_Forwarded_For"];
                if (ipAddr == null)
                {
                    ipAddr = Request.ServerVariables["Remote_addr"];
                }
                isScreenShot = upl.IsScreenShot(0, PosId, ipAddr);
            }
            catch (Exception ex)
            {
                isScreenShot = 0;
                //Response.Write(ex.Message + ", posid = " + Request["PosId"]);
                //Response.End();
            }

            if (isScreenShot == 0)
            {
               result = "false";
            }
            else
            {
                result = "true";
            }
            return result;
        }
    }
}