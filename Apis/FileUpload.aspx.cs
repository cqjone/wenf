using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
/// 文件上传
/// </summary>
public partial class Apis_FileUpload : AuthBasePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (ActionName)
        {
            default:
                base.ReturnResultJson("false", "没有该API");
                break;
            case "doUpload":
                DoUpload();
                break;
            case "delPic":
                DelPic();
                break;
        }
    }

    /// <summary>
    /// 上传文件，成功后，返回 msg：文件名称
    /// </summary>
    private void DoUpload()
    {
        if (Request.Files.Count == 0)
        {
            base.ReturnResultJson("false","没有需要上传的文件！");
            return;
        }
        int maxSize = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings.Get("PicMaxSize"));

        if (Request.Files[0].ContentLength / 1024 > maxSize)
        {
            base.ReturnResultJson("false","上传的文件超过最大限制 " + maxSize + "kb ");
            return;
        }
        string fileName = Request.Files[0].FileName;

        string extName = fileName.LastIndexOf('.') != -1 ? fileName.Substring(fileName.LastIndexOf('.'), fileName.Length - fileName.LastIndexOf('.')) : "";
        extName = extName.ToLower();

        if (!".jpg".Equals(extName) && !".gif".Equals(extName) && !".bmp".Equals(extName))
        {
            base.ReturnResultJson("false", "上传文件格式错误！");
            return;
        }

        string filePath = DateTime.Now.ToString("yyyyMMddHHmmssff") + extName;

        try
        {
            Request.Files[0].SaveAs(Server.MapPath("~/Uploads") + "//" + filePath);
            base.ReturnResultJson("true",filePath);
        }
        catch (System.Threading.ThreadAbortException ex)
        {
            //base.ReturnResultJson("false", ex.Message);
            throw (ex);
        }
    }

    public void DelPic()
    {
        string picName = Request["PicName"];
        if (!string.IsNullOrEmpty(picName))
        {
            string path = Server.MapPath("~/Uploads") + "//";// "D:/SvnWork/BeautyPoint/BeautyPointWeb/Uploads/";
            System.IO.File.Delete(path + picName);
            base.ReturnResultJson("true", "删除图片成功！");
        }
        else
        {
            base.ReturnResultJson("false", "无清空图片！");
        }
    }
}