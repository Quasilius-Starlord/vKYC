import IpfsAPI from "ipfs-api";

var ipfs = IpfsAPI({host: 'localhost', port: '5001', protocol: 'http'})

export default ipfs;