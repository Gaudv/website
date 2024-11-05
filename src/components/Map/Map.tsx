import { FC, useEffect, useState } from 'react';
import { Telex, TelexConnection } from '@flybywiresim/api-client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { ArrowRightOutlined } from '@ant-design/icons';

const AircraftIcon = (heading: number, aircraftId: string, aircraftType: string) => {
    let aircraftIconUrl = '/meta/aircraft-icon.png';
    let aircraftIconSize = 28;
    if (aircraftType.includes('A32')) {
        aircraftIconUrl = '/meta/aircraft-icon-a32nx.png';
    }
    if (aircraftType.includes('A38')) {
        aircraftIconUrl = '/meta/aircraft-icon-a380x.png'; aircraftIconSize = 38;
    }
    const aircraftIconStyle = `transform:rotate(${heading}deg);transform-origin:center;width:${aircraftIconSize}px;height:${aircraftIconSize}px;filter:drop-shadow(0 0 2px rgba(0 0 0 /0.5))`;

    return new DivIcon({
        iconSize: [0, 0],
        iconAnchor: [15, 10],
        html: `<img src="${aircraftIconUrl}" alt="${aircraftId}" style="${aircraftIconStyle}"/>`,
    });
};

const numberFormat = new Intl.NumberFormat();

export interface LeafletMapProps {
    isFullPageMap: boolean;
    className?: string;
}

const LeafletMap: FC<LeafletMapProps> = ({ isFullPageMap, className }) => {
    const [flights, setFlights] = useState<TelexConnection[]>([]);

    const MapLegend = () => (
        <div className="leaflet-bottom leaflet-left">
            <div className="leaflet-control">
                <div className="bg-light p-4 text-secondary font-mono">
                    <span className="items-center inline-flex gap-x-2 mr-4 xl:flex xl:gap-x-4 xl:mr-0">
                        <img className="inline" src="/meta/aircraft-icon-a32nx.png" style={{ height: 28, width: 28 }} />
                        <h4>
                            <span className="hidden lg:inline">FlyByWire </span>
                            A32NX
                        </h4>
                    </span>
                    <span className="items-center inline-flex gap-x-2 mr-4 xl:flex xl:gap-x-4 xl:mr-0">
                        <img className="inline" src="/meta/aircraft-icon-a380x.png" style={{ height: 28, width: 28 }} />
                        <h4>
                            <span className="hidden lg:inline">FlyByWire </span>
                            A380X
                        </h4>
                    </span>
                    <span className="items-center inline-flex gap-x-2 mr-4 xl:flex xl:gap-x-4 xl:mr-0">
                        <img className="inline" src="/meta/aircraft-icon.png" style={{ height: 28, width: 28 }} />
                        <h4>Others</h4>
                    </span>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        Telex.fetchAllConnections().then((flights) => setFlights(flights));
    }, []);

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (isFullPageMap && footer) {
            footer.style.display = 'none';
        }

        return () => {
            if (footer) {
                footer.style.display = '';
            }
        };
    }, [isFullPageMap]);

    const position = [51, 5];

    return (
        <div className={`${className} ${isFullPageMap ? 'full-page-map' : ''}`}>
            <MapContainer center={position as any} zoom={5} scrollWheelZoom className="w-full h-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                />

                {flights.map((it) => (
                    <Marker key={it.id} icon={AircraftIcon(it.heading, it.id, it.aircraftType)} position={[it.location.y, it.location.x]}>
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
                <MapLegend />
            </MapContainer>
        </div>
    );
};

export default LeafletMap;