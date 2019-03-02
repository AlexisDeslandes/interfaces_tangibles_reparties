# coding: utf-8
import socket
import os

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ipv4 = s.getsockname()[0]
print("Votre adresse IP est : " + ipv4)
s.close()

print("Lancement du projet.")
print("Changement des IP du smartphone et table.")
if not os.path.isdir("table/src/network"):
	os.mkdir("table/src/network",0755)
iPFile = open("table/src/network/Network.js","w")
iPFile.write("export const IP = \"http://" + ipv4 + ":4444\";")
print("Changement de l'IP table effectuée.")
if not os.path.isdir("Smartphone/src/network"):
	os.mkdir("Smartphone/src/network",0755)
IPFilePhone = open("Smartphone/src/network/Network.js","w")
IPFilePhone.write("export const IP = \"http://" + ipv4 + ":4444\";")
print("Changement de l'IP smartphone effectuée.")
