using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
namespace CollegeApp.Models
{
    public class Course
    {
        public Course()
        {
            this.Enrollments = new HashSet<Enrollment>();
        }

        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int Semester { get; set; }
        [Required]
        [Display(Name = "Start Date")]
        public DateTime StartDate { get; set; }
        [Required]
        [Display(Name = "End Date")]
        public DateTime EndDate { get; set; }

        public Nullable<decimal> EnrollmentFee { get; set; }

        public virtual ICollection<Enrollment> Enrollments { get; set; }
        public virtual Teacher Teacher { get; set; }
    }
}