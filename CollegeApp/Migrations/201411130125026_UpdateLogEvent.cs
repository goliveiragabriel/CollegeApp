namespace CollegeApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateLogEvent : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LogEvent", "CreatedDate", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.LogEvent", "CreatedDate");
        }
    }
}
