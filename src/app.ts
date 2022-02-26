import {createSession, decode} from 'pcap';
import petitio from 'petitio';
(await import('dotenv')).config();

let ppm: string[] = [];

const pcap = createSession('en0', {});
pcap.on('packet', (p) => ppm.push(decode.packet(p).payload.shost.addr.join('.')));

setInterval(() => {
	const rr = petitio(process.env.URL!);
	rr.method('POST');
	rr.body({unique: ppm.filter((v, i, a) => a.indexOf(v) === i).length}, 'json');
	rr.header('Authorization', process.env.AUTH!);
	rr.send();
	ppm = [];
}, 60 * 1000);