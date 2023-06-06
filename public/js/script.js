function validate()
{
    let name=document.querySelector(".name");
    let phone=document.querySelector(".phone");
    let email=document.querySelector(".email");
    let message=document.querySelector(".textarea");
    let sendbtn=document.querySelector(".send_btn");

    sendbtn.addEventListener("click",(e)=>
    {
        e.preventDefault();
        if (name.value == "" || phone.value == "" || email.value == "" || message.value == "")
        {
            emptyerror();
        }
        else
        {
            sendmail (name.value,phone.value,email.value,message.value);
            success();
            document.querySelector(".main_form").reset();
        }
    });
}
validate();

function sendmail(name,phone,email,message)
{
    emailjs.send("service_79qwy1h","template_um71odm",{
        from_name: name,
        phone:phone,
        email_id: email,
        message: message,
        });
}

function emptyerror()
{
    swal({
        title: "oh no....",
        text: "Fields cannot be empty",
        icon: "error",
      });
}

function success()
{
    swal({
        title: "Email sent successfully",
        text: "Thank you for contacting us!",
        icon: "success",
    });
}