export function getStations() {
    return fetch('https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?datasetid=GHCND&limit=140', { method: 'GET', headers: {'token': 'EHLqMvinOlPjuZdkzDnnxkSbyyiNULyS'}})
      .then(data => data.json())
}


export function getData(stationId, startDate, endDate) {
    return fetch('https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&startdate='+startDate+'&enddate='+endDate+'&datatypeid=PRCP&stationid='+stationId, { method: 'GET', headers: {'token': 'EHLqMvinOlPjuZdkzDnnxkSbyyiNULyS'}})
      .then(data => data.json())
}