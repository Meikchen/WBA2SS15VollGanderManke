var fs = require('fs');

fs.readFile(__dirname+"/wolkenkratzer.json", function(err, data) 
{
    if(err) throw err;
    
    var data = JSON.parse(data);
    
    var sortiert = data.wolkenkratzer.sort(function (a, b) 
    {
        if (b.hoehe > a.hoehe) return 1;
        if (b.hoehe < a.hoehe) return -1;
        return 0;
    });


    var wolkenkratzer_liste = JSON.stringify({wolkenkratzer : sortiert});
    fs.writeFile(__dirname+"/wolkenkratzer_liste.json", wolkenkratzer_liste, function(err) 
    {
        if(err) throw err;
        
        for(var i = 0; i < data.wolkenkratzer.length; i++)
        {
            console.log("________________________________________" + "\n \n"
            + "Name: " + data.wolkenkratzer[i].name + "\n"
            + "Stadt: " + data.wolkenkratzer[i].stadt + "\n" 
            + "Höhe: " + data.wolkenkratzer[i].hoehe +  "\n"
            );
        };
    });
});