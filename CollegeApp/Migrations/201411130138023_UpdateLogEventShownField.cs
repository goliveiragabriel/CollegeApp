namespace CollegeApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateLogEventShownField : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LogEvent", "Shown", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.LogEvent", "Shown");
        }
    }
}
