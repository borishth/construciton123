// Replace 'YOUR_UBUNTU_IP' with the actual IP address of your Ubuntu backend machine.
// If your backend is hosted on AWS EC2, this must be the Public IPv4 Address.
const SERVER_IP = '13.214.237.209';

export const BASE_URL = `http://${SERVER_IP}:8000/api/v1`;
