using System.ComponentModel.DataAnnotations;

public class MyFormModel{
    [Required]
    public string Name {get; set;}

    [Required, EmailAddress]
    public string Email {get; set;}
}