# RossDashboard-PlanarTVControl

#### This repo contains a Ross Dashboard .grid file and the necessary script files to control Planar Simplicity 4k televisions using Serial over Network commands.
---
**The functions available in the PlanarTVScripts.grid.js file include:**

    tv.getVolume(tvIPAddress, listener)
    tv.setVolume(volumeLevel as INT, tvIPAddress, listener)
    tv.sendToTV(command, tvIPAddress, listener)
    tv.getChecksum(hexString)

---

This repo also contains the scripts necessary to convert hex/binary/strings...

    convert.toHex(integerValue) @returns hexValue
    convert.toInteger(hexValue) @returns integer
    convert.toHexString(byteArray) @returns hex string
    convert.toByteArray(hexString) @returns byte array

---

And a script to create a log file...

    logfile.write(message)
    logfile.clear()

The logfile creates a folder called /logs/ and adds a .log text file with the current date as a file name.

---

Copyright 2019 Bo Cordle bocordle@sailingbo.com.
