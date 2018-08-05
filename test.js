const http = require('http');

http.get({ hostname: "10.0.1.5", port: 80, path: `/api/IsBWrxo3PBHXwoVX2KSym32iMDnR9fu7ahtfjt-C/resourcelinks` }, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
    data += chunk;
    });

    // The whole response has been received.
    resp.on('end', () => {
    _accessories(data);
    });
}).on("error", (error) => {
    console.log('Failed to get update from server');
});



 function _accessories(data) {
     resourcelinks = JSON.parse(data);
    for (let key of Object.keys(resourcelinks)) {
        resource = resourcelinks[key];
       if (resource.type == "Link" && resource.classid == 2) {
           for (let link of resource.links) {
               if (link.startsWith('/sensor')) {
                sensor = link.split('/')[2];
                console.log(`${key}: "${resource.name}" - ${sensor}`)
                   break;
               }
           }
       }
       
    }

  }
