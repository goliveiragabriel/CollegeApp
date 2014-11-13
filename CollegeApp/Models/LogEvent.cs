using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeApp.Models
{
    public class LogEvent
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string State { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Value { get; set; }
        public bool Shown { get; set; }
    }
}