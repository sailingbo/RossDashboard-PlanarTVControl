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
