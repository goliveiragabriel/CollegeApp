using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
namespace CollegeApp.Models
{
    public class Student
    {
        public Student()
        {
            this.Enrollments = new HashSet<Enrollment>();
        }
        public int Id { get; set;}
        
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Display(Name = "Birth Date")]
        [Required]
        public DateTime BirthDate { get; set; }
        [StringLength(1)]
        [Display(Name = "Gender")]
        [Required]
        public string Gender { get; set; }

        [StringLength(65)]
        [Display(Name = "E-mail")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        public virtual ICollection<Enrollment> Enrollments { get; set; }
    }
}