Inside this script are the changes that need to be made to the
Slive-McWhorter panel.

1- Include Scripts/TimeOfDayFunctions.grid.js
2- Add the following Parameters.
    <param access="1" maxlength="0" name="TimeToRun_Raw" oid="TimeToRun_Raw" type="STRING" value="9:38:10" widget="text"/>
    <param access="1" constraintstrict="false" constrainttype="STRING_STRING_CHOICE" maxlength="0" name="RunSchedule" oid="RunSchedule" type="STRING" value="1" widget="toggle">
       <constraint key="0">Display Off Schedule Not Running</constraint>
       <constraint key="1">Displays will currently turn OFF at 7pm</constraint>
    </param>

3- Add a button for the RunSchedule parameter. Possibly on an "Admin" page?
