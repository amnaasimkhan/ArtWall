#!/bin/bash
# Turn an Amazon Linux 2023 instance into a NAT for the private subnets.
set -euxo pipefail
dnf install -y iptables-services
systemctl enable --now iptables
echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/90-nat.conf
sysctl --system
IFACE=$(ip route show default | awk '{print $5; exit}')
iptables -t nat -A POSTROUTING -o "$IFACE" -j MASQUERADE
iptables -F FORWARD
service iptables save
