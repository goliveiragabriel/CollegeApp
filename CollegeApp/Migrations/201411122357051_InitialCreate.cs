namespace CollegeApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Course",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        Semester = c.Int(nullable: false),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        EnrollmentFee = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Teacher_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Teacher", t => t.Teacher_Id)
                .Index(t => t.Teacher_Id);
            
            CreateTable(
                "dbo.Enrollment",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        StudentId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.CourseId, cascadeDelete: true)
                .ForeignKey("dbo.Student", t => t.StudentId, cascadeDelete: true)
                .Index(t => t.StudentId)
                .Index(t => t.CourseId);
            
            CreateTable(
                "dbo.Student",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FirstName = c.String(),
                        LastName = c.String(),
                        BirthDate = c.DateTime(nullable: false),
                        Gender = c.String(),
                        Email = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Teacher",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FirstName = c.String(),
                        LastName = c.String(),
                        BirthDate = c.DateTime(nullable: false),
                        Gender = c.String(),
                        Email = c.String(),
                        Degree = c.String(),
                        Phone = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Course", "Teacher_Id", "dbo.Teacher");
            DropForeignKey("dbo.Enrollment", "StudentId", "dbo.Student");
            DropForeignKey("dbo.Enrollment", "CourseId", "dbo.Course");
            DropIndex("dbo.Enrollment", new[] { "CourseId" });
            DropIndex("dbo.Enrollment", new[] { "StudentId" });
            DropIndex("dbo.Course", new[] { "Teacher_Id" });
            DropTable("dbo.Teacher");
            DropTable("dbo.Student");
            DropTable("dbo.Enrollment");
            DropTable("dbo.Course");
        }
    }
}
