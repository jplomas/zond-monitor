# zond-monitor

## Requirements

nodejs (`choco install nodejs` on Windows)

Make sure `node -v` returns a version.

## Getting going

- Clone repo if using git or download zip and extract
- Run `npm install` inside directory
- Run `npm run start` to run

There will be a link in console to status page showing node status if it is running.

## Configuration

Create a `.env` file in the `apps/backend` folder of the project and add the following variables:

``` bash
GZONDDATA_PATH="../../../gzonddata"
BEACONDATA_PATH="../../../beacondata"
API_PORT="3001"
```

Paths for `GZONDDATA_PATH` and `BEACONDATA_PATH` are relative to the `apps/backend` folder.

For the defaults, the assumption is that zond-monitor is being run in a sub folder from same parent as gzonddata/beacondata, i.e.

``` text
/qrl
  /gzonddata
  /beacondata
  /zond-monitor   <---
  gzond
  beacon-chain
  validator
  qrysmctl
```
