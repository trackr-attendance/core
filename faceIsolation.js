exports.getFaceCropBox = function (imageWidth, imageHeight, x, y, faceWidth, faceHeight, scaleFactor){

  // Transform X,Y to center of face
  x = x + Math.round(faceWidth/2);
  y = y + Math.round(faceHeight/2);

  var width, height;

  // If Possible Increase Size of Face by Ratio
  if (x + Math.round(scaleFactor*faceWidth/2) >= imageWidth){
    // New Width Truncated by Image Width to the Right
    x = x - Math.round(scaleFactor*faceWidth/2);
    width = imageWidth - x;
  }else if(x - Math.round(scaleFactor*faceWidth/2) <= 0){
    // New Width Truncated by Image Width to the Left
    width = x + Math.round(scaleFactor*faceWidth/2);
    x = 0;
  }else{
    width = Math.round(scaleFactor*faceWidth);
    x = Math.round(x - (scaleFactor*faceWidth)/2);
  }

  // If Possible Increase Size of Face by Ratio
  if (y + Math.round(scaleFactor*faceHeight/2) >= imageHeight){
    // New Width Truncated by Image Width to the Right
    y = y - Math.round(scaleFactor*faceHeight/2);
    height = imageHeight - y;
  }else if(y - Math.round(scaleFactor*faceHeight/2) <= 0){
    // New Width Truncated by Image Width to the Left
    height = y + Math.round(scaleFactor*faceHeight/2);
    y = 0;
  }else{
    height = Math.round(scaleFactor*faceHeight);
    y = y - Math.round(scaleFactor*faceHeight/2);
  }

  return {
    "width": width,
    "height": height,
    "x": x,
    "y": y
  };
}