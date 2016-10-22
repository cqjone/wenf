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
    public partial class PriceMgr : AuthBasePage
    {
        BllApi.PriceMgr mybll = new BllApi.PriceMgr();
        protected void Page_Load(object sender, EventArgs e)
        {
            string result = string.Empty;
            switch (ActionName)
            { 
                case "search":
                    result=this.Search();
                    break;
                case "GNewEdit":
                    result = this.GNewEdit();
                    break;
                case "gpg_search":
                    result = this.Gpg_Search();
                    break;
                case "getPrice":
                    result = this.GetPrice();
                    break;
                case "getDept":
                    result = this.GetDept();
                    break;
                case "GDel":
                    result = this.GDel();
                    break;
                case "UdatePG":
                    result = this.UdatePG();
                    break;
                case "UdateGDept":
                    result = this.UdateGDept();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        //搜索价格组
        private string Search()
        {
            string result = string.Empty;
            try
            {
                string code = Request["code"];
                string name = Request["name"];

                Hashtable parms = new Hashtable();
                string sql = @"select Id,Code,Title,MemoInfo from iPriceGroup where IsDeleted=0 ";

                if (code != null && !string.IsNullOrEmpty(code))
                {
                    sql += " and code like '%'+@Code+'%' ";
                    parms.Add("@Code", code);
                }

                if (name != null && !string.IsNullOrEmpty(name))
                {
                    sql += " and Title like '%'+@Name+'%'";
                    parms.Add("@Name", name);
                }

                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);

                DataTable dt = mybll.GetPageData(sql, "order by Id", start+1,limit,parms);
                result=Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                result = string.Format("{{\"datacount\":{0},\"items\":{1}}}",dt.Rows.Count,result);
            }
            catch (Exception ex)
            {
                result = string.Format("{{success:false,msg:\"{0}\"}}", ex.Message); ;
            }
            return result;
        }

        //删除选定价格组
        private string GDel()
        {
            string result = string.Empty;
            try
            {
                string GroupId = Request["GroupId"];
                Hashtable prams = new Hashtable();
                prams.Add("@GroupId",GroupId);
                result = mybll.GDel(CurrentUser.Id, prams);
            }
            catch (Exception ex)
            {
                result = string.Format("{{success:false,msg:\"{0}\"}}",ex.Message);
            }
            return result;
        }

        //新增或修改价格组
        private string GNewEdit()
        {
            string result = string.Empty;
            try
            {
                string id = Request["Id"];
                string code = Request["GCode"];
                string name = Request["GName"];
                string memoinfo = Request["GMemoInfo"];
                string type = Request["type"];
                Hashtable parms = new Hashtable();

                parms.Add("@Code",code);
                parms.Add("@Title",name);
                parms.Add("@MemoInfo",memoinfo);
                parms.Add("@type", type);
                parms.Add("@Id",id);

                result=mybll.NewGroup(type,parms, CurrentUser.Id);

            }
            catch (Exception ex)
            {
                result=ex.Message.Replace("\"","'");
                result = "{success:false,msg:\""+result+"\"}";
            }
            return result;
        }

        //搜索服务/产品
        private string Gpg_Search()
        {
            string result = string.Empty;
            try
            {
                string type = Request["type"] == null ? "" : Request["type"];
                string code = Request["code"];
                string title = Request["title"];

                string sql = "select Id,Code,Title,Price from {0} where IsDeleted=0 ";
                Hashtable prams = new Hashtable();
                if (code != null && !string.IsNullOrEmpty(code))
                {
                    sql += " and code like '%'+@Code+'%' ";
                    prams.Add("@Code",code);
                }
                if (title != null && !string.IsNullOrEmpty(title))
                {
                    sql += " and title like '%'+@Title+'%' ";
                    prams.Add("@Title",title);
                }

                if (type.Equals("service"))
                {
                    sql = string.Format(sql,"iService");
                }
                else if (type.Equals("goods"))
                {
                    sql = string.Format(sql, "iProduct");
                }
                else
                {
                    result = "{success:false,msg:\"查询类型有误！\"}";
                    return result;
                }
                DataTable dt = mybll.ExecQuery(sql, prams);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = string.Format("{{success:false,msg:\"{0}\"}}",ex.Message);
            }
            return result;
        }

        //获得服务价格
        private string GetPrice()
        {
            string result = string.Empty;
            try
            {
                string type = Request["type"];
                string gid = Request["GroupId"];
                string sql = "";
                Hashtable prams=new Hashtable();
                prams.Add("@GroupId",gid);
                if (type.Equals("service"))
                {
                    sql = string.Format(@"select a.Id,a.ServiceId,b.Code,b.Title,a.LowPrice as Price
                            from iServicePrice a,iService b
                            where a.IsDeleted=0 and b.IsDeleted=0 and a.ServiceID=b.ID and GroupId=@GroupId");
                }
                else if (type.Equals("goods"))
                {
                    sql = string.Format(@"select a.Id,a.ProductId,b.Code,b.Title,a.LowPrice as Price
                            from iProductPrice a,iProduct b
                            where a.IsDeleted=0 and b.IsDeleted=0 and a.ProductID=b.ID and GroupId=@GroupId");
                }
                else
                {
                    result = "{success:false,msg:\"查询类型有误！\"}";
                    return result;
                }
                DataTable dt = mybll.ExecQuery(sql,prams);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);

            }
            catch (Exception ex)
            {
                result = string.Format("{{success:false,msg:\"{0}\"}}",ex.Message);
            }
            return result;
        }

        //获得门店
        private string GetDept()
        {
            string result = string.Empty;
            try
            {
                string type = Request["type"];
                string code = Request["code"];
                string title = Request["title"];
                string sql = "";
                Hashtable prams = new Hashtable();
                if (type.Equals("GDept"))
                {
                    string groupid = Request["GroupId"];
                    prams.Add("@GroupId",groupid);
                    sql = string.Format(@"select a.Id,a.DeptId,b.Code,b.Title from iDeptPrice a,iDept b where a.IsDeleted=0 
                                          and b.IsDeleted=0 and a.DeptId=b.Id and a.GroupId=@GroupId");
                    if (code != null && !string.IsNullOrEmpty(code))
                    {
                        sql += " and code like '%'+@Code+'%' ";
                        prams.Add("@Code", code);
                    }
                    if (title != null && !string.IsNullOrEmpty(title))
                    {
                        sql += " and title like '%'+@Title+'%' ";
                        prams.Add("@Title", title);
                    }
                }
                else if(type.Equals("FDept"))
                {
                    sql = "select Id,Code,Title from iDept where IsDeleted=0 and DeptTypeId=1";
                    if (code != null && !string.IsNullOrEmpty(code))
                    {
                        sql += " and code like '%'+@Code+'%' ";
                        prams.Add("@Code",code);
                    }
                    if (title != null && !string.IsNullOrEmpty(title))
                    {
                        sql += " and title like '%'+@Title+'%' ";
                        prams.Add("@Title", title);
                    }
                }
                DataTable dt = mybll.ExecQuery(sql, prams);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                result = "success:false,msg:\""+ex.Message+"\"";
            }
            return result;
        }

        //更新组价格(删除、更新、添加)
        private string UdatePG()
        {
            string result = string.Empty;
            try
            {
                string type = Request["type"];
                string GroupId = Request["GroupId"];
                string DelIds = Request["DelIds"];
                string sql = string.Empty;
                string sql_del = "update {0} set ModifyId={1},ModifyDate=getdate(),IsDeleted=1 where Id in ({2})";
                string sql_insert = "insert into {0}(CreateDate,CreateId,ModifyDate,ModifyId,IsDeleted,{1}) values(getdate(),{2},getdate(),{2},0,{3})";
                string sql_update = "update {0} set ModifyId={1},ModifyDate=getdate(),LowPrice={2} where Id={3}";

                string updsp = Request["updsp"];
                string newsp = Request["newsp"];

                string[] updsps = updsp.Split('_');
                string[] newsps = newsp.Split('_');

                ArrayList insertlist = new ArrayList();
                ArrayList updatelist = new ArrayList();

                #region
                if (type.Equals("service"))
                {
                    if (!string.IsNullOrEmpty(DelIds))
                    {
                        sql_del = string.Format(sql_del, "iServicePrice", CurrentUser.Id, DelIds.Substring(0, DelIds.LastIndexOf(',')));
                    }
                    else
                    {
                        sql_del = string.Empty; ;
                    }
                    if (!string.IsNullOrEmpty(newsp))
                    {
                        for (int i = 0; i < newsps.Length-1; i++)
                        {
                            string[] p = newsps[i].Split(',');
                            string ServiceId = p[0];
                            string LowPrice = p[1];
                            string a = "GroupId,ServiceId,LowPrice";
                            string b = string.Format("{0},{1},{2}", GroupId, ServiceId, LowPrice);
                            string sqlinsert = string.Format(sql_insert, "iServicePrice", a, CurrentUser.Id, b);
                            insertlist.Add(sqlinsert);
                        }
                    }
                    if (!string.IsNullOrEmpty(updsp))
                    {
                        for (int i = 0; i < updsps.Length - 1; i++)
                        {
                            string[] p = updsps[i].Split(',');
                            string ServiceId = p[0];
                            string LowPrice = p[1];
                            string sqlupdate = string.Format(sql_update, "iServicePrice", CurrentUser.Id, LowPrice,ServiceId);
                            updatelist.Add(sqlupdate);
                        }
                    }
                }
                else if (type.Equals("goods"))
                {
                    if (!string.IsNullOrEmpty(DelIds))
                    {
                        sql_del = string.Format(sql_del, "iProductPrice", CurrentUser.Id, DelIds.Substring(0, DelIds.LastIndexOf(',')));
                    }
                    else
                    {
                        sql_del = string.Empty; ;
                    }
                    if (!string.IsNullOrEmpty(newsp))
                    {
                        for (int i = 0; i < newsps.Length - 1; i++)
                        {
                            string[] p = newsps[i].Split(',');
                            string ProductId = p[0];
                            string LowPrice = p[1];
                            string a = "GroupId,ProductId,LowPrice";
                            string b = string.Format("{0},{1},{2}", GroupId, ProductId, LowPrice);
                            string sqlinsert = string.Format(sql_insert, "iProductPrice", a, CurrentUser.Id, b);
                            insertlist.Add(sqlinsert);
                        }
                    }
                    if (!string.IsNullOrEmpty(updsp))
                    {
                        for (int i = 0; i < updsps.Length - 1; i++)
                        {
                            string[] p = updsps[i].Split(',');
                            string ProductId = p[0];
                            string LowPrice = p[1];
                            string sqlupdate = string.Format(sql_update, "iProductPrice", CurrentUser.Id, LowPrice, ProductId);
                            updatelist.Add(sqlupdate);
                        }
                    }
                }
                #endregion

                result = mybll.DUI_GPrice(sql_del, updatelist, insertlist);
            }
            catch (Exception ex)
            {
                result = "success:false,msg:\"" + ex.Message + "\"";
            }
            return result;
        }

        //更新组门店(删除、更新、添加)
        private string UdateGDept()
        {
            string result = string.Empty;
            try
            {
                string groupid = Request["GroupId"];
                string DelIds = Request["DelIds"];
                string newGdept = Request["newGdept"];

                string[] newGdepts = newGdept.Split(',');

                string sql_del = "update iDeptPrice set ModifyId={0},ModifyDate=getdate(),IsDeleted=1 where Id in ({1})";
                string sql_insert = "insert into iDeptPrice(CreateDate,CreateId,ModifyDate,ModifyId,IsDeleted,GroupId,DeptId) values(getdate(),{0},getdate(),{0},0,{1},{2})";

                ArrayList insertlist = new ArrayList();
                string deldeptid = string.Empty;

                #region
                if (!string.IsNullOrEmpty(DelIds))
                {
                    sql_del = string.Format(sql_del,  CurrentUser.Id, DelIds.Substring(0, DelIds.LastIndexOf(',')));
                }
                else
                {
                    sql_del = string.Empty; ;
                }
                if (!string.IsNullOrEmpty(newGdept))
                {
                    for (int i = 0; i < newGdepts.Length - 1; i++)
                    {
                        string[] p = newGdepts[i].Split(',');
                        string DeptId = p[0];
                        string sqlinsert = string.Format(sql_insert, CurrentUser.Id, groupid, DeptId);
                        insertlist.Add(sqlinsert);
                        deldeptid += DeptId;
                        if (newGdepts.Length - 2 > i)
                        {
                            deldeptid += ",";
                        }
                    }
                }
                #endregion
                result = mybll.DI_GDept(CurrentUser.Id,sql_del, insertlist, deldeptid, groupid);
            }
            catch (Exception ex)
            {
                result = "success:false,msg:\""+ex.Message+"\"";
            }
            return result;
        }
    }
}