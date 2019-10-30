/**
 * This file deals with listener conversions to/from hex
 * @param  {[type]} integerValue [description]
 * @return {[type]}              [description]
 */

 var convert = (function() {

   // This function takes an integer and creates a 2 character Byte
   function toHex(integerValue) {
     var hexValue = parseInt(integerValue, 10).toString(16).toUpperCase();
     if (hexValue.length < 2) {
       hexValue = "0" + hexValue;
     }
     // ogscript.debug("Hex Value: " + hexValue);
     return hexValue;
   }

   // This function takes a 2 character hex byte and converts it back to an integer
   function toInteger(hexValue) {
     var convertedInteger = parseInt(hexValue, 16).toString(10);
     ogscript.debug("Converted back to Int: " + convertedInteger);
     return convertedInteger;
   }

   // A function I found to convert a byteArray into a Hex String.
   function toHexString(byteArray) {
     // ogscript.debug(byteArray)
     var result = Array.prototype.map.call(byteArray, function(byte) {
       return ("0" + (byte & 0xFF).toString(16)).slice(-2);
     }).join(" ");

     // ogscript.debug("toHexStringFunction Result: " + result);
     return result;
   }

   function toByteArray(hexString) {
     var result = [];
     for (var i = 0; i < hexString.length; i += 2) {
       result.push(parseInt(hexString.substr(i, 2), 16));
     }
     return result;
   }

   return {
     toHex: toHex,
     toInteger: toInteger,
     toHexString: toHexString,
     toByteArray: toByteArray
   }

}());
