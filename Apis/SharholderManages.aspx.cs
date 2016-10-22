using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using Newtonsoft.Json;

namespace BeautyPointWeb.Apis
{
    public partial class SharholderManages : System.Web.UI.Page
    {
        BllApi.SharehodlerManages Shareholder = new BllApi.SharehodlerManages();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string json = string.Empty;

                switch (Request["actionName"])
                {
                    case "GetList":
                        json = GetList();
                        break;
                    case "updateData":
                        UpdateData();
                        break;

                    default:

                        break;
                }

                Response.Write(json);
                Response.End();
            }
        }
        public void UpdateData()
        {
            string data = Request["records"];
            string ModifyID = Request["sid"];
            Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";
            for (int m = 0; m < arr.Count; m++)
            {
                string ID = arr[m]["ID"].ToString();
                //string Title = arr[m]["店名"].ToString() != "null" ? arr[m]["店名"].ToString() : "";
                string ShareA = arr[m]["股东A"].ToString();
                string ShareB = arr[m]["股东B"].ToString();
                string ShareC = arr[m]["股东C"].ToString();
                string ShareD = arr[m]["股东D"].ToString();
                string DonateA = arr[m]["赠股A"].ToString();
                string Donateb = arr[m]["赠股B"].ToString();
                string DonateC = arr[m]["赠股C"].ToString();
                string DonateD = arr[m]["赠股D"].ToString();

                string str = @"update biDeptExt set ModifyDate = getDate(),ModifyID ='" + ModifyID + "',ShareA='" + ShareA + "',ShareB='" + ShareB + "',ShareC='" + ShareC +
                               "',ShareD='" + ShareD + "',DonateA='" + DonateA + "',Donateb='" + Donateb + "',DonateC='" + DonateC +
                               "',DonateD='" + DonateD +
                                "' where id  =" + ID + ";";
                sql += str;

            }
            int ok = Shareholder.ExecuteNonQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }



        /// <summary>
        /// 获取维护数据
        /// </summary>
        /// <returns></returns>
        private string GetList()
        {
            string result = string.Empty;


            try
            {
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);

                string depid = Request["depID"].ToString();
                Hashtable prams = new Hashtable();
                string sql = @"select a.ID, c.Title 区域,b.Title as 门店,b.Code 门店编码, a.ShareA as 股东A,a.ShareB as 股东B,a.ShareC as 股东C,a.ShareD as 股东D,a.DonateA as 赠股A,a.Donateb 赠股B,a.DonateC 赠股C,a.DonateD 赠股D 
        from biDeptExt as a 
        join iDept as b on a.DeptID=b.ID   
        join iArea as c on b.AreaID=c.ID
        where 1=1";
                if (!string.IsNullOrEmpty(depid))
                {
                    sql += " and b.ID=" + depid;
                }
                sql += "order by a.ID asc";
                int count = 0;
                 DataTable dt = Shareholder.GetList(sql, prams, ref count);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = "{totalCount:" + count + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }
    }
}
