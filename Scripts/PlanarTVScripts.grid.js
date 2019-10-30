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
    var hexString = convert.toHexString(resultString);
    var percentageVolume = resultString[8].toString(10);
    // ogscript.debug("Resulting Hex String: " + hexString);
    // ogscript.debug("Volume Percentage: " + percentageVolume + "%");
    return resultString;
  }
}

// This function takes a volume INT and converts it to a string to be sent to the TV
function getVolume(tvIPAddress, listener) {
  logFile.write("Get Volume Button Pushed.");
  var getVolumeCommand = "A6 01 00 00 00 03 01 45 E0";
  // logFile.write("Final command to send to tv: " + setVolumeCommand);
  // Send command to TV now.
  sendToTV(getVolumeCommand, tvIPAddress, listener);
}

// This function takes a volume INT and converts it to a string to be sent to the TV
function setVolume(volumeLevel, tvIPAddress, listener) {
  hexVolume = convert.toHex(volumeLevel);
  var setVolumeCommand = "A6 01 00 00 00 05 01 44 " + hexVolume + " " + hexVolume;
  // ogscript.debug("Volume in hex: " + hexVolume);
  // ogscript.debug("Command to send before checksum: " + setVolumeCommand);
  var checksum = LRC(setVolumeCommand.replace(/\s/g, "")).toUpperCase();
  // ogscript.debug("Checksum: " + checksum);
  var setVolumeCommand = setVolumeCommand + " " + checksum;
  // ogscript.debug("Final command to send to tv: " + setVolumeCommand);
  // logFile.write("Final command to send to tv: " + setVolumeCommand);
  // Send command to TV now.
  sendToTV(setVolumeCommand, tvIPAddress, listener);
}

// This function sends a command to the TV.
function sendToTV(command, tvIPAddress, listener) {
  var listener = ogscript.getObject(listener);
  if (listener != null){
    logFile.write("Command sent to TV: " + command);
    listener.writeAsBytes(command);
  }
  else {
    logFile.write("No listener connection found. Maybe try sendAsBytes?");
    // rosstalk.sendAsBytes(tvIPAddress, 5000, command, callback);
  }
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
    ogscript.debug("Hexstring is null.");
  }
}
