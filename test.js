const csp = require('content-security-policy');
const cspPolicy = {
//    'default-src' : csp.SRC_ANY,
//    'script-src' : csp.SRC_ANY,
//    'connect-src' : csp.SRC_ANY,
//    'img-src' : csp.SRC_ANY,
//    'font-src' : csp.SRC_ANY,
//    'child-src' : csp.SRC_ANY,
//    'form-src' : csp.SRC_ANY,
//    'frame-ancestors' : csp.SRC_ANY,
//    'stlye-src' : csp.SRC_ANY
};
const globalCSP = csp.getCSP(cspPolicy);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var EosApi = require('eosjs-api');
var Eos = require('eosjs');

//https://github.com/CryptoLions/EOS-Jungle-Testnet#bp-nodes-information
var endpoint = 'http://testnet01.eoseoul.io:8801';//eoseoul.io
// var endpoint = 'http://193.93.219.219:8888';//Tiger, CryptoLions.io
eos_config = {
    httpEndpoint: endpoint,
   chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
   keyProvider: [ '5JQSkb1M7KFahT4dnxYhfLL9KtSV3aLFaafamNP4p2bpF7Qp9f7','5KhHNY8EtY693CAwjYNgPNimCvQCFi4azFKFy1QrqsLXsmuii9E' ],
   sign: true,
   debuf: false
};
eos_config_scatter = {
    httpEndpoint: endpoint,
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
    keyProvider: [],
    sign: true,
    debuf: false
 };

var eos_api = EosApi({
    httpEndpoint: endpoint
});
var eos = Eos(eos_config);

app.use(globalCSP);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', function(req, res){
   eos_api.getInfo({}).then(result => {
      //console.log(JSON.stringify(result, null, 2));
      res.send(JSON.stringify(result, null, 3));
   });
});
app.get('/get/account/:account', function(req, res){
   eos_api.getAccount(req.params.account).then(result => {
      res.send(JSON.stringify(result, null, 3));
   });
});
app.get('/get/transactions/:account', function(req, res){
    eos_api.getTransaction(req.params.account).then(result => {
       res.send(JSON.stringify(result, null, 3));
    });
 });
 app.get('/get_controlled_accounts/:account', function(req, res){
    eos_api.getControlledAccounts(req.params.account).then(result => {
       res.send(JSON.stringify(result, null, 3));
    });
 });
 app.get('/get_currency_stats/:code/:sym', function(req, res){
    eos_api.getCurrencyStats(req.params.code, req.params.sym).then(result => {
       res.send(JSON.stringify(result, null, 3));
    });
 });
app.get('/get/ramprice', function(req, res){
   eos_api.getTableRows(true, 'eosio', 'eosio', 'rammarket')
      .then(result => {
        console.log(result.rows[0]);
        var row = result.rows[0];
        var quote =row.quote.balance.replace("EOS","");
        var base = row.base.balance.replace("RAM","");
        var price = quote/ base * 1024;// * row.quote.weight;
        var price_eos = base / quote / 1024;
        res.send("<p>"+price+" EOS/Kb</p><p>"
        +price_eos+" Kb/EOS</p>"
        +"<p>"+price_eos*1024+" bytes/EOS</p>"
        );
        });
});
app.get('/get/table/rammarket', function(req, res){
eos_api.getTableRows(true, 'eosio', 'eosio', 'rammarket')
  .then(result => res.send(JSON.stringify(result, null, 2)));
});
app.get('/buyram/:account/:eos', function(req, res){
  eos.contract('eosio').then(function(eosio){
        return eosio.buyram(req.params.account, req.params.account, req.params.eos + ' EOS', {authorization:[req.params.account+'@active']});
        })
  .then(function(result){
        res.send(JSON.stringify(result, null, 2));
        });
});
app.get('/sellram/:account/:bytes', function(req, res){
  eos.contract('eosio').then(function(eosio){
        return eosio.sellram(req.params.account, req.params.bytes, {authorization:[req.params.account+'@active']});
        })
  .then(function(result){
        res.send(JSON.stringify(result, null, 2));
        });
});
app.get('/transfer/:from/:to/:amount', function(req, res){
  eos.contract('eosio.token').then(function(eosio){
        return eosio.transfer(req.params.from, req.params.to, req.params.amount, {authorization:[req.params.from+'@active']});
        })
  .then(function(result){
        res.send(JSON.stringify(result, null, 2));
        });
});

app.get('/scatter/:account', function(req, res){
    res.render()
  document.addEventListener('scatterLoaded', scatterExtension => {
        const scatter = window.scatter;

        window.scatter = null;

        scatter.requireVersion(3.0);
        });
});

var server = app.listen(8090, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});

console.log('Server Start');
