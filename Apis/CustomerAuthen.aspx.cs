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
using DbCommon;
using BeautyPointWeb.Entities;
using BllApi;

namespace BeautyPointWeb.Apis
{
    public partial class CustomerAuthen : AuthBasePage
    {
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
            if (!this.Page.IsPostBack){
                string json = string.Empty;

                switch (ActionName)
                {
                    default:
                        base.ReturnResultJson("false", "没有该API");
                        break;
                    case "getAuthenCustomerInfo":
                         json = getAuthenCustomerInfo();
                         break;
                    case "saveAuthenCustomer":
                         json = saveAuthenCustomer();
                         break;

                    case "passwordVerify":
                         json = passwordVerify();
                         break;


                       
                }

                Response.Write(json);
                Response.End();
            }
            
            
        }

        public String  getAuthenCustomerInfo(){
            String json = "{}";
            String value = Request["value"];
            AuthenCustomerInfo info = AuthenCustomerInfo.GetCustomerByMobileOrIdNo(value,true,null);
            if (info != null) 
            {
                json = Newtonsoft.Json.JsonConvert.SerializeObject(info);
            }
            return json;
        }


        public String passwordVerify()
        {
            String json = "{}";
            
            try
            {
                String key = Request["key"];
                String password = Request["password"];
                if (!String.IsNullOrEmpty(key) && !String.IsNullOrEmpty(password))
                {
                    
                    AuthenCustomerInfo info = AuthenCustomerInfo.GetCustomerByMobileOrIdNo(key, true, null);
                    if (info == null)
                    {
                        json = "{success:true,msg:-1}";
                    }
                    else if (!password.Equals(info.Password))
                    {
                        json = "{success:true,msg:-2}";
                    }
                    else 
                    {
                        json = "{success:true,msg:1,ID:"+info.CustomerID+"}";
                    }
                }
            }
            catch (Exception ex) 
            {
                json = ex.Message.Replace("'", "\"");
                json = "{success:false,msg:'" + json + "'}";
            }
            
            return json;
        }

        public String saveAuthenCustomer()
        {
            String json = "{}";
            try
            {
                String title = Request["title"];
                String mobile = Request["mobile"];
                String idno = Request["idno"];
                String password = Request["password"];
                String id = Request["ID"];
                AuthenCustomerInfo info = new AuthenCustomerInfo();
                if (!String.IsNullOrEmpty(id))
                {
                    info.CustomerID = Int16.Parse(id);
                }
                info.Title = title;
                info.Mobile = mobile;
                info.IdNo = idno;
                info.Authenticated = 1;
                info.AuthenticateDate = DateTime.Now.ToString("yyyy-MM-dd");
                info.Password = password;
                info.HashedMobile = EncrptionHelper.Encrypt("@@@" + mobile.ToUpper() + "###");
                info.HashedIdNo = EncrptionHelper.Encrypt("@@@" + idno.ToUpper() + "###");
                if (!String.IsNullOrEmpty(password))
                {
                    info.SecretPassword = EncrptionHelper.GetSecretPwd(password);
                }
                info.CurrentUser = this.CurrentUser;
                info.save();
                json = Newtonsoft.Json.JsonConvert.SerializeObject(info);
                json = "{success:true,msg:'" + json + "'}";
            }
            catch (Exception ex) 
            {
                json = ex.Message.Replace("'", "\"");
                json = "{success:false,msg:'" + json + "'}";
            }
            return json;
        } 

        
    }
}
