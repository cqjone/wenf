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
    public partial class JyMaintain : System.Web.UI.Page
    {

        BllApi.JyMaintain maintain = new BllApi.JyMaintain();

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
                string Tel = arr[m]["电话"].ToString();
                string Area = arr[m]["面积"].ToString();
                string Address = arr[m]["地址"].ToString();
                string Rental = arr[m]["房租"].ToString();
                string LegalPerson = arr[m]["法人"].ToString();
                string BusinessLic = arr[m]["营业执照"].ToString();
                string TaxCertificate = arr[m]["税务登记证"].ToString();
                string OrganizationCode = arr[m]["机构代码证"].ToString();
                string FireCertificate = arr[m]["消防许可证"].ToString();
				
				// a.LandLord as 房东, a.RentBegin as 租期开始, a.RentEnd as 租期结束
				string LandLord = arr[m]["房东"].ToString();
				string RentBegin = arr[m]["租期开始"].ToString();
				string RentEnd = arr[m]["租期结束"].ToString();

                //string str = @"update biDeptExt set ModifyDate = getDate(), DeptID ='" + Title + "',Tel='" + Tel + ",Address=" + Address + "',Area='" + Area +
                //                "',Rental='" + Rental + "',LegalPerson='" + LegalPerson + "',BusinessLic='" + BusinessLic + "',TaxCertificate='" + TaxCertificate + "'" +
                //                ",OrganizationCode='" + OrganizationCode + "'" +
                //                ",FireCertificate=" + FireCertificate +
                //                " where id = " + ID + ";";

                string str = @"update biDeptExt set ModifyDate = getDate(), ModifyID ='" + ModifyID + "', Tel='" + Tel + "', Address='" + Address + "', Area='" + Area + "', Rental='" + Rental + "', LegalPerson='" + LegalPerson + "', BusinessLic='" + BusinessLic + "', TaxCertificate='" + TaxCertificate + "', OrganizationCode='" + OrganizationCode + "', FireCertificate='" + FireCertificate + "',  LandLord='" + LandLord + "', RentBegin='" + RentBegin + "', RentEnd='" + RentEnd + "'   where id  =" + ID+";";
                sql += str;

            }
            int ok = maintain.ExecuteNonQuery(sql);
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
                string sql = @"select a.ID as ID,c.Title 区域,b.Code 门店编码,b.Title as 门店,a.Address as 地址,a.Tel as 电话,a.Area as 面积,a.Rental as 房租, a.LandLord as 房东, a.RentBegin as 租期开始, a.RentEnd as 租期结束, a.LegalPerson as 法人,a.BusinessLic as 营业执照,a.TaxCertificate  as  税务登记证,a.OrganizationCode as 机构代码证,a.FireCertificate as 消防许可证 
                from biDeptExt as a 
                join iDept as b on a.DeptID=b.ID  
                join iArea as c on b.AreaID=c.ID
                where a.IsDeleted=0  ";
                if (!string.IsNullOrEmpty(depid))
                {
                    sql += " and b.ID=" + depid;
                }
                sql += "order by a.ID asc";
                int count = 0;
                DataTable dt = maintain.GetList(sql, prams, ref count);


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
