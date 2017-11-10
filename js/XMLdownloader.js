function downloadFile(fileContents, fileFormat, fileName) {
    // thanks, SO, for always being there for me: 
    // https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
    // great answer from https://stackoverflow.com/users/1768690/default
    let encodingType = "data:text/" + fileFormat + ";charset=utf-8,";
    var encodedUri = encodeURI(encodingType + fileContents);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", (fileName + ".xml"));
    document.body.appendChild(link); // Required for FF

    link.click();
}