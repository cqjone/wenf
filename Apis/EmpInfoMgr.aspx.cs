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
using System.IO;

namespace BeautyPointWeb.Apis
{
    public partial class EmpInfoMgr : AuthBasePage
    {
        private BllApi.AttendanceMgr kqgl = new BllApi.AttendanceMgr();
        private BllApi.Uploadfile upl = new BllApi.Uploadfile();
        private BllApi.BaseApi basebll = new BllApi.BaseApi();
        private string photoPath = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                photoPath= System.Configuration.ConfigurationSettings.AppSettings["photoPath"];

                string json = (string)this.inokeMethod(this.ActionName);
                Response.Write(json);
                Response.End();
            }
        }

        public string getNewEmpName()
        {
            string result = string.Empty;
            try
            {
                string Code = Request["Code"].Trim();
                DataTable dt = new DataTable();
                string sql = "";

                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(Code))
                {
                    sql = @"select * from iEmployee where Code=@Code and IsDeleted in (0,2) ";
                    prams.Add("@Code", Code);
                    dt = kqgl.GetAll(sql, prams);
                }
                result = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;



        }

        public string getEmpName()
        {
            string result = string.Empty;
            try
            {
                string Code = Request["Code"].Trim();
                DataTable dt = new DataTable();
                string sql = "";
                
                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(Code))
                {
                    sql = @"select top 1 a.ID,isnull(a.Title,'') as Title,c.Title as Dept,IdNo,Mobile,Sex,b.Title as Duty,Nvarchar1,Nvarchar2,Nvarchar3,Nvarchar4,PersonalAddress,FamilyPhone,FamilyAdress,Rank,TrainPriod,a.Tel,a.BaseWage,
                          isNull(DutyTypeID,0) as DutyTypeID ,DutyID,Height,Weight,CoatSize,TrousersSize,ShirtSize,SkirtSize,ShoesSize, CommCardNo,BocCardNo,CmbCardNo  
                           from iEmployee a left join iDuty b on a.DutyID=b.ID inner join iDept c on a.DeptID=c.ID
                        where a.Code = @Code and a.IsDeleted in (0,2)  ";
                    prams.Add("@Code", Code);
                    dt = kqgl.GetAll(sql, prams);
                }
                result = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
           

            
        }





        public string getNewQsData()
        {
            string result = string.Empty;

            try
            {
                string Code = Request["Code"].Trim();
                if (String.IsNullOrEmpty(Code))
                {
                    Code = Request["EmployeeCode"];
                }

                DataTable dt = new DataTable();
                string sql = "";

                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(Code))
                {
                    sql = @"select top 14 a.ID,Period from bEmpTrain  as a join iEmployee as b on a.EmpID=b.ID where b.Code=@Code  and b.IsDeleted in (0,2) ";
                    prams.Add("@Code", Code);
                    dt = kqgl.GetAll(sql, prams);
                    String empId = "";
                    DataTable dtEmp = kqgl.GetEmp(" and Code=@Code", prams);
                    if (dtEmp != null && dtEmp.Rows.Count > 0)
                    {
                        empId = dtEmp.Rows[1]["ID"].ToString();
                    }

                    int allcount = 0;
                    if (dt.Rows.Count < 14)
                    {
                        allcount = 14 - dt.Rows.Count;
                    }
                    if (allcount != 0)
                    {
                        for (int i = 0; i < allcount; i++)
                        {
                            string insertsql = @"INSERT INTO [bEmpTrain]
                                               ([CreateID]
                                               ,[CreateDate]
                                               ,[ModifyID]
                                               ,[ModifyDate]
                                               ,[IsDeleted]
                                               ,[Title]
                                               ,[EmpID]
                                               ,[TrainDate]
                                               ,[TrainScore]
                                               ,[IdNo]
                                               ,[SubjectNo]
                                               ,[SubjectName]
                                               ,[OrderIndex]
                                               ,[Period])
                                         VALUES
                                               (null
                                               ,GETDATE()
                                               ,null
                                               ,GetDate()
                                               ,0
                                               ,null
			                                    ," + empId+@"
                                               ,null
                                               ,null
                                               ,null
                                               ,null
                                               ,null
                                               ,null
                                               ,null)";
                            kqgl.ExecuteNoneQuery(insertsql,prams);
                        }
                        sql = @"select top 14 a.ID,Period from bEmpTrain  as a join iEmployee as b on a.EmpID=b.ID where b.Code=@Code  and b.IsDeleted in (0,2) ";
                        dt = kqgl.GetAll(sql, prams);
                    }
                    
                }
                result = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;

        }





        public string getNewDdData()
        {
            string result = string.Empty;

            try
            {
                string Code = Request["Code"].Trim();
                if (String.IsNullOrEmpty(Code)) 
                {
                    Code = Request["EmployeeCode"];
                }
                DataTable dt = new DataTable();
                string sql = "";

                Hashtable prams = new Hashtable();
                //if (String.IsNullOrEmpty(Code) ) 
                //{
                    
                //}

                if (!string.IsNullOrEmpty(Code))
                {
                   
                    sql = @"select top 10 a.ID,a.ToDept as Title,JoinDate ,LeaveDate ,a.Duty 
                            from bEmpFlow   as a join iEmployee as b on a.EmployeeID=b.ID
                            left join iDuty as d on d.ID=a.DutyID 
                            left join iDept as c on c.ID=a.ToDept
                            where b.Code=@Code  and b.IsDeleted in (0,2)";
                    prams.Add("@Code", Code);
                    String empId = "";
                    DataTable dtEmp = kqgl.GetEmp(" and Code=@Code", prams);
                    if (dtEmp != null && dtEmp.Rows.Count > 0) 
                    {
                        empId = dtEmp.Rows[1]["ID"].ToString();
                    }
                    dt = kqgl.GetAll(sql, prams);
                    int allcount = 0;
                    if (dt.Rows.Count < 10)
                    {
                        allcount = 10 - dt.Rows.Count;
                    }
                    if (allcount != 0)
                    {
                        for (int i = 0; i < allcount; i++)
                        {
                            string insertsql = @"INSERT INTO [bEmpFlow]
                                               ([EmpCode]
                                               ,[EmpName]
                                               ,[Type]
                                               ,[FromDept]
                                               ,[ToDept]
                                               ,[Days]
                                               ,[CreateDate]
                                               ,[CreateId]
                                               ,[FlowDate]
                                               ,[MemoInfo]
                                               ,[ModifyDate]
                                               ,[EmployeeID]
                                               ,[DutyID]
                                               ,[JoinDate]
                                               ,[LeaveDate]
                                               ,[Duty]   )
                                         VALUES
                                               (@Code
                                               ,@Code
                                               ,''
                                               ,null
                                               ,null
                                               ,null
                                               ,GETDATE()
                                               ,0
                                               ,null
                                               ,null
                                               ,GetDate()
                                               ,"+empId+@"
                                               ,null
                                               ,null
                                               ,null
                                               ,null)";
                            kqgl.ExecuteNoneQuery(insertsql,prams);
                        }
                        sql = @"select top 10 a.ID,c.Title,JoinDate ,LeaveDate ,d.Title 
                            from bEmpFlow   as a join iEmployee as b on a.EmployeeID=b.ID
                            left join iDuty as d on d.ID=a.DutyID 
                            left join iDept as c on c.ID=a.ToDept
                            where b.Code=@Code  and b.IsDeleted in (0,2)";
                        dt = kqgl.GetAll(sql, prams);
                    }
                }
                result = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        public string getNewRxData()
        {
            string result = string.Empty;

            try
            {
                string Code = Request["Code"];
                if (String.IsNullOrEmpty(Code))
                {
                    Code = Request["EmployeeCode"];
                }
                DataTable dt = new DataTable();
                string sql = "";

                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(Code))
                {
                    sql = @"select top 8 a.ID,ClassName,JoinDate,GraduateDate from bEmpEduList as a join iEmployee as b on a.EmpoyeeID=b.ID where b.Code=@Code  and b.IsDeleted in (0,2) ";
                    prams.Add("@Code", Code);
                    dt = kqgl.GetAll(sql, prams);
                    String empId = "";
                    DataTable dtEmp = kqgl.GetEmp(" and Code=@Code", prams);
                    if (dtEmp != null && dtEmp.Rows.Count > 0)
                    {
                        empId = dtEmp.Rows[01]["ID"].ToString();
                    }

                    int allcount = 0;
                    if (dt.Rows.Count < 8)
                    {
                        allcount = 8 - dt.Rows.Count;
                    }
                    if (allcount != 0)
                    {
                        for (int i = 0; i < allcount; i++)
                        {
                            string insertsql = @"INSERT INTO [bEmpEduList]
                                                ([CreateID]
                                               ,[CreateDate]
                                               ,[ModifyID]
                                               ,[ModifyDate]
                                               ,[IsDeleted]
                                               ,[ClassName]
                                               ,[EmpoyeeID]
                                               ,[JoinDate]
                                               ,[GraduateDate])
                                            VALUES
                                               (null
                                               ,GETDATE()
                                               ,null
                                               ,GetDate()
                                               ,0
                                               ,null
                                               ," + empId+@"
                                               ,null
                                               ,null)";
                            kqgl.ExecuteNoneQuery(insertsql, prams);
                        }
                        sql = @"select top 8 a.ID,ClassName,JoinDate,GraduateDate from bEmpEduList as a join iEmployee as b on a.EmpoyeeID=b.ID where b.Code=@Code  and b.IsDeleted in (0,2) ";
                        dt = kqgl.GetAll(sql, prams);
                    }
                }
                result = "{success:true,msg:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;


        }

        public string newUpload()
        {
            string result = string.Empty;
            string sql1 = "";
            string sql2 = "";
            string sql3 = "";
            try
            {
                

                String employeeCode = Request["EmployeeCode"];
                
                string Marriage = Request["Marriage"];
                string Nation = Request["Nation"];
                string Politics = Request["Politics"];
                string Nvarchar1 = Request["Nvarchar1"];
                string FamilyPhone = Request["FamilyPhone"];
                string PersonalAddress = Request["PersonalAddress"];
                string ConsortName = Request["ConsortName"];
                string ConsortPhone = Request["ConsortPhone"];
                string ConsortAddress = Request["ConsortAddress"];
                string ParentName = Request["ParentName"];
                string ParentPhone = Request["ParentPhone"];
                string ParentAddress = Request["ParentAddress"];
                string KinName = Request["KinName"];
                string KinPhone = Request["KinPhone"];
                string KinAddress = Request["KinAddress"];
                string syear = Request["syear"];
                string smonth = Request["smonth"];
                string eyear = Request["eyear"];
                string emonth = Request["emonth"];



                DateTime HireDate = DateTime.Parse(eyear + "-" + emonth);
                //DateTime FireDate = DateTime.Parse(eyear + "-" + emonth);
                string Height = Request["Height"];
                string Weight = Request["Weight"];
                string CoatSize = Request["CoatSize"];
                string TrousersSize = Request["TrousersSize"];
                string ShirtSize = Request["ShirtSize"];
                string SkirtSize = Request["SkirtSize"];
                string ShoesSize = Request["ShoesSize"];
                string CommCardNo = Request["CommCardNo"];
                string BocCardNo = Request["BocCardNo"];
                string CmbCardNo = Request["CmbCardNo"];
                string Sex = Request["Sex"];
                string Mobile = Request["Mobile"];
                string IdNo = Request["IdNo"];
                string Rank = Request["Rank"];
                string TrainPriod = Request["TrainPriod"];

                Hashtable parms = new Hashtable();

                parms.Add("@employeeCode", employeeCode);
                parms.Add("@Marriage", Marriage);
                parms.Add("@Nation", Nation);
                parms.Add("@Politics", Politics);


                parms.Add("@Nvarchar1", Nvarchar1);
                parms.Add("@FamilyPhone", FamilyPhone);
                parms.Add("@PersonalAddress", PersonalAddress);
                parms.Add("@ConsortName", ConsortName);
                parms.Add("@ConsortPhone", ConsortPhone);
                parms.Add("@ConsortAddress", ConsortAddress);
                parms.Add("@ParentName", ParentName);
                parms.Add("@ParentPhone", ParentPhone);
                parms.Add("@ParentAddress", ParentAddress);
                parms.Add("@KinName", KinName);
                parms.Add("@KinPhone", KinPhone);
                parms.Add("@KinAddress", KinAddress);
                parms.Add("@HireDate", HireDate);
                //parms.Add("@FireDate", FireDate);
                parms.Add("@Height", Height);
                parms.Add("@Weight", Weight);
                parms.Add("@CoatSize", CoatSize);
                parms.Add("@TrousersSize", TrousersSize);
                parms.Add("@ShirtSize", ShirtSize);
                parms.Add("@SkirtSize", SkirtSize);
                parms.Add("@ShoesSize", ShoesSize);
                parms.Add("@CommCardNo", CommCardNo);
                parms.Add("@BocCardNo", BocCardNo);
                parms.Add("@CmbCardNo", CmbCardNo);
                parms.Add("@Sex", Sex);
                parms.Add("@Mobile", Mobile);
                parms.Add("@IdNo", IdNo);
                parms.Add("@Rank", Rank);
                parms.Add("@eyear", eyear);
                parms.Add("@emonth", emonth);

                parms.Add("@syear", syear);
                parms.Add("@smonth", smonth);

                parms.Add("@TrainPriod", TrainPriod);
                string sql = @"  update iEmployee set ModifyDate = GetDate(), IsDeleted=0,  Marriage=@Marriage,Nation=@Nation,Politics=@Politics,Nvarchar1=@Nvarchar1,FamilyPhone=@FamilyPhone,PersonalAddress=@PersonalAddress,ConsortName=@ConsortName,
            ConsortPhone=@ConsortPhone,ConsortAddress=@ConsortAddress,ParentName=@ParentName,ParentPhone=@ParentPhone,ParentAddress=@ParentAddress,KinName=@KinName,KinPhone=@KinPhone,KinAddress=@KinAddress,
            HireDate=@HireDate,Height=@Height,Weight=@Weight,CoatSize=@CoatSize,TrousersSize=@TrousersSize,ShirtSize=@ShirtSize,SkirtSize=@SkirtSize,ShoesSize=@ShoesSize,
             eyear=@eyear,emonth=@emonth,syear=@syear,smonth=@smonth,
            CommCardNo=@CommCardNo,BocCardNo=@BocCardNo,CmbCardNo=@CmbCardNo,Sex=@Sex,Mobile=@Mobile,IdNo=@IdNo,Rank=@Rank,TrainPriod=@TrainPriod   
            where Code=@employeeCode and IsDeleted in (0,2)" ;
                int index = upl.ExecuteNonQuery(sql, parms);




                

                for (int i = 1; i <= 8; i++)
                {
                    sql1 = sql1 + "update bEmpEduList set ";
                    string ID = Request["xx" + i];
                    string rxy = Request["rxy" + i];
                    string rxm = Request["rxm" + i];
                    DateTime? JoinDate = null;
                    if (!string.IsNullOrEmpty(rxy) && !string.IsNullOrEmpty(rxm))
                    {
                        JoinDate = DateTime.Parse(rxy + "-" + rxm);
                        sql1 = sql1 + "JoinDate='" + JoinDate + "'";
                    }
                    string bxy = Request["bxy" + i];
                    string bxm = Request["bxm" + i];
                    DateTime? GraduateDate = null;
                    if (!string.IsNullOrEmpty(bxy) && !string.IsNullOrEmpty(bxm))
                    {
                        GraduateDate = DateTime.Parse(bxy + "-" + bxm);
                        if (JoinDate != null)
                        {
                            sql1 = sql1 + ",GraduateDate='" + GraduateDate + "'";
                        }
                        else
                        {
                            sql1 = sql1 + "GraduateDate='" + GraduateDate + "'";
                        }
                    }
                    string ClassName = Request["bj" + i];
                    if (JoinDate != null || GraduateDate != null)
                    {
                        sql1 = sql1 + ",ClassName='" + ClassName + "' where ID= " + ID + ";";
                    }
                    else
                    {
                        sql1 = sql1 + "ClassName='" + ClassName + "' where ID= " + ID + ";";
                    }
                }
                int index1 = upl.ExecuteNonQuery(sql1);







               
                for (int i = 1; i <= 14; i++)
                {
                    string ID = Request["tx" + i];
                    string Period = Request["px" + i];
                    sql2 = sql2 + "update bEmpTrain  set Period='" + Period + "' where ID=" + ID + ";";

                }
                int index2 = upl.ExecuteNonQuery(sql2);



               
                for (int i = 1; i <= 10; i++)
                {
                    sql3 = sql3 + "update bEmpFlow set ";
                    string ID = Request["dd" + i];
                    string rdy = Request["rdy" + i];
                    string rdm = Request["rdm" + i];
                    string zz = Request["zz" + i];
                    DateTime? JoinDate = null;
                    if (!string.IsNullOrEmpty(rdy) && !string.IsNullOrEmpty(rdm))
                    {
                        JoinDate = DateTime.Parse(rdy + "-" + rdm);
                        sql3 = sql3 + "JoinDate='" + JoinDate + "'";
                    }
                    string ldy = Request["ldy" + i];
                    string ldm = Request["ldm" + i];
                    DateTime? LeaveDate = null;
                    if (!string.IsNullOrEmpty(ldy) && !string.IsNullOrEmpty(ldm))
                    {
                        LeaveDate = DateTime.Parse(ldy + "-" + ldm);
                        if (JoinDate != null)
                        {
                            sql3 = sql3 + ",LeaveDate='" + LeaveDate + "'";
                        }
                        else
                        {
                            sql3 = sql3 + "GraduateDate='" + LeaveDate + "'";
                        }
                    }

                   
                    string ToDept = Request["DeptId" + i].Split(',')[0];

                    if (JoinDate != null || LeaveDate != null)
                    {
                        sql3 = sql3 + ",ToDept='" + ToDept + "' ";
                    }
                    else
                    {
                        sql3 = sql3 + "ToDept='" + ToDept + "' ";
                    }
                    string duty = Request["zz" + i];
                    if (ToDept != null || ToDept != null)
                    {
                        sql3 = sql3 + ",duty='" + duty + "' where ID= " + ID + ";";
                    }
                    else
                    {
                        sql3 = sql3 + "duty='" + duty + "' where ID= " + ID + ";";
                    }

                    
                   
                   


                    
                    
                }
                int index3 = upl.ExecuteNonQuery(sql3);
              




                if (index > 0)
                {

                    result = "{success:true,msg:'成功！'}";

                }
                else
                {
                    result = "{success:true,msg:'失败！'}";

                }
            }
            catch (Exception ex) 
            {
                Response.Write(ex.Message);
                result = "{success:true,msg:'"+sql1+"\r\n  "+sql2+"\r\n  "+sql3+"\r\n'}";
            }
          return result;
        }

        public string upload()
        {
            //IsScreenShot();
            string result = string.Empty;
            
          

            
            
                try
                {
                    String employeeCode = Request["EmployeeCode"];
                    String idno = Request["IdNo"]; 
                    String sex = Request["Sex"];
                    if (String.IsNullOrEmpty(employeeCode))
                    {
                        return "{failure:true,msg:'提交失败！员工编号不能为空'}";
                    }
                    else {

                        employeeCode = employeeCode.Trim();
                    }

                    if (String.IsNullOrEmpty(idno))
                    {
                        return "{failure:true,msg:'提交失败！身份证号码不能为空'}";
                    }
                    else 
                    {
                        if (idno.Length != 18) 
                        {
                            return "{failure:true,msg:'提交失败！身份证号码必须为18位'}";
                        }
                        String sexFlag = idno.Substring(16, 1);
						int sexNum = Int32.Parse(sexFlag);
                        String realSex = sexNum %2==1 ? "男" : "女";
                        if (sex != realSex) 
                        {
                            return "{failure:true,msg:'提交失败！性别与身份证号码第17位不符合'}";
                        }
                        DateTime outTime = DateTime.Now;
                        String birthday = idno.Substring(6, 4) + "-" + idno.Substring(10, 2) + "-" + idno.Substring(12, 2);

                        if (!DateTime.TryParse(birthday, out outTime)) 
                        {
                            return "{failure:true,msg:'提交失败！身份证号码生日有问题'}";
                        }
                        String sqlChk = "select top 1 * from iEmployee where IdNo='"+idno+"' and Code!='"+employeeCode+"' and IsDeleted in (0,2)";

                        Hashtable prams = new Hashtable();
                        prams.Add("@Code", employeeCode);
                        prams.Add("@IdNo", idno);
                        DataTable dt = kqgl.GetAll(sqlChk);
                        if (dt != null && dt.Rows.Count > 0) 
                        {
                            DataRow dr = dt.Rows[0];
                            return "{failure:true,msg:'提交失败！此身份证号与 <b>" + dr["Code"] + "</b>&nbsp;<b>" + dr["Title"] + "</b>&nbsp;身份证重复'}";
                        }

                    }

                    //String sql = "update iEmployee set Height=@Height,Weight=@Weight,CoatSize=@CoatSize,TrousersSize=@TrousersSize,ShirtSize=@ShirtSize,SkirtSize=@SkirtSize,ShoesSize=@ShoesSize where Code=@Code";
                    String sql = @"update iEmployee set IsDeleted=0,  Height=@Height,Weight=@Weight,CoatSize=@CoatSize,TrousersSize=@TrousersSize,ShirtSize=@ShirtSize,SkirtSize=@SkirtSize,ShoesSize=@ShoesSize,ModifyDate=@ModifyDate
                                ,IdNo=@IdNo,Mobile=@Mobile,Sex=@Sex,TrainPriod=@TrainPriod,Rank=@Rank,DutyID=@DutyID,Nvarchar1=@Nvarchar1,FamilyPhone=@FamilyPhone,FamilyAdress=@FamilyAdress,ModifyID=@ModifyID,
                                 CommCardNo=@CommCardNo,BocCardNo=@BocCardNo,CmbCardNo=@CmbCardNo 
                                 where Code=@Code and IsDeleted in (0,2)";
                                    
                                    
                    Hashtable parms = new Hashtable();
                    parms.Add("@Code", employeeCode);
                    parms.Add("@Height", Request["Height"]);
                    parms.Add("@Weight", Request["Weight"]);
                    parms.Add("@CoatSize", Request["CoatSize"]);
                    parms.Add("@TrousersSize", Request["TrousersSize"]);
                    parms.Add("@ShirtSize", Request["ShirtSize"]);
                    parms.Add("@SkirtSize", Request["SkirtSize"]);
                    parms.Add("@ShoesSize", Request["ShoesSize"]);

                    parms.Add("@TrainPriod", Request["TrainPriod"]);
                    
                    parms.Add("@IdNo", Request["IdNo"]);
                    parms.Add("@Mobile", Request["Mobile"]);
                    parms.Add("@Sex", Request["Sex"]);
                    parms.Add("@Rank", Request["Rank"]);
                    parms.Add("@DutyID", Request["DutyID"]);
                    //parms.Add("@DutyID", Request["RealDutyID"]);
                    
                    parms.Add("@Nvarchar1", Request["Nvarchar1"]);
                    parms.Add("@FamilyAdress", Request["FamilyAdress"]);
                    parms.Add("@FamilyPhone", Request["FamilyPhone"]);
                    parms.Add("@ModifyID", CurrentUser.Id);
                    parms.Add("@CommCardNo", Request["CommCardNo"]);
                    parms.Add("@BocCardNo", Request["BocCardNo"]);
                    parms.Add("@CmbCardNo", Request["CmbCardNo"]);
                    

                    parms.Add("@ModifyDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                    int index = upl.ExecuteNonQuery(sql, parms);

                    if (index>0 && Request.Files.Count > 0){
                        HttpPostedFile file = Request.Files["File"];


                        #region
                        if (file != null && file.ContentLength > 0)
                        {
                           // string SavePath = Server.MapPath("~/EmployeePhoto");
                            string SavePath = photoPath;
                            this.ToCreateFile(SavePath);//判断文件夹是否存在，如果不存在则创建文件夹

                            string filename = file.FileName.ToString();
                            if (filename.IndexOf(':') > 0)//用于判断不同的浏览器传过来的上传文件的路径
                            {
                                filename = filename.Substring(filename.LastIndexOf('\\') + 1);
                            }
                            if (filename.Substring(filename.LastIndexOf('.') + 1).ToLower() == "jpg" || filename.Substring(filename.LastIndexOf('.') + 1).ToLower() == "jpge")
                            {
                                //当文件为 jpg/jpge 图片类型时
                                filename = employeeCode + ".jpg";
                                #region
                                SavePath = SavePath + "\\" + filename;

                                file.SaveAs(SavePath);
                                #endregion
                            }
                            else
                            {
                                result = "{failure:true,msg:'上传失败！只能是jpg/jpge图片类型!'}";
                            }

                        }
                        #endregion
                    }
                    result = "{success:true,msg:'上传成功！'}";

                }
                catch (Exception ex)
                {
                    result = "{failure:true,msg:\"上传失败！" + ex.Message.ToString() + "\"}";
                }
                return result;
            
           

        }


        public string queryEmployee() 
        {
            
            String msg = "";
            Hashtable prams = new Hashtable();
            try
            {
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                //prams.Add("IsDeleted",0);
                String sql = @"select ID,Code as EmployeeCode,Title as EmployeeName,Height,Weight,CoatSize,TrousersSize,ShirtSize,SkirtSize,ShoesSize,
                                CommCardNo,BocCardNo,CmbCardNo,
                                '../EmployeePhoto/'+Code+'.jpg' as photo,ModifyDate from iEmployee
                                where IsDeleted in (0,2) and state in ('在岗','待报到') ";

                int totalCount = basebll.GetCount(sql, prams);

                DataTable dt = basebll.GetPageData(sql, "order by ModifyDate desc", start + 1, limit, prams);
                msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";

            }
            catch (Exception ex) 
            {
                Response.Write(ex.Message + "\r\n" + ex.StackTrace);
            }
            return msg;

            
        }
        
        private void ToCreateFile(string SavePath)
        {
            if (!Directory.Exists(SavePath))
            {
                Directory.CreateDirectory(SavePath);
            }
        }

       
    }
}
