using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using Newtonsoft;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace BeautyPointWeb.Apis
{
    public partial class ClothingSizesFill : AuthBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            {
                case "getAllEmp":
                    GetAllEmp();
                    break;
                case "updateData":
                    UpdateData();
                    break;
            }
        }
        private BllApi.BaseApi basebll = new BllApi.BaseApi();
        BllApi.AttendanceMgr kqgl = new BllApi.AttendanceMgr();
        public void GetAllEmp()
        {
            int DeptID = CurrentSession.DeptID;
//            String sql = @"select ID,Code,Title,Tel,'' as TrainPriod,'' as Zodiac,case Height when 0 then null else 
//                            Height end as Height,case Weight when 0 then null else Weight end as Weight,
//                            CoatSize,ShirtSize,TrousersSize,SkirtSize,ShoesSize,'' as Memo,'../EmployeePhoto/'+Code+'.jpg' as photo
//                            from iEmployee where IsDeleted = 0 and DeptID = @DeptID and (State = '在岗'  or State = '待报到' )
//                            order by Code";

            String sql = @"select ID,Code,Title,IdNo, Mobile as Tel, TrainPriod,Rank,Zodiac,Height,Weight,CommCardNo,CmbCardNo,BocCardNo,FamilyAdress,FamilyPhone,
                            PersonalPhone,PersonalAddress,ConsortName,ConsortPhone,ConsortAddress,ParentName,ParentPhone,ParentAddress,KinName,KinPhone,KinAddress,
                            CoatSize,ShirtSize,TrousersSize,SkirtSize,ShoesSize,'' as Memo,'http://jf.wenfeng.com.cn/Imgs/EmpImgs/'+Code+'.jpg' as photo
                            from iEmployee where IsDeleted in (0,2) and DeptID = @DeptID and (State = '在岗'  or State = '待报到' )
                            order by Code";

            Hashtable prams = new Hashtable();
            prams.Add("@DeptID", DeptID);
            DataTable dt = basebll.GetPageData(sql, prams);
            string msg = "{results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            Response.Write(msg);
            Response.End();
        }
        public void UpdateData()
        {
            string data = Request["records"];
            int userID = CurrentUser.Id;
            Newtonsoft.Json.Linq.JArray arr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(data);
            string sql = "";
            for (int m = 0; m < arr.Count; m++)
            {
                string ID = arr[m]["ID"].ToString().Replace("\"", "");
                string TrainPriod = arr[m]["TrainPriod"].ToString().Replace("\"", "")!="null"?arr[m]["TrainPriod"].ToString().Replace("\"", ""):"";
                string Rank = arr[m]["Rank"].ToString().Replace("\"", "") != "null" ? arr[m]["Rank"].ToString().Replace("\"", "") : "无";
              //  string Zodiac = arr[m]["Zodiac"].ToString().Replace("\"", "") != "null" ? arr[m]["Zodiac"].ToString().Replace("\"", "") : ""; 

                string CoatSize = arr[m]["CoatSize"].ToString().Replace("\"", "") != "null" ? arr[m]["CoatSize"].ToString().Replace("\"", "") : ""; 
                string ShirtSize = arr[m]["ShirtSize"].ToString().Replace("\"", "") != "null" ? arr[m]["ShirtSize"].ToString().Replace("\"", "") : ""; 
                string TrousersSize = arr[m]["TrousersSize"].ToString().Replace("\"", "") != "null" ? arr[m]["TrousersSize"].ToString().Replace("\"", "") : ""; 
                string SkirtSize = arr[m]["SkirtSize"].ToString().Replace("\"", "") != "null" ? arr[m]["SkirtSize"].ToString().Replace("\"", "") : ""; 
                string ShoesSize = arr[m]["ShoesSize"].ToString().Replace("\"", "") != "null" ? arr[m]["ShoesSize"].ToString().Replace("\"", "") : ""; 
                string height = arr[m]["Height"].ToString().Replace("\"", "")!=""?arr[m]["Height"].ToString().Replace("\"", ""):"0";
                string Height = !String.IsNullOrEmpty(height) ? height : "0";
                string weight = arr[m]["Weight"].ToString().Replace("\"", "") != "" ? arr[m]["Weight"].ToString().Replace("\"", "") : "0";
                string Weight = !String.IsNullOrEmpty(weight) ? height : "0";
                string tel = arr[m]["Tel"].ToString().Replace("\"", "") != "null" ? arr[m]["Tel"].ToString().Replace("\"", "") : "";

                string CommCardNo = arr[m]["CommCardNo"].ToString().Replace("\"", "") != "null" ? arr[m]["CommCardNo"].ToString().Replace("\"", "") : "";
                string CmbCardNo = arr[m]["CmbCardNo"].ToString().Replace("\"", "") != "null" ? arr[m]["CmbCardNo"].ToString().Replace("\"", "") : "";
                string BocCardNo = arr[m]["BocCardNo"].ToString().Replace("\"", "") != "null" ? arr[m]["BocCardNo"].ToString().Replace("\"", "") : "";
                string FamilyAdress = arr[m]["FamilyAdress"] + "";
                string FamilyPhone = arr[m]["FamilyPhone"] + "";

                string PersonalPhone = arr[m]["PersonalPhone"] + "";
                string PersonalAddress = arr[m]["PersonalAddress"] + "";
                string ConsortName = arr[m]["ConsortName"] + "";
                string ConsortPhone = arr[m]["ConsortPhone"] + "";
                string ConsortAddress = arr[m]["ConsortAddress"] + "";
                string ParentName = arr[m]["ParentName"] + "";
                string ParentPhone = arr[m]["ParentPhone"] + "";
                string ParentAddress = arr[m]["ParentAddress"] + "";
                string KinName = arr[m]["KinName"] + "";
                string KinPhone = arr[m]["KinPhone"] + "";
                string KinAddress = arr[m]["KinAddress"] + "";

                //if (TrainPriod != "" || CoatSize != "" || ShirtSize != "" || TrousersSize != "" 
                   // || SkirtSize != "" || ShoesSize != "" || Height != 0 || Weight != 0)
                //{
                    string str = @"update iEmployee set ModifyDate = getDate(),ModifyID='" + userID + "', TrainPriod ='" + TrainPriod + "',CoatSize='" + CoatSize + "',ShirtSize='" + ShirtSize +
                                    "',TrousersSize='" + TrousersSize + "',SkirtSize='" + SkirtSize + "',ShoesSize='" + ShoesSize + "',Mobile='"+tel+"'"+
                                    ",Rank='" + Rank + "'"+
                                    ",Height='" + Height + "',Weight='" + Weight +
                                        "',CommCardNo='" + CommCardNo + "'" +
                                        ",CmbCardNo='" + CmbCardNo +"'"+
                                        ",BocCardNo='" + BocCardNo + "'" +
                                        ",FamilyAdress='" + FamilyAdress +"'"+
                                        ",FamilyPhone='" + FamilyPhone + "'" +

                                        ",PersonalPhone='" + PersonalPhone + "'" +
                                        ",PersonalAddress='" + PersonalAddress + "'" +
                                        ",ConsortName='" + ConsortName + "'" +
                                        ",ConsortPhone='" + ConsortPhone + "'" +
                                        ",ConsortAddress='" + ConsortAddress + "'" +
                                        ",ParentName='" + ParentName + "'" +
                                        ",ParentPhone='" + ParentPhone + "'" +
                                        ",ParentAddress='" + ParentAddress + "'" +
                                        ",KinName='" + KinName + "'" +
                                        ",KinPhone='" + KinPhone + "'" +
                                        ",KinAddress='" + KinAddress + "'" +
                                    " where id = "+ID+";";
                    sql += str;
                //}
            }
            int ok = kqgl.ExecuteNoneQuery(sql);
            string msg = "{results:true}";
            Response.Write(msg);
            Response.End();
        }
    }
}