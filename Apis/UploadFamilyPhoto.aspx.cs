using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using System.IO;


namespace BeautyPointWeb.Apis
{
    public partial class UploadFamilyPhoto : System.Web.UI.Page
    {
        BllApi.UploadFamilyPhoto upload = new BllApi.UploadFamilyPhoto();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string json = string.Empty;

                switch (Request["actionName"])
                {
                    case "uploadGetList":
                        json = GetList();
                        break;
                    case "uploadfile":

                        string Code = Request["Code"];
                        int ID = Convert.ToInt32(Request["ID"]);

                        json = UploadFile(ID, Code);
                        break;
                    default:
                     
                        break;
                }
             
                Response.Write(json);
                Response.End();
            }
        }
        /// <summary>
        /// 获取全家福信息
        /// </summary>
        /// <returns></returns>
        private string GetList()
        {
            string result = string.Empty;
            try
            {
                //int start = Convert.ToInt32(Request["start"]);
                //int limit = Convert.ToInt32(Request["limit"]);
                string depid = Request["DeptID"];
                Hashtable prams = new Hashtable();
                string sql = "select ID,Code,Title,PhotoPath,CONVERT(varchar(100), UploadTime , 23) as UploadTime from iDept  where IsDeleted=0 and DeptTypeID=1 and DeptStatus=1 ";
                if (!string.IsNullOrEmpty(depid))
                {

                    sql += " and ID=" + depid;
                
                }
                int count = 0;
                DataTable dt = upload.GetList(sql, prams, ref count);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{totalCount:" + count + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

    /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        private string UploadFile(int id,string code)
        {
            //IsScreenShot();
            string result = string.Empty;
            if (Request.Files.Count > 0)
            {
                try
                {
                    HttpPostedFile file = Request.Files["File"];
                    int max = 3 * 1024 * 1024;
                    string Date = DateTime.Now.ToString("yyyy-MM-dd");
                    #region
                    if (file != null && file.ContentLength > 0)
                    {
                        if (file.ContentLength > (max))
                        {
                            result = "{failure:true,msg:'对不起，目前上文件大小限定于1-3M之内，上传失败！'}";
                        }
                        else if (file.ContentLength <= (max))
                        {
                            string SavePath = Server.MapPath("~/Imgs/DeptPhoto/");
                            ToCreateFile(SavePath);//判断文件夹是否存在，如果不存在则创建文件夹

                            string filename = file.FileName.ToString();
                            if (filename.IndexOf(':') > 0)//用于判断不同的浏览器传过来的上传文件的路径
                            {
                                filename = filename.Substring(filename.LastIndexOf('\\') + 1);
                            }
                            if (filename.Substring(filename.LastIndexOf('.') + 1).ToLower() == "jpg" || filename.Substring(filename.LastIndexOf('.') + 1).ToLower() == "jpge")
                            {
                                //当文件为 jpg/jpge 图片类型时

                                filename = code + ".jpg";
                                #region

                                SavePath = SavePath+filename;

                                string sql = string.Format(@"update iDept set ModifyDate=@modifydate ,UploadTime=@uploadtime,PhotoPath=@path where ID=@ID");
                            
                                #region Hashtable
                                Hashtable parms = new Hashtable();
                                parms.Add("@modifydate", Date);
                                parms.Add("@uploadtime", Date);
                                parms.Add("@path", filename);
                                parms.Add("@ID", id);

                                #endregion
                        
                                    file.SaveAs(SavePath);
                                    result = "{success:true,msg:'上传成功！'}";

                                    upload.ExecuteNonQuery(sql, parms);
                            
                                #endregion
                            }
                            else
                            {
                                result = "{failure:true,msg:'上传失败！只能是jpg/jpge图片类型!'}";
                            }
                        }

                    }
                    else
                    {
                        result = "{failure:true,msg:\"上传失败！" + "请选择上传图片" + "\"}";
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

    }



}
