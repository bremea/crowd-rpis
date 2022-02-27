import {createSession, decode} from 'pcap';
import petitio from 'petitio';
import dotenv from 'dotenv';
dotenv.config();

let ppm: string[] = [];

const pcap = createSession('en0', {});
pcap.on('packet', (p) => ppm.push(decode.packet(p).payload.shost.addr.join('.')));

setInterval(async () => {
	const rr = petitio(process.env.URL!);
	rr.method('POST');
	rr.body({unique: ppm.filter((v, i, a) => a.indexOf(v) === i).length}, 'json');
	rr.header('Authorization', process.env.AUTH!);
	await rr.send();
	ppm = [];
}, 1000);