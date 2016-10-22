using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using BllApi;

namespace BeautyPointWeb.Apis
{
    public partial class StoreExInfo : AuthBasePage
    {
        BllApi.DeptLimitApis deptLimit = new BllApi.DeptLimitApis();
        protected void Page_Load(object sender, EventArgs e)
        {
            switch(ActionName)
            {
                case "getDataByParms":
                    GetDataByParms();
                    break;
                case "selectCode":
                    SelectID();
                    break;
                case "submitDept":
                    SubmitDept();
                    break;
                case "delDept":
                    DelDept();
                    break;
            }
        }
        /// <summary>
        /// 根据查询条件查询信息
        /// </summary>
        public void GetDataByParms()
        {
            string result = string.Empty;
            try
            {
                int start = Convert.ToInt32(Request["start"]);
                int limit = Convert.ToInt32(Request["limit"]);

                string DeptStatus = Request["DeptStatus"];
                string Code = Request["code"];
                string Title = Request["title"];

                Hashtable prams = new Hashtable();
                if (!string.IsNullOrEmpty(Code))
                {
                    prams.Add("@Code", Code);
                    Code = " and d.Code like '%' + @Code + '%'";
                }

                if (!string.IsNullOrEmpty(Title))
                {
                    prams.Add("@Title", Title);
                    Title = " and d.Title like '%' + @Title + '%'";
                }

                if (!string.IsNullOrEmpty(DeptStatus))
                {
                    int deptStatus = Convert.ToInt32(DeptStatus) - 1;
                    if (deptStatus > -1)
                    {
                        prams.Add("@DeptStatus", deptStatus);
                        DeptStatus = " and d.DeptStatus = @DeptStatus";
                    }
                    else
                    {
                        DeptStatus = string.Empty;
                    }
                }
                else
                {
                    DeptStatus = string.Empty;
                }

                string sql = string.Format(@"select e.id as ID,d.id as DeptID, d.code as Code,d.DeptStatus,d.title as Title,e.LandLord ,
                                            e.RentBegin,e.RentEnd,e.BusinessLic,e.LordTel,e.Rental,e.Area,e.LegalPerson from 
                                            idept d, ideptext e where e.deptid=d.id and d.isdeleted=0 and e.isdeleted=0 
                                             and d.depttypeid=1 {0} {1} {2}", Code, Title, DeptStatus);
                aUserApis auser = new aUserApis();
                DataTable dt = auser.GetPageData(sql, "order by code", start + 1, limit, prams);
                result = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
                sql = string.Format(@"select count(*) from idept d, ideptext e where e.deptid=d.id and d.isdeleted=0 
                                and e.isdeleted=0 and d.depttypeid=1 {0} {1} {2}", Code, Title, DeptStatus);
                int count = (int)auser.ExecScalar(sql, prams);
                result = "{totalCount:" + count + ",results:" + result + "}";
            }
            catch (Exception ex)
            {
                result = ex.Message.Replace("'", "\"") + ex.StackTrace.Replace("'", "\"");
                result = "{success:false,msg:'" + result + "'}";
            }
            Response.Write(result);
            Response.End();

        }

        /// <summary>
        /// 添加查询编号是否存在
        /// </summary>
        private void SelectID()
        {
            string cid = Request["cid"];
            string InOrUp = Request ["InOrUp"];
            if (!string.IsNullOrEmpty(InOrUp))
            {
                SubmitDept();
            }
            if (string.IsNullOrEmpty(cid))
            { 
                cid=Request ["DeptId"];
            }
            int num = SelectByID(cid);
            if (num == 0)
            {
                //SubmitDeptLimit();
                base.ReturnResultJson("true", "没有此编号！");
            }
            else
            {
                base.ReturnResultJson("false", "编号已存在");
            }
        }
        /// <summary>
        /// 查询编号是否存在
        /// </summary>
        /// <param name="cid"></param>
        /// <returns></returns>
        public int SelectByID(string cid)
        {
            int num = 0;
            Hashtable parms = new Hashtable();
            parms.Add("@cid", cid);
            string sql = "select COUNT(*) from iDeptExt where IsDeleted=0 and DeptID=@cid";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                num = (int)db.ExecuteScalar(sql, parms);
            }
            return num;
        }
        /// <summary>
        /// 提交 一条规则
        /// 判断有没有id，如果有id则 update，否则 则insert
        /// </summary>
        private void SubmitDept()
        {
            string InOrUp = Request["InOrUp"];

            DataTable result;
            DataTable dtSource;
            if (string.IsNullOrEmpty(InOrUp) || "0".Equals(InOrUp))
            {
                //insert
                dtSource = MappingDataFromPage("iDeptExt", "0");
                result = deptLimit.Add(CurrentUser, dtSource);
                base.ReturnResultJson("true", "添加成功");
            }
            else
            {
                //update;
                dtSource = MappingDataFromPage("iDeptExt", InOrUp);
                result = deptLimit.Update(CurrentUser, dtSource);
                base.ReturnResultJson("true", "修改成功");
            }
            //base.ReturnSubmitResultJson(result);
        }

        /// <summary>
        /// 根据ID删除
        /// </summary>
        private void DelDept()
        {
            Hashtable parms = new Hashtable();
            string did = Request["did"];
            int uid = base.CurrentSession.UserID;
            int num = updateIsDelete(did, uid);
            if (num > 0)
            {
                base.ReturnResultJson("true", "删除成功");
            }
            else
            {
                base.ReturnResultJson("false", "删除失败");
            }
        }

        /// <summary>
        /// 修改IsDelete=1
        /// </summary>
        /// <param name="did"></param>
        public int updateIsDelete(string did, int uid)
        {
            int num = 0;
            string datetime = DateTime.Now.ToString();//当前时间
            Hashtable parms = new Hashtable();
            parms.Add("@did", did);
            parms.Add("@datetime", datetime);
            parms.Add("@uid", uid);
            string sql = "update iDeptExt set IsDeleted=1,ModifyDate=@datetime,ModifyID=@uid where ID=@did";
            using (DbCommon.DbUtil db = new DbCommon.DbUtil())
            {
                num = db.ExecuteNoneQuery(sql, parms);
                db.Commit();
            }
            return num;
        }
    }
}