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
    public partial class FindDeptOnline : AuthBasePage
    {
        private BllApi.FindDeptOnline mybll = new BllApi.FindDeptOnline();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack) 
            {
                switch (ActionName) 
                {
                    case "findDept":
                        FindDept();
                        break;
                    case "findPics":
                        FindPics();
                        break;
                    case "isScreenShot":
                        IsScreenShot();
                        break;
                    case "showShotImgs":
                        ShowShotImgs();
                        break;
                }
            }
        }

        /// <summary>
        /// 查询截屏图片
        /// </summary>
        private void ShowShotImgs()
        {
            string msg = string.Empty;
            try
            {
                string sqlWhere = string.Empty;
                
                #region 参数
                Hashtable prams = new Hashtable();
                string dateBegin = Request["dateBegin"];
                string dateEnd = Request["dateEnd"];
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);
                
                sqlWhere += " and a.screentime >= @dateBegin";
                if (!string.IsNullOrEmpty(dateBegin))
                {
                    prams.Add("@dateBegin", dateBegin);
                }
                
                sqlWhere += " and a.screentime <= @dateEnd";
                if (!string.IsNullOrEmpty(dateEnd))
                {
                    prams.Add("@dateEnd", dateEnd);
                }
                #endregion

                string sql = @"select a.Id,a.ScreenTime,a.FilePath,b.title as DeptName from bscreenlog a, idept b
                                where a.isdeleted = 0 and b.isdeleted = 0
                                and a.deptid = b.id ";

                DataTable dtShotImgs = mybll.GetPageData(sql + sqlWhere, "order by ScreenTime desc", start + 1, limit, prams);

                sql = @"select count(a.Id) from bscreenlog a where a.isdeleted = 0";
                int totalCount = 0;
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    totalCount = (int)utl.ExecuteScalar(sql + sqlWhere,prams);
                }

                msg = "{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dtShotImgs) + "}";
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.Message);
            }
            Response.Write(msg);
            Response.End();
        }

        /// <summary>
        /// 查询在线门店
        /// </summary>
        private void FindDept()
        {
            try
            {
                //string diffSecond = Request["diffSecond"];//在线时间差
                string IsOnline = Request["IsOnline"];
                string DeptStatus = Request["DeptStatus"];
                string DeptName = Request["DeptName"];
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);

                Hashtable prams = new Hashtable();

                string sql = @"select b.DeptStatus,b.id as DeptId,a.id as PosId,b.Code as DeptCode,b.title as DeptName,b.Tel,a.code as PosCode,
                                a.title as PosName,a.LastIp,CONVERT(varchar(100), isnull(a.LastTime,'1950-1-1')   , 20) as LastTime,
                                case 
	                                when a.LastTime is null or datediff(mi,a.LastTime,getdate()) > 5 then 0 else 1
                                end as IsOnline,
                                isnull(a.ScreenShot,0) as ScreenShot,
                                (
	                                select top 1 c.realname from auser c,iiccardinfo d 
	                                where c.deptid=a.deptid
	                                and c.isdeleted=0 and d.isdeleted = 0
	                                and c.EmployeeID = d.Empid
	                                and d.Status=1 and d.lastusetime is not null
	                                order by d.LastUsetime desc
                                ) as realname,
                                (
	                                select top 1 CONVERT(varchar(100), d.lastusetime  , 20) as lastusetime from auser c,iiccardinfo d 
	                                where c.deptid=a.deptid
	                                and c.isdeleted=0 and d.isdeleted = 0
	                                and c.EmployeeID = d.Empid
	                                and d.Status=1
	                                order by d.LastUsetime desc
                                ) as lastusetime,CameraVersion
                                from ipos a,idept b
                                where a.isdeleted = 0 and b.isdeleted= 0 and a.DeptId = b.Id";

                string sqlWhere = string.Empty;
                if (!string.IsNullOrEmpty(DeptStatus))
                {
                    int deptStatus = Convert.ToInt32(DeptStatus) - 1;
                    if (deptStatus > -1)
                    {
                        sqlWhere += " and b.DeptStatus = @DeptStatus";
                        prams.Add("@DeptStatus", deptStatus);
                    }
                }
                if (!string.IsNullOrEmpty(DeptName))
                {
                    sqlWhere += " and b.title like '%' + @DeptName + '%'";
                    prams.Add("@DeptName", DeptName);
                }
                if (IsOnline.Equals("1"))
                {
                    sqlWhere += " and datediff(mi,a.LastTime,getdate()) <= 5";
                    //prams.Add("@diffSecond", diffSecond);
                }
                else if (IsOnline.Equals("2"))
                {
                    sqlWhere += " and datediff(mi,isnull(a.LastTime,'1950-01-01'),getdate()) > 5";
                    //prams.Add("@diffSecond", diffSecond);
                }

                DataTable dt = mybll.GetPageData(sql + sqlWhere, "order by DeptCode,DeptName", start + 1, limit, prams);

                sql = @"select count(*) from ipos a,idept b where a.isdeleted = 0 and b.isdeleted= 0 and a.DeptId = b.Id";
                int totalCount = 0;
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    totalCount = int.Parse(utl.ExecuteScalar(sql + sqlWhere, prams).ToString());
                }

                Response.Write("{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}");
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.Message);
            }
            finally
            {
                Response.End();
            }
        }

        /// <summary>
        /// 查询上传图片
        /// </summary>
        private void FindPics()
        {
            try
            {
                string DeptId = Request["DeptId"];
                string PosId = Request["PosId"];
                string dateBegin = Request["dateBegin"];
                string dateEnd = Request["dateEnd"];
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);

                Hashtable prams = new Hashtable();
                prams.Add("@DeptId", DeptId);
                prams.Add("@PosId", PosId);

                string sqlWhere = string.Empty;
                if (!string.IsNullOrEmpty(dateBegin))
                {
                    sqlWhere += " and ScreenTime >= @dateBegin";
                    prams.Add("@dateBegin",dateBegin);
                }
                if (!string.IsNullOrEmpty(dateEnd))
                {
                    sqlWhere += " and ScreenTime <= @dateEnd";
                    prams.Add("@dateEnd", dateEnd);
                }

                string sql = @"select CONVERT(varchar(100), ScreenTime  , 20)  as ScreenTime,FileSize,FileName,FilePath,isnull(IpAddr,'') as IpAddr from bscreenlog
                           where IsDeleted = 0 and DeptId = @DeptId and PosId = @PosId";

                DataTable dt = mybll.GetPageData(sql + sqlWhere, "order by ScreenTime desc", start + 1, limit, prams);

                sql = @"select count(*) from bscreenlog where  IsDeleted = 0 and DeptId = @DeptId and PosId = @PosId";
                int totalCount = 0;
                using (DbCommon.DbUtil utl = new DbCommon.DbUtil())
                {
                    totalCount = (int)utl.ExecuteScalar(sql + sqlWhere, prams);
                }
                Response.Write("{totalCount:" + totalCount + ",results:" + Newtonsoft.Json.JsonConvert.SerializeObject(dt) + "}");
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.Message);
            }
            finally
            {
                Response.End();
            }
        }

        /// <summary>
        /// 是否允许截屏
        /// </summary>
        private void IsScreenShot()
        {
            int index = 0;
            try
            {
                string PosIds = Request["PosIds"];

                index = mybll.IsScreenShot(CurrentSession.UserID, PosIds);
            }
            catch (Exception ex)
            {
                base.ReturnResultJson("false", ex.Message);
            }
            finally
            {
                if (index > 0)
                {
                    base.ReturnResultJson("true", "操作完成...");
                }
                else
                {
                    base.ReturnResultJson("true", "操作失败，没有找到 Pos 机...");
                }
            }
        }
    }
}