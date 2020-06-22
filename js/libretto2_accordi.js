var aTon;

function array_index(arr, obj) {
	if( obj != null ) {
    for(var i=0; i<arr.length; i++) {
       if (arr[i] == obj) return i;
    }
  }
  return -1;
}

function FixAccordo(szAccordo){
	newAccordo = szAccordo;
	if( szAccordo.toLowerCase().indexOf('do') > -1 ) {
		newAccordo = "DO" + szAccordo.substring(2);
	}
	else if( szAccordo.toLowerCase().indexOf('re') > -1 ) {
		newAccordo = "RE" + szAccordo.substring(2);
	}
	else if( szAccordo.toLowerCase().indexOf('mi') > -1 ) {
		newAccordo = "MI" + szAccordo.substring(2);
	}
	else if( szAccordo.toLowerCase().indexOf('fa') > -1 ) {
		newAccordo = "FA" + szAccordo.substring(2);
	}
	else if( szAccordo.toLowerCase().indexOf('sol') > -1 ) {
		newAccordo = "SOL" + szAccordo.substring(3);
	}
	else if( szAccordo.toLowerCase().indexOf('la') > -1 ) {
		newAccordo = "LA" + szAccordo.substring(2);
	}
	else if( szAccordo.toLowerCase().indexOf('si') > -1 ) {
		newAccordo = "SI" + szAccordo.substring(2);
	}

	return newAccordo;
}

function CambioAccordo(szAccordo, aArrAcc, nTonalita ) {
  //szNew = "";
  if( szAccordo != null ) {
		newAccordo = FixAccordo(szAccordo);
    nPos = array_index( aArrAcc, newAccordo );
    if( nPos >= 0 ){
      if (nPos+nTonalita > 0 ){
        szNew = aArrAcc[ (nPos+nTonalita) % aArrAcc.length ];
      }
      else{
        nNPos = nPos+nTonalita+aArrAcc.length;
        szNew = aArrAcc[ nNPos % aArrAcc.length ];
      }
      return szNew;
    }
    else {
      return "";
    }
  }
}

// direction assume i seguenti valori:
// * '-' decrementa la tonalita di 1
// * '+' incrementa la tonalita di 1
// * '0' tonalita originale

function change_all_chords(id,direction){
	if( direction == '0' ) {
		tonalita = 0;
	}
	else if( direction == '-' ) {
		tonalita--;
	}
	else if( direction == '+' ) {
		tonalita++;
	}

	var nTonalita = tonalita;

	var accordi_song = jQuery("span");

	for( var i=0; i<accordi_song.length; i++ ){
		if( accordi_song[i].getAttribute('id') != null ){
			var chord = jQuery(accordi_song[i]);

			if( chord.attr('id').indexOf('/') > -1 ) {
				aChord = chord.attr('id').split('/');
				chord.html( getNewChord(aChord[0], tonalita) + '/' + getNewChord(aChord[1], tonalita) );
				console.log(chord.attr('id'), accordo);
			}
			else {
				if( chord.attr('id') != '7' && chord.attr('id') != '4' ){
	        chord.html( getNewChord(chord.attr('id'), nTonalita) );
				}
			}
		}
	}

	// memorizza la tonalita di esecuzione del brano
	sql = "SELECT * FROM canti_settings WHERE id_canti = " + id;
	exeQuery(sql,[],function(_tm,chk){
		if( chk.rows.length == 0 ) {
			sql = "INSERT INTO canti_settings (id_canti, tonalita) VALUES("+id+","+tonalita+");"
			// console.log("inserisci il record",sql);
		}
		else {
			if( direction == '-' )
				sql = "UPDATE canti_settings SET tonalita = tonalita-1 WHERE id_canti="+id+";"
			else if( direction == '+' )
				sql = "UPDATE canti_settings SET tonalita = tonalita+1 WHERE id_canti="+id+";"
			else if( direction == '0' )
				sql = "UPDATE canti_settings SET tonalita = 0 WHERE id_canti="+id+";"


			// console.log("aggiorna il record",sql);
		}
		exeQuery(sql,[],function(_tm,res){
			console.log(res);
		});
	});
}

function getAccordi(){
	if( jQuery.jStorage != undefined ){
		var app_settings = jQuery.jStorage.get('app_settings');
		aTon = app_settings.aTonalita;
	}
	else {
		aTon = aTonalita;
	}
}

function getNewChord(chord, nTonalita){
	var new_chord = "";
	jQuery.each(aTon, function(k,v){
		// console.log(v);
		if( new_chord.length == 0 ) {
			new_chord = CambioAccordo( chord, v, nTonalita );
		}
	});
	if( new_chord == "" ) {
		new_chord = chord;
	}
	return new_chord;
}

// mobile
function parseCantoAccordi(canto,tonalita,bShow) {

	getAccordi();

	// se non è definito setto a True, altrimenti utilizzo quello che trovo impostato nella variabile.
	if( typeof tonalita == 'undefined' ){
		tonalita = 0;
	}
	if( typeof bShow == 'undefined' ){
		bShow = true;
	}

	var aCanto;
	if( bShow ) {
		aCanto = canto.accordi.split('\n');
	}
	else {
		if( canto.testo != "null" ) {
			aCanto = canto.testo.split('\n');
		}
		else {
			aCanto = canto.accordi.split('\n');
		}
	}

  var bNum = false;
  var newFormat = "";
	var aMemory = {};
	var bMemory = false;
	var bReplay = false;

	var aCopy = {};
	var bCopy = false;
	var bPaste = false;

	var nL = 0;
	// debugger;
	var bNumber = false;
	jQuery.each(aCanto, function(k,l){
		if( l.indexOf('_num') > -1 ) {
			bNumber = true;
		}
	})

	var bFindNum = false;
	var bStartTag = false;
	var bAutoTag = false;
	jQuery.each(aCanto, function(k,line) {
		// Gestione della personalizzazione
		if (line.trim().indexOf('{memorize') > -1) {
			bMemory = true;
			val = line.substring(line.trim().indexOf('{memorize')+1,line.length-1).split('/')[1];
			aMemory[val]=[];
		}
		if (line.trim().indexOf('{replay') > -1) {
			bReplay = true;
			val = line.substring(line.trim().indexOf('{replay')+1,line.length-1).split('/')[1];
			nL = 0;
		}
		if (line.trim().indexOf('{copy') > -1) {
			bCopy = true;
			valc = line.substring(line.trim().indexOf('{copy')+1,line.length-1).split('/')[1];
			aCopy[valc]=[];
		}
		if (line.trim().indexOf('{paste') > -1) {
			bPaste = true;
			valc = line.substring(line.trim().indexOf('{paste')+1,line.length-1).split('/')[1];
		}

		// Inizio del parser con definizione del formato di uscita
		if( line.trim().indexOf('{start_verse}') > -1 || line.trim() == '\\beginverse' || line.trim().indexOf('{start_of_verse') > -1 || line.trim().indexOf('{sov') > -1 ) {
      newFormat += "<div class='lyr color_black font-roboto'>";
			bStartTag = true;
			bAutoTag = true;
    }
    else if( line.trim().indexOf('{start_verse_num}') > -1 ) {
			if( !bNum ) {
				bFindNum = true;
				bNum = true;
				newFormat += "<ol style='padding-left: 20px;'>";
			}
      newFormat += "<div class='lyr color_black font-roboto'><li>";
			bStartTag = true;
			bAutoTag = true;
    }
    else if( line.trim().indexOf('{start_chorus}') > -1 || line.trim() == '\\beginchorus' || line.trim().indexOf('{start_of_chorus') > -1 || line.trim().indexOf('{soc') > -1 ) {
			if( ! bAutoTag ){
				newFormat += "</div>";
				bAutoTag = true;
			}
			addClass = '';
			if( bNumber && !bFindNum ) {
				addClass = 'rit-add-padding';
				bFindNum = false;
			}
      newFormat += "<div class='rit font-roboto-medium "+addClass+"'>";
			bStartTag = true;
			bAutoTag = true;
			if( bPaste ) {
				jQuery.each(aCopy[valc], function(k,v){
					newFormat += "<p class='accapo'>"+v+"</p>";
				})
			}
    }
    else if( line.trim().indexOf('{start_lyrics}') > -1 ) {
      newFormat += "<div class='lyr_no_chr color_black font-roboto'>";
			bStartTag = true;
    }
    else if( line.trim().indexOf('{start_lyrics_num}') > -1 ) {
      bNum = true;
      newFormat += "<div class='lyr_no_chr color_black font-roboto'><li>";
			bStartTag = true;
    }
    else if( line.trim().indexOf('{start_bridge}') > -1 ) {
      newFormat += "<div class='lyr_bridge color_black font-roboto'>";
			bStartTag = true;
    }
		else if( line.trim().indexOf('{start_chord}') > -1 ) {
			console.log("inizio accordi/commento");
			newFormat += "<div class='lyr color_black nascondi'>";
			bStartTag = true;
		}
    else if( line.trim() == '\\endverse' || line.trim() == '\\endchorus' || line.trim() == '{end_verse}' ||
						 line.trim() == '{end_chorus}' || line.trim() == '{end_lyrics}' || line.trim() == '{end_bridge}' ||
						 line.trim() == '{end_chord}' || line.trim() == '{end_of_verse}' || line.trim() == '{eov}' ||
					   line.trim() == '{end_of_chorus}' || line.trim() == '{eoc}' ) {
      newFormat += "</div>";
			bReplay = false;
			bCopy = false;
			bPaste = false;
			bStartTag = false;
			bAutoTag = true;
    }
    else if( line.trim() == '{end_verse_num}' || line.trim() == '{end_lyrics_num}' ) {
      newFormat += "</li></div>";
			bReplay = false;
    }
    else {
				if( line.length > 0 && line.indexOf('{title:') == -1 && line.indexOf('{t:') == -1 && line.indexOf('{subtitle:') == -1  ) {
					if( !bStartTag ) {
						newFormat += "<div class='lyr color_black font-roboto'>";
						bStartTag = true;
						bAutoTag = false;
					}

					if( line.indexOf('{c:') == -1 ) {
						txt = line.replace(/ /g,"&nbsp;");
						txt = txt.split('|').join("&nbsp;<span id='|' class='chr'>|</span>&nbsp");
						txt = txt.split('Intro').join("<span id='intro' class='chr'>Intro</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
					}
					else {
						// se trovo un commento ...
						s = line.indexOf("c:")+2;
						f = line.indexOf("}")-3;
						llen = line.substr(s,f).length;
						label = "<span id='intro' class='chr'>"+line.substr(s,f)+"</span>"+addSpace(llen+1);
						wline = line.replace(/{.*?}/, "").trim();

						txt = label;
						// console.log(line,wline);
						jQuery.each(wline.split(" "), function(kk,vv){
								if( vv[0] =='[' && vv[vv.length-1] == ']'){
									alen = vv.length;
									txt += vv+addSpace(alen);
								}
								else if( vv[0] =='[' && vv[vv.length-1] != ']'){
									// Gestisce gli accordi-attaccati a destra vv.substr(vv.indexOf(']')+1)
									alen = vv.substr(0,vv.indexOf(']')+1).length;
									txt += vv.substr(0,vv.indexOf(']')+1)+addSpace(alen);
									txt += "<span id='|' class='chr'>"+vv.substr(vv.indexOf(']')+1)+"</span>"+addSpace(vv.substr(vv.indexOf(']')+1).length+1);

									// console.log("dx",vv,vv.substr(vv.indexOf(']')+1));
								}
								else if( vv[0] !='[' && vv[vv.length-1] == ']'){
									// Gestisce gli accordi-attaccati a sinistra
									alen = vv.substr(vv.indexOf('[')).length;
									txt += "<span id='|' class='chr'>"+vv.substr(0,vv.indexOf('['))+"</span>"+addSpace(vv.substr(0,vv.indexOf('[')).length+1);
									txt += vv.substr(vv.indexOf('['))+addSpace(alen);

									// console.log("sx",vv);
								}
								else {
									if( vv.length > 0 ){
										// console.log("nn", vv, vv.length);
										txt += "<span id='|' class='chr'>"+vv+"</span>"+addSpace(vv.length+1);
									}
								}
						})
						// console.log(txt);
						newFormat += "<div class='lyr color_black nascondi'>";
					}
					if( bShow ) {
						if( bReplay ) {
							if( txt.length > 0 && typeof aMemory[val] != 'undefined' ){
								var replaceArrayValue = aMemory[val][nL];
								for (var i = 0; i< replaceArrayValue.length; i++) {
									accordo = replaceArrayValue[i];
									txt = txt.replace("*","<span id='"+accordo+"' class='chr'>"+accordo+"</span>");
								}
								nL++;

								txt = txt.replace(/(\[([^\]]+)\])/g, function(x) {
									accordo = getNewChord(x.substring(1,x.length-1), tonalita);
									return "<span id='"+accordo+"' class='chr'>"+accordo+"</span>";
								});
							}
						}
						else {
							var aLine = [];
							txt = txt.replace(/(\[([^\]]+)\])/g, function(x) {
								chord = x.substring(1,x.length-1);
								if( chord.indexOf('/') > -1 ) {
									aChord = chord.split('/');
									accordo = getNewChord(aChord[0], tonalita) + '/' + getNewChord(aChord[1], tonalita);
								}
								else {
									accordo = getNewChord(chord, tonalita);
								}
								aLine.push(accordo);
								return "<span id='"+accordo+"' class='chr'>"+accordo+"</span>";
							});
							if( bMemory ) {
								aMemory[val].push(aLine);
							}
							if( bCopy ) {
								aCopy[valc].push(txt);
							}
						}
					}
					else {
						txt = txt.replace(/(\[([^\]]+)\])/g, function(x) {
							return "";
						});
					}
					if( line.indexOf('{c:') != -1 ) {
						// console.log("fine accordi/commento");
						newFormat += "</div>";
						bStartTag = false;
					}
					newFormat += "<p class='accapo'>"+txt+"</p>";
				}
    }
  });
  return newFormat;
}

function addSpace(n) {
	pad = "";
	for(i=0; i<n; i++){
		pad+="&nbsp;";
	}
  return pad;
}
