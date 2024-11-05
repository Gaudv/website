import { FC, useEffect, useState } from 'react';
import { Telex, TelexConnection } from '@flybywiresim/api-client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { ArrowRightOutlined } from '@ant-design/icons';

const AircraftIcon = (heading: number, aircraftId: string) => {
    const aircraftStyle = `transform: rotate(${heading}deg); transform-origin: center; width: 32px; height: 32px; filter: drop-shadow(0 0 2px rgba(0 0 0 /0.5))`;

    return new DivIcon({
        iconSize: [0, 0],
        iconAnchor: [15, 10],
        html: `<img src="/meta/aircraft-icon.png" alt="${aircraftId}" style="${aircraftStyle}"/>`,
    });
};

const numberFormat = new Intl.NumberFormat();

export interface LeafletMapProps {
    isFullPageMap: boolean;

    className?: string;
}

const LeafletMap: FC<LeafletMapProps> = ({ isFullPageMap, className }) => {
    const [flights, setFlights] = useState<TelexConnection[]>([]);

    useEffect(() => {
        Telex.fetchAllConnections().then((flights) => setFlights(flights));
    }, []);

    const position = [51, 5];

    return (
        <div className={`${className} ${isFullPageMap ? 'full-page-map' : ''}`}>
            <MapContainer center={position as any} zoom={5} scrollWheelZoom className="w-full h-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                />

                {flights.map((it) => (
                    <Marker key={it.id} icon={AircraftIcon(it.heading, it.id)} position={[it.location.y, it.location.x]}>
                        <Popup>
                            <div className="p-4 text-white">
                                <div className="grid grid-cols-2 gap-12 pb-4">
                                    <p>
                                        {it.flight} <span className="text-primary">|</span> A380X
                                    </p>
                                    <p className="flex flex-row-reverse gap-1">
                                            <p>F-PEGA</p>
                                            <img className="h-5 w-5 fill-current make-fbw-primary"  src="/svg/plane-tail-thin.svg"/>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-12 pb-4">
                                    <div className="font-mono">
                                        <h2 className="pb-0">{it.origin || '- - - -'}</h2>
                                        <small>whateverplace is that we need a api to get that info</small>
                                    </div>
                                    <div className="font-mono text-right">
                                        <h2 className="pb-0">{it.destination || '- - - -'}</h2>
                                        <small>whatever other place, same deal as the other side</small>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <img className="h-10 w-10 fill-current make-fbw-primary"  src="/svg/plane-departure-thin.svg"/>
                                    <div className="w-full rounded-full h-1 mb-4 bg-dark">
                                        <div className="h-1 rounded-full bg-primary" style={{width: "45%"}}></div>
                                    </div>
                                    <img className="h-10 w-10 fill-current make-fbw-primary"  src="/svg/plane-arrival-thin.svg"/>
                                </div>

                                <div className="grid grid-cols-3 py-4 text-center">
                                    <span>
                                        <p>G/S</p>
                                        <h4 className="p-0 font-mono">{numberFormat.format(342)} kts</h4>
                                    </span>
                                    <span>
                                        <p>HDG</p>
                                        <h4 className="p-0 font-mono">{it.heading.toFixed(0).padStart(3, '0')}°</h4>
                                    </span>
                                    <span>
                                    <p>ALT</p>
                                        <h4 className="p-0 font-mono">{numberFormat.format(it.trueAltitude)} ft</h4>
                                    </span>

                                </div>

                                <h5 className="pt-2 pb-0">
                                    Livery
                                </h5>
                                <small>{it.aircraftType}</small>

                                

                                <h5 className="pt-2 pb-0">
                                    Route
                                </h5>
                                <small>we don't have that info yet, so here is my last route: EIDW/10L INKU2Q INKUR DCT BEXET DCT DOGAL DCT 54N020W DCT 55N030W DCT 56N040W DCT 55N050W DCT LOMSI N662C TOPPS DCT ENE PARCH3 KJFK/I04R</small>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
