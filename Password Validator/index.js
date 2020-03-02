function validate()
{
  let pass1 = document.querySelector("#pass1");
  let pass2 = document.querySelector("#pass2");
  let message = document.querySelector("#message");

  if(pass1.value != pass2.value)
  {
    message.innerText = "Your passwords don't match!";
  }
  else if(pass1.value.length<8)
  {
    message.innerText = "Your password must be at least 8 characters long";
  }
  else
  {
    message.innerText = "Password Validated!";
  }
}
