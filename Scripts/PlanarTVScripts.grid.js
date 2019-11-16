/**
 * This creates a tv module that sends commands to Planar 4k Simplicity Series TVs
 * tv.getVolume(tvId)
 * tv.setVolume(volumeLevel as INT, tvId)
 * tv.SendToTV(command, tvId)
 * tv.getChecksum(hexString) returns hexstring + checksum at the end.
 *
 * The responses from the TV are handled in the Dashboard Panel's listener function.
 *
 * These commands work for Planar 4k Simplicity Series TVs.
 * https://www.planar.com/media/437583/020-1344-00a_planar-simplicity-series-rs232-user-guide.pdf
 *
 * bocordle@sailingbo.com 10/31/2019
 */

// This is the Ross Callback Function
function callback(success, sentData, resultString, exception) {
  ogscript.debug("Success: " + success);
  ogscript.debug("Sent Data: " + sentData);
  ogscript.debug("Result String: " + resultString);
  ogscript.debug("Exception: " + exception);
  if (!success) {
    ogscript.debug("Unable to send message: " + exception);
  } else {
    ogscript.debug("Result String via Callback: " + resultString);
    var hexString = convert.toHexString(resultString);
    var percentageVolume = resultString[8].toString(10);
    // ogscript.debug("Resulting Hex String: " + hexString);
    // ogscript.debug("Volume Percentage: " + percentageVolume + "%");
    // if updateTVAgain is true, run the SetVolumeCommand again.
    //var updateTVAgain = ogscript.getObject('updateTVAgain');
    //if (updateTVAgain.true) {
    //  ogscript.debug('Running setVolume() again from Callback function.');
    //  tv.setVolume(params.getValue('tv1.volume', 0), updateTVAgain.tvId);
    //}
    return resultString;
  }
}

var tv = function() {
  //Serial commands for Planar Simplicity 4k Series tvs.
  var command = {
    getVolume: "A6 01 00 00 00 03 01 45 E0",
    getPowerState: "A6 01 00 00 00 03 01 19 BC",
    setVolume: "A6 01 00 00 00 05 01 44 ",
    turnOff: "A6 01 00 00 00 04 01 18 01 BB",
    turnOn: "A6 01 00 00 00 04 01 18 02 B8"
  };

  // This function gets the current TV volume.
  function getVolume(tvId) {
    logFile.write("Get Volume Button Pushed.");
    ogscript.debug("Get Volume Button Pushed.");
    // logFile.write("Final command to send to tv: " + setVolumeCommand);
    // Send command to TV now.
    tv.sendToTV(command.getVolume, tvId);
  }

  // This function takes a volume INT and converts it to a string to be sent to the TV
  function setVolume(volumeLevel, tvId) {
    var hexVolume = convert.toHex(volumeLevel);
    var sendAgainAtEnd;
    var setVolumeCommand = command.setVolume + hexVolume + " " + hexVolume;
    // ogscript.debug("Volume in hex: " + hexVolume);
    // ogscript.debug("Command to send before checksum: " + setVolumeCommand);
    var checksum = tv.getChecksum(setVolumeCommand.replace(/\s/g, "")).toUpperCase();
    // ogscript.debug("Checksum: " + checksum);
    setVolumeCommand = setVolumeCommand + " " + checksum;
    // ogscript.debug("Final command to send to tv: " + setVolumeCommand);
    logFile.write("Final command to send to tv: " + setVolumeCommand);
    // Send command to TV now.
    tv.sendToTV(setVolumeCommand, tvId);
  }

  // This function gets the power state of the TV
  function getPowerState(tvId) {
    var getPowerCommand = "";
    // Send command to TV now.
    tv.sendToTV(command.getPowerState, tvId);
  }

  // This function turns on the TV
  function turnOn(tvId) {
    // Send command to TV now.
    ogscript.debug('tv.turnOn() Running.');
    tv.sendToTV(command.turnOn, tvId);
  }

  // This function turns on the TV
  function turnOff(tvId) {
    ogscript.debug('tv.turnOff() Running.');
    // Send command to TV now.
    tv.sendToTV(command.turnOff, tvId);
  }

  // This function sends a passed command to the TV.
  function sendToTV(command, tvId) {
    var listener = ogscript.getObject("listener_tv" + tvId);
    // If readyToSend, send.
    if (tv.readyToSend()) {
      if (listener !== null) {
        logFile.write("Command sent to TV: " + command);
        listener.writeAsBytes(command);
        ogscript.putObject("updateTVAgain.true", false);
      } else {
        logFile.write("No listener connection found. Try sendAsBytes?");
        // rosstalk.sendAsBytes(tvIPAddress, 5000, command, callback);
      }
      ogscript.debug("Sent, theoretically.");
      ogscript.putObject("lastCommandSentTime", new Date());
    }
    // If not ready, flag updateTVAgain as true and die.
    else {
      var updateTVAgain = {
          "tvNum" : tvId,
          "true" : true,
          "command" : command
        };
    ogscript.putObject("updateTVAgain", updateTVAgain);
    ogscript.debug("Not sent. updateTVAgain flag set to True for TV #" + updateTVAgain.tvNum);
    // ogscript.debug(updateTVAgain.true);
  }
}

// This function calculates the proper checksum (LRC) for Planar TVs
function getChecksum(hexstring) {
  if (hexstring !== "") {
    var s = hexstring.match(/../g);
    var lrc = 0;
    s.forEach(function(hexbyte) {
      var n = 1 * ("0x" + hexbyte);
      lrc ^= n;
    });

    lrc = lrc.toString(16);
    if (lrc.length % 2) {
      lrc = "0" + lrc;
    }
    return lrc;
  } else {
    ogscript.debug("Hexstring is null.");
  }
}

// This function decides whether to actually send the value yet.
function readyToSend() {
  // if command was sent very recently, return false, flag to updateTVAgain and store command in array
  if (ogscript.getObject("lastCommandSentTime")) {
    // ogscript.debug(
    //   "lastCommandSentTime: " + ogscript.getObject("lastCommandSentTime")
    // );
    // ogscript.debug(new Date() - ogscript.getObject("lastCommandSentTime"));
    if (new Date() - ogscript.getObject("lastCommandSentTime") < 250) {
      // ogscript.debug("3");
      return false;
    }
    // if command wasn't sent recently, return true and update lastCommandSentTime
    else {
      // ogscript.debug("2");
      return true;
    }
  } else {
    ogscript.putObject("lastCommandSentTime", new Date());
    // ogscript.debug("1");
    return true;
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
};
}();
