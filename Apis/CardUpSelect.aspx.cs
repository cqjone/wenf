using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using System.Text.RegularExpressions;
using BllApi.Models;
using BllApi;

namespace BeautyPointWeb.Apis
{
    public partial class CardUpSelect : AuthBasePage
    {
        public Dictionary<String, String> DBColumns = new Dictionary<string, string>();

        protected void Page_Load(object sender, EventArgs e)
        {
            //字典映射 icardlog
            DBColumns.Add("MemoInfo","备注");

            //字典映射 icustomerlog
            DBColumns.Add("HairInfo", "美发合同备注");
            DBColumns.Add("IsHair", "是否签订美发合同");
            DBColumns.Add("FaceInfo", "美容合同备注");
            DBColumns.Add("IsFace", "是否签订美容合同");
            DBColumns.Add("Sex", "性别");
            DBColumns.Add("Email", "电子邮件");
            DBColumns.Add("Birthday", "出生年月");
            DBColumns.Add("Address", "地址");
            DBColumns.Add("Mobile", "手机号码");
            DBColumns.Add("Tel", "联系电话");
            DBColumns.Add("CustomerName", "客户姓名");
            DBColumns.Add("CustomerId", "客户编号");
            DBColumns.Add("CustomerWork", "客户职业");
            DBColumns.Add("IdNo", "身份证号码");
            DBColumns.Add("PassWord", "密码");
            DBColumns.Add("ZipCode", "邮编");
            switch (ActionName)
            {
                case "getInfo":
                    GetInfo();
                    break;
            }
        }
        /// <summary>
        /// 根据查询条件获取所需信息
        /// </summary>
        private void GetInfo()
        {
            Hashtable parms = new Hashtable();
            string Code = Request["code"];
            string StartTime = Convert.ToDateTime(Request["startTime"]).ToString("yyyy-MM-dd") + " 0:00:00";
            string EndTime = Convert.ToDateTime(Request["endTime"]).ToString("yyyy-MM-dd") + " 23:59:59";

            int start = Convert.ToInt32(Request["start"]);
            int limit = Convert.ToInt32(Request["limit"]) ;
            aUserApis auser = new aUserApis();
            string result = string.Empty;
            Int32 cardCount = 0;
            DataTable dtCardLog;
            if (!string.IsNullOrEmpty(Code))
            {
                parms.Add("@Code", Code);
                Code = "and a.Code like '%'+@Code+'%'";
            }
            if (!string.IsNullOrEmpty(StartTime))
            {
                parms.Add("@StartTime", StartTime);
                StartTime = "and a.CreateDate >= @StartTime ";
            }
            if (!string.IsNullOrEmpty(EndTime))
            {
                parms.Add("@EndTime", EndTime);
                EndTime = "and a.CreateDate <= @EndTime";
            }
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                string sqlCard = string.Format(@"select * from (select
                    CONVERT(varchar(100), a.CreateDate , 23) as CreateDate  ,b.username as LogName,b.realname as RealName,
			        '' as CardType ,'' as DeptTitle,a.Code,a.Changes
			        from icardlog a,auser b
			        where a.createid = b.id
			        and a.status = '未启用'
			        and a.isdeleted = 0 and b.isdeleted = 0
                    {0} {1} {2}
			        union all select 
                    CONVERT(varchar(100), a.CreateDate , 23) as CreateDate,b.username as LogName,b.realname as RealName,c.title as CardType ,d.title as DeptTitle,a.Code,a.Changes
                    from icardlog a,auser b,icardtype c,idept d
                    where a.createid=b.id
                    and a.cardtypeid=c.id
                    and b.deptid=d.id   and a.isdeleted=0 and d.isdeleted=0 and b.isdeleted=0
                    {0} {1} {2}  union all select 
                    CONVERT(varchar(100), a.CreateDate , 23) as CreateDate,b.username as LogName,b.realname as RealName,c.title as CardType ,d.title as DeptTitle,e.Code,a.Changes
                    from icustomerlog a,auser b,icardtype c,idept d,icard e
                    where a.createid=b.id and a.customerid=e.customerid
                    and e.cardtypeid=c.id and e.isdeleted=0
                    and b.deptid=d.id   and a.isdeleted=0 and d.isdeleted=0 and b.isdeleted=0
                    {0} {1} {2}) t", Code, StartTime, EndTime);

                string sqlCardCount = string.Format(@"select count(*) from (select 
            a.CreateDate,b.username,b.realname,c.title as CardType ,d.title as DeptTitle,a.Code,a.changes
            from icardlog a,auser b,icardtype c,idept d
            where a.createid=b.id
            and a.cardtypeid=c.id
            and b.deptid=d.id   and a.isdeleted=0 and d.isdeleted=0 and b.isdeleted=0
            {0} {1} {2}  union all select 
            a.CreateDate,b.username,b.realname,c.title as CardType ,d.title as DeptTitle,e.Code,a.changes
            from icustomerlog a,auser b,icardtype c,idept d,icard e
            where a.createid=b.id and a.customerid=e.customerid
            and e.cardtypeid=c.id and e.isdeleted=0
            and b.deptid=d.id   and a.isdeleted=0 and d.isdeleted=0 and b.isdeleted=0
            {0} {1} {2}) t", Code, StartTime, EndTime);

                dtCardLog = auser.GetPageData(sqlCard,"order by CreateDate desc",start + 1,limit,parms);
                cardCount = Convert.ToInt32(db.ExecuteScalar(sqlCardCount,parms));

                string Changes = "";

                for (int i = 0; i < dtCardLog.Rows.Count; i++)
                {
                    string ShowChanges = "";
                    Changes = dtCardLog.Rows[i]["Changes"].ToString();
                    List<LogItem> logList = Common.DeserializeLogItem(Changes);
                    for (int c = 0; c < logList.Count; c++)
                    {
                        for (int j = 0; j < logList[c].Values.Length; j++)
                        {
                            if (logList[c].Name == "IsFace" || logList[c].Name == "IsHair")
                            {
                                if (logList[c].Values[j] == "0")
                                {
                                    logList[c].Values[j] = "是";
                                }
                                else if (logList[c].Values[j] == "1")
                                {
                                    logList[c].Values[j] = "否";
                                }
                            }

                            else if (logList[c].Values[j] == "")
                            {
                                logList[c].Values[j] = "空";
                            }
                        }
                        //解析，根据关键字解析，如没有则为空格

                        if (DBColumns.ContainsKey(logList[c].Name))
                        {
                            ShowChanges += (DBColumns.ContainsKey(logList[c].Name) ? "【" + DBColumns[logList[c].Name] + "】" : "");
                            if (logList[c].Name.Equals("PassWord"))
                            {
                                ShowChanges += "由 ****** 改为 ******;";
                            }
                            else
                            {
                                ShowChanges += "由" + logList[c].Values[0] + "改为" + logList[c].Values[1] + "" + ";";
                            }
                        }
                        else
                        {
                            ShowChanges += "由" + logList[c].Values[0] + "改为" + logList[c].Values[1] + "" + ";";
                        }
                        //ShowChanges += (DBColumns.ContainsKey(logList[c].Name) ? "【" + DBColumns[logList[c].Name] + "】" : "")
                        //              + "由" + logList[c].Values[0] + "改为" + logList[c].Values[1] + "" + ";";
                    }
                    dtCardLog.Rows[i]["Changes"] = ShowChanges;
                }
            }

            result = Newtonsoft.Json.JsonConvert.SerializeObject(dtCardLog);
            result = "{totalCount:" + cardCount + ",results:" + result + "}";
            Response.Write(result);
            Response.End();
        }
     
    }
}