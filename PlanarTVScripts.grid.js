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

// This is the Ross Callback Function
function callback(success, sentData, resultString, exception) {
  ogscript.debug("Success: " + success);
  ogscript.debug("Sent Data: " + sentData);
  ogscript.debug("Result String: " + resultString);
  ogscript.debug("Exception: " + exception);
  if (!success) {
    ogscript.debug("Unable to send message: " + exception);
  } else {
    // ogscript.debug("Result String via Callback: " + resultString);
    var hexString = toHexString(resultString);
    var percentageVolume = resultString[8].toString(10);
    ogscript.debug("Resulting Hex String: " + hexString);
    ogscript.debug("Volume Percentage: " + percentageVolume + "%");
    return resultString;

  }

}

// This function takes a volume INT and converts it to a string to be sent to the TV
function setVolume(volumeLevel, tvIPAddress) {
  hexVolume = toHex(volumeLevel);
  var setVolumeCommand = "A6 01 00 00 00 05 01 44 " + hexVolume + " " + hexVolume;
  ogscript.debug("Volume in hex: " + hexVolume);
  ogscript.debug("Command to send before checksum: " + setVolumeCommand);
  var checksum = LRC(setVolumeCommand.replace(/\s/g, "")).toUpperCase();
  ogscript.debug("Checksum: " + checksum);
  var setVolumeCommand = setVolumeCommand + " " + checksum;
  ogscript.debug("Final command to send to tv: " + setVolumeCommand);
  // Send command to TV now.

}

// This function calculates the proper checksum for Planar TVs
function LRC(hexstring) {
  if (hexstring != "") {
    var s = hexstring.match(/../g);
    var lrc = 0;
    s.forEach(function(hexbyte) {
      var n = 1 * ("0x" + hexbyte);
      lrc ^= n;
    });

    lrc = lrc.toString(16);
    if (lrc.length % 2)
      lrc = "0" + lrc;
    return lrc;
  } else {
    debug("Hexstring is null.");
  }
}

// This function adds to a log file. logFile.write(message) or logFile.clear()
var logFile = (function() {

  function addLeadingZero(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }

  var date = new Date();
  var date = date.getFullYear() + "-" + addLeadingZero((date.getMonth() + 1)) + "-" + addLeadingZero(date.getDay());
  var file = ogscript.createFileOutput("./Logs/" + date + ".log", true);

  // This appends a message string to the file.
  function write(message) {
    var time = new Date();
    var time = addLeadingZero(time.getHours()) + ":" + addLeadingZero(time.getMinutes()) + ":" + addLeadingZero(time.getSeconds());
    file.writeString(date + " " + time + ": " + message + "\n");
  }

  // This clears the contents of the current log file.
  function clear() {
    file.clear();
  }
  //Is this ok?
  

  return {
    write: write,
    clear: clear
  }
}());
