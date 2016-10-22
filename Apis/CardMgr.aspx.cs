using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;
using System.Xml;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using BeautyInterface;
using System.Drawing;
using Newtonsoft;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

using System.Web.Script.Serialization;

namespace BeautyPointWeb.Apis
{
    public partial class CardMgr : AuthBasePage
    {
        BllApi.CardMgr kgl = new BllApi.CardMgr();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                string json = string.Empty;
                switch (ActionName)
                {
                    case "Search":
                        json = GetSeach();
                        break;
                    case "SearchById":
                        json = GetSeachById();
                        break;
                    case "GethCardById":
                        json = GethCardById();
                        break;
                    case "Update":
                        json = UpdateBySql();
                        break;
                    case "GetJob":
                        json = GetJob();
                        break;
                    case "UpdateCardStatus":
                        json = UpdateCardStatus();
                        break;
                    case "UpdatePwd":
                        json = UpdatePwd();
                        break;
                    case "GetVCode":
                        json = GetVCode();
                        break;
                    case "JMForGetVCode":
                        json = JMForGetVCode();
                        break;
                    case "JudgeVCode":
                        json = JudgeVCode();
                        break;
                    case "GetVCodes":
                        json = GetVCodes();
                        break;
                    case "queryUnlockedCard"://查询未锁卡
                        QueryLockCard();
                        break;
                    case "queryUnlockedCardJck"://查询未锁卡
                        QueryLockCardJck();
                        break;
                    case "lockCard"://锁卡
                        LockCard();
                        break;
                    case "unLockCard"://解锁卡
                        UnLockCard();
                        break;
                    case "queryCard":
                        QueryCard();
                        break;
                    case "queryCardDetail":
                        QueryCardDetail();
                        break;
                    case "queryHistoryCardDetail":
                        queryHistoryCardDetail();
                        break;
                    case "getDept":
                        GetDept();
                        break;
                    case"getType":
                        GetType();
                        break;
                    case "queryBillImage":
                        json = QueryBillImage();
                        break;
                    case "queryAllBillImages":
                        json = QueryAllBillImages();
                        break;
                    case "queryNextBillImages":
                        json = QueryNextBillImages();
                        break;
                    case "queryPreBillImages":
                        json = QueryPreBillImages();
                        break;
                    case "queryLastBillImages":
                        json = QueryLastBillImages();
                        break;
                    case "cleanSessionAndPic":
                        json = CleanSessionAndPic();
                        break;
                    case "clearPic":
                        json = ClearPic();
                        break;
                    case "queryJckCardsResults":
                        queryJckCardsResults();
                        break;
                    case "createPic":
                        CreatePic();
                        break;

                    case "getServiceHistoryById":
                        json = this.GetServiceHistoryById();
                        break;

                    case "addServiceHistory":
                        json = this.AddServiceHistory();
                        break;
                    case "deleteServiceHistoryItem":
                        json = this.deleteServiceHistoryItem();
                        break;
                    case "getExtendHireInfoById":
                        json = this.GetExtendHireInfoById();
                        break;
                    case "getExtendFaceInfoById":
                        json = this.GetExtendFaceInfoById();
                        break;
                        //getExtendFaceInfoById
                    case "balanceQuery":
                        balanceQuery();
                        break;
                }

                Response.Write(json);
                Response.End();
            }
        }

        private BllApi.BaseApi basebll = new BllApi.BaseApi();

        /// <summary>
        ///  锁计次卡
        /// </summary>
        /// <param name="cardid"></param>
        /// <param name="cardids"></param>
        private void LockJck(int cardid, string cardIdsStr, string MemoInfos)
        {
            // 1、更新 iJckInfo 中的表
            // 2、更新 iCard 表 IsLocked = 1 
            // 3、插入 日志表
            String[] cardIDs = cardIdsStr.Split(';');
            String sql = @"insert into hLockCardLog(CreateDate,CreateID,ModifyDate,ModifyID,IsDeleted,CardID,CardNo,LockDate,
                                    BeforeMemoInfo,AfterMemoInfo,BeforeCardStatus,LockType, LockUserID,CardTypeID,JckInfoID) ";
            String values = "";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                for (int i = 0; i < cardIDs.Length; i++)
                {
                    if (!string.IsNullOrEmpty(cardIDs[i]) && !"".Equals(cardIDs[i]))
                    {
                        values = "select getDate()," + CurrentUser.Id + ",getDate()," + CurrentUser.Id
                            + ",0,ID,Code,getdate(),'" + cardIDs[i] + "','" + cardIDs[i] + "',status,0," + CurrentUser.Id + ",CardTypeID ,"
                        + cardIDs[i] + " from iCard  where IsDeleted=0 and ID=" + cardid;
                        db.ExecuteNoneQuery(sql + values);
                        //更新卡
                        db.ExecuteNoneQuery("update iJckInfo set IsDeleted=1 ,modifyDate=getdate(),modifyID=" + CurrentUser.Id +
                            " where ID=" + cardIDs[i]);
                        //更新icard标示  查询解锁时 使用
                        db.ExecuteNoneQuery("update iCard set Batch='LOCK' ,MemoInfo='" + MemoInfos + "',modifyDate=getdate(),modifyID=" + CurrentUser.Id +
                            " where ID=" + cardid);
                    }
                }
                db.Commit();
            }
            ReturnResultJson("true", "锁卡成功！");
        }
        /// <summary>
        ///  解锁次卡
        /// </summary>
        /// <param name="cardid"></param>
        /// <param name="cardids"></param>
        private void UnLockJck(int cardid, string cardIdsStr)
        {
            // 1、更新 iJckInfo 中的表
            // 2、更新 iCard 表 IsLocked = 1 
            // 3、插入 日志表
            String[] cardIDs = cardIdsStr.Split(';');
            String sql = @"insert into hLockCardLog(CreateDate,CreateID,ModifyDate,ModifyID,IsDeleted,CardID,CardNo,LockDate,
                                    BeforeMemoInfo,AfterMemoInfo,BeforeCardStatus,LockType, LockUserID,CardTypeID,JckInfoID) ";
            String values = "";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                foreach (string id in cardIDs)
                {
                    if (!string.IsNullOrEmpty(id) && !"".Equals(id))
                    {
                        values = "select getDate()," + CurrentUser.Id + ",getDate()," + CurrentUser.Id
                            + ",0,ID,Code,getdate(),'','',status,1," + CurrentUser.Id + ",CardTypeID ,"
                        + id + " from iCard  where IsDeleted=0 and ID=" + cardid;
                        db.ExecuteNoneQuery(sql + values);
                        //更新卡
                        db.ExecuteNoneQuery("update iJckInfo set IsDeleted=0 ,modifyDate=getdate(),modifyID=" + CurrentUser.Id +
                            " where ID=" + id);
                    }
                }
                //判断是否要将icard表 islocked 状态改为0，未锁定任何套盒
                object obj = db.ExecuteScalar("select count(*) from iJckInfo where IsDeleted=1 and CardID=" + cardid);
                if (Convert.ToInt32(obj) == 0)
                {
                    db.ExecuteNoneQuery("update iCard set ModifyDate=getdate(),modifyID="+CurrentUser.Id +",Batch='' where ID=" + cardid);
                }
                db.Commit();
            }
            ReturnResultJson("true", "解锁卡成功！");
        }
        

        /// <summary>
        ///  锁卡操作
        /// </summary>
        private void LockCard()
        {
            String cardIdsStr = Request["CardIDs"].Substring(0, Request["CardIDs"].Length-1);
            string cardid = "";//如果带cardid 说明是计次卡
            string MemoInfos = Request["MemoInfos"];
            string OldMemoInfos = Request["OldMemoInfos"];

            if (!string.IsNullOrEmpty(Request["CardID"]))
            {
                cardid = Request["CardID"];
                LockJck(Convert.ToInt32(cardid), cardIdsStr, MemoInfos);
                return;
            }
            Newtonsoft.Json.Linq.JArray MemoInfoArr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(MemoInfos);
            Newtonsoft.Json.Linq.JArray OldMemoInfoArr = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(OldMemoInfos);
            String[] cardIDs = cardIdsStr.Split(';');
            String sql = @"insert into hLockCardLog(CreateDate,CreateID,ModifyDate,ModifyID,IsDeleted,CardID,CardNo,LockDate,
                                    BeforeMemoInfo,AfterMemoInfo,BeforeCardStatus,LockType, LockUserID,CardTypeID) ";
            String values = "";
            string  MemoInfoi = "";
            string OldMemoInfoi = "";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                for (int i = 0; i < cardIDs.Length; i++)
                {
                    MemoInfoi = (MemoInfoArr[i]["MemoInfo"].ToString()).Replace("\'","\'\'").Replace("\\\"","\"");
                    if (!string.IsNullOrEmpty(MemoInfoi) && MemoInfoi.Length>=2) 
                    {
                        MemoInfoi = MemoInfoi.Substring(1, MemoInfoi.Length - 2);
                    }
                    OldMemoInfoi = (OldMemoInfoArr[i]["OldMemoInfo"].ToString()).Replace("\'", "\'\'").Replace("\\\"", "\"");
                    if (!string.IsNullOrEmpty(OldMemoInfoi) && OldMemoInfoi.Length >= 2)
                    {
                        OldMemoInfoi = OldMemoInfoi.Substring(1, OldMemoInfoi.Length - 2);
                    }
                    
                    if (!string.IsNullOrEmpty(cardIDs[i]) && !"".Equals(cardIDs[i]))
                    {
                        values = "select getDate()," + CurrentUser.Id + ",getDate()," + CurrentUser.Id
                            + ",0,ID,Code,getdate(),'" + OldMemoInfoi +"','" + MemoInfoi + "',status,0," + CurrentUser.Id + ",CardTypeID from iCard where IsDeleted=0 and ID=" + cardIDs[i];
                        db.ExecuteNoneQuery(sql + values);
                        //更新卡
                        db.ExecuteNoneQuery("update iCard set IsDeleted=1 ,modifyDate=getdate(),modifyID=" + CurrentUser.Id +
                            ",MemoInfo = '" + MemoInfoi + "' ,Status='销卡'  where ID=" + cardIDs[i]);
                    }
                }
                    //foreach (string id in cardIDs)
                    //{
                        
                    //}
                db.Commit();
            }
            ReturnResultJson("true", "锁卡成功！");
        }
        /// <summary>
        ///  解锁操作
        /// </summary>
        private void UnLockCard()
        {
            String cardIdsStr = Request["CardIDs"].Substring(0, Request["CardIDs"].Length - 1);
            String[] cardIDs = cardIdsStr.Split(';');
            string cardid = "";//如果带cardid 说明是计次卡
            if (!string.IsNullOrEmpty(Request["CardID"]))
            {
                cardid = Request["CardID"];
                UnLockJck(Convert.ToInt32(cardid), cardIdsStr);
                return;
            }

            String sql = @"insert into hLockCardLog(CreateDate,CreateID,ModifyDate,ModifyID,IsDeleted,CardID,CardNo,LockDate,
                                    BeforeMemoInfo,AfterMemoInfo,BeforeCardStatus,LockType, LockUserID,CardTypeID) ";
            String values = "";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                foreach (string id in cardIDs)
                {
                    if (!string.IsNullOrEmpty(id) && !"".Equals(id))
                    {
                        //更新卡
                        //找到原来锁卡前的备注/状态 如果找不到 锁定卡的记录 说明这张卡没有锁定，不需要解锁
                        int IsDeleted =Convert.ToInt32(db.ExecuteScalar(@"select IsDeleted from iCard where ID = "+id));
                        if (IsDeleted==1)
                        {
                            values = "select getDate()," + CurrentUser.Id + ",getDate()," + CurrentUser.Id
                                + ",0,ID,Code,getdate(),'','',status,1," + CurrentUser.Id + ",CardTypeID from iCard where IsDeleted=1 and ID=" + id;
                            db.ExecuteNoneQuery(sql + values);

                            db.ExecuteNoneQuery("update iCard set IsDeleted=0 ,modifyDate=getdate(),modifyID=" + CurrentUser.Id +
                                " ,Status='正常'  where ID=" + id);
                        }
                    }
                }
                db.Commit();
            }
            ReturnResultJson("true", "解锁卡成功！");
        }

        /// <summary>
        ///  查询计次卡的套盒，根据卡ID来查询
        /// </summary>
        private void QueryLockCardJck()
        {
            string cardID = Request["CardID"];

        }

        /// <summary>
        ///  根据卡号 查询 计次卡 套盒信息
        /// </summary>
        /// <param name="queryType">1:未锁定的卡</param>
        /// <param name="cardid"></param>
        private void QueryJck(int queryType, int cardid)
        {
            string sql = @"select a.CardID, a.ID as JckInfoID,a.JckTypeID,b.Code,b.Title ,a.RemainCount ,a.TotalCount,a.CardID
                                        from iJckInfo a,iJckType b
                                        where a.JckTypeID = b.ID
                                        and a.CardID=" + cardid;
            if (queryType == 1)
            {
                sql += " and a.IsDeleted = 0 ";
            }
            else
            {
                sql += " and a.IsDeleted = 1 ";
            }
            DataTable dt = new DataTable();
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                dt = db.ExecuteQuery(sql);
            }
             
            string msg = "{totalCount:" + 0 + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";

            Response.Write(msg);
            Response.End();
        }
        /// <summary>
        ///  查询 未锁定的卡
        /// </summary>
        private void QueryLockCard()
        {
            string msg = "";
            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]);
            //1:查询未锁的卡，2：查询 已经锁定的卡
            int queryType = Convert.ToInt32(Request["queryType"]);

            String cardID = Request["cardID"];
            if (!String.IsNullOrEmpty(cardID))
            {
                QueryJck(queryType, Convert.ToInt32(cardID));
                return;
            }
            //查询参数
            int TypeId = 0;
            if (Request["TypeId"] != "")
            {
                TypeId = Convert.ToInt32(Request["TypeId"]);
            }
            string cardStatus = Request["CardStatus"];
            string cardNoBegin = Request["CardNoBegin"].Trim();
            string cardNoEnd = Request["CardNoEnd"].Trim();

            String sql = @"select a.ID as CardID,d.Title as DeptName,c.Title as CardTypeName,a.code as CardNo,a.Status,c.Code as CardTypeCode
                                        ,a.MemoInfo,a.MemoInfo as OldMemoInfo
                                        from icard a ,icustomer b,
                                        icardtype c,idept d
                                        where a.cardtypeid=c.id
                                        and a.customerid=b.id
                                        and a.deptid = d.id ";
            if (queryType == 1)
            {
                sql += " and a.isdeleted=0 ";
            }
            else
            {
                sql += " and (a.isdeleted=1 or a.Batch='LOCK')  ";
            }
            Hashtable prams = new Hashtable();
            if (TypeId != 0)
            {
                sql += " and c.Id =@TypeId ";
                prams.Add("@TypeId", TypeId);
                
            }
            if (!string.IsNullOrEmpty(cardStatus) && !"全部".Equals(cardStatus))
            {
                sql += " and a.status =@cardStatus ";
                prams.Add("@cardStatus", cardStatus);
            }
            if (!string.IsNullOrEmpty(cardNoBegin) && !string.IsNullOrEmpty(cardNoEnd))
            {
                sql += " and a.Code >=@cardNoBegin";
                prams.Add("@cardNoBegin", cardNoBegin);
                sql += " and a.Code <=@cardNoEnd";
                prams.Add("@cardNoEnd", cardNoEnd);
            }
            else if (!string.IsNullOrEmpty(cardNoBegin))
            {
                sql += " and a.Code =@cardNoBegin";
                prams.Add("@cardNoBegin", cardNoBegin);
            }
            else if (!string.IsNullOrEmpty(cardNoEnd))
            {
                sql += " and a.Code =@cardNoEnd";
                prams.Add("@cardNoEnd", cardNoEnd);
            }
            else
            {
                msg = "{totalCount:0,results:[{msg:'请至少输入一个卡号！'}]}";
                Response.Write(msg);
                Response.End();
            }
            int totalCount = basebll.GetCount(sql, prams);
            DataTable dt = basebll.GetPageData(sql, "order by CardNo", start + 1, limit, prams);

            sql = "";

            msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";

            Response.Write(msg);
            Response.End();
        }
        /// <summary>
        /// 查卡
        /// </summary>
        private void QueryCard()
        {
            string msg = "";
            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]);
            //查询参数
            
            int TypeId = 0;
            if (Request["TypeId"] != "")
            {
                TypeId = Convert.ToInt32(Request["TypeId"]);
            }
            string cardStatus = Request["CardStatus"];
            string cardNoBegin = Request["CardNoBegin"].Trim();
            string cardNoEnd = Request["CardNoEnd"].Trim();

            String sql = @"select a.ID as CardID,a.code as CardNo,a.Status,d.Title as DeptName,a.Balance
                                        ,a.MemoInfo,a.IsDeleted  
                                        from icard a ,icustomer b,
                                        icardtype c,idept d 
                                        where a.cardtypeid=c.id
                                        and a.customerid=b.id and a.deptid = d.id";
            Hashtable prams = new Hashtable();
            
            if (TypeId != 0)
            {
                sql += " and c.Id =@TypeId ";
                prams.Add("@TypeId", TypeId);

            }
            if (!string.IsNullOrEmpty(cardStatus) && !"全部".Equals(cardStatus))
            {
                sql += " and a.status =@cardStatus ";
                prams.Add("@cardStatus", cardStatus);
            }
            if (!string.IsNullOrEmpty(cardNoBegin) && !string.IsNullOrEmpty(cardNoEnd))
            {
                sql += " and a.Code >=@cardNoBegin";
                prams.Add("@cardNoBegin", cardNoBegin);
                sql += " and a.Code <=@cardNoEnd";
                prams.Add("@cardNoEnd", cardNoEnd);
            }
            else if (!string.IsNullOrEmpty(cardNoBegin))
            {
                sql += " and a.Code =@cardNoBegin";
                prams.Add("@cardNoBegin", cardNoBegin);
            }
            else if (!string.IsNullOrEmpty(cardNoEnd))
            {
                sql += " and a.Code =@cardNoEnd";
                prams.Add("@cardNoEnd", cardNoEnd);
            }
            else
            {
                msg = "{totalCount:0,results:[{msg:'请至少输入一个卡号！'}]}";
                Response.Write(msg);
                Response.End();
            }
            int totalCount = basebll.GetCount(sql, prams);
            DataTable dt = basebll.GetPageData(sql, "order by CardNo", start + 1, limit, prams);

            sql = "";

            msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";

            Response.Write(msg);
            Response.End();
        }
        /// <summary>
        /// 修改客户密码
        /// </summary>
        /// <returns></returns>
        private string UpdatePwd()
        {
            string VCode = Request["VCode"];
            string Code = Request["Code"].ToString();
            string newpwd = Request["NewPwd"].ToString();
            string secretpwd = BllApi.EncrptionHelper.GetSecretPwd(newpwd);
            Hashtable parms = new Hashtable();
            parms.Add("@Code", Code);
            string pwd = (kgl.Scalar(string.Format("select password from icard where code=@Code"), parms)).ToString();
            string sql = string.Format("update icard set ModifyDate=getDate(),ModifyId={0},PassWord=@PassWord,SecretPassword=@SecretPwd where Code=@Code", CurrentUser.Id);
            parms.Add("@PassWord", newpwd);
            parms.Add("@SecretPwd",secretpwd);
            int result = kgl.ExecuteNoneQuery(sql, parms);
            string msg = string.Empty;
            if (result > 0)
            {
                this.InsertLog(Code, "{\"name\":\"PassWord\",\"values\":[\"" + pwd + "\",\"" + newpwd + "\"]}",VCode);
                msg = "{success:true,msg:'修改成功！'}";
            }
            else
            {
                msg = "{failure:true,msg:'修改失败！'}";
            }
            return msg;
        }

        /// <summary>
        /// 更新客户卡状态
        /// </summary>
        /// <returns></returns>
        private string UpdateCardStatus()
        {
            string id = Request["ID"];
            string CardCodeNo = Request["CardCodeNo"];
            string status = Request["status"].ToString();//从前台获取到的消息
            string VCode = Request["VCode"];
            string msg = string.Empty;//返回消息
            string sql = string.Empty;
            Hashtable prams = new Hashtable();
            prams.Add("@Code", CardCodeNo);
            sql = string.Format("select Status from icard where Code=@Code", CardCodeNo);
            Object obj = kgl.Scalar(sql, prams);//从数据库获取原始状态
            if (obj == null)
            {
                msg = "{failure:true,msg:'更新失败！'}";
            }
            else
            {
                if (!obj.ToString().Equals("挂失") && !obj.ToString().Equals("正常"))
                {
                    msg = "{failure:true,msg:'此卡已经" + obj.ToString() + "'}";
                }
                else
                {
                    if (obj.ToString().Equals(status))
                    {
                        msg = "{failure:true,msg:'此卡已经" + status + "'}";
                    }
                    else
                    {
                        prams.Add("@Status", status);
                        sql = string.Format("update icard set Status=@Status,ModifyDate=getDate(),ModifyID={0} where Code=@Code", CurrentUser.Id);
                        int result = kgl.ExecuteNoneQuery(sql, prams);
                        if (result > 0)
                        {
                            this.InsertLog(CardCodeNo, "{\"name\":\"Status\",\"values\":[\"" + obj.ToString() + "\",\"" + status + "\"]}", VCode);
                            msg = "{success:true,msg:'提交成功！'}";
                        }
                        else
                        {
                            msg = "{failure:true,msg:'提交失败！'}";
                        }
                    }
                }
            }
            return msg;
        }

        /// <summary>
        /// 通过 Customer Id 搜索信息(CodeInfo，KeHuInfo)
        /// </summary>
        /// <returns></returns>
        private string GetSeachById()
        {
            string sql = string.Empty;
            string id = Request["ID"].ToString();
            string type = Request["type"].ToString();
            Hashtable prams = new Hashtable();
            prams.Add("@Id",id);
            if (type.Equals("CodeInfo"))
            {
                sql = @"select CreateDate,Status,Balance,Arrear,Code,CONVERT(varchar(100), PublishDate , 23) as PublishDate,
                            CONVERT(varchar(100), LastConsumeDate , 23) as LastConsumeDate ,PaySum,(PaySum - Balance) as UsedSum,(select title from icardtype where id=icard.CardTypeID) as 'CardType',MemoInfo,
                            (select AllowChangeCustomer from icardtype where id=icard.CardTypeID) as 'AllowChangeCustomer'
                            from icard where ISDeleted=0 and CustomerID=@Id";
            }
            else if (type.Equals("KeHuInfo"))
            {
                sql = @"select CreateDate,Title as CustomerName,Email,Sex,Tel,Mobile,
                        case IsFace
                        when 0 then '是'
                        when 1 then '否'
                        end as IsFace,FaceInfo,
                        case IsHair
                        when 0 then '是'
                        when 1 then '否'
                        end as IsHair,HairInfo,ID as CustomerId,
                        (select Title from iCustomerProfessional where ID=CustomerProfessionalID) as CustomerWork,IdNo,Address,CONVERT(varchar(100), Birthday , 23) as Birthday,ZipCode,MemoInfo
                        from iCustomer where ISDeleted=0 and ID=@Id";
            }

            if (type.Equals("ServiceHistory"))
            {
                sql = @"select Isnull(ServcieHisory,'[]')  from iCustomer where ISDeleted=0 and ID=@Id ";
            }
            
            
            DataTable dt = kgl.GetAll(sql,prams);
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            return json;
        }

        private string GetExtendHireInfoById() 
        {
            string sql = string.Empty;
            string id = Request["id"].ToString();


            Hashtable prams = new Hashtable();
            prams.Add("@Id", id);

            sql = @"select Isnull(ExtendHireInfo,'[]')  from iCustomer where ISDeleted=0 and ID=@Id ";


            String str = kgl.Scalar(sql, prams) + "";
            return str;
        }

        private string GetExtendFaceInfoById() 
        {
            string sql = string.Empty;
            string id = Request["id"].ToString();


            Hashtable prams = new Hashtable();
            prams.Add("@Id", id);

            sql = @"select Isnull(ExtendFaceInfo,'[]')  from iCustomer where ISDeleted=0 and ID=@Id ";


            String str = kgl.Scalar(sql, prams) + "";
            return str;
        }

        
        
        private string GetServiceHistoryById()
        {
            string sql = string.Empty;
            string id = Request["ID"].ToString();
            

            Hashtable prams = new Hashtable();
            prams.Add("@Id", id);

            sql = @"select Isnull(ServcieHisory,'[]')  from iCustomer where ISDeleted=0 and ID=@Id ";
           
            
            String strHistory = kgl.Scalar(sql, prams)+"";
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<ServiceHistory> list = serializer.Deserialize<List<ServiceHistory>>(strHistory);
            for (int i = 0; i < list.Count; i++) 
            {
                ServiceHistory item = list[i];
                if (!String.IsNullOrEmpty(item.CreateID) && item.CreateID.Equals(CurrentUser.Id + "")) 
                {
                    item.DeleteEnable = true;
                    list[i] = item;
                }
            }
            //string json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(list);
            
            json = "{\"results\":" + json + "}";
            return json;
        }

        private string deleteServiceHistoryItem() 
        {
            string result = string.Empty;
            string customerId = Request["customerId"].ToString();
            string recordId = Request["recordId"].ToString();
            Hashtable prams = new Hashtable();
            prams.Add("@Id", customerId);

            String sql = @"select Isnull(ServcieHisory,'[]')  from iCustomer where ISDeleted=0 and ID=@Id ";
            String strHistory = kgl.Scalar(sql, prams) + "";
            DataTable dt = convertJsonToTable(strHistory);
            DataRow dr = dt.Rows.Find(recordId);
            if (dr != null) 
            {
                dt.Rows.Remove(dr);
            }
            sql = @"update iCustomer set ServcieHisory=@ServcieHisory where ID=@Id";
            prams.Add("@ServcieHisory", Newtonsoft.Json.JsonConvert.SerializeObject(dt));
            kgl.UpdateBySql(sql, prams);
            result = "{success:true,msg:'删除成功！'}";

            return result;

        }
        private String AddServiceHistory(){
            string result = string.Empty;
            try
            {
                ServiceHistory his = new ServiceHistory();
                string id = Request["ID"].ToString();
                Hashtable prams = new Hashtable();
                prams.Add("@Id", id);

                String sql = @"select Isnull(ServcieHisory,'[]')  from iCustomer where ISDeleted=0 and ID=@Id ";
                String strHistory = kgl.Scalar(sql, prams) + "";
                DataTable dt = convertJsonToTable(strHistory);
                DataRow dr = dt.NewRow();
                TimeSpan ts = DateTime.Now.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0);
                dr["ID"] = Convert.ToInt64(ts.TotalSeconds);
                dr["ServiceDate"] = Request["serviceDate"].ToString();
                dr["ServiceName"] = Request["serviceName"].ToString();
                dr["MasterName"] = Request["masterName"].ToString();
                dr["Effect"] = Request["effect"].ToString();
                dr["CreateID"] = CurrentUser.Id;
                dt.Rows.Add(dr);

                sql = @"update iCustomer set ServcieHisory=@ServcieHisory where ID=@Id";
                prams.Add("@ServcieHisory", Newtonsoft.Json.JsonConvert.SerializeObject(dt));
                kgl.UpdateBySql(sql, prams);
                result = "{success:true,msg:'保存成功！'}";

            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        private DatasetServiceHistory.ServiceHistoryDataTable convertJsonToTable(String json) 
        {
            DatasetServiceHistory ds = new DatasetServiceHistory();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<ServiceHistory> list = serializer.Deserialize<List<ServiceHistory>>(json);
            for (int i = 0; i < list.Count; i++)
            {
                DataRow dr = ds.ServiceHistory.NewRow();
                dr["ID"] = list[i].id;
                dr["ServiceDate"] = list[i].ServiceDate;
                dr["ServiceName"] = list[i].ServiceName;
                dr["MasterName"] = list[i].MasterName;
                dr["Effect"] = list[i].Effect;
                dr["CreateID"] = list[i].CreateID;
                ds.ServiceHistory.Rows.Add(dr);
            }

            return ds.ServiceHistory;
        }
        private struct ServiceHistory
        {
            public String id;
            public String ServiceDate;
            public String MasterName;
            public String ServiceName;
            public String Effect;
            public String CreateID;
            public bool deleteEnable;

            public bool DeleteEnable 
            {
                set { this.deleteEnable = value; }
                get { return this.deleteEnable ; }

            }

        }

        /// <summary>
        /// 通过 sql 搜索部份信息
        /// </summary>
        /// <returns></returns>
        private string GetSeach()
        {
            string start = Request["start"];
            int limit = Convert.ToInt32(Request["limit"]);

            string sql = string.Format(@"SELECT  top {0}  a.Id as CardId,b.Id as CustomerId,a.Code as Code, b.Title as EmpName,b.Tel as EmpTel,b.Mobile as EmpMobile,b.ID 
                                                                    FROM iCard a INNER JOIN iCustomer b ON a.CustomerID = b.ID 
                                                                    WHERE a.IsDeleted=0 and a.Status<>'未启用' ", 30);

            string SeachType = Request["SearchType"];
            string SeachText = Request["SearchText"];

            #region
            string cs = string.Empty;
            switch (SeachType)
            {
                case "卡号":
                    sql += string.Format(" and b.ID not in (select top {0} ID from iCustomer where Code='{1}'  order by id) and a.Code ='{1}'", start, SeachText);
                    cs = "a.Code='" + SeachText + "'";
                    break;
                case "客户姓名":
                    sql += string.Format(" and b.ID not in (select top {0} ID from iCustomer where Title='{1}'  order by id) and b.Title ='{1}'", start, SeachText);
                    cs = "b.Title='" + SeachText + "'";
                    break;
                case "电话":
                    sql += string.Format(" and b.ID not in (select top {0} ID from iCustomer where Tel='{1}'  order by id) and b.Tel ='{1}'", start, SeachText);
                    cs = "b.Tel='" + SeachText + "'";
                    break;
                case "手机":
                    sql += string.Format(" and b.ID not in (select top {0} ID from iCustomer where Mobile='{1}'  order by id) and b.Mobile ='{1}'", start, SeachText);
                    cs = "b.Mobile='" + SeachText + "'";
                    break;
            }
            #endregion
            sql += "  order by b.id";

            DataTable dt = kgl.GetAll(sql);

            string json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            int count = Convert.ToInt32(kgl.Scalar(string.Format("select count(*) from iCard a,iCustomer b where a.CustomerID = b.ID  and a.IsDeleted=0  and a.Status<>'未启用' and {0}", cs), null).ToString());
            json = "{totalCount:'" + count + "',results:" + json + "}";
            return json;
        }

        /// <summary>
        /// 通过 sql 获取卡消费信息
        /// </summary>
        /// <returns></returns>
        private string GethCardById()
        {
            string json = string.Empty;
            if (Request["id"] != null)
            {
                string id = Request["id"];
                Hashtable prams = new Hashtable();
                prams.Add("@Id",id);

                string sql = string.Format(@"select CardNo,CardType,CONVERT(varchar(100), BillDate , 23) as BillDate ,case BillType
                            when 'A' then '充值'
                            when 'B' then '从老系统导入'
                            when 'F' then '修正'
                            when 'L' then '售卡'
                            when 'S' then '服务'
                            when 'P' then '产品'
                            when 'H' then '换卡'
                            end as BillType,DetailCode,DetailName,
                            Price,Quantity,Amount,Rebate,MasterName,AsstName
                            from hcard where CardNo=(select code from icard where CustomerID=@Id )and RefDeptID={0}",  CurrentSession.DeptID);

               
                DataTable dt = kgl.GetAll(sql,prams);

                json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                json = "{results:" + json + "}";
            }
            return json;
        }

        /// <summary>
        /// 通过 sql 更新
        /// </summary>
        /// <returns></returns>
        private string UpdateBySql()
        {
            string result = string.Empty;
            try
            {
                string sql = string.Empty;
                Hashtable parms = new Hashtable();
                string VCode = Request["VCode"];
                string KeHuEdit = Request["KeHuEdit"];
                string CodeInfoMemoInfo = Request["CodeInfoMemoInfo"];
                string code = Request["code"].ToString();
                string hireInfo = Request["HireInfo"].ToString();
                string faceInfo = Request["FaceInfo"].ToString();

                int CustomerId = Convert.ToInt32(Request["CustomerId"]);
                //获取修改客户信息的sql
                if (KeHuEdit.Trim().Length > 0 || !String.IsNullOrEmpty(hireInfo) || !String.IsNullOrEmpty(faceInfo))
                {
                    #region
                    string CustomerName = Request["CustomerName"];
                    string Email = Request["Email"];
                    string Sex = Request["Sex"];
                    if (Sex.Trim().Length > 0)
                    {
                        parms.Add("@Sex", Sex);
                        Sex = string.Format("Sex = @Sex,");
                    }
                    else
                    {
                        Sex = "";
                    }
                    string Tel = Request["Tel"].ToString();
                    string Mobile = Request["Mobile"].ToString();
                    string IsFace = Request["IsFace"].ToString();
                    if (IsFace == "是")
                    {
                        IsFace = string.Format("IsFace = {0},", 0);
                    }
                    else if (IsFace == "否")
                    {
                        IsFace = string.Format("IsFace = {0},", 1);
                    }
                    else
                    {
                        IsFace = string.Format("IsFace = {0},", "NULL");
                    }
                    string FaceInfo = Request["FaceInfo"].ToString();
                    string IsHair = Request["IsHair"].ToString();
                    if (IsHair == "是")
                    {
                        IsHair = string.Format("IsHair = {0},", 0);
                    }
                    else if (IsHair == "否")
                    {
                        IsHair = string.Format("IsHair = {0},", 1);
                    }
                    else
                    {
                        IsHair = string.Format("IsHair ={0},", "NULL");
                    }
                    string HairInfo = Request["HairInfo"].ToString();
                    string CustomerWork = Request["CustomerWork"].ToString();
                    if (CustomerWork.Trim().Length > 0)
                    {
                        parms.Add("@CustomerWork", CustomerWork);
                        CustomerWork = string.Format("CustomerProfessionalID = (select ID from iCustomerProfessional where Title=@CustomerWork),", CustomerWork);
                    }
                    else
                    {
                        CustomerWork = "";
                    }
                    string IdNo = Request["IdNo"].ToString();
                    string Address = Request["Address"].ToString();
                    string Birthday = Request["Birthday"].ToString();
                    if (Birthday.Trim().Length > 0)
                    {
                        parms.Add("@Birthday", Birthday);
                        Birthday = string.Format("Birthday = @Birthday,");
                    }
                    else
                    {
                        Birthday = "";
                    }
                    string ZipCode = Request["ZipCode"].ToString();
                    string MemoInfo = Request["MemoInfo"].ToString();
                    #endregion
                    #region sql
                    sql += string.Format(@"update iCustomer
                                            set Title=@Title,--客户姓名
                                            Email = @Email,--电子邮件
                                            {0}--性别
                                            {1}--客户职业
                                            Tel = @Tel,--联系电话
                                            {2}--是否签订美容合同
                                            Mobile =@Mobile,--手机号码
                                            FaceInfo =@FaceInfo,--美容合同备注
                                            IdNo = @IdNo,--身份证号码
                                            {3}--是否签订美发合同
                                            Address = @Address,--地址
                                            HairInfo = @HairInfo,--美发合同备注
                                            ZipCode = @ZipCode, --邮编
                                            MemoInfo = @KeHuMemoInfo, --备注
                                            {4}--出生年月
                                            ExtendHireInfo = @HireInfo, --邮编
                                            ExtendFaceInfo = @FaceExtendInfo, --邮编
                                            ModifyDate=getdate(),ModifyId=@ModifyId
                                        where id=@Id", Sex, CustomerWork, IsFace, IsHair, Birthday);
                    #endregion
                    #region parms
                    parms.Add("@Title", CustomerName);
                    parms.Add("@Email", Email);
                    parms.Add("@Tel", Tel);
                    parms.Add("@Mobile", Mobile);
                    parms.Add("@FaceInfo", FaceInfo);
                    parms.Add("@IdNo", IdNo);
                    parms.Add("@Address", Address);
                    parms.Add("@HairInfo", HairInfo);
                    parms.Add("@ZipCode", ZipCode);
                    parms.Add("@KeHuMemoInfo", MemoInfo);
                    parms.Add("@ModifyId", CurrentUser.Id);
                    parms.Add("@HireInfo", hireInfo);
                    parms.Add("@FaceExtendInfo", faceInfo);
                    parms.Add("@Id", CustomerId);
                    #endregion
                }
                //获取修改卡信息的sql
                if (CodeInfoMemoInfo.Trim().Length > 0)
                {
                    string codebz = Request["codebz"];
                    parms.Add("@CodeMemoInfo", codebz);
                    parms.Add("@CodeModifyId", CurrentUser.Id);
                    parms.Add(@"Code",code);
                    sql += string.Format(" ; update Icard set MemoInfo=@CodeMemoInfo,ModifyDate=getdate(),ModifyId=@CodeModifyId where Code=@Code");
                }


                //int i = kgl.ExecuteNoneQuery(sql, parms);
                int i = 0;
                if (KeHuEdit.Trim().Length > 0 || hireInfo.Trim().Length > 0 || faceInfo.Trim().Length > 0)
                {
                    i = this.InsertLog(CustomerId, KeHuEdit,VCode);
                }
                if (CodeInfoMemoInfo.Trim().Length > 0)
                {
                    i = this.InsertLog(code, CodeInfoMemoInfo, VCode);
                }
                if (i > 0)
                {
                    i = kgl.UpdateBySql(sql, parms);
                    if (i > 0)
                    {
                        result = "{success:true,msg:'保存成功！'}";
                    }
                    else
                    {
                        result = "{failure:true,msg:'保存失败！'}";
                    }
                }
                else
                {
                    result = "{failure:true,msg:'保存失败！'}";
                }

                parms.Clear();
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        /// <summary>
        /// 获取所有职业
        /// </summary>
        /// <returns></returns>
        private string GetJob()
        {
            string sql = "select ID,Title from iCustomerProfessional where ISDeleted=0";

            DataTable dt = kgl.GetAll(sql);
            int count = dt.Rows.Count;
            string arraystring = string.Empty;
            for (int i = 0; i < count; i++)
            {
                arraystring += string.Format("[{0},'{1}']", Convert.ToInt32(dt.Rows[i][0]), dt.Rows[i][1].ToString());
                if (i < count - 1)
                {
                    arraystring += ",";
                }
            }
            arraystring = "[" + arraystring + "]";
            return arraystring;
        }

        /// <summary>
        /// 添加日志（修改ICard时）
        /// </summary>
        /// <param name="CodeNo">通过卡号添加Log</param>
        private int InsertLog(string CodeNo, string editstring, string VCode)
        {
            string sql = string.Format("select * from icard where Code='{0}'", CodeNo);
            DataTable dt = kgl.GetAll(sql);
            Hashtable parms = new Hashtable();
            editstring = "[" + editstring + "]";
            #region
            int UserType = CurrentUser.UserType;
            int CardID = Convert.ToInt32(dt.Rows[0]["ID"]);
            DateTime CreateDate = DateTime.Now;
            int CreateID = CurrentUser.Id;
            DateTime ModifyDate = Convert.ToDateTime(dt.Rows[0]["ModifyDate"]);
            int ModiFyId = Convert.ToInt32(dt.Rows[0]["ModiFyId"]);
            int IsDeleted = Convert.ToInt32(dt.Rows[0]["IsDeleted"]);
            object Code = dt.Rows[0]["Code"];
            string Title = dt.Rows[0]["Title"].ToString();
            string Batch = dt.Rows[0]["Batch"].ToString();
            int DeptID = Convert.ToInt32(dt.Rows[0]["DeptID"]);
            int CardTypeID = Convert.ToInt32(dt.Rows[0]["CardTypeID"]);
            int CustomerID = Convert.ToInt32(dt.Rows[0]["CustomerID"]);
            DateTime PublishDate = DateTime.Now;
            if (dt.Rows[0]["PublishDate"] != null && dt.Rows[0]["PublishDate"].ToString() != "")
            {
                PublishDate = Convert.ToDateTime(dt.Rows[0]["PublishDate"]);
            }
            object LastConsumeDate = "";
            if (dt.Rows[0]["LastConsumeDate"] == null || string.IsNullOrEmpty(dt.Rows[0]["LastConsumeDate"].ToString()))
            {
                LastConsumeDate = "";
            }
            else
            {
                LastConsumeDate = Convert.ToDateTime(dt.Rows[0]["LastConsumeDate"]);
            }
            string PaySum = dt.Rows[0]["PaySum"].ToString();
            if (PaySum == null || string.IsNullOrEmpty(PaySum))
            {
                PaySum = "";
                parms.Add("@PaySum", 0.00);
            }
            else
            {
                parms.Add("@PaySum", Convert.ToDouble(PaySum));
            }
            string Balance = dt.Rows[0]["Balance"].ToString();
            if (Balance == null || string.IsNullOrEmpty(Balance))
            {
                Balance = "";
                parms.Add("@Balance", 0.00);
            }
            else
            {
                parms.Add("@Balance", Convert.ToDouble(Balance));
            }
            string Arrear = dt.Rows[0]["Arrear"].ToString();
            if (Arrear == null || string.IsNullOrEmpty(Arrear))
            {
                Arrear = "";
                parms.Add("@Arrear", 0.00);
            }
            else
            {
                parms.Add("@Arrear", Convert.ToDouble(Arrear));
            }
            if (VCode == null)
            {
                VCode = "";
            }
            parms.Add("@VCode", VCode);
            string Password = dt.Rows[0]["Password"].ToString();
            string Status = dt.Rows[0]["Status"].ToString();
            string MemoInfo = dt.Rows[0]["MemoInfo"].ToString();
            #endregion

            sql = string.Format(@"INSERT INTO iCardLog
                               (Changes,[CardID],[CreateDate],[CreateID],ModifyDate,[ModiFyId],[IsDeleted],[Code],[Title],[Batch],[DeptID],[CardTypeID],[CustomerID],[PublishDate]
                               ,[LastConsumeDate],[PaySum],[Balance],[Arrear],[Password] ,[Status],[MemoInfo],UserType,VCode)
                               VALUES
                               (@Changes,@CardID,@CreateDate,@CreateID,@ModifyDate,@ModiFyId,@IsDeleted,@Code,@Title,@Batch,@DeptID,
                                @CardTypeID,@CustomerID,@PublishDate,@LastConsumeDate,@PaySum,@Balance,@Arrear,@Password,@Status,@MemoInfo,@UserType,@VCode)");
            #region parms
            parms.Add("@UserType", UserType);
            parms.Add("@Changes", editstring);
            parms.Add("@ModifyDate", ModifyDate);
            parms.Add("@CardID", CardID);
            parms.Add("@CreateDate", CreateDate);
            parms.Add("@CreateID", CreateID);
            parms.Add("@ModiFyId", ModiFyId);
            parms.Add("@IsDeleted", IsDeleted);
            parms.Add("@Code", Code);
            parms.Add("@Title", Title);
            parms.Add("@Batch", Batch);
            parms.Add("@DeptID", DeptID);
            parms.Add("@CardTypeID", CardTypeID);
            parms.Add("@CustomerID", CustomerID);
            parms.Add("@PublishDate", PublishDate);
            parms.Add("@LastConsumeDate", LastConsumeDate);
            parms.Add("@Password", Password);
            parms.Add("@Status", Status);
            parms.Add("@MemoInfo", MemoInfo);
            #endregion
            return kgl.InsertLog(sql, parms);
        }

        /// <summary>
        /// 添加日志（修改ICustomer时）
        /// </summary>
        /// <param name="Id">通过用户ID添加Log</param>
        private int InsertLog(int Id, string editstring, string VCode)
        {
            editstring = "[" + editstring + "]";
            string sql = string.Format("select * from icustomer where id={0}", Id);
            DataTable dt = kgl.GetAll(sql);
            #region
            int UserType = CurrentUser.UserType;
            int CustomerID = Convert.ToInt32(dt.Rows[0]["ID"]);
            string CreateDate = DateTime.Now.ToString();
            string CreateID = CurrentUser.Id.ToString();
            string ModifyDate = dt.Rows[0]["ModifyDate"].ToString();
            string ModifyID = dt.Rows[0]["ModifyID"].ToString();
            string IsDeleted = dt.Rows[0]["IsDeleted"].ToString();
            string DeptID = dt.Rows[0]["DeptID"].ToString();
            string Code = dt.Rows[0]["Code"].ToString();
            string Title = dt.Rows[0]["Title"].ToString();
            string Tel = dt.Rows[0]["Tel"].ToString();
            string Mobile = dt.Rows[0]["Mobile"].ToString();
            string IdNo = dt.Rows[0]["IdNo"].ToString();
            string Address = dt.Rows[0]["Address"].ToString();
            string Birthday = dt.Rows[0]["Birthday"].ToString();
            string Email = dt.Rows[0]["Email"].ToString();
            string MemoInfo = dt.Rows[0]["MemoInfo"].ToString();
            string ZipCode = dt.Rows[0]["ZipCode"].ToString();
            string Sex = dt.Rows[0]["Sex"].ToString();
            string CustomerProfessionalID = dt.Rows[0]["CustomerProfessionalID"].ToString();
            string IsFace = dt.Rows[0]["IsFace"].ToString();
            string FaceInfo = dt.Rows[0]["FaceInfo"].ToString();
            string IsHair = dt.Rows[0]["IsHair"].ToString();
            string HairInfo = dt.Rows[0]["HairInfo"].ToString();
            #endregion



            sql = string.Format(@"INSERT INTO [iCustomerLog]
                               ([Changes],[CustomerID],[CreateDate],[CreateID],[ModifyDate],[ModifyID],[IsDeleted],[DeptID],[Code],[Title]
                               ,[Tel],[Mobile],[IdNo],[Address],[Birthday],[Email],[MemoInfo],[ZipCode],[Sex],[CustomerProfessionalID]
                               ,[IsFace],[FaceInfo],[IsHair],[HairInfo],UserType,VCode)
                                VALUES
                               (@Changes,@CustomerID,@CreateDate,@CreateID,@ModifyDate,@ModifyID,@IsDeleted,@DeptID,@Code,
                                @Title,@Tel,@Mobile,@IdNo,@Address,@Birthday,@Email,@MemoInfo,@ZipCode,@Sex,@CustomerProfessionalID,
                                @IsFace,@FaceInfo,@IsHair,@HairInfo,@UserType,@VCode)");

            #region Hashtable
            Hashtable parms = new Hashtable();
            parms.Add("@UserType", UserType);
            parms.Add("@Changes", editstring);
            parms.Add("@CustomerID", CustomerID);
            parms.Add("@CreateDate", CreateDate);
            parms.Add("@CreateID", CreateID);
            parms.Add("@ModifyDate", ModifyDate);
            parms.Add("@ModifyID", ModifyID);
            parms.Add("@IsDeleted", IsDeleted);
            parms.Add("@DeptID", DeptID);
            parms.Add("@Code", Code);
            parms.Add("@Title", Title);
            parms.Add("@Tel", Tel);
            parms.Add("@Mobile", Mobile);
            parms.Add("@IdNo", IdNo);
            parms.Add("@Address", Address);
            parms.Add("@Birthday", Birthday);
            parms.Add("@Email", Email);
            parms.Add("@MemoInfo", MemoInfo);
            parms.Add("@ZipCode", ZipCode);
            parms.Add("@Sex", Sex);
            parms.Add("@CustomerProfessionalID", CustomerProfessionalID);
            parms.Add("@IsFace", IsFace);
            parms.Add("@FaceInfo", FaceInfo);
            parms.Add("@IsHair", IsHair);
            parms.Add("@HairInfo", HairInfo);
            if (VCode == null)
            {
                VCode = "";
            }
            parms.Add("@VCode", VCode);
            #endregion

            return kgl.InsertLog(sql, parms);
        }

        /// <summary>
        /// 生成 卡信息修改验证码
        /// </summary>
        /// <returns></returns>
        private string GetVCode()
        {
            string result = string.Empty;
            try
            {
                string DeptId = Request["DeptId"];
                result = kgl.GetVCode(DeptId, CurrentUser.Id);
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:'" + ex.Message + "'}";
            }
            return result;
        }

        /// <summary>
        /// 判断此卡是不是当天创建
        /// </summary>
        /// <returns></returns>
        private string JMForGetVCode()
        {
            string result = string.Empty;
            try
            {
                string CardId = Request["CardId"];
                string CustomerId = Request["CustomerId"];
                string sql = "select PublishDate from iCard where IsDeleted=0 and Id=@CardId";
                Hashtable prams = new Hashtable();
                prams.Add("@CardId", CardId);
                object obj = kgl.Scalar(sql, prams);
                if (obj == null || obj.ToString()=="")
                {
                    return "{success:true,ok:false,msg:'不是今日创建的卡'}";
                }
                else
                {
                    DateTime dt = (DateTime)obj;
                    if (dt.ToString("yyyy-MM-dd") == DateTime.Now.ToString("yyyy-MM-dd"))
                    {
                        return "{success:true,ok:true,msg:'今日创建的卡'}";
                    }
                    else
                    {
                        return "{success:true,ok:false,msg:'不是今日创建的卡'}";
                    }
                }
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        /// <summary>
        /// 判断验证码输入是否正确
        /// </summary>
        /// <returns></returns>
        private string JudgeVCode()
        {
            string result = string.Empty;
            string sql = string.Empty;
            try
            {
                string VCode = Request["VCode"];

                //去数据库拉取数据
                sql = string.Format(@"select Id,VCode,Used,CreateDate from iOnlineCode 
                                      where IsDeleted=0 and DeptId={0}", CurrentUser.DeptID);
                DataTable dt = kgl.GetPageData(sql, "order by Id desc", 1, 1);
                if (dt.Rows.Count > 0)
                {
                    string DataVCode = dt.Rows[0]["VCode"].ToString();
                    //判断用户输入与数据库的验证码是否相同
                    if (VCode.Equals(DataVCode))
                    {
                        string CreateDate = Convert.ToDateTime(dt.Rows[0]["CreateDate"]).ToString("yyyy-M-d");
                        string TodayDate = DateTime.Now.ToString("yyyy-M-d");
                        if (!CreateDate.Equals(TodayDate))
                        {
                            result = "{success:false,msg:'验证码已过期,请重新获取验证码！'}";
                        }
                        else if (dt.Rows[0]["Used"].ToString() != "0")
                        {
                            result = "{success:false,msg:'验证码已使用,请输入新验证码！'}";
                        }
                        else
                        {
                            //更新验证码状态
                            sql = string.Format("update iOnlineCode set Used=1,ModifyDate=getdate(),ModifyId={0} where IsDeleted=0 and Id={1}", CurrentUser.Id, dt.Rows[0]["ID"]);
                            int index = kgl.ExecuteNoneQuery(sql);
                            if (index > 0)
                            {
                                result = "{success:true,msg:true}";
                            }
                            else
                            {
                                result = "{success:false,msg:'更新失败！'}";
                            }
                        }
                    }
                    else
                    {
                        result = "{success:false,msg:'验证码输入错误,请重新输入！'}";
                    }
                }
                else
                {
                    result = "{success:false,msg:'验证码对比失败！'}";
                }
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\"" + ex.Message + "\"}";
            }
            return result;
        }

        /// <summary>
        /// 根据sql语句 获得卡信息修改验证码集合
        /// </summary>
        /// <returns></returns>
        private string GetVCodes()
        {
            string result = string.Empty;
            try
            {
                string DeptId = Request["DeptId"];
                string BeginDate = Request["BeginDate"];
                string EndDate = Request["EndDate"] + " 23:59:59.999";
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                //string sql = @"select Id,CreateDate,VCode,Used,VCodeType from iOnlineCode where IsDeleted=0 
                //             and CreateDate between @BeginDate and @EndDate";
                string sql = @"select a.Id,a.CreateDate,VCode,Used,b.Title as DeptName from iOnlineCode a,iDept b
                            where a.IsDeleted=0 and a.DeptId=b.Id and a.CreateDate between @BeginDate and @EndDate";
                Hashtable prams = new Hashtable();
                if (DeptId != null && !string.IsNullOrEmpty(DeptId))
                {
                    sql += " and DeptId=@DeptId";
                    prams.Add("@DeptId", DeptId);
                }
                prams.Add("@BeginDate",BeginDate);
                prams.Add("@EndDate", EndDate);
                DataTable dt = kgl.GetPageData(sql, "order by Id desc", start + 1, limit, prams);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                sql = @"select count(Id) from iOnlineCode where IsDeleted=0 and CreateDate between @BeginDate and @EndDate";
                if (DeptId != null && !string.IsNullOrEmpty(DeptId))
                {
                    prams.Remove("@DeptId");
                    sql += " and DeptId=@DeptId";
                    prams.Add("@DeptId", DeptId);
                }
                object count=kgl.Scalar(sql, prams);
                result = "{totalCount:" + count + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = "{success:false,msg:\""+ex.Message+"\"}";
            }
            return result;
        }

        private void QueryCardDetail()
        {
            string result = string.Empty;
            string payHistoryResult = string.Empty;
            string CardNo = (Request["CardCode"].Replace("'", "''"));
            Hashtable prams = new Hashtable();
            Hashtable payHistoryPrams = new Hashtable();
            string sql = "SELECT b.ID as cardID,a.Code,a.Title,a.Mobile,a.Tel,a.Address, CONVERT(varchar(100), Birthday , 23) as Birthday ,a.Email,a.IdNo,a.MemoInfo,b.Status "
                + " ,b.Code,b.CardTypeID,b.PaySum,b.Balance,(b.PaySum-b.Balance) as xiaofei,b.CardTypeID,c.Title, CONVERT(varchar(100), PublishDate , 23) as PublishDate,c.Code as cardTypeCode"
                + " FROM iCustomer a,iCard b,iCardType c"
                + " WHERE a.ID=b.CustomerID and b.CardTypeID = c.ID and b.Code = @CardNo";
            prams.Add("@CardNo", CardNo);
            payHistoryPrams.Add("@CardNo", CardNo);
            DataTable dt = kgl.GetAll(sql, prams);
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write("{customerResults:" + result + "}");
            Response.End();
        }

        private void queryJckCardsResults()
        {
            string result = string.Empty;
            string payHistoryResult = string.Empty;
            string CardID = (Request["cardID"].Replace("'", "''"));
            Hashtable prams = new Hashtable();
            Hashtable payHistoryPrams = new Hashtable();
            string sql = "select  a.id,a.jckTypeID,b.title as jcktypeTitle,a.RemainCount,a.TotalCount,a.SaleMoney,a.SingleCost,CONVERT(varchar(100), ExpireDate , 23) as ExpireDate  " +
                        " from ijckInfo a,ijcktype b "+
                        " where a.CardID = @CardID and a.IsDeleted = 0  and a.jckTypeID = b.id ";
            prams.Add("@CardID", CardID);
            payHistoryPrams.Add("@CardID", CardID);
            DataTable dt = kgl.GetAll(sql, prams);
            result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write("{jckResults:" + result + "}");
            Response.End();
        }

        private void queryHistoryCardDetail()
        {
            string payHistoryResult = string.Empty;
            string CardNo = Request["CardCode"];
            string SearchYear = DateTime.Today.Year.ToString();
            string SearchMonth = DateTime.Today.Month.ToString();
            Hashtable payHistoryPrams = new Hashtable();
            string payHistorySql = "SELECT * FROM hCard WHERE CardNo = @CardNo";
            string payHistoryCountSql = "select count(1) from hCard WHERE CardNo = @CardNo";
            payHistoryPrams.Add("@CardNo", CardNo);
            if (!string.IsNullOrEmpty(SearchYear))
            {
                payHistorySql += " and Year([BillDate]) = @Year";
                payHistoryCountSql += " and Year([BillDate]) = @Year";
                payHistoryPrams.Add("@Year", SearchYear);
            }
            if (!string.IsNullOrEmpty(SearchMonth))
            {
                payHistorySql += " and Month([BillDate]) = @Month";
                payHistoryCountSql += " and Month([BillDate]) = @Month";
                payHistoryPrams.Add("@Month", SearchMonth);
            }
            payHistorySql += "  ORDER BY BillDate";
            DataTable payHistorydt = kgl.GetAll(payHistorySql, payHistoryPrams);
            DataTable payHistorydtCount = kgl.GetCountBySql(payHistoryCountSql, payHistoryPrams);
            payHistoryResult = Newtonsoft.Json.JsonConvert.SerializeObject(payHistorydt);
            Response.Write("{payHistoryResults:" + payHistoryResult + ",totalCount:" + payHistorydtCount.Rows[0][0] + "}");
            Response.End();
        }
        //查询所有店铺id和名称
        private void GetDept()
        {
            Hashtable parms = new Hashtable();
            string sql = "";
            string dName = Request["dName"];
            if (!string.IsNullOrEmpty(dName))
            {
                parms.Add("@dName", dName);
                sql += "and Title like '%'+@dName+'%'";
            }
            DataTable dt = kgl.GetDept(sql, parms);
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(html);
            Response.End();

        }
        //查询卡类型
        private void GetType()
        {
            Hashtable parms = new Hashtable();
            string sql = "";
            string tName = Request["tName"];
            if (!string.IsNullOrEmpty(tName))
            {
                parms.Add("@tName", tName);
                sql += "and Title like '%'+@tName+'%'";
            }
            DataTable dt = kgl.GetCardType(sql, parms);
            string html = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            Response.Write(html);
            Response.End();
        }
        /// <summary>
        /// 查询单月图片
        /// </summary>
        private string QueryBillImage()
        {
            string CardNo = Request["CardCode"].ToString();
            int year = 0;
            if (Request["SearchYear"] != "")
            {
                year = Convert.ToInt32(Request["SearchYear"]);
            }
            int month = 0;
            if (Request["SearchMonth"] != "")
            {
                month = Convert.ToInt32(Request["SearchMonth"]);
            }
            Response.ClearContent();
            Response.ContentType = "image/Png";
            System.Drawing.Image img = Remote.GetCardHistory(CardNo, year, month);
            if (img == null)
            {
                return "{success:true,result:[{src:'',shortName:'图片浏览结束'}]}";
            }
            string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]);
            string filename = Guid.NewGuid() + ".png";
            img.Save(dirpath + "/" + filename);
            img.Dispose();
            return "{success:true,result:[{src:\"" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"] + filename + "\",shortName:''}]}";
        }
        /// <summary>
        /// 查询全部以及第一页按钮事件
        /// </summary>
        private string QueryAllBillImages()
        {
            string CardNo = Request["CardCode"].ToString();
            if (Request["PublishDate"] == "")
            {
                return "{success:true,result:[{src:'',shortName:'无月账单！'}]}";
            }
            DateTime PublishDate = Convert.ToDateTime(Request["PublishDate"]);
            DateTime dt = PublishDate;
            Response.ClearContent();
            Response.ContentType = "image/Png";
            System.Drawing.Image img = Remote.GetCardHistory(CardNo, dt.Year, dt.Month);
            if (img == null)
            {
                return "{success:true,result:[{src:'',shortName:'无月账单！'}]}";
            }
            Session["QueryTime"] = dt;
            string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]);
            string filename = Guid.NewGuid() + ".png";
            img.Save(dirpath + "/" + filename);
            img.Dispose();
            return "{success:true,result:[{src:\"" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"] + filename + "\",shortName:''}]}";
            
        }
        /// <summary>
        /// 下一页按钮事件
        /// </summary>
        private string QueryNextBillImages()
        {
            DateTime dtTime = DateTime.Now.AddMonths(-1);
            string CardNo = Request["CardCode"].ToString();
            DateTime dt = Convert.ToDateTime(Session["QueryTime"]);
            dt=dt.AddMonths(1);
            Response.ClearContent();
            Response.ContentType = "image/Png";
            System.Drawing.Image img = Remote.GetCardHistory(CardNo, dt.Year, dt.Month);
            Session["QueryTime"] = dt;
            if (img == null)
            {
                if (dt.Year == dtTime.Year && dt.Month == dtTime.Month)
                {
                    return "{success:true,result:[{src:'null',shortName:'月账单浏览结束'}]}";
                }
                return "{success:true,result:[{src:'',shortName:'" + dt.Year + "年" + dt.Month + "月无账单'}]}";
            }
            string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]);
            string filename = Guid.NewGuid() + ".png";
            img.Save(dirpath + "/" + filename);
            img.Dispose();
            return "{success:true,result:[{src:\"" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"] + filename + "\",shortName:''}]}";
        }
        /// <summary>
        /// 上一页按钮事件
        /// </summary>
        private string QueryPreBillImages()
        {
            string CardNo = Request["CardCode"].ToString();
            DateTime dt = Convert.ToDateTime(Session["QueryTime"]);
            DateTime PublishDate = Convert.ToDateTime(Request["PublishDate"]);
            dt=dt.AddMonths(-1);
            Response.ClearContent();
            Response.ContentType = "image/Png";
            System.Drawing.Image img = Remote.GetCardHistory(CardNo, dt.Year, dt.Month);
            Session["QueryTime"] = dt;
            if (img == null)
            {
                if (dt.Year == PublishDate.Year && dt.Month == PublishDate.Month)
                {
                    return "{success:true,result:[{src:'null',shortName:'月账单浏览结束'}]}";
                }
                return "{success:true,result:[{src:'',shortName:'" + dt.Year + "年" + dt.Month + "月无账单'}]}";
            }
            string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]);
            string filename = Guid.NewGuid() + ".png";
            img.Save(dirpath + "/" + filename);
            img.Dispose();
            return "{success:true,result:[{src:\"" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"] + filename + "\",shortName:''}]}";
            
        }
        /// <summary>
        /// 最后一页按钮事件
        /// </summary>
        private string QueryLastBillImages()
        {
            string CardNo = Request["CardCode"].ToString();
            DateTime dt = DateTime.Now.ToLocalTime();
            dt=dt.AddMonths(-1);
            Response.ClearContent();
            Response.ContentType = "image/Png";
            System.Drawing.Image img = Remote.GetCardHistory(CardNo, dt.Year, dt.Month);
            Session["QueryTime"] = dt;
            if (img == null)
            {
                return "{success:true,result:[{src:'',shortName:'上个月无账单<br/>请关闭窗口<br/>重新逐月查询！'}]}";
            }
            string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]);
            string filename = Guid.NewGuid() + ".png";
            img.Save(dirpath + "/" + filename);
            img.Dispose();
            return "{success:true,result:[{src:\"" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"] + filename + "\",shortName:''}]}";
        }
        /// <summary>
        /// 清空session
        /// </summary>
        /// <returns></returns>
        private string CleanSessionAndPic()
        {
            string result = string.Empty;
            Session.Clear();
            string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]);
            System.IO.DirectoryInfo path = new System.IO.DirectoryInfo(Server.MapPath("~/TempImg"));
            deletefile(path);
            result = "{success:true,msg:'成功清除session and 图片文件夹成功'}";
            return result;
        }
        /// <summary>
        /// 清空图片文件夹
        /// </summary>
        /// <returns></returns>
        private string ClearPic()
        {
            string result = string.Empty;
            string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]);
            System.IO.DirectoryInfo path = new System.IO.DirectoryInfo(Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]));
            deletefile(path);
            result = "{success:true,msg:'成功清除图片文件夹'}";
            return result;
        }
        /// <summary>
        /// 创建图片文件夹
        /// </summary>
        /// <returns></returns>
        private string CreatePic()
        {
            string result = string.Empty;
            string dirpath = Server.MapPath("~" + System.Configuration.ConfigurationSettings.AppSettings["TempImg"]);
            if (!Directory.Exists(dirpath))
            {
                Directory.CreateDirectory(dirpath);
            }
            result = "{success:true,msg:'成功创建图片文件夹'}";
            return result;
        }

        private void balanceQuery() 
        {
            string type = "1";
            string dName = "";

            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]);
            
            Hashtable prams = new Hashtable();

            if (!String.IsNullOrEmpty(Request["type"])) 
            {
                type = Request["type"];
            }

            if (!String.IsNullOrEmpty(Request["dName"]))
            {
                dName = Request["dName"];
            }
            string deptType = type == "1" ? "文峰" : "个体";
            string sql = "select * from rTempCard where IsDeleted=0 and DeptType=@DeptType";

            prams.Add("@DeptType", deptType);
            if (!String.IsNullOrEmpty(dName))
            {
                sql += " and DeptName=@DeptName";
                prams.Add("@DeptName", dName);
            }

            int totalCount = basebll.GetCount(sql, prams);
            
            DataTable dt = basebll.GetPageData(sql, "order by DeptName", start + 1, limit, prams);
            if (dt != null) 
            {
                dt.Columns.Add("DisplayBalance");
            }
            for (int i = 0; i < dt.Rows.Count; i++) 
            {
                DataRow dr = dt.Rows[i];
                if (dr["CardBalance"] != DBNull.Value) 
                {
                    dr["DisplayBalance"] = double.Parse(dr["CardBalance"].ToString()).ToString("C2").Replace("¥", "");
                }
            }
            String msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}";
            Response.Write(msg);
            Response.End();
            
        }

        private void deletefile(System.IO.DirectoryInfo path)
        {
            foreach (System.IO.DirectoryInfo d in path.GetDirectories())
            {
                deletefile(d);
            }
            foreach (System.IO.FileInfo f in path.GetFiles())
            {
                f.Delete();
            }
        }  
    }
}