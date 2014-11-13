using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace CollegeApp.Models
{
    public class Teacher
    {
        public Teacher()
        {
            this.Courses = new HashSet<Course>();
        }
        public int Id { get; set; }
        
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Display(Name = "Birth Date")]
        [Required]
        public DateTime BirthDate { get; set; }
        
        [Required]
        public string Gender { get; set; }

        [StringLength(65)]
        [Display(Name = "E-mail")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        
        [Required]
        public string Degree { get; set; }
        public string Phone { get; set; }

        public virtual ICollection<Course> Courses { get; set; }
    }
}