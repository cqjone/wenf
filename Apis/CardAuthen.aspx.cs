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

using BeautyPointWeb.Entities;
using BllApi;
using DbCommon;
using System.Collections.Generic;


namespace BeautyPointWeb.Apis
{
    public partial class CardAuthen : AuthBasePage
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
            if (!this.Page.IsPostBack)
            {
                string json = string.Empty;

                switch (ActionName)
                {
                    default:
                        base.ReturnResultJson("false", "没有该API");
                        break;
                    case "passwordVerify":
                        json = passwordVerify();
                        break;
                    case "getCardInfo":
                        json = getCardInfo();
                        break;

                    case "bingdingCard":
                        json = bingdingCard();
                        break;
                    case "unBingdingCard":
                        json = unBingdingCard();
                        break;
                    case "getAuthenCardList":
                        json = getAuthenCardList();
                        break;
                }

                Response.Write(json);
                Response.End();
            }


        }

        public string getCardInfo() 
        {
            String json = "{}";
            try
            {
                String cardno = Request["cardno"];
                AuthenCardInfo info = AuthenCardInfo.GetCardInfoByCardNo(cardno);
                if (info != null)
                {
                    json = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(info) +"}";
                }
            }
            catch (Exception ex)
            {
                json = ex.Message.Replace("'", "\"");
                json = "{success:false,msg:'" + json + "'}";
            }
            return json;
        }


        public string getAuthenCardList()
        {
            String json = "[]";
            try
            {
                String customerId = Request["customerId"];
                if (!String.IsNullOrEmpty(customerId)) 
                {
                    List<AuthenCardInfo> cardList = AuthenCardInfo.GetAuthenCardList(Int32.Parse(customerId), true);
                    json = Newtonsoft.Json.JsonConvert.SerializeObject(cardList);
                }
                
            }
            catch (Exception ex)
            {
                json = ex.Message.Replace("'", "\"");
                json = "{success:false,msg:'" + json + "'}";
            }
            return json;
        }

        public string bingdingCard()
        {
            String json = "{}";

            try
            {
                String cardno = Request["cardno"];
                String password = Request["password"];
                String key = Request["key"];
                if (!String.IsNullOrEmpty(cardno))
                {
                    AuthenCardInfo card = AuthenCardInfo.GetCardInfoByCardNo(cardno);
                    card.CurrentUser = CurrentUser;
                    if (card == null)
                    {
                        json = "{success:true,msg:-1}";
                    }
                    else if (!password.Equals(card.Password))
                    {
                        json = "{success:true,msg:-2}";
                    }
                    else
                    {
                        AuthenCustomerInfo cust = AuthenCustomerInfo.GetCustomerByMobileOrIdNo(key, true,null);
                        if (cust != null) 
                        {
                            card.CustomerID = cust.CustomerID;
                            card.binding();
                        }
                        json = "{success:true,msg:1}";
                        
                    }
                }
                else
                {
                    json = "{success:false,msg:-1}";
                }

            }
            catch (Exception ex)
            {
                json = ex.Message.Replace("'", "\"");
                json = "{success:false,msg:'" + json + "'}";
            }

            return json;
        }

        public string unBingdingCard()
        {
            String json = "{}";

            try
            {
                String id = Request["id"];

                if (!String.IsNullOrEmpty(id))
                {
                    AuthenCardInfo card = AuthenCardInfo.GetCardInfoById(Int32.Parse(id));
                    card.CurrentUser = CurrentUser;
                    if (card == null)
                    {
                        json = "{success:true,msg:-1}";
                    }
                    else
                    {
                        card.unBinding();
                        json = "{success:true,msg:1}";

                    }
                }
                else
                {
                    json = "{success:false,msg:-1}";
                }

            }
            catch (Exception ex)
            {
                json = ex.Message.Replace("'", "\"");
                json = "{success:false,msg:'" + json + "'}";
            }

            return json;
        }


        public String passwordVerify()
        {
            String json = "{}";

            try
            {
                String cardno = Request["cardno"];
                String password = Request["password"];
                if (!String.IsNullOrEmpty(cardno))
                {
                    AuthenCardInfo info = AuthenCardInfo.GetCardInfoByCardNo(cardno);
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
                        json = "{success:true,msg:1}";
                    }
                }
                else 
                {
                    json = "{success:false,msg:-1}";
                }

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
