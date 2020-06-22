<?php
$a=[
  ["DO","DO#","RE","MIb","MI","FA","FA#","SOL","SOL#","LA","SIb","SI"],
  ["DO4","DO#4","RE4","MIb4","MI4","FA4","FA#4","SOL4","SOL#4","LA4","SIb4","SI4"],
  ["DO5","DO#5","RE5","MIb5","MI5","FA5","FA#5","SOL5","SOL#5","LA5","SIb5","SI5"],
  ["DO7","DO#7","RE7","MIb7","MI7","FA7","FA#7","SOL7","SOL#7","LA7","SIb7","SI7"],
  ["DO7+","DO#7+","RE7+","MIb7+","MI7+","FA7+","FA#7+","SOL7+","SOL#7+","LA7+","SIb7+","SI7+"],
  ["DO-","DO#-","RE-","MIb-","MI-","FA-","FA#-","SOL-","SOL#-","LA-","SIb-","SI-"],
  ["DO-7","DO#-7","RE-7","MIb-7","MI-7","FA-7","FA#-7","SOL-7","SOL#-7","LA-7","SIb-7","SI-7"],
  ["DOdim","SOLdim","REdim","DOdim","SOLdim","REdim","DOdim","SOLdim","REdim","DOdim","SOLdim","REdim"],
  ["DO+","DO#+","RE+","MIb+","MI+","FA+","FA#+","SOL+","SOL#+","LA+","SIb+","SI+"],
  ["DO9","DO#9","RE9","MIb9","MI9","FA9","FA#9","SOL9","SOL#9","LA9","SIb9","SI9"],
  ["DO","DO#","RE","RE#","MI","FA","FA#","SOL","SOL#","LA","SIb","SI"],
  ["DO4","DO#4","RE4","RE#4","MI4","FA4","FA#4","SOL4","SOL#4","LA4","SIb4","SI4"],
  ["DO5","DO#5","RE5","RE#5","MI5","FA5","FA#5","SOL5","SOL#5","LA5","SIb5","SI5"],
  ["DO7","DO#7","RE7","RE#7","MI7","FA7","FA#7","SOL7","SOL#7","LA7","SIb7","SI7"],
  ["DO7+","DO#7+","RE7+","RE#7+","MI7+","FA7+","FA#7+","SOL7+","SOL#7+","LA7+","SIb7+","SI7+"],
  ["DO-","DO#-","RE-","RE#-","MI-","FA-","FA#-","SOL-","SOL#-","LA-","SIb-","SI-"],
  ["DO-7","DO#-7","RE-7","RE#-7","MI-7","FA-7","FA#-7","SOL-7","SOL#-7","LA-7","SIb-7","SI-7"],
  ["DO+","DO#+","RE+","RE#+","MI+","FA+","FA#+","SOL+","SOL#+","LA+","SIb+","SI+"],
  ["(DO)","(DO#)","(RE)","(MIb)","(MI)","(FA)","(FA#)","(SOL)","(SOL#)","(LA)","(SIb)","(SI)"],
  ["(DO)","(DO#)","(RE)","(RE#)","(MI)","(FA)","(FA#)","(SOL)","(SOL#)","(LA)","(SIb)","(SI)"]
];

$aTon = "var aTonalita=".json_encode($a).";"
?>

<!DOCTYPE html>
<html lang="it">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="keywords" content="accordi dei canti, canti di chiesa,canzoni cristiane,,canti cristiani,canti cattolici,canzoni cattoliche,libretto dei canti,canti evangelici,canti rns,accordi,video,libretto 2.0" />
    <meta name="rights" content="Tutti i diritti sono riservati. Il materiale multimediale contenuto è ricavato da contributi individuali oppure da video già presenti su Youtube" />
    <meta name="description" content="Questo portale vuole sostituire il vecchio canzoniere cartaceo con uno più moderno digitale. Contiene i canti più suonati nelle parrocchie italiane. Permette di cambiare gli accordi dei canti al 'volo'">
    <meta name="author" content="Michele Mammini">

    <title>Libretto 2.0 - Editor/Parser validatore</title>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- Favicon -->
    <link rel="icon" href="resources/favicon.ico" type="image/x-icon"/>

<!-- CSS personalizzato per l'app -->
<link href="css/app.css" rel="stylesheet">

<!-- Bootstrap core JavaScript-->
<script type="text/javascript" src="lib/jquery/jquery.min.js"></script>
<script type="text/javascript" src="lib/bootstrap/js/bootstrap.bundle.min.js"></script>


<?php
  $version = "1.0.0.".mt_rand(1000, 9999).".".mt_rand(100,999);
?>
<!-- Custom scripts for all pages-->
<script src="js/libretto2_accordi.js?v=<?php echo $version;?>"></script>

<script>
  <?php echo $aTon; ?>;
  jQuery(document).ready(function(){

    jQuery("#btn_check").click(function(){
      var song = {};
      song.accordi = jQuery('#editor').val()
      jQuery('#render').html(parseCantoAccordi(song,0,true));
    });

    jQuery("#start_chord").click(function(){
      var content = jQuery('#editor').val();
      content += "\n{start_chord}\n";
      content += "<< inserisci qui una serie di accordi >>\n";
      content += "{end_chord}\n";

      jQuery('#editor').val(content);
    });

    jQuery("#start_verse").click(function(){
      var content = jQuery('#editor').val();
      content += "\n{start_verse}\n";
      content += "<< inserisci qui la strofa >>\n";
      content += "{end_verse}\n";

      jQuery('#editor').val(content);
    });

    jQuery("#start_verse_num").click(function(){
      var content = jQuery('#editor').val();
      content += "\n{start_verse_num}\n";
      content += "<< inserisci qui la strofa numerata >>\n";
      content += "{end_verse_num}\n";

      jQuery('#editor').val(content);
    });

    jQuery("#start_chorus").click(function(){
      var content = jQuery('#editor').val();
      content += "\n{start_chorus}\n";
      content += "<< inserisci qui il ritornello >>\n";
      content += "{end_chorus}\n";

      jQuery('#editor').val(content);
    });

    jQuery("#start_bridge").click(function(){
      var content = jQuery('#editor').val();
      content += "\n{start_bridge}\n";
      content += "<< inserisci qui l'inciso >>\n";
      content += "{end_bridge}\n";

      jQuery('#editor').val(content);
    });
  })
</script>
</head>

<body>
  <div style="margin:10px;">

    <h3>Editor validatore testi per l'app CantiCristiani</h3>
    <p>Incolla in questo box sottostante il tuo canto. Cliccando sul bottone il canto verrà visualizzato così come apparirà nell'app</p>
    <div class="row" style="margin-top:10px;">

      <div class='col-md-6'>
        <button id='start_chord'>{start_chord}</button>
        <button id='start_verse'>{start_verse}</button>
        <button id='start_verse_num'>{start_verse_num}</button>
        <button id='start_chorus'>{start_chorus}</button>
        <button id='start_bridge'>{start_bridge}</button>
        <textarea rows="20" id="editor" class="form form-control" style="margin-bottom:5px;"></textarea>
        <button id="btn_check" class='btn btn-success'>Visualizza / Valida</button>
      </div>
      <div id="render" class='col-md-6'></div>
    </div>
  </div>
</body>

</html>
