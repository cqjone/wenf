using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;

namespace BeautyPointWeb.Apis
{
    public partial class lookscreenupload : System.Web.UI.Page
    {
        private BllApi.lookscreenupload lsud = new BllApi.lookscreenupload();
        protected void Page_Load(object sender, EventArgs e)
        {
            string op = Request["op"].ToString();
            string result = string.Empty;
            switch (op)
            {
                case "GetDept":
                    result = GetDept();
                    break;
                case "Seach":
                    result = SeachUpload();
                    break;
            }
            Response.Write(result);
            Response.End();
        }

        /// <summary>
        /// 获取所有门店
        /// </summary>
        /// <returns></returns>
        private string GetDept()
        {
            string sql = string.Format("select id,title from idept where IsDeleted=0 union select 0 as id,'全部' as title");
            DataTable dt = lsud.GetAll(sql);
            string array = string.Empty;
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                array += string.Format("[{0},'{1}']", dt.Rows[i]["id"], dt.Rows[i]["title"]);
                if (i < dt.Rows.Count - 1)
                {
                    array += ",";
                }
            }
            array = "[" + array + "]";
            return array;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        private string SeachUpload()
        {
           // string DeptTitle = Request["DeptTitle"];
            string DeptId = Request["DeptId"];
            string start=Request["start"];
            string limit = Request["limit"];
            if (DeptId.Length > 0 && DeptId!="0")
            {
                DeptId = string.Format("DeptId={0} and ", DeptId);
            }
            else 
            {
                DeptId = "";
            }
            string Time1 = Request["Time1"];
            string Time2 = Request["Time2"];
            string sql = string.Format(@"select top {3} a.FileName,a.ScreenTime,a.FileSize,a.FilePath,b.Title as DeptTitle 
                                                            from bscreenlog a,iDept b where {0}  ScreenTime between '{1}' and '{2}' and a.IsDeleted=0 and b.IsDeleted=0 and a.DeptId=b.Id
                                                            and a.Id not in (select top {4} Id from bscreenlog  where Isdeleted=0 order by ScreenTime desc)
                                                            order by ScreenTime desc", DeptId, Time1, Time2, limit,start);
            DataTable dt = lsud.GetAll(sql);
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(dt);
            int count = Convert.ToInt32(lsud.ExecScalar(string.Format("select count(*) from bscreenlog where IsDeleted=0 and ScreenTime between '{0}' and '{1}'", Time1, Time2)));
            json = "{totalCount:"+count+",results:" + json + "}";
            return json;
        }
    }
}