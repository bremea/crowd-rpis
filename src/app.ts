import {createSession} from 'pcap';
import petitio from 'petitio';
(await import('dotenv')).config();

let ppm = 0;

const pcap = createSession('en0', {});
pcap.on('packet', () => ppm++);

setInterval(() => {
	const rr = petitio(process.env.URL!);
	rr.method('POST');
	rr.body({}, 'json');
	rr.header('Authorization', process.env.AUTH!);
	rr.send();
	ppm = 0;
}, 60 * 1000);