# RossDashboard-PlanarTVControl

This repo contains a Ross Dashboard .grid file and the necessary script files to control Planar Simplicity 4k televisions using Serial over Network commands.

The functions available in the PlanarTVScripts.grid.js file include:
tv.getVolume(tvIPAddress, listener)
tv.setVolume(volumeLevel as INT, tvIPAddress, listener)
tv.sendToTV(command, tvIPAddress, listener)
tv.getChecksum(hexString)

This repo also contains the scripts necessary to convert hex/binary/strings, as well as write to a logfile.

Created in Oct, 2019 by Bo Cordle bocordle@sailingbo.com.
