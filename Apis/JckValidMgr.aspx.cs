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
    public partial class JckValidMgr : AuthBasePage
    {
        private BllApi.JckValidMgr mybll = new BllApi.JckValidMgr();

        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            { 
                case "FindJck":
                    result = this.FindJck();
                    break;
                case "UpdateExpireDate":
                    result = this.UpdateExpireDate();
                    break;
                default:
                    result = "{success:false,msg:'没有该API！'}";
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        private string FindJck()
        {
            try
            {
                string Code = Request["Code"];
                Hashtable prams = new Hashtable();
                string sql = @"select a.Id,b.Code,c.Title as CustomerName,c.Tel,c.Mobile,a.RemainCount,a.TotalCount,CONVERT(varchar(100), a.ExpireDate , 23) as ExpireDate 
                               from iJckInfo a,iCard b,iCustomer c
                               where a.IsDeleted=0 and a.CardId=b.Id and b.CustomerId=c.Id ";
                if (Code != null && !string.IsNullOrEmpty(Code))
                {
                    sql += " and b.Code=@Code";
                    prams.Add("@Code",Code);
                }
                return Newtonsoft.Json.JsonConvert.SerializeObject(mybll.ExecQuery(sql,prams));
                //return Newtonsoft.Json.JsonConvert.SerializeObject(mybll.GetPageData(sql, "order by Code", 1, 1,prams));
            }
            catch (Exception ex)
            {
                return "{success:false,msg:\""+ex.Message+"\"}";
            }
        }

        private string UpdateExpireDate()
        {
            try
            {
                string Id = Request["TargetId"];
                string ExpireDate = Request["UpdateDate"];
                Hashtable prams = new Hashtable();
                prams.Add("@Id",Id);
                prams.Add("@ExpireDate",ExpireDate);
                return mybll.UpdateExpireDate(prams,CurrentUser.Id);
            }
            catch (Exception ex)
            {
                return "{success:false,msg:\""+ex.Message+"\"}";
            }
        }
    }
}