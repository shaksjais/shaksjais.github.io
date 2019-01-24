

function pageLoaded() {
        var image = "";
        if(!localStorage.getItem('images'))
                localStorage.setItem('images', JSON.stringify(images));
        storedImages = JSON.parse(localStorage.getItem('images'));
        for( image in storedImages.images ) {
                document.getElementById("grid").innerHTML += "<div><img src=" + storedImages.images[image]['url'] + "><span>" + storedImages.images[image]['name'] +"</span></div>"; 
        }
}

function submitForm() {
    alert("Your mail has been sent!")
}

function updateImages() {
        var date = new Date().toJSON().slice(0,10);
        if(!document.getElementById("imageName").value || !document.getElementById("url").value || !document.getElementById("info").value || !document.getElementById("uploadDate").value)
        {   
                alert('Cannot submit empty values!');
                return;
        }      
        if( document.getElementById("uploadDate").value > date ) {
                alert("Date cannot be higher than today's date");
                return;
        }
        imageName = document.getElementById("imageName").value;
        var image = "";
        storedImages = JSON.parse(localStorage.getItem('images'));
        var found = 0;
        for( image in storedImages.images ) {
                if(storedImages.images[image]['name'] == imageName ) {
                        storedImages.images[image]['url'] = document.getElementById("url").value;
                        storedImages.images[image]['uploadDate'] = document.getElementById("uploadDate").value;
                        storedImages.images[image]['info'] = document.getElementById("info").value;
                        document.getElementById("updated").style.display = "block";
                        document.getElementById("imageForm").reset();
                        document.getElementById("updated").innerHTML = "The image has been updated!";
                        found = 1;
                        break;

                }
        }
        if(found === 0 ) 
        {
                storedImages.images.push({
                        "name" : imageName,
                        "url" : document.getElementById("url").value,
                        "info" : document.getElementById("info").value,
                        "uploadDate" : document.getElementById("uploadDate").value
                });
                document.getElementById("imageForm").reset();
                document.getElementById("updated").innerHTML = "The image has been added!";
                

        }
        localStorage.setItem('images', JSON.stringify(storedImages));
}


