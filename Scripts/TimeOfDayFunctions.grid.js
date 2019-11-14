/* This document contains the functions necessary for a Ross Dashboard
  that runs an event at a specific time of day. */

function runAtTime(functionName, tvId, time) {
  function runGPI(functionName, tvId) {
    return function() {
      //  Insert actual task below
      ogscript.debug("Running function: " + functionName);
      ogscript.setStyle("ScheduleButton", "bg#000000;");
      if (params.getValue('RunSchedule', 0) == true) {
          if (functionName === 'turnOff') {
          ogscript.debug('Turning Off TV with ID: ' + tvId);
          scheduleTomorrow(functionName, tvId, time);
          ogscript.asyncExec(tv.turnOff(tvId));
          }
          else { ogscript.debug('Function wasn\'t turnOff'); }
      }
      else {
          ogscript.debug('Schedule is currently turned off.');
          scheduleTomorrow(functionName, tvId, time);
        }
      // Insert actual task above.
    };
  }

  var now = new Date();
  var delay = time.getTime() - now.getTime();
  if (delay > 0) {
    ogscript.asyncExec(runGPI(functionName, tvId), delay);
  }
}


function parseTime(timeString){
  ogscript.debug(timeString);
  timeArray = timeString.split(':');
  ogscript.debug('Time Array: ' + timeArray);
  var newTime = new Date();
  newTime.setHours(timeArray[0]);
  newTime.setMinutes(timeArray[1]);
  newTime.setSeconds(timeArray[2]);
  newTime.setMilliseconds(0);
  return newTime;
}

function scheduleToday(functionName, tvId, time) {
  var parsedTime = parseTime(time);
  var today = new Date();
  var newTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(),
    parsedTime.getHours(), parsedTime.getMinutes(), parsedTime.getSeconds(),
    parsedTime.getMilliseconds());
  if (0 > newTime.getTime() - today.getTime()) {
    ogscript.debug("Too late for today.");
    scheduleTomorrow(functionName, tvId, parsedTime);
  } else {
    ogscript.debug("Scheduled task for today: " + newTime);
    ogscript.setStyle("ScheduleButton", "bg#E50909;");
    runAtTime(functionName, tvId, newTime);
  }
}

function scheduleTomorrow(functionName, tvId, time) {
  var today = new Date();
  var newTime = new Date(today.getFullYear(), today.getMonth(),
    today.getDate() + 1, time.getHours(), time.getMinutes(),
    time.getSeconds(), time.getMilliseconds());
  ogscript.debug("Scheduling TV " + tvId + " for " + functionName + " at " + newTime);
  ogscript.setStyle("ScheduleButton", "bg#E50909;");
  runAtTime(functionName, tvId, newTime);
}
