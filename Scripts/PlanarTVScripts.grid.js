/**
 * This creates a tv module that sends commands to Planar 4k Simplicity Series TVs
 * tv.getVolume(tvIPAddress, listener)
 * tv.setVolume(volumeLevel as INT, tvIPAddress, listener)
 * tv.SendToTV(command, tvIPAddress, listener)
 * tv.getChecksum(hexString) returns hexstring + checksum at the end.
 *
 * The responses from the TV are handled in the Dashboard Panel's listener function.
 *
 * These commands work for Planar 4k Simplicity Series TVs.
 * https://www.planar.com/media/437583/020-1344-00a_planar-simplicity-series-rs232-user-guide.pdf
 *
 * bocordle@sailingbo.com 10/31/2019
 */

var tv = (function() {

// This function gets the current TV volume.
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

// This function gets the power state of the TV
function getPowerState(tvIPAddress, listener) {
  var getPowerCommand = "A6 01 00 00 00 03 01 19 BC";
  // Send command to TV now.
  sendToTV(getPowerCommand, tvIPAddress, listener);
}

// This function turns on the TV
function turnOn(tvIPAddress, listener) {
  var setPowerCommand = "A6 01 00 00 00 04 01 18 02 BB";
  // Send command to TV now.
  sendToTV(setPowerCommand, tvIPAddress, listener);
}

// This function turns on the TV
function turnOff(tvIPAddress, listener) {
  var setPowerCommand = "A6 01 00 00 00 04 01 18 01 BB";
  // Send command to TV now.
  sendToTV(setPowerCommand, tvIPAddress, listener);
}

// This function sends a passed command to the TV.
function sendToTV(command, tvIPAddress, listener) {
  var listener = ogscript.getObject(listener);
  if (listener != null){
    logFile.write("Command sent to TV: " + command);
    listener.writeAsBytes(command);
  }
  else {
    logFile.write("No listener connection found. Try sendAsBytes?");
    // rosstalk.sendAsBytes(tvIPAddress, 5000, command, callback);
  }
}

// This function calculates the proper checksum (LRC) for Planar TVs
function getChecksum(hexstring) {
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

return {
  getVolume: getVolume,
  setVolume: setVolume,
  getPowerState: getPowerState,
  turnOn: turnOn,
  turnOff: turnOff,
  sendToTV: sendToTV,
  getChecksum: getChecksum
}
}());
