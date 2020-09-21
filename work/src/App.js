import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './Api';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 25.021937,
    longitude: 121.411623,
    zoom: 3
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries)
  };
  useEffect(() => {
    getEntries()
  });
  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    })
  }
  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/robin-yu/ckf9s5cbo2pmn19nmw9d9hhad"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >

      {
        logEntries.map(entry => (
          <React.Fragment key={entry._id}>
            <Marker
              // key={entry._id}
              latitude={entry.latitude}
              longitude={entry.longitude}
            >
              <div
                onClick={() => setShowPopup({
                  showPopup,
                  [entry._id]: true,
                })}
              >
                <svg viewBox="0 0 24 24"
                  className="mark"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>

                </svg>
              </div>
            </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                  latitude={entry.latitude}
                  longitude={entry.longitude}
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition={true}
                  onClose={() => setShowPopup({})}
                  anchor="top" >
                  <div className="popup">
                    <h3>{entry.title}</h3>
                    <p>&nbsp;&nbsp;&nbsp;{entry.comments}</p>
                    <p>&nbsp;&nbsp;&nbsp;{entry.description}</p>
                    <small>Visited on:{new Date(entry.visitDate).toLocaleDateString()}</small>
                    {entry.image && <img src={entry.image} alt={entry.title} />}

                  </div>
                </Popup>
              ) : null
            }
          </React.Fragment>
        ))
      }
      {
        addEntryLocation ? (
          <>
            <Marker
              // key={entry._id}
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div>
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="#ffdde1"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="css-i6dzq1">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              </Marker>
              <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setAddEntryLocation(null)}
              anchor="top" >
              <div className="popup">
                <LogEntryForm onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }} location={addEntryLocation} />
              </div>
            </Popup>
          </>
        ):null
      }
          </ReactMapGL>
        );
}
export default App;
