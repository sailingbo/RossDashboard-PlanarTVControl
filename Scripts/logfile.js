/** This function creates a text log file in the /logs/
 * folder with the current days date as a file name.
 *
 * logfile.write(message), logfile.clear()
 *
 * bocordle@sailingbo.com 10/28/2019
 */
var logFile = (function() {

  function addLeadingZero(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }

  var date = new Date();
  var date = date.getFullYear() + "-" + addLeadingZero((date.getMonth() + 1)) + "-" + addLeadingZero(date.getDay());
  var file = ogscript.createFileOutput("./logs/" + date + ".log", true);

  function write(message) {
    var time = new Date();
    var time = addLeadingZero(time.getHours()) + ":" + addLeadingZero(time.getMinutes()) + ":" + addLeadingZero(time.getSeconds());
    file.writeString(date + " " + time + ": " + message + "\r\n");
  }

  function clear() {
    file.clear();
  }
  //Is this ok?


  return {
    write: write,
    clear: clear
  }
}());
