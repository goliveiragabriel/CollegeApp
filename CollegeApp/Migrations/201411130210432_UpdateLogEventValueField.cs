namespace CollegeApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateLogEventValueField : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LogEvent", "Value", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.LogEvent", "Value");
        }
    }
}
