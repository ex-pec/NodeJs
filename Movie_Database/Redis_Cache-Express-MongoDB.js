var express=require('express');
var redis=require('redis');
var	mongoose=require('mongoose');
var	bodyParser=require('body-parser');

var app=express();

var redisClient=redis.createClient();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/movies', {useNewUrlParser: true});

var tableSchema=new mongoose.Schema({
	Film:'String',
	Genre:'String',
	Lead:'String',
	Audience:'String',
	Profitability:'String',
	Rotten:'String',
	Worldwide:'String',
	Year:'String'},
	{collection:'Movie'}
);

var film=mongoose.model('Movie',tableSchema);


app.get('/',function(req,res){
	film.find({Film:req.params.Film},function(err,movie){
		if(err)
			return res.jsonp({status:500,message:err.message});
		var Film='',Genre='',Lead='',Audience='',Profitability='',Rotten='',Worldwide='',Year='';
		res.send(HTML(Film,Genre,Lead,Audience,Profitability,Rotten,Worldwide,Year));
	});
});

app.post('/:Film',function(req,res){
	var gelen=req.params.Film;
	var Film='',Genre='',Lead='',Audience='',Profitability='',Rotten='',Worldwide='',Year='';
	var bilgi;

	redisClient.exists(gelen,function(err,reply){
		if(reply==1)
	    {
	    	redisClient.hgetall(gelen,function(err,val){	
	    		console.log('The key ('+gelen+') exists in the Redis Cache.');
	    		bilgi=val;
				Film=bilgi.Film;
				Genre=bilgi.Genre;
				Lead=bilgi.Lead;
				Audience=bilgi.Audience;
				Profitability=bilgi.Profitability;
				Rotten=bilgi.Rotten;
				Worldwide=bilgi.Worldwide;
				Year=bilgi.Year;
	    		res.send(HTML(Film,Genre,Lead,Audience,Profitability,Rotten,Worldwide,Year));
	    	});
	    }
	    else
	    {
	    	film.find({Film:req.params.Film},function(err,movie){
				if(err)
					return res.jsonp({status:500,message:err.message});
				bilgi=movie[0];
				Film=bilgi.Film;
				Genre=bilgi.Genre;
				Lead=bilgi.Lead;
				Audience=bilgi.Audience;
				Profitability=bilgi.Profitability;
				Rotten=bilgi.Rotten;
				Worldwide=bilgi.Worldwide;
				Year=bilgi.Year;
				res.send(HTML(Film,Genre,Lead,Audience,Profitability,Rotten,Worldwide,Year));
				var bilStr=JSON.stringify(bilgi);
				redisClient.hmset([Film, "Film", Film, "Genre", Genre, "Lead", Lead, "Audience", Audience, "Profitability", Profitability, "Rotten", Rotten, "Worldwide", Worldwide, "Year", Year],function(err,reply){if (err) throw err});
				redisClient.expire(gelen,30);
			});
		}
	});
});

app.listen(3000,function(){console.log('App is running at port 3000.')});

function HTML(Film,Genre,Lead,Audience,Profitability,Rotten,Worldwide,Year) {
	var HTML="<!DOCTYPE html>"+
"	<html>"+
"	<head>"+
"		<title>Film Sorgula</title>"+
"	</head>"+
"	<body>"+
"		<style type='text/css'>"+
"			.tablo{"+
"				width: 50%; background:#dcdcdc;"+
"				min-height: 430px;"+
"				margin:0 auto;"+
"				margin-top: 15px;"+
"				padding:15px 15px 15px 15px;"+
"			}"+
"		</style>"+
"		<script>"+
"		function getir() {"+
"			var x = document.getElementById('ad').value;"+
"			document.getElementById('frm').action='/'+x"+
"		}"+
"		</script>"+
"		<table class='tablo'>"+
"			<tr>"+
"				<td>"+
"					<form action='' id='frm' method='post'>"+
"						<input type='' id='ad' value='"+Film+"'>"+
"						<button onclick='getir()'> Film Sorgula </button>"+
"					</form>"+
"				</td>"+
"			</tr>"+
"			<tr>"+
"				<td>Film</td>"+
"				<td><input type='' id='Film' value='"+Film+"' readonly></td>"+
"			</tr>"+
"			<tr>"+
"				<td>Genre</td>"+
"				<td><input type='' id='Genre' value='"+Genre+"' readonly></td>"+
"			</tr>"+
"			<tr>"+
"				<td>Lead Studio</td>"+
"				<td><input type='' id='Lead' value='"+Lead+"' readonly></td>"+
"			</tr>"+
"			<tr>"+
"				<td>Audience score %</td>"+
"				<td><input type='' id='Audience' value='"+Audience+"' readonly></td>"+
"			</tr>"+
"			<tr>"+
"				<td>Profitability</td>"+
"				<td><input type='' id='Profitability' value='"+Profitability+"' readonly></td>"+
"			</tr>"+
"			<tr>"+
"				<td>Rotten Tomatoes %</td>"+
"				<td><input type='' id='Rotten' value='"+Rotten+"' readonly></td>"+
"			</tr>"+
"			<tr>"+
"				<td>Worldwide Gross</td>"+
"				<td><input type='' id='Worldwide' value='"+Worldwide+"' readonly></td>"+
"			</tr>"+
"			<tr>"+
"				<td>Year</td>"+
"				<td><input type='' id='Year' value='"+Year+"' readonly></td>"+
"			</tr>"+
"		</table>"+
"	</body>"+
"	</html>"
return HTML
}