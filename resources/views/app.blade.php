<!DOCTYPE html> 
<html lang="en"> 
<head> 
<meta charset="UTF-8"> 
<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
<title>{{ config('app.name') }}</title> 
@vite(['resources/css/app.css', 'resources/js/app.js']) 
</head> 
<body class="antialiased"> 
<div id="app"></div> 
<!-- Add this script to the blade layout -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script type="text/javascript">
   (function(){
      emailjs.init("zpQXzdJqC2cOnbcef");  // Replace with your public key
   })();
</script>

</body> 
</html>