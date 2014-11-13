using CollegeApp.DAL;
using CollegeApp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CollegeApp.Controllers
{
    public class LogEventsController : Controller
    {
        private CollegeContext db = new CollegeContext();

        // GET: LogEvents
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetNotifications()
        {
            var notifications = db.LogEvents.Where(m => m.Shown == true);
            return Json(new { notification = notifications.ToList() }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Save(List<LogEvent> events)
        {
            if (events != null)
            {
                foreach (LogEvent notification in events)
                {
                    notification.CreatedDate = DateTime.Now;
                    notification.Shown = false;
                    db.Entry(notification).State = EntityState.Modified;
                }
                db.SaveChanges();
            }
            return Json(new { valid = true });
        }
    }
}