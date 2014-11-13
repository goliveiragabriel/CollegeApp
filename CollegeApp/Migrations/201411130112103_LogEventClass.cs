namespace CollegeApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LogEventClass : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LogEvent",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Message = c.String(),
                        State = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.LogEvent");
        }
    }
}
