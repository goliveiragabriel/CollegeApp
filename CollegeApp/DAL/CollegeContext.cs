using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Data.Entity.ModelConfiguration.Conventions;
using CollegeApp.Models;
using System.Data.Entity.Core.Objects;

namespace CollegeApp.DAL
{
    public class CollegeContext : DbContext
    {

        public CollegeContext() : base("CollegeContext") { }

        public DbSet<Student> Students { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<LogEvent> LogEvents { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
        /**
         * Observerpattern
         * 
         */
        public override int SaveChanges()
        {
            foreach (var ent in this.ChangeTracker.Entries())
            {
                if (ent.Entity.GetType() == typeof(Student) || ObjectContext.GetObjectType(ent.Entity.GetType()) == typeof(Student))
                {

                    LogEvent logEvent = new LogEvent();
                    logEvent.CreatedDate = DateTime.Now;
                    logEvent.Shown = true;
                    logEvent.Value = (ent.Entity as Student).FirstName;
                    switch ( ent.State ) {
                        case EntityState.Added: {
                            logEvent.Message = "A new user has been created.";
                            logEvent.State = "Added";
                            break;
                        }
                        case EntityState.Modified: {
                            logEvent.Message = "A new user has been modified.";
                            logEvent.State = "Modified";
                            break;
                        }
                        case EntityState.Deleted: {
                            logEvent.Message = "A new user has been removed.";
                            logEvent.State = "Deleted";
                            break;
                        }
                        default: break;
                    }
                    this.LogEvents.Add(logEvent);
                }
            }
            return base.SaveChanges();
        }
    }
}