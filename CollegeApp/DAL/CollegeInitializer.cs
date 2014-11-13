using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollegeApp.DAL
{
    public class CollegeInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<CollegeContext>
    {
        protected override void Seed(CollegeContext context)
        {
            base.Seed(context);
        }
    }
}