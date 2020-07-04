var request=require('request');
var express=require('express');
var app=express();
var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
	var html="";

	html+="<!DOCTYPE html><html><meta charset='utf-8'><body><style>"+
	".icerik{width: 40%; background:#dcdcdc; min-height: 430px; margin:0 auto; margin-top: 15px; padding:15px 15px 15px 15px;}"+
	".sol{ float: left;width: 100%;} .sag{float: left;} .sol table{float: left;} .sag li{list-style: none; padding: 18px;} "+
	".e-sag{ margin-left: 11px; float: left;} .e-sag li{list-style: none; padding: 16px;} .e-sag li input{ background:#dcdcdc;}</style>"
	//body
	request(`https://api.canlidoviz.com/web/items?marketId=1&type=0`,function(error,response,body){
			if(!error&&(response.statusCode==200))
			{
				var doviz=JSON.parse(body);
				var dovizStr=JSON.stringify(doviz);
				if(doviz[0].name==undefined)
					res.send('There is something wrong with the JSON object.');
				else
				{
					html+="<div class='icerik'><div class='sol'><table><tr><td rowspan='6'><select id='ad' size='25' onchange='fonk()''>";
					for (var i = 0; i < doviz.length; i++)
						html+="<option value="+i+">"+doviz[i].name+"</option>";
					html+="</select> </td> <table> </div> <div class='sag'> "+
					"<li>Kur ismi</li> <li>Alış</li> <li>Satış</li> <li>Yüzde Değişimi</li> "+
					"<li>Döviz Kodu</li> <li><form action='/' method='get'>"+
					"<input type='submit' value='Kurları yenile'></form></li> </div> "+
					"<div class='e-sag'> <li><input type='' name='' id='isim' readonly>"+
					"</li> <li><input type='' name='' id='alis' readonly></li> "+
					"<li><input type='' name='' id='satis' readonly></li> <li>"+
					"<input type='' name='' id='yuzde' readonly></li> "+
					"<li><input type='' name='' id='kodu' readonly></li> </div> </div>"+
					"<script>function fonk(){"+
					'var doviz='+dovizStr+';'+
					"var ad = document.getElementById('ad');"+
					"var indis = Number(ad.options[ad.selectedIndex].value);"+
					"var fark = doviz[indis].buyPrice-doviz[indis].yesterdayClosingBuyPrice;"+
					"var yuzde;"+
					"if (fark<0) {yuzde=doviz[indis].dailyChangePercentage;document.getElementById('yuzde').style.color ='red';} "+
					"else if(fark==0) {yuzde=doviz[indis].dailyChangePercentage;document.getElementById('yuzde').style.color ='black';} "+
					"else {yuzde='+'+doviz[indis].dailyChangePercentage;document.getElementById('yuzde').style.color ='green';}"+
					"document.getElementById('isim').value =doviz[indis].name;"+
					"document.getElementById('alis').value =doviz[indis].buyPrice;"+
					"document.getElementById('satis').value =doviz[indis].sellPrice;"+
					"document.getElementById('yuzde').value =yuzde;"+
					"document.getElementById('kodu').value 	=doviz[indis].code;}</script>"+
					"</body></html>";
					res.write(html);
					res.end();
  				}
			}
			else
				res.send('API hatali');
	});
	//body
});
app.listen(3000,function(){console.log('Node.js Web Server is Running at Port 3000.');});

/*
function fonk(){yesterdayClosingBuyPrice
	var doviz=dovizStr;
	var ad = document.getElementById('ad');
	var indis = Number(ad.options[ad.selectedIndex].value);
	var fark = doviz[indis].buyPrice-doviz[indis].yesterdayClosingBuyPrice;
	var yuzde;
	if (fark<0) {yuzde=doviz[indis].dailyChangePercentage;document.getElementById('yuzde').style.color ='red';} 
	else if(fark==0) {yuzde=doviz[indis].dailyChangePercentage;document.getElementById('yuzde').style.color ='black';} 
	else {yuzde='+'+doviz[indis].dailyChangePercentage;document.getElementById('yuzde').style.color ='green';}
	document.getElementById('isim').value =doviz[indis].name;
	document.getElementById('alis').value =doviz[indis].buyPrice;
	document.getElementById('satis').value =doviz[indis].sellPrice;
	document.getElementById('yuzde').value =yuzde;
	document.getElementById('kodu').value 	=doviz[indis].code;
}
*/