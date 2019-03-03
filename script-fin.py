import os
import shutil

if not os.path.isdir("./output"):
	os.mkdir("output",0755)
path = "./Smartphone/platforms/android/app/build/outputs/apk/debug"
os.chdir(path)
os.rename("app-debug.apk", "Aventure-de-Jean.apk")
shutil.move("Aventure-de-Jean.apk","../../../../../../../../output")
print("Le fichier APK est disponible dans le dossier output.")