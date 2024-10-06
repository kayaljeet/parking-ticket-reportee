"use client"

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import Navbar from './Navbar';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';

const MapViewSetter = ({ location, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], zoom);
    }
  }, [location, map, zoom]);

  return null;
};

const ChallanMarkers = ({ zoom }) => {
  const [challans, setChallans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchChallans();
      setChallans(data);
    };

    fetchData();
  }, []);

  const fetchChallans = async () => {
    try {
      const response = await fetch('http://localhost:5000/locations');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching challans:', error);
      return [];
    }
  };

  const getMarkerSize = (zoomLevel) => {
    return Math.max(5, 10 - zoomLevel);
  };

  return (
    <>
      {challans.map((challan, index) => {
        const { latitude, longitude, status, created_at, assigned_to, last_reviewed_by, last_modified, phone, registration_plate } = challan;

        const markerColor = status === 'Active' ? 'blue' : 'red';
        const radius = getMarkerSize(zoom);

        return (
          <CircleMarker
            key={index}
            center={[latitude, longitude]}
            radius={radius}
            fillColor={markerColor}
            color={markerColor}
            fillOpacity={0.7}
            stroke={false}
          >
            <Popup>
              <div>
                <h4>Challan Details</h4>
                <p><strong>Time:</strong> {created_at}</p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Assigned To:</strong> {assigned_to || 'N/A'}</p>
                <p><strong>Reviewed By:</strong> {last_reviewed_by || 'N/A'}</p>
                <p><strong>Reviewed At:</strong> {last_modified || 'N/A'}</p>
                <p><strong>Complainee:</strong> {phone || 'N/A'}</p>
                <p><strong>Vehicle No:</strong> {registration_plate || 'N/A'}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
};

export default function Map() {
  const [zoom, setZoom] = useState(5);
  const [challanLocation, setChallanLocation] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Add this line
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const id = params.get('id');
    const zoomParam = params.get('zoom');
    if (id) {
      fetchChallanById(id);
      if (zoomParam) {
        setZoom(parseInt(zoomParam, 10));
      } else {
        setZoom(5);
      }
    }
  }, [search]);

  const fetchChallanById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/locations/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setChallanLocation(data);
    } catch (error) {
      console.error('Error fetching challan by ID:', error);
    }
  };

  const handleMapButtonClick = () => {
    if (challanLocation) {
      setZoom(14);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-black min-h-screen">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} /> {/* Pass props here */}
      <div className="flex-grow p-4 md:p-8 pt-16 md:pt-8">
<div
  className="bg-white rounded-3xl h-[calc(100vh-5rem)] md:h-[calc(100vh-4rem)] p-4"
  style={{ opacity: isOpen && window.innerWidth < 768 ? 0 : 1 }} // Adjust opacity for mobile display
>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Map</h1>
          <div className="rounded-3xl overflow-hidden h-[calc(100%-3rem)] md:h-[calc(100%-4rem)]">
            <MapContainer
              center={challanLocation ? [challanLocation.latitude, challanLocation.longitude] : [20.5937, 78.9629]}
              zoom={zoom}
              style={{ height: '100%', width: '100%'}}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <ChallanMarkers zoom={zoom} />
              {challanLocation && (
                <CircleMarker
                  center={[challanLocation.latitude, challanLocation.longitude]}
                  radius={10}
                  fillColor="green"
                  color="green"
                  fillOpacity={0.7}
                  stroke={false}
                >
                  <Popup>
                    <div>
                      <h4>Focused Challan Details</h4>
                      <p><strong>Time:</strong> {challanLocation.created_at}</p>
                      <p><strong>Status:</strong> {challanLocation.status}</p>
                      <p><strong>Assigned To:</strong> {challanLocation.assigned_to || 'N/A'}</p>
                      <p><strong>Reviewed By:</strong> {challanLocation.last_reviewed_by || 'N/A'}</p>
                      <p><strong>Reviewed At:</strong> {challanLocation.last_modified || 'N/A'}</p>
                      <p><strong>Complainee:</strong> {challanLocation.phone || 'N/A'}</p>
                      <p><strong>Vehicle No:</strong> {challanLocation.registration_plate || 'N/A'}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              )}
              <MapViewSetter location={challanLocation} zoom={zoom} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}