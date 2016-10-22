using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Office.Interop.Excel;
using System.Diagnostics;
using Newtonsoft;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections;
namespace BeautyPointWeb.Apis
{
    public partial class ImportCommonDetailExcel : AuthBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string action = Request["actionName"];
                string json = string.Empty;
                switch (action)
                {
                    case "ImportExcel":
                        ImportExcel();
                        break;
                    case "Save":
                        SaveData();
                        break;
                }
                Response.Write(json);
                Response.End();
            }
            
        }
        private BllApi.BaseApi basebll = new BllApi.BaseApi();
        public void ImportExcel()
        {
            string fileName = Guid.NewGuid().ToString() + ".xls";
            System.Data.DataTable dt = new System.Data.DataTable();
            if (fileLoad(fileName))
            {
                object missing = System.Reflection.Missing.Value;
                Application excel = new Application();//lauch excel application
                if (excel == null)
                {
                    Response.Write("<script>alert('Can't access excel')</script>");
                }
                else
                {
                    excel.Visible = false; excel.UserControl = true;
                    // 以只读的形式打开EXCEL文件
                    Workbook wb = excel.Application.Workbooks.Open(Server.MapPath("~/Temp/") + fileName, missing, true, missing, missing, missing,
                     missing, missing, missing, true, missing, missing, missing, missing, missing);
                    //取得第一个工作薄
                    Worksheet ws = (Worksheet)wb.Worksheets.get_Item(1);
                    //取得总记录行数   (包括标题列)
                    int rowsint = ws.UsedRange.Cells.Rows.Count; //得到行数
                    int columnsint = ws.UsedRange.Cells.Columns.Count;//得到列数
                    //string sql = "";
                    //bool flag = true;
                    //Range rg = null;

                    dt.Columns.Add("Title");
                    dt.Columns.Add("TotalPurchase");
                    dt.Columns.Add("TotalReceive");
                    dt.Columns.Add("TotalSell");
                    dt.Columns.Add("Inventory");
                    int Receive = 0;
                    int Sell = 0;
                    for (int i = 3; i <= rowsint; i++)
                    {
                        Receive = Convert.ToInt32(ws.Cells[i, 98].Value.ToString().Replace("\"", "") != "null" ? ws.Cells[i, 98].Value.ToString().Replace("\"", "") : "0");
                        Sell = Convert.ToInt32(ws.Cells[i, 99].Value.ToString().Replace("\"", "") != "null" ? ws.Cells[i, 99].Value.ToString().Replace("\"", "") : "0");
                        if (ws.Cells[i, 2].Value != null)
                        {
                            DataRow dr = dt.NewRow();
                            dr["Title"] = ws.Cells[i, 2].Value;
                            dr["TotalPurchase"] = ws.Cells[i, 97].Value;
                            dr["TotalReceive"] = ws.Cells[i, 98].Value;
                            dr["TotalSell"] = Receive + Sell;
                            dr["Inventory"] = ws.Cells[i, 100].Value;
                            dt.Rows.Add(dr);
                        }
                    }
                }
                excel.Quit(); excel = null;
                Process[] procs = Process.GetProcessesByName("excel");

                foreach (Process pro in procs)
                {
                    pro.Kill();//没有更好的方法,只有杀掉进程
                }
                GC.Collect();
            }
            string msg = "{success:true,results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            Response.Write(msg);
            Response.End();
        }

        public bool fileLoad(string SaveName)
        {
            HttpFileCollection files = HttpContext.Current.Request.Files;
            /// '状态信息
            System.Text.StringBuilder strMsg = new System.Text.StringBuilder();
            for (int iFile = 0; iFile < files.Count; iFile++)
            {
                ///'检查文件扩展名字
                bool fileOK = false;
                HttpPostedFile postedFile = files[iFile];
                string fileName, fileExtension;
                fileName = System.IO.Path.GetFileName(postedFile.FileName);
                if (fileName != "")
                {
                    fileExtension = System.IO.Path.GetExtension(fileName);
                    String[] allowedExtensions = {".xls",".xlsx" };
                    for (int i = 0; i < allowedExtensions.Length; i++)
                    {
                        if (fileExtension == allowedExtensions[i])
                        {
                            fileOK = true;
                            break;
                        }

                    }
                    if (!fileOK) return false;
                }
                if (fileOK)
                {
                    postedFile.SaveAs(Server.MapPath("~/Temp/") + SaveName);
                }
            }
            return true;
        }
        public void SaveData()
        {
            int userID = CurrentSession.UserID;
            string data = Request["records"];
            string searchYear = Request["searchYear"];
            string searchMonth = Request["searchMonth"];
            int DeptID = Convert.ToInt32(Request["DeptID"]);
            Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            System.Data.DataTable dt = new System.Data.DataTable();
            dt.Columns.Add("DeptID");
            dt.Columns.Add("DataYear");
            dt.Columns.Add("DataMonth");
            dt.Columns.Add("ItemType");
            dt.Columns.Add("ItemName");
            dt.Columns.Add("ItemData");
            for (int m = 0; m < arr.Count; m++)
            {
                
                if (arr[m]["TotalPurchase"].ToString().Replace("\"", "") != "0" && arr[m]["TotalPurchase"].ToString().Replace("\"", "") != "")
                {
                    DataRow dr = dt.NewRow();
                    dr["DeptID"] = DeptID;
                    dr["DataYear"] = searchYear;
                    dr["DataMonth"] = searchMonth;
                    dr["ItemType"] = "入库";
                    dr["ItemName"] = arr[m]["Title"].ToString().Trim().Replace("\"", "") != "null" ? arr[m]["Title"].ToString().Replace("\"", "") : "";
                    dr["ItemData"] = arr[m]["TotalPurchase"].ToString().Replace("\"", "");
                    dt.Rows.Add(dr);
                }

                if (arr[m]["TotalSell"].ToString().Replace("\"", "") != "0" && arr[m]["TotalSell"].ToString().Replace("\"", "") != "")
                {
                    DataRow dr = dt.NewRow();
                    dr["DeptID"] = DeptID;
                    dr["DataYear"] = searchYear;
                    dr["DataMonth"] = searchMonth;
                    dr["ItemType"] = "出库";
                    dr["ItemName"] = arr[m]["Title"].ToString().Trim().Replace("\"", "") != "null" ? arr[m]["Title"].ToString().Replace("\"", "") : "";
                    dr["ItemData"] = arr[m]["TotalSell"].ToString().Replace("\"", "");
                    dt.Rows.Add(dr);
                }
                
                if (arr[m]["Inventory"].ToString().Replace("\"", "") != "0" && arr[m]["Inventory"].ToString().Replace("\"", "") != "")
                {
                    DataRow dr2 = dt.NewRow();
                    dr2["DeptID"] = DeptID;
                    dr2["DataYear"] = searchYear;
                    dr2["DataMonth"] = searchMonth;
                    dr2["ItemType"] = "库存";
                    dr2["ItemName"] = arr[m]["Title"].ToString().Trim().Replace("\"", "") != "null" ? arr[m]["Title"].ToString().Replace("\"", "") : "";
                    dr2["ItemData"] = arr[m]["Inventory"].ToString().Replace("\"", "");
                    dt.Rows.Add(dr2);
                }
            }
            Hashtable prams = new Hashtable();
            string sqlQuery = @"select ID,DataYear,DataMonth,ItemType,ItemName,ItemData from biCommonDetail where IsDeleted = 0 and  DeptID=@DeptID";
            prams.Add("@DeptID",DeptID);
            System.Data.DataTable dt1 = basebll.GetPageData(sqlQuery, prams);
            string sql = "";
            int flag = 0;
            int detailID = 0;
            int ItemData = 0;
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                for (int j = 0; j < dt1.Rows.Count; j++)
                {
                    if (dt1.Rows[j]["DataYear"].ToString() == dt.Rows[i]["DataYear"].ToString() && dt1.Rows[j]["DataMonth"].ToString() == dt.Rows[i]["DataMonth"].ToString() && dt1.Rows[j]["ItemType"].ToString() == dt.Rows[i]["ItemType"].ToString() && dt1.Rows[j]["ItemName"].ToString() == dt.Rows[i]["ItemName"].ToString())
                    {
                        flag = 1;
                        detailID =Convert.ToInt32(dt1.Rows[j]["ID"]);
                        ItemData = Convert.ToInt32(dt1.Rows[j]["ItemData"]);
                    }
                }
                if (flag == 1)
                {
                    if (Convert.ToInt32(dt.Rows[i]["ItemData"]) != ItemData)
                    {
                        sql += @"update biCommonDetail set ModifyID=" + userID + ",ModifyDate=getDate(),ItemData=" + dt.Rows[i]["ItemData"] +
                        " where ID=" + detailID + ";";
                    }
                    flag = 0;
                }
                else 
                {
                    sql += @"insert into biCommonDetail(CreateID,CreateDate,ModifyID,ModifyDate,IsDeleted,DeptID,DataYear,DataMonth,ItemType,ItemName,ItemData) values 
                            (" + userID + ",getdate()," + userID + ",getDate(),0," + DeptID + "," + dt.Rows[i]["DataYear"] + "," + dt.Rows[i]["DataMonth"] +
                             ",'" + dt.Rows[i]["ItemType"] + "','" + dt.Rows[i]["ItemName"] + "'," + dt.Rows[i]["ItemData"] + ");";
                }
            }
            int result = basebll.ExecuteNoneQuery(sql);
            if (sql == "")
            {
                ReturnResultJson("true", "保存成功！");
            }
            if (result > 0)
            {
                ReturnResultJson("true", "保存成功！");
            }
            else
            {
                ReturnResultJson("false", "保存异常！");
            }
        }
    }
}